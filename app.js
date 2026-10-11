/* Nemo — AI Chemistry Tutor (front-end).
   Works fully offline in "study mode". Open via http(s) with server.js (or set AI_ENDPOINT) for live AI answers.
   Never put a secret API key in this file. */
"use strict";

const AI_ENDPOINT = ""; // e.g. "https://your-server.example/api/chat". Leave empty to auto-detect /api/chat from server.js.

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const DATA = window.NEMO_DATA || { quiz: [], formulas: [], topics: [] };
const MOLS = window.NEMO_MOLECULES || [];

function libraryAnswer(e, related) {
  const parts = ["**" + e.n + "** (" + e.b + " · " + e.ch + " · " + e.t + ")", e.s];
  if (e.w) parts.push("**Credit / origin:** " + e.w);
  if (e.e) parts.push("**Example:** " + e.e);
  if (e.x) parts.push("**Exam trap:** " + e.x);
  if (related && related.length) parts.push("**Also in the Library:** " + related.map((r) => r.n).join(" · "));
  return parts.join("\n\n");
}

const store = {
  get(k, fallback) { try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch (_) { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (_) { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (_) { /* ignore */ } }
};

function el(tag, props, ...kids) {
  const n = document.createElement(tag);
  if (props) for (const [k, v] of Object.entries(props)) {
    if (k === "class") n.className = v; else if (k === "text") n.textContent = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else if (v !== false && v != null) n.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids) if (kid != null) n.append(kid);
  return n;
}

function mdToHtml(src) {
  const lines = String(src).replace(/\r/g, "").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (/^```/.test(line)) {
      const code = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i++; out.push("<pre><code>" + code.join("\n") + "</code></pre>"); continue;
    }
    if (/^\s*[-*•]\s+/.test(line)) {
      const items = []; while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*•]\s+/, ""));
      out.push("<ul>" + items.map((t) => "<li>" + t + "</li>").join("") + "</ul>"); continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = []; while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+[.)]\s+/, ""));
      out.push("<ol>" + items.map((t) => "<li>" + t + "</li>").join("") + "</ol>"); continue;
    }
    if (/^>\s?/.test(line)) { out.push('<span class="formula-line">' + line.replace(/^>\s?/, "") + "</span>"); i++; continue; }
    const para = []; while (i < lines.length && lines[i].trim() && !/^```/.test(lines[i]) && !/^\s*[-*•]\s+/.test(lines[i]) && !/^\s*\d+[.)]\s+/.test(lines[i]) && !/^>\s?/.test(lines[i])) para.push(lines[i++]);
    out.push("<p>" + para.join("<br>") + "</p>");
  }
  return out.join("");
}

const messagesEl = $("#messages"), input = $("#questionInput"), sendBtn = $("#sendBtn");
let history = store.get("nemo.chat.v2", []).filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string").slice(-40);

function addMessage(text, role = "nemo") {
  const row = el("div", { class: "message " + (role === "user" ? "user-message" : "nemo-message") });
  if (role !== "user") row.append(el("div", { class: "mini-orb", "aria-hidden": "true", text: "N" }));
  const bubble = el("div", { class: "bubble" });
  bubble.innerHTML = mdToHtml(text);
  row.append(bubble);
  messagesEl.append(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function renderHistory() {
  messagesEl.innerHTML = "";
  if (!history.length) {
    addMessage("**Hi! I'm Nemo.**\nAsk me a chemistry question.");
    return;
  }
  for (const m of history) addMessage(m.content, m.role === "user" ? "user" : "nemo");
}

function offlineAnswer(q) {
  for (const t of DATA.topics) {
    try { if (new RegExp(t.match, "i").test(q)) return t.answer; } catch (_) {}
  }
  return "I'm in offline study mode. Try a formula or rule from the built-in library.";
}

async function askNemo(question) {
  question = String(question || "").trim();
  if (!question) return;
  addMessage(question, "user");
  history.push({ role: "user", content: question });
  input.value = "";
  let answer = offlineAnswer(question);
  addMessage(answer, "nemo");
  history.push({ role: "assistant", content: answer });
  store.set("nemo.chat.v2", history.slice(-40));
}

sendBtn.addEventListener("click", () => askNemo(input.value));
input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); askNemo(input.value); } });

renderHistory();
