#!/usr/bin/env node
// dashboard-wiring.test.mjs — end-to-end render checks for the effort card and
// the next-step quick-win hint: paths the template's own empty backlog can
// never exercise. Builds a throwaway project in tmp and runs the real
// render-dashboard.mjs against it.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const RENDER = fileURLToPath(new URL("../render-dashboard.mjs", import.meta.url));
const git = (cwd, args) => execFileSync("git", args, { cwd, stdio: "pipe" });

function scaffold({ withWork = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agent-os-dash-"));
  const write = (rel, content) => {
    const f = path.join(root, rel);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, content);
  };
  git(root, ["init", "-q"]);
  git(root, ["config", "core.hooksPath", ".githooks"]);
  write("project-spine/00-brief.md", "---\nstatus: ready\n---\n");
  write("project-spine/00-interview.md", "---\nstatus: answered\n---\n");
  write("project-spine/01-charter.md", "# charter fixture\n");
  write("project-state/state.json", JSON.stringify({
    schema: "agent-os.state.v1", version: "1.0.0",
    updated: "2026-08-01T00:00:00.000Z", updated_by: "fixture",
    actor: { harness: null, model: null, role: null },
    current: { epic: null, slice: null, task: null, agent: null, branch: null, session_status: "none", handoff_status: "none" },
    completion: { summary: "", done: [], remaining: [], blocked: "none" },
    counts: withWork
      ? { epics_total: 1, tasks_open: 2, tasks_in_progress: 0, tasks_done: 5, handoffs_pending: 0, handoffs_consumed: 0 }
      : { epics_total: 0, tasks_open: 0, tasks_in_progress: 0, tasks_done: 0, handoffs_pending: 0, handoffs_consumed: 0 },
    metrics: {}, epics: [], handoff_queue: [], flow: "github",
  }, null, 2));
  if (withWork) {
    const ledger = [];
    for (let i = 1; i <= 5; i++) {
      write(`backlog/done/TASK-D${i}.md`, `---\nid: TASK-D${i}\ntitle: "Done ${i}"\nstatus: done\nepic_ref: backlog/epics/EPIC-001.md\nprogress_weight: 1\n---\n`);
      ledger.push(JSON.stringify({
        started: `2026-07-0${i}T10:00:00Z`, ended: `2026-07-0${i}T11:00:00Z`,
        harness: "h", model: "m", role: "executor", branch: "feature/EPIC-001",
        task: `backlog/done/TASK-D${i}.md`, gate: "ok", status: "completed", duration_min: 60,
      }));
    }
    write("project-state/ledger.jsonl", ledger.join("\n") + "\n");
    write("backlog/tasks/TASK-R1.md", `---\nid: TASK-R1\ntitle: "Ready one"\nstatus: ready\npriority: P1\nepic_ref: backlog/epics/EPIC-001.md\nprogress_weight: 1\n---\n`);
    write("backlog/tasks/TASK-R2.md", `---\nid: TASK-R2\ntitle: "Ready two"\nstatus: ready\npriority: P2\nepic_ref: backlog/epics/EPIC-001.md\nprogress_weight: 2\n---\n`);
  }
  return root;
}

function render(root) {
  execFileSync(process.execPath, [RENDER], { cwd: root, stdio: "pipe" });
  return fs.readFileSync(path.join(root, "dashboard.html"), "utf8");
}

let root;
try {
  // Scenario A: real work history — baseline, longest table, quick-win hint.
  root = scaffold();
  let html = render(root);
  assert.match(html, /Quickest: TASK-R1 \(weight 1\)/, "next-step names the cheapest ready task");
  assert.match(html, /per weight · n=5/, "baseline stat renders");
  assert.match(html, /Baseline: ~60 min per weight \(n=5\)/, "baseline line renders");
  for (const id of ["TASK-D1", "TASK-D2", "TASK-D3", "TASK-D4", "TASK-D5"])
    assert.match(html, new RegExp(`<code>${id}</code>`), `longest table lists ${id}`);
  const afterQuickWins = html.split("Quick wins")[1] || "";
  assert.match(afterQuickWins, /TASK-R1/, "quick wins list includes R1");
  assert.doesNotMatch(afterQuickWins, /TASK-D1/, "quick wins never list done tasks");
  fs.rmSync(root, { recursive: true, force: true });

  // Scenario B: no ledger, no backlog — honest empty states.
  root = scaffold({ withWork: false });
  html = render(root);
  assert.match(html, /No completed sessions with task attribution yet\./);
  assert.match(html, /Estimation baseline needs ≥5 completed tasks \(have 0\)\./);
  fs.rmSync(root, { recursive: true, force: true });

  console.log("[dashboard-wiring-test] pass");
} finally {
  if (root && fs.existsSync(root)) fs.rmSync(root, { recursive: true, force: true });
}
