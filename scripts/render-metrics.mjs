#!/usr/bin/env node
// render-metrics.mjs — aggregate ledger.jsonl into harness/model performance
// AND cost/token metrics. Writes project-state/metrics.md (generated view) and a
// metrics block back into state.json.
//
// Rebuilt vs legacy: the legacy version only tracked sessions + gate-pass-rate +
// avg-min. This adds tokens_in/out, cost_usd, status breakdown (incl. crashed),
// and $/gate-pass. Crashes are now first-class data (the legacy ledger never
// logged them, so they vanished from metrics entirely).
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
    sessions: 0, gate_pass: 0, gate_fail: 0, mins: 0, dated: 0,
    tokens_in: 0, tokens_out: 0, cost: 0, cost_known: 0, crashed: 0 };
  a.sessions++;
  if (r.status === "crashed") a.crashed++;
  if (r.gate === "pass" || r.gate === "ok") a.gate_pass++;
  if (r.gate === "fail" || r.gate === "warn") a.gate_fail++;
  if (r.started && r.ended) {
    const dt = (new Date(r.ended) - new Date(r.started)) / 60000;
    if (Number.isFinite(dt) && dt >= 0) { a.mins += dt; a.dated++; }
  }
  if (Number.isFinite(+r.tokens_in))  a.tokens_in  += +r.tokens_in;
  if (Number.isFinite(+r.tokens_out)) a.tokens_out += +r.tokens_out;
  if (Number.isFinite(+r.cost_usd))   { a.cost += +r.cost_usd; a.cost_known++; }
  agg.set(k, a);
}

const list = [...agg.values()].map(a => {
  const graded = a.gate_pass + a.gate_fail;
  const passRate = graded ? Math.round((a.gate_pass / graded) * 100) : null;
  const avgMin = a.dated ? Math.round(a.mins / a.dated) : null;
  return { ...a, graded, passRate, avgMin,
    costPerPass: a.gate_pass ? (a.cost / a.gate_pass) : null,
    lowN: a.sessions < MIN_N };
}).sort((x, y) => (y.passRate ?? -1) - (x.passRate ?? -1));

// ---- global totals (across all combos) ----
const tot = rows.reduce((t, r) => {
  t.sessions++;
  if (r.status === "crashed") t.crashed++;
  if (r.gate === "pass" || r.gate === "ok") t.gate_pass++;
  if (r.gate === "fail" || r.gate === "warn") t.gate_fail++;
  if (Number.isFinite(+r.cost_usd)) t.cost += +r.cost_usd;
  if (Number.isFinite(+r.tokens_in))  t.tokens_in  += +r.tokens_in;
  if (Number.isFinite(+r.tokens_out)) t.tokens_out += +r.tokens_out;
  return t;
}, { sessions: 0, gate_pass: 0, gate_fail: 0, crashed: 0, cost: 0, tokens_in: 0, tokens_out: 0 });

const banner = "<!-- generated — do not edit; source: project-state/ledger.jsonl -->";
const fmtK = (n) => Number.isFinite(+n) ? Math.round(+n).toLocaleString() : "—";
const fmt$ = (n) => Number.isFinite(+n) ? `$${(+n).toFixed(2)}` : "—";

const rowsMd = list.map(a =>
  `| ${a.harness} | ${a.model} | ${a.role} | ${a.sessions} | ${a.passRate ?? "—"}${a.passRate!=null?"%":""} (${a.gate_pass}/${a.graded}) | ${fmtK(a.tokens_in)} | ${fmtK(a.tokens_out)} | ${fmt$(a.cost)} | ${a.avgMin ?? "—"}${a.avgMin!=null?" min":""} | ${a.crashed} | ${a.lowN ? "⚠ low-n" : "ok"} |`
).join("\n");

fs.writeFileSync(OUT, `${banner}
# Performance & Cost Metrics
Directional only — solo-dev volume is low. Rates below ${MIN_N} sessions are flagged ⚠ low-n.
Gate pass = \`verify.sh\` passed at session end (externally computed, not self-reported).
"crashed" counts sessions that never reached \`os end\` (now tracked, unlike the legacy system).

## Totals (all sessions)
| Metric | Value |
|---|---|
| Sessions | ${tot.sessions} |
| Gate pass / fail | ${tot.gate_pass} / ${tot.gate_fail} |
| Crashed sessions | ${tot.crashed} |
| Tokens in / out | ${fmtK(tot.tokens_in)} / ${fmtK(tot.tokens_out)} |
| Total cost | ${fmt$(tot.cost)} |

## By harness · model · role
| Harness | Model | Role | Sessions | Gate pass rate | Tokens in | Tokens out | Cost | Avg session | Crashed | Confidence |
|---|---|---|---:|---|---|---|---|---|---:|---|
${rowsMd || "| — | — | — | — | — | — | — | — | — | — | — |"}
`);

if (fs.existsSync(STATE)) {
  const state = JSON.parse(fs.readFileSync(STATE, "utf8"));
  state.metrics = {
    updated: new Date().toISOString(),
    min_n: MIN_N,
    totals: { sessions: tot.sessions, gate_pass: tot.gate_pass, gate_fail: tot.gate_fail,
      crashed: tot.crashed, tokens_in: tot.tokens_in, tokens_out: tot.tokens_out, cost_usd: tot.cost },
    combos: list.map(a => ({ harness: a.harness, model: a.model, role: a.role,
      sessions: a.sessions, gate_pass: a.gate_pass, gate_fail: a.gate_fail,
      gate_pass_rate: a.passRate, avg_session_min: a.avgMin,
      tokens_in: a.tokens_in, tokens_out: a.tokens_out, cost_usd: a.cost, cost_per_pass: a.costPerPass,
      crashed: a.crashed, low_n: a.lowN }))
  };
  fs.writeFileSync(STATE, JSON.stringify(state, null, 2) + "\n");
}
console.log(`[metrics] aggregated ${rows.length} sessions across ${list.length} combo(s) -> ${OUT}`);
