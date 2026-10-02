#!/usr/bin/env node
// Update allowed current-work fields through the shared transaction writer.
import fs from "node:fs";
import { transaction, assertOwner } from "./runtime.mjs";
assertOwner(process.cwd());

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
  transaction(process.cwd(), current => { current.current = state.current; current.updated_by = state.updated_by; }, state.revision ?? 0);
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
    if (field === "task") state.current.claimed_at = new Date().toISOString();
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
