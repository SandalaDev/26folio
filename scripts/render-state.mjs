#!/usr/bin/env node
// render-state.mjs — STATE.json is canonical; regenerate every human view from it.
// Uses a real YAML parser for task frontmatter (fixes v6's regex splitter).
// Flags: --check  (verify consistency + freshness, write nothing; exit 1 on drift)
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";                 // npm i yaml  (vendored in package or skills)

const STATE = "project-state/STATE.json";
const TASKS = "backlog/tasks";
const DONE  = "backlog/done";
const EPICS = "backlog/epics";
const CHECK = process.argv.includes("--check");

const readJSON = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const exists   = (p) => fs.existsSync(p);

function frontmatter(file) {
  const src = fs.readFileSync(file, "utf8");
  // CRLF-tolerant anchor (Windows autocrlf yields ---\r\n).
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  try { return YAML.parse(m[1]) ?? {}; } catch { return {}; }
}

function tasksByStatus(dir, status) {
  if (!exists(dir)) return 0;
  return fs.readdirSync(dir).filter(f => f.endsWith(".md"))
    .filter(f => frontmatter(path.join(dir, f)).status === status).length;
}
const countMd = (dir) => exists(dir) ? fs.readdirSync(dir).filter(f => f.endsWith(".md")).length : 0;

if (!exists(STATE)) { console.error(`[render] missing ${STATE}`); process.exit(1); }
const state = readJSON(STATE);

// ---- consistency: does STATE.current.task agree with that task's frontmatter? ----
let drift = [];
const curTask = state.current?.task;
if (curTask && curTask !== "TASK-XXX") {
  const tf = path.join(TASKS, `${curTask}.md`);
  if (exists(tf)) {
    const st = frontmatter(tf).status;
    if (st === "ready" || st === "in-progress") { /* ok */ }
    else if (st) drift.push(`STATE.current.task ${curTask} has frontmatter status '${st}'`);
  } else {
    // maybe already done
    if (!exists(path.join(DONE, `${curTask}.md`)))
      drift.push(`STATE.current.task ${curTask} has no file in tasks/ or done/`);
  }
}

// ---- recompute derived counts ----
const counts = {
  epics_total: countMd(EPICS),
  tasks_open: tasksByStatus(TASKS, "ready"),
  tasks_in_progress: tasksByStatus(TASKS, "in-progress"),
  tasks_done: countMd(DONE),
  handoffs_pending: (state.handoff_queue || []).filter(h => h.status === "pending").length,
  handoffs_consumed: (state.handoff_queue || []).filter(h => h.status === "consumed").length,
};

if (CHECK) {
  // freshness: STATE.updated should not be empty
  if (!state.updated) drift.push("STATE.updated is empty");
  // counts in file should match recomputed
  for (const k of Object.keys(counts))
    if ((state.counts?.[k] ?? null) !== counts[k])
      drift.push(`counts.${k}: STATE=${state.counts?.[k]} recomputed=${counts[k]}`);
  if (drift.length) {
    console.error("state: DRIFT");
    drift.forEach(d => console.error("  - " + d));
    process.exit(1);
  }
  console.log("state: consistent");
  process.exit(0);
}

// ---- write derived fields back into the canonical file ----
state.counts = counts;
state.updated = new Date().toISOString();
state.updated_by = process.env.AGENT_NAME || state.updated_by || "render-state";
fs.writeFileSync(STATE, JSON.stringify(state, null, 2) + "\n");

const banner = "<!-- generated — do not edit; source: project-state/STATE.json -->";

// ---- CURRENT_STATE.md ----
const c = state.completion || {};
const cur = state.current || {};
const currentMd = `${banner}
---
updated: ${state.updated}
updated_by: ${state.updated_by}
---
# Current State
## Active work
Epic: ${cur.epic ?? "—"}   Slice: ${cur.slice ?? "—"}   Task: ${cur.task ?? "—"}
Branch: ${cur.branch ?? "—"}   Actor: ${(state.actor && state.actor.harness) ? `${state.actor.harness} / ${state.actor.model} (${state.actor.role})` : (cur.agent ?? "—")}
## Completion status
${c.summary ?? "—"}
## What is done
${(c.done || []).map(x => "- " + x).join("\n") || "- —"}
## What remains
${(c.remaining || []).map(x => "- " + x).join("\n") || "- —"}
## Blocked
${c.blocked ?? "none"}
## Assigned handoffs
${(state.handoff_queue || []).filter(h => h.status === "pending").map(h => "- " + h.file).join("\n") || "none"}
`;
fs.writeFileSync("project-state/CURRENT_STATE.md", currentMd);

// ---- HANDOFF_QUEUE.md ----
const rows = (state.handoff_queue || [])
  .map(h => `| ${h.id} | ${h.type} | ${h.task_ref} | ${h.file} | ${h.status} |`).join("\n");
fs.writeFileSync("project-state/HANDOFF_QUEUE.md",
`${banner}
# Handoff Queue
| ID | Type | Task | File | Status |
|---|---|---|---|---|
${rows || "| — | — | — | — | — |"}
`);

console.log("[render] STATE.json refreshed; CURRENT_STATE.md and HANDOFF_QUEUE.md regenerated.");
console.log(`  epics:${counts.epics_total} open:${counts.tasks_open} done:${counts.tasks_done} pending-handoffs:${counts.handoffs_pending}`);

// Refresh harness/model performance view if a ledger exists.
try {
  if (fs.existsSync("project-state/SESSION_LEDGER.jsonl")) {
    const { execFileSync } = await import("node:child_process");
    execFileSync(process.execPath, ["scripts/render-metrics.mjs"], { stdio: "inherit" });
  }
} catch { /* metrics are best-effort; never block a render */ }

// ---- generate the Build Dashboard (dashboard.html) ----
// Delegates to scripts/render-dashboard.mjs, which builds the HTML/CSS/JS in
// code (no template file) and stamps live values from STATE.json. It reloads
// STATE fresh, so the metrics block written above is reflected. Best-effort:
// a missing script or a failure never blocks the Markdown render.
try {
  if (fs.existsSync("scripts/render-dashboard.mjs")) {
    const { execFileSync } = await import("node:child_process");
    execFileSync(process.execPath, ["scripts/render-dashboard.mjs"], { stdio: "inherit" });
  }
} catch { /* dashboard is best-effort; never block a render */ }

