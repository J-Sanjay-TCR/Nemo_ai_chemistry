# Nemo_ai_chemistry

Nemo is a chemistry AI tutor and study companion for CBSE, JEE Main, and JEE Advanced students.

Features:
- Offline study mode with formulas, rules, examples, and practice questions
- Optional server-side AI chat using Gemini or Anthropic
- 3D molecule viewer with built-in structures
- PYQ import workflow for personal practice
- Practice analytics and chapter tracking

Run locally:

```bash
npm install
npm start
```

With AI enabled:

```bash
GEMINI_API_KEY=your_key node server.js
```

Or with Anthropic:

```bash
ANTHROPIC_API_KEY=your_key node server.js
```
