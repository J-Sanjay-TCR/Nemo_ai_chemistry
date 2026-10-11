#!/usr/bin/env node
/* Nemo backend — zero dependencies (Node 18+). Gemini or Anthropic, key stays on the server.
 *
 *   GEMINI_API_KEY=...        node server.js     (Google AI Studio / Gemini API)
 *   ANTHROPIC_API_KEY=sk-ant-... node server.js  (Claude API)
 *   then open http://localhost:3000
 *
 * - Serves the front-end files (a whitelist, so nothing else on disk is exposed).
 * - POST /api/chat  {message, history[]} -> {answer}   (the key is never sent to the browser)
 * - GET  /api/health                      -> {ai: true|false, provider: "gemini"|"anthropic"|null, model}
 * Without a key the app stays in offline study mode (Library, PYQ bank, formulas, 3D molecules, practice all still work).
 *
 * Environment
 *   PORT (3000)   HOST (127.0.0.1 locally; 0.0.0.0 when PORT is provided by a host such as Cloud Run)
 *   NEMO_PROVIDER   gemini | anthropic   (default: whichever key is present; Gemini wins if both)
 *   GEMINI_API_KEY (or GOOGLE_API_KEY)   GEMINI_MODEL (default gemini-flash-latest)   GEMINI_BASE_URL (override for tests)
 *   ANTHROPIC_API_KEY                    NEMO_MODEL (default claude-sonnet-5-5)       ANTHROPIC_BASE_URL (override for tests)
 */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || (process.env.PORT ? "0.0.0.0" : "127.0.0.1");
const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";
const GEMINI_BASE = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/+$/, "");
const ANTHROPIC_BASE = (process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(/\/+$/, "");
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
/* If the configured Gemini model id is rejected (renamed or retired), try these stable ids once before giving up. */
const GEMINI_FALLBACKS = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite"];
const ANTHROPIC_MODEL = process.env.NEMO_MODEL || "claude-sonnet-5-5";
const wanted = (process.env.NEMO_PROVIDER || "").toLowerCase();
const PROVIDER = wanted === "anthropic" && ANTHROPIC_KEY ? "anthropic" : wanted === "gemini" && GEMINI_KEY ? "gemini" : GEMINI_KEY ? "gemini" : ANTHROPIC_KEY ? "anthropic" : null;
const MODEL = PROVIDER === "gemini" ? GEMINI_MODEL : PROVIDER === "anthropic" ? ANTHROPIC_MODEL : null;

const ROOT = __dirname;
const JS = "text/javascript; charset=utf-8";
const FILES = {
  "/": ["index.html", "text/html; charset=utf-8"], "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/style.css": ["style.css", "text/css; charset=utf-8"], "/app.js": ["app.js", JS],
  "/data.js": ["data.js", JS], "/molecules.js": ["molecules.js", JS], "/pyq.js": ["pyq.js", JS],
  "/lib-physical.js": ["lib-physical.js", JS], "/lib-inorganic.js": ["lib-inorganic.js", JS],
  "/lib-organic.js": ["lib-organic.js", JS], "/lib-organic2.js": ["lib-organic2.js", JS],
  "/pyq_template.json": ["pyq_template.json", "application/json; charset=utf-8"]
};
const SYSTEM = `You are Nemo, a friendly and rigorous chemistry tutor for CBSE, JEE Main and JEE Advanced students.
- Explain step by step. Define symbols, give units, and show worked numerical steps.
- Use plain text with light Markdown only (**bold**, "- " bullets, "1." lists, simple | tables |). Write formulas with Unicode, e.g. E = E° − (RT/nF) ln Q, H₂SO₄.
- Be accurate. If you are unsure of a fact, an exception or a previous-year-question detail, say so instead of guessing. Never invent PYQ years, paper names, question text or statistics.
- Keep answers focused: usually under 350 words unless the student asks for more.`;

/* very small in-memory rate limit: 20 requests per minute per IP */
const hits = new Map();
function limited(ip) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < 60000)) hits.delete(k);
  return arr.length > 20;
}
const send = (res, code, obj) => { const b = JSON.stringify(obj); res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }); res.end(b); };

/* Normalised conversation: alternating user/assistant turns that start and end with the user. */
function buildMessages(message, history) {
  const msgs = [];
  for (const m of Array.isArray(history) ? history.slice(-12) : []) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") continue;
    const content = m.content.slice(0, 4000);
    if (msgs.length && msgs[msgs.length - 1].role === m.role) msgs[msgs.length - 1].content += "\n\n" + content; else msgs.push({ role: m.role, content });
  }
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (msgs.length && msgs[msgs.length - 1].role === "user") msgs[msgs.length - 1].content += "\n\n" + message; else msgs.push({ role: "user", content: message });
  return msgs;
}

class ProviderError extends Error { constructor(status, message) { super(message); this.status = status; } }

async function callGemini(msgs, signal) {
  const models = [GEMINI_MODEL, ...GEMINI_FALLBACKS.filter((m) => m !== GEMINI_MODEL)];
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: msgs.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    generationConfig: { maxOutputTokens: 4096, temperature: 0.4 }
  });
  let last = null;
  for (let i = 0; i < models.length; i++) {
    const r = await fetch(`${GEMINI_BASE}/models/${encodeURIComponent(models[i])}:generateContent`, {
      method: "POST", signal, headers: { "content-type": "application/json", "x-goog-api-key": GEMINI_KEY }, body
    });
    const data = await r.json().catch(() => ({}));
    if (r.ok) {
      const cand = (data.candidates || [])[0];
      const text = cand && cand.content && Array.isArray(cand.content.parts) ? cand.content.parts.filter((p) => p && typeof p.text === "string" && !p.thought).map((p) => p.text).join("").trim() : "";
      if (text) return text;
      const why = (data.promptFeedback && data.promptFeedback.blockReason) || (cand && cand.finishReason) || "empty response";
      return "I couldn't produce an answer for that (" + why + "). Please rephrase your question.";
    }
    last = new ProviderError(r.status, (data.error && data.error.message) || "error");
    console.error("Gemini API error", r.status, models[i], last.message);
    /* model id rejected -> try the next stable id; anything else (bad key, quota, server error) is final */
    if (!(r.status === 404 || (r.status === 400 && /model/i.test(last.message)))) break;
  }
  throw last;
}

async function callAnthropic(msgs, signal) {
  const r = await fetch(ANTHROPIC_BASE + "/v1/messages", {
    method: "POST", signal,
    headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: ANTHROPIC_MODEL, max_tokens: 1200, system: SYSTEM, messages: msgs })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { console.error("Anthropic API error", r.status, data && data.error && data.error.message); throw new ProviderError(r.status, "error"); }
  return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
}

async function chat(req, res) {
  if (!PROVIDER) return send(res, 503, { error: "AI is not configured. Set GEMINI_API_KEY (or ANTHROPIC_API_KEY) on the server and restart." });
  const ip = req.socket.remoteAddress || "?";
  if (limited(ip)) return send(res, 429, { error: "Too many requests. Please wait a minute." });
  let raw = "";
  for await (const chunk of req) { raw += chunk; if (raw.length > 40000) return send(res, 413, { error: "Request too large." }); }
  let body; try { body = JSON.parse(raw); } catch (_) { return send(res, 400, { error: "Invalid JSON." }); }
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";
  if (!message) return send(res, 400, { error: "Missing message." });
  const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 40000);
  try {
    const msgs = buildMessages(message, body.history);
    const answer = PROVIDER === "gemini" ? await callGemini(msgs, ctrl.signal) : await callAnthropic(msgs, ctrl.signal);
    return send(res, 200, { answer: answer || "I couldn't produce an answer. Please rephrase your question." });
  } catch (err) {
    console.error("chat failed:", err.name, err.message);
    if (err instanceof ProviderError) return send(res, 502, { error: "The AI provider returned an error (" + err.status + ")." + (err.status === 400 || err.status === 401 || err.status === 403 ? " Check the API key and model name on the server." : "") });
    return send(res, 502, { error: err.name === "AbortError" ? "The AI provider took too long." : "Could not reach the AI provider." });
  } finally { clearTimeout(timer); }
}

const server = http.createServer((req, res) => {
  const url = (req.url || "/").split("?")[0];
  if (req.method === "GET" && url === "/api/health") return send(res, 200, { ai: Boolean(PROVIDER), provider: PROVIDER, model: MODEL });
  if (req.method === "POST" && url === "/api/chat") return chat(req, res).catch((e) => { console.error(e); if (!res.headersSent) send(res, 500, { error: "Server error." }); });
  if (req.method === "GET" && FILES[url]) {
    const [file, type] = FILES[url];
    return fs.readFile(path.join(ROOT, file), (err, buf) => {
      if (err) { res.writeHead(404); return res.end("Not found"); }
      res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff" }); res.end(buf);
    });
  }
  res.writeHead(404, { "Content-Type": "text/plain" }); res.end("Not found");
});
server.listen(PORT, HOST, () => console.log(`Nemo running at http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}  (AI ${PROVIDER ? "enabled: " + PROVIDER + ", model " + MODEL : "disabled: set GEMINI_API_KEY or ANTHROPIC_API_KEY"})`));
