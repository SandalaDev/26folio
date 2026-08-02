#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadProgressModel } from "../progress.mjs";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "agent-os-progress-"));
const write = (relative, content) => {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

try {
  write("project-spine/01-charter.md", `---
goals:
  - id: GOAL-001
    title: Faster activation
    weight: 1
    success_signal: Median activation below ten minutes
---
`);
  write("project-spine/03-roadmap.md", `---
roadmap:
  - id: ROAD-001
    title: Activation flow
    goal_refs: [GOAL-001]
---
`);
  write("backlog/epics/EPIC-001.md", `---
id: EPIC-001
roadmap_refs: [ROAD-001]
goal_refs: [GOAL-001]
---
`);
  write("backlog/tasks/TASK-002.md", `---
id: TASK-002
status: ready
epic_ref: backlog/epics/EPIC-001.md
progress_weight: 1
---
`);
  write("backlog/done/TASK-001.md", `---
id: TASK-001
status: done
epic_ref: backlog/epics/EPIC-001.md
progress_weight: 1
---
`);

  const model = loadProgressModel(root);
  assert.equal(model.scope, "business-goal");
  assert.equal(model.overallPercent, 50);
  assert.equal(model.goals[0].percent, 50);
  assert.equal(model.roadmap[0].percent, 50);
  assert.equal(model.tasks.coveragePercent, 100);
  assert.equal(model.confidence, "high");
  console.log("[progress-test] pass");
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
