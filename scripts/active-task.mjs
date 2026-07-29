#!/usr/bin/env node
// active-task.mjs — resolve the in-progress task file path from state.json.
// Used by the pre-push hook to know which task the gate should verify.
// Prints the path (backlog/tasks/<TASK>.md) if a task is active and its file
// exists; otherwise prints nothing and exits 0.
import fs from "node:fs";

try {
  const state = JSON.parse(fs.readFileSync("project-state/state.json", "utf8"));
  const task = state.current?.task;
  if (task && task !== "TASK-XXX") {
    for (const d of ["backlog/tasks", "backlog/done"]) {
      const p = `${d}/${task}.md`;
      if (fs.existsSync(p)) { process.stdout.write(p); break; }
    }
  }
} catch { /* no state or bad json -> no active task */ }
