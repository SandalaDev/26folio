#!/usr/bin/env node
// update-state.mjs — the single canonical writer for project-state/state.json.
//
// WHY THIS EXISTS
// state.json is the source of truth, but for a long time nothing in the OS
// actually wrote the fields that matter (current.task, completion, etc.) —
// agents had to hand-edit JSON, which is exactly the unsanctioned, drift-prone
// path the system exists to prevent. This is the sanctioned writer: a
// constrained, operation-based interface (not arbitrary merge), so writes are
// auditable and can't silently corrupt schema.
//
// Usage:
//   node scripts/update-state.mjs set-current <field> <value>
//     Set state.current.<field> (e.g. task, branch, agent). Value "null" clears.
//   node scripts/update-state.mjs clear-task
//     Convenience: null out current.task + current.branch + current.agent.
//
// Writes are atomic (temp + rename) so a crash mid-write can't leave a
// half-written state.json. Formatting is preserved (2-space indent, trailing
// newline). Exits non-zero with a message on any validation failure.
//
// current.epic is NOT in the allow-list: it is derived (Phase 3a) from the
// claimed task's epic_ref frontmatter by render-state.mjs. To change it, set
// the task's epic_ref (or claim a different task) and run `os render`.
import fs from "node:fs";

const STATE = "project-state/state.json";
const ALLOWED_CURRENT = new Set(["slice", "task", "agent", "branch", "session_status", "handoff_status"]);

const [op, ...args] = process.argv.slice(2);

if (!op) {
  console.error("Usage: node scripts/update-state.mjs <set-current <field> <value> | clear-task>");
  process.exit(2);
}

if (!fs.existsSync(STATE)) {
  console.error(`[update-state] missing ${STATE}`);
  process.exit(1);
}

// Atomic read-modify-write: parse, mutate, write to temp, rename.
let state;
try {
  state = JSON.parse(fs.readFileSync(STATE, "utf8"));
} catch (e) {
  console.error(`[update-state] ${STATE} is not valid JSON: ${e.message}`);
  process.exit(1);
}
if (!state || typeof state !== "object" || state.current == null) {
  console.error(`[update-state] ${STATE} has no 'current' object — refusing to write.`);
  process.exit(1);
}

function commit() {
  state.updated = new Date().toISOString();
  state.updated_by = process.env.HARNESS_NAME || "agent";
  const tmp = `${STATE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2) + "\n", "utf8");
  fs.renameSync(tmp, STATE);
}

switch (op) {
  case "set-current": {
    const [field, ...rest] = args;
    const value = rest.join(" ");
    if (!ALLOWED_CURRENT.has(field)) {
      console.error(`[update-state] field 'current.${field}' not in allow-list: ${[...ALLOWED_CURRENT].join(", ")}`);
      process.exit(1);
    }
    if (!value || value === "null") {
      state.current[field] = null;
    } else {
      state.current[field] = value;
    }
    commit();
    console.log(`[update-state] current.${field} = ${state.current[field] == null ? "null" : JSON.stringify(state.current[field])}`);
    break;
  }
  case "clear-task": {
    state.current.task = null;
    state.current.branch = null;
    state.current.agent = null;
    state.current.epic = null;   // derived from current.task (Phase 3a); no task -> no epic
    commit();
    console.log("[update-state] cleared current.{task,branch,agent,epic}");
    break;
  }
  default:
    console.error(`[update-state] unknown op '${op}'`);
    console.error("Usage: node scripts/update-state.mjs <set-current <field> <value> | clear-task>");
    process.exit(2);
}
