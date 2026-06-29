#!/usr/bin/env node
// render-metrics.mjs — aggregate SESSION_LEDGER.jsonl into harness/model/role
// performance. Writes project-state/METRICS.md (generated view) and a metrics
// block back into STATE.json. Gate result is the ground-truth signal.
//
// NOTE: solo-dev volume is low. These numbers are DIRECTIONAL, not significant.
// Counts are shown beside rates so a 1-of-2 never masquerades as a trend.
import fs from "node:fs";

const LEDGER = "project-state/SESSION_LEDGER.jsonl";
const STATE  = "project-state/STATE.json";
const OUT    = "project-state/METRICS.md";
const MIN_N  = 5; // below this, flag as low-confidence

if (!fs.existsSync(LEDGER)) { console.log("[metrics] no ledger yet — nothing to aggregate."); process.exit(0); }

const rows = fs.readFileSync(LEDGER, "utf8").trim().split("\n")
  .filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

const key = (r) => `${r.harness} · ${r.model} · ${r.role}`;
const agg = new Map();
for (const r of rows) {
  const k = key(r);
  const a = agg.get(k) || { harness: r.harness, model: r.model, role: r.role, sessions: 0, gate_pass: 0, gate_fail: 0, mins: 0, dated: 0 };
  a.sessions++;
  if (r.gate === "pass") a.gate_pass++;
  if (r.gate === "fail") a.gate_fail++;
  if (r.started && r.ended) {
    const dt = (new Date(r.ended) - new Date(r.started)) / 60000;
    if (Number.isFinite(dt) && dt >= 0) { a.mins += dt; a.dated++; }
  }
  agg.set(k, a);
}

const list = [...agg.values()].map(a => {
  const graded = a.gate_pass + a.gate_fail;
  const passRate = graded ? Math.round((a.gate_pass / graded) * 100) : null;
  const avgMin = a.dated ? Math.round(a.mins / a.dated) : null;
  return { ...a, graded, passRate, avgMin, lowN: a.sessions < MIN_N };
}).sort((x, y) => (y.passRate ?? -1) - (x.passRate ?? -1));

const banner = "<!-- generated — do not edit; source: project-state/SESSION_LEDGER.jsonl -->";
const rowsMd = list.map(a =>
  `| ${a.harness} | ${a.model} | ${a.role} | ${a.sessions} | ${a.passRate ?? "—"}${a.passRate!=null?"%":""} (${a.gate_pass}/${a.graded}) | ${a.avgMin ?? "—"}${a.avgMin!=null?" min":""} | ${a.lowN ? "⚠ low-n" : "ok"} |`
).join("\n");

fs.writeFileSync(OUT, `${banner}
# Harness / Model Performance
Directional only — solo-dev volume is low. Rates below ${MIN_N} sessions are flagged ⚠ low-n.
Gate pass = \`verify-task.sh\` passed at session end (externally computed, not self-reported).

| Harness | Model | Role | Sessions | Gate pass rate | Avg session | Confidence |
|---|---|---|---:|---|---|---|
${rowsMd || "| — | — | — | — | — | — | — |"}
`);

if (fs.existsSync(STATE)) {
  const state = JSON.parse(fs.readFileSync(STATE, "utf8"));
  state.metrics = {
    updated: new Date().toISOString(),
    min_n: MIN_N,
    combos: list.map(a => ({ harness: a.harness, model: a.model, role: a.role,
      sessions: a.sessions, gate_pass: a.gate_pass, gate_fail: a.gate_fail,
      gate_pass_rate: a.passRate, avg_session_min: a.avgMin, low_n: a.lowN }))
  };
  fs.writeFileSync(STATE, JSON.stringify(state, null, 2) + "\n");
}
console.log(`[metrics] aggregated ${rows.length} sessions across ${list.length} combos -> ${OUT}`);
