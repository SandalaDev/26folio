#!/usr/bin/env node
// render-state.mjs — state.json is canonical; regenerate every human view from it.
// One real YAML parser, CRLF-tolerant, recomputes derived counts, --check fails
// on drift. The L1 view generator. Never hand-edit what this writes.
//
// Flags: --check  (verify consistency + freshness, write nothing; exit 1 on drift)
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const STATE = "project-state/state.json";
const TASKS = "backlog/tasks";
const DONE  = "backlog/done";
const EPICS = "backlog/epics";
const HANDOFFS = "handoffs";
const CHECK = process.argv.some(a => a === "--check" || a === "--check-structural");

const readJSON = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const exists   = (p) => fs.existsSync(p);

function frontmatter(file) {
  const src = fs.readFileSync(file, "utf8");
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);   // CRLF-tolerant
  if (!m) return {};
  try { return YAML.parse(m[1]) ?? {}; } catch { return {}; }
}

function tasksByStatus(dir, status) {
  if (!exists(dir)) return 0;
  return fs.readdirSync(dir).filter(f => f.endsWith(".md"))
    .filter(f => frontmatter(path.join(dir, f)).status === status).length;
}
const countMd = (dir) => exists(dir) ? fs.readdirSync(dir).filter(f => f.endsWith(".md")).length : 0;

// ---- derived: epics[] (Phase 3a) ------------------------------------------
// backlog/epics/*.md frontmatter -> { id, title, status }. Source of truth is
// the filesystem; state.epics is a derived projection rebuilt every render.
// Idempotent and read-only on the sources; absent dir -> []. Files missing an
// `id` are skipped (they'd be unaddressable downstream).
function deriveEpics() {
  if (!exists(EPICS)) return [];
  return fs.readdirSync(EPICS).filter(f => f.endsWith(".md"))
    .map(f => frontmatter(path.join(EPICS, f)))
    .filter(e => e.id != null && e.id !== "")
    .map(e => ({ id: String(e.id), title: e.title ?? null, status: e.status ?? null }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

// ---- derived: current.epic (Phase 3a) -------------------------------------
// If a task is claimed, derive current.epic from that task's epic_ref
// frontmatter (e.g. "backlog/epics/EPIC-001.md" -> "EPIC-001"). Returns null
// when there is nothing to derive from (no task, no file, no epic_ref, or an
// epic_ref that doesn't carry an EPIC-NNN token) — callers must treat null as
// "leave the existing value alone," never as "clear it." current.epic stays
// claim/runtime-driven at the fallback; the derivation just keeps it in sync.
function deriveCurrentEpic(task) {
  if (!task || task === "TASK-XXX") return null;
  const tf = path.join(TASKS, `${task}.md`);
  if (!exists(tf)) return null;
  const ref = frontmatter(tf).epic_ref;
  if (typeof ref !== "string" || ref === "") return null;
  const m = ref.match(/(EPIC-\d+)/);
  return m ? m[1] : null;
}

// ---- derived: handoff_queue[] ---------------------------------------------
// handoffs/{session,task,...}/*.md -> { id, type, task_ref, file, status }.
// The artifact files are the source of truth; the queue is a derived projection
// rebuilt every render. Files carry frontmatter (id, handoff_type, task_ref);
// files missing a frontmatter `id` are skipped. Absent dir -> []. Status is
// "pending" until the file is moved to handoffs/archive/ (the consumed path).
function deriveHandoffQueue() {
  if (!exists(HANDOFFS)) return [];
  const out = [];
  for (const dir of fs.readdirSync(HANDOFFS)) {
    const sub = path.join(HANDOFFS, dir);
    if (!fs.statSync(sub).isDirectory()) continue;
    for (const f of fs.readdirSync(sub).filter(x => x.endsWith(".md"))) {
      const file = path.join(sub, f).replace(/\\/g, "/");
      const fm = frontmatter(file);
      if (fm.id == null || fm.id === "") continue;
      out.push({ id: String(fm.id), type: fm.handoff_type || dir,
                 task_ref: fm.task_ref ?? null, file, status: "pending" });
    }
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

// ---- derived: completion.* ------------------------------------------------
// project-state/completion.md frontmatter -> { summary, done, remaining,
// blocked }. That file is the curated source of truth (like decisions.md);
// state.completion is a derived projection. Missing file -> empty defaults so
// the view renders "—" rather than crashing. Lists default to [].
const COMPLETION = "project-state/completion.md";
function deriveCompletion() {
  const fm = exists(COMPLETION) ? frontmatter(COMPLETION) : {};
  const list = (v) => Array.isArray(v) ? v : (v == null || v === "" ? [] : [v]);
  return {
    summary:  fm.summary ?? "",
    done:     list(fm.done),
    remaining: list(fm.remaining),
    blocked:  fm.blocked ?? "none",
  };
}

if (!exists(STATE)) { console.error(`[render] missing ${STATE}`); process.exit(1); }
const state = readJSON(STATE);

// ---- consistency: does state.current.task agree with that task's frontmatter? ----
let drift = [];
const curTask = state.current?.task;
if (curTask && curTask !== "TASK-XXX") {
  const tf = path.join(TASKS, `${curTask}.md`);
  if (exists(tf)) {
    const st = frontmatter(tf).status;
    if (st === "ready" || st === "in-progress" || st === "blocked") { /* ok */ }
    else if (st) drift.push(`current.task ${curTask} has frontmatter status '${st}'`);
  } else if (!exists(path.join(DONE, `${curTask}.md`))) {
    drift.push(`current.task ${curTask} has no file in tasks/ or done/`);
  }
}

// ---- derived: handoff_queue[] (Phase 3a) ----
// Computed before counts so counts.handoffs_* reflect the freshly-derived queue
// rather than whatever is currently in state.json (which may be stale).
const handoffs = deriveHandoffQueue();

// ---- recompute derived counts ----
const counts = {
  epics_total: countMd(EPICS),
  tasks_open: tasksByStatus(TASKS, "ready"),
  tasks_in_progress: tasksByStatus(TASKS, "in-progress"),
  tasks_done: countMd(DONE),
  handoffs_pending: handoffs.filter(h => h.status === "pending").length,
  handoffs_consumed: handoffs.filter(h => h.status === "consumed").length,
};

// ---- derived: epics[] + current.epic (Phase 3a) ----
// Recomputed from the filesystem so they can't drift. current.epic is only
// overwritten when there is a positive derivation; a null result means "no
// claimable source," and we leave the existing value in place rather than
// clobbering it (a claimed task with a missing epic_ref shouldn't zero it out).
const epics = deriveEpics();
const derivedEpic = deriveCurrentEpic(curTask);
const completion = deriveCompletion();

if (CHECK) {
  // --check-structural: only structural invariants (task coherence), NOT derived
  // counts. The gate (verify.sh) runs BEFORE os.sh end renders, so counts are
  // legitimately stale (task not yet moved, handoff just queued). Comparing them
  // here would false-positive. Full --check (incl. counts) is the human's probe.
  const STRUCTURAL_ONLY = process.argv.includes("--check-structural");
  if (!STRUCTURAL_ONLY) {
    if (!state.updated) drift.push("state.updated is empty (run `os start` or `os end`)");
    for (const k of Object.keys(counts))
      if ((state.counts?.[k] ?? null) !== counts[k])
        drift.push(`counts.${k}: state=${state.counts?.[k]} recomputed=${counts[k]}`);
    // epics[] drift: compare by id+status+title projection (order-independent).
    const sig = (arr) => (arr || []).map(e => `${e.id}|${e.title ?? ""}|${e.status ?? ""}`).sort().join("\n");
    if (sig(state.epics) !== sig(epics))
      drift.push(`epics[]: state has ${(state.epics || []).length} recomputed has ${epics.length} (run \`os render\`)`);
    // handoff_queue[] drift: compare by id|status (the fields that are derived).
    const hsig = (arr) => (arr || []).map(h => `${h.id}|${h.status ?? "pending"}`).sort().join("\n");
    if (hsig(state.handoff_queue) !== hsig(handoffs))
      drift.push(`handoff_queue[]: state has ${(state.handoff_queue || []).length} recomputed has ${handoffs.length} (run \`os render\`)`);
    if (derivedEpic && (state.current?.epic ?? null) !== derivedEpic)
      drift.push(`current.epic: state=${state.current?.epic ?? null} derived=${derivedEpic}`);
    // completion.* drift: compare by the derived fields.
    const csig = (c) => `summary=${c?.summary ?? ""}|done=${(c?.done || []).join(",")}|remaining=${(c?.remaining || []).join(",")}|blocked=${c?.blocked ?? "none"}`;
    if (csig(state.completion) !== csig(completion))
      drift.push(`completion.*: drifts from project-state/completion.md (run \`os render\`)`);
  }
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
state.epics = epics;
state.handoff_queue = handoffs;
state.completion = completion;
if (derivedEpic) state.current.epic = derivedEpic;
state.updated = new Date().toISOString();
state.updated_by = process.env.HARNESS_NAME || process.env.AGENT_NAME || state.updated_by || "render-state";
fs.writeFileSync(STATE, JSON.stringify(state, null, 2) + "\n");

const banner = "<!-- generated — do not edit; source: project-state/state.json -->";

// ---- current-state.md ----
const c = state.completion || {};
const cur = state.current || {};
const actorLine = (state.actor && state.actor.harness)
  ? `${state.actor.harness} / ${state.actor.model ?? "—"} (${state.actor.role ?? "—"})`
  : (cur.agent ?? "—");
const currentMd = `${banner}
---
updated: ${state.updated}
updated_by: ${state.updated_by}
---
# Current State
## Active work
Epic: ${cur.epic ?? "—"}   Slice: ${cur.slice ?? "—"}   Task: ${cur.task ?? "—"}
Branch: ${cur.branch ?? "—"}   Actor: ${actorLine}
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
fs.writeFileSync("project-state/current-state.md", currentMd);

// ---- handoff queue view (folded into current-state.md in the dashboard; kept minimal) ----
console.log("[render] state.json refreshed; current-state.md regenerated.");
console.log(`  epics:${counts.epics_total} open:${counts.tasks_open} done:${counts.tasks_done} pending-handoffs:${counts.handoffs_pending}`);

// Best-effort: refresh metrics + dashboard if their renderers exist.
try {
  if (fs.existsSync("project-state/ledger.jsonl") && fs.existsSync("scripts/render-metrics.mjs")) {
    const { execFileSync } = await import("node:child_process");
    execFileSync(process.execPath, ["scripts/render-metrics.mjs"], { stdio: "inherit" });
  }
} catch { /* metrics are best-effort */ }
try {
  if (fs.existsSync("scripts/render-dashboard.mjs")) {
    const { execFileSync } = await import("node:child_process");
    execFileSync(process.execPath, ["scripts/render-dashboard.mjs"], { stdio: "inherit" });
  }
} catch { /* dashboard is best-effort */ }
try {
  if (fs.existsSync("scripts/render-guide.mjs")) {
    const { execFileSync } = await import("node:child_process");
    execFileSync(process.execPath, ["scripts/render-guide.mjs"], { stdio: "inherit" });
  }
} catch { /* guide is best-effort */ }
