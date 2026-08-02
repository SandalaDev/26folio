#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadEffortModel } from "../effort.mjs";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "agent-os-effort-"));
const write = (relative, content) => {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

// A ledger row factory with sensible defaults.
const row = (over) => JSON.stringify({
  started: "2026-01-01T00:00:00Z", ended: "2026-01-01T01:00:00Z",
  harness: "h", model: "m", role: "executor", branch: "feature/x",
  task: "none", gate: "ok", status: "completed", duration_min: 60, ...over,
}) + "\n";

try {
  // --- normalization: path / bare id / none / missing ---
  write("project-state/ledger.jsonl",
    row({ task: "backlog/tasks/TASK-001.md", duration_min: 30 }) +
    row({ task: "TASK-001", duration_min: 45 }) +          // same task, two forms
    row({ task: "TASK-002", duration_min: 90 }) +
    row({ task: "none", duration_min: 10 }) +               // unattributed
    row({ duration_min: 12 }));                            // missing -> unattributed
  write("backlog/tasks/TASK-001.md", `---
id: TASK-001
title: "First"
status: ready
epic_ref: backlog/epics/EPIC-001.md
progress_weight: 1
---
`);
  write("backlog/tasks/TASK-002.md", `---
id: TASK-002
title: "Second"
status: ready
epic_ref: backlog/epics/EPIC-001.md
progress_weight: 3
---
`);

  let m = loadEffortModel(root);
  const t1 = m.longest.find(t => t.id === "TASK-001");
  assert.equal(t1.totalMin, 75, "path + bare id for the same task must aggregate");
  assert.equal(t1.sessions, 2);
  assert.equal(m.unattributed.sessions, 2, "none + missing bucket together");
  assert.equal(m.unattributed.minutes, 22);

  // --- duration fallback: missing field, computed from timestamps ---
  write("project-state/ledger.jsonl",
    row({ task: "TASK-001", duration_min: undefined, started: "2026-01-02T00:00:00Z", ended: "2026-01-02T01:30:00Z" }));
  m = loadEffortModel(root);
  assert.equal(m.longest.find(t => t.id === "TASK-001").totalMin, 90, "ended-started fallback = 90 min");

  // --- unknown duration: counted as a session, not summed ---
  fs.appendFileSync(path.join(root, "project-state/ledger.jsonl"),
    row({ task: "TASK-001", duration_min: "unknown", started: null, ended: null }));
  m = loadEffortModel(root);
  const u = m.longest.find(t => t.id === "TASK-001");
  assert.equal(u.totalMin, 90, "unknown duration not added to the sum");
  assert.equal(u.sessions, 2, "but the session still counts");

  // --- deleted-task rows still surface with a no-file marker ---
  write("project-state/ledger.jsonl", row({ task: "TASK-OLD", duration_min: 5 }));
  m = loadEffortModel(root);
  const gone = m.longest.find(t => t.id === "TASK-OLD");
  assert.ok(gone && gone.noFile, "renamed/deleted task stays visible");

  // --- quick wins order by weight, only status: ready ---
  write("backlog/done/TASK-DONE.md", `---
id: TASK-DONE
status: done
progress_weight: 1
---
`); // done tasks must never be quick wins
  write("backlog/tasks/TASK-003.md", `---
id: TASK-003
title: "Cheap"
status: ready
progress_weight: 1
---
`);
  m = loadEffortModel(root);
  assert.equal(m.quickWins[0].weight, 1, "lightest task is first");
  assert.equal(m.quickWins[m.quickWins.length - 1].weight, 3, "heaviest ready task is last");
  assert.ok(m.quickWins.every(t => t.id !== "TASK-DONE"), "done excluded");
  assert.ok(m.quickWins.length <= 3, "quick wins capped at 3");

  // --- calibration stays silent below MIN_N ---
  // Only TASK-001 (weight1) and TASK-002 (weight3) have effort so far (<5 tasks).
  m = loadEffortModel(root);
  assert.equal(m.calibration.baselineMinPerWeight, null, "no baseline until n>=5");
  assert.equal(m.calibration.lowN, true);
  assert.ok(m.longest.every(t => t.miss === false), "no miss flags without a baseline");

  // --- crash counts toward effort but flags as thrash ---
  write("project-state/ledger.jsonl",
    row({ task: "TASK-002", status: "crashed", duration_min: 20 }));
  m = loadEffortModel(root);
  const t2 = m.longest.find(t => t.id === "TASK-002");
  assert.equal(t2.crashed, 1, "crashed session counted");
  assert.equal(t2.flag, "thrash", "crash surfaces as thrash, not miss");

  console.log("[effort-test] pass");
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
