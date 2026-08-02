#!/usr/bin/env node
// render-metrics.mjs — aggregate ledger.jsonl into harness/model performance
// metrics. Writes project-state/metrics.md (generated view) and a metrics block
// back into state.json.
//
// Tracks sessions, gate-pass rate, avg minutes, and crash counts (crashes are
// first-class data — the legacy ledger never logged them, so they vanished).
// Token/cost tracking was removed: it was opt-in, hand-written, and never real.
import fs from "node:fs";

const LEDGER = "project-state/ledger.jsonl";
const STATE  = "project-state/state.json";
const OUT    = "project-state/metrics.md";
const MIN_N  = 5; // below this, flag as low-confidence

if (!fs.existsSync(LEDGER)) { console.log("[metrics] no ledger yet — nothing to aggregate."); process.exit(0); }

const rows = fs.readFileSync(LEDGER, "utf8").trim().split("\n")
  .filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

if (!rows.length) { console.log("[metrics] ledger empty — nothing to aggregate."); process.exit(0); }

// ---- aggregate by harness·model·role combo ----
const key = (r) => `${r.harness} · ${r.model} · ${r.role}`;
const agg = new Map();
for (const r of rows) {
  const k = key(r);
  const a = agg.get(k) || { harness: r.harness, model: r.model, role: r.role,
    sessions: 0, gate_pass: 0, gate_fail: 0, mins: 0, dated: 0, crashed: 0 };
  a.sessions++;
  if (r.status === "crashed") a.crashed++;
  if (r.gate === "pass" || r.gate === "ok") a.gate_pass++;
  if (r.gate === "fail" || r.gate === "warn") a.gate_fail++;
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

// ---- global totals (across all combos) ----
const tot = rows.reduce((t, r) => {
  t.sessions++;
  if (r.status === "crashed") t.crashed++;
  if (r.gate === "pass" || r.gate === "ok") t.gate_pass++;
  if (r.gate === "fail" || r.gate === "warn") t.gate_fail++;
  return t;
}, { sessions: 0, gate_pass: 0, gate_fail: 0, crashed: 0 });

const banner = "<!-- generated — do not edit; source: project-state/ledger.jsonl -->";

const rowsMd = list.map(a =>
  `| ${a.harness} | ${a.model} | ${a.role} | ${a.sessions} | ${a.passRate ?? "—"}${a.passRate!=null?"%":""} (${a.gate_pass}/${a.graded}) | ${a.avgMin ?? "—"}${a.avgMin!=null?" min":""} | ${a.crashed} | ${a.lowN ? "⚠ low-n" : "ok"} |`
).join("\n");

fs.writeFileSync(OUT, `${banner}
# Performance Metrics
Directional only — solo-dev volume is low. Rates below ${MIN_N} sessions are flagged ⚠ low-n.
Gate pass = \`verify.sh\` passed at session end (externally computed, not self-reported).
"crashed" counts sessions that never reached \`os end\`.

## Totals (all sessions)
| Metric | Value |
|---|---|
| Sessions | ${tot.sessions} |
| Gate pass / fail | ${tot.gate_pass} / ${tot.gate_fail} |
| Crashed sessions | ${tot.crashed} |

## By harness · model · role
| Harness | Model | Role | Sessions | Gate pass rate | Avg session | Crashed | Confidence |
|---|---|---|---:|---|---|---:|---|
${rowsMd || "| — | — | — | — | — | — | — | — |"}
`);

if (fs.existsSync(STATE)) {
  const state = JSON.parse(fs.readFileSync(STATE, "utf8"));
  state.metrics = {
    updated: new Date().toISOString(),
    min_n: MIN_N,
    totals: { sessions: tot.sessions, gate_pass: tot.gate_pass, gate_fail: tot.gate_fail,
      crashed: tot.crashed },
    combos: list.map(a => ({ harness: a.harness, model: a.model, role: a.role,
      sessions: a.sessions, gate_pass: a.gate_pass, gate_fail: a.gate_fail,
      gate_pass_rate: a.passRate, avg_session_min: a.avgMin,
      crashed: a.crashed, low_n: a.lowN }))
  };
  fs.writeFileSync(STATE, JSON.stringify(state, null, 2) + "\n");
}
console.log(`[metrics] aggregated ${rows.length} sessions across ${list.length} combo(s) -> ${OUT}`);
