#!/usr/bin/env node
// agent-switch.test.mjs — end-to-end for os switch / os onboard / fresh-lock guard.
// Builds a throwaway project in tmp (os.sh renders guide/dashboard so the full
// repo layout is needed), then drives the real scripts through a full switch cycle.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const root = fs.mkdtempSync(path.join(os.tmpdir(), "agent-os-switch-"));

const write = (rel, content) => {
  const f = path.join(root, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
};
const ossh = (args) => spawnSync("bash", ["scripts/os.sh", ...args], { cwd: root, encoding: "utf8" });

try {
  // fixture: copy machinery the OS renders
  for (const dir of ["scripts", "docs", "node_modules"]) {
    fs.cpSync(path.join(REPO, dir), path.join(root, dir), { recursive: true });
  }
  execFileSync("git", ["init", "-q"], { cwd: root });
  execFileSync("git", ["config", "core.hooksPath", ".githooks"], { cwd: root });

  write("project-spine/00-brief.md", "---\nstatus: ready\n---\n");
  write("project-spine/00-interview.md", "---\nstatus: answered\n---\n");
  write("project-spine/01-charter.md", "# charter fixture\n");
  write("project-state/state.json", JSON.stringify({
    schema: "agent-os.state.v1", version: "1.0.0",
    updated: "2026-08-01T00:00:00.000Z", updated_by: "fixture",
    actor: { harness: null, model: null, role: null },
    current: { epic: null, slice: null, task: null, agent: null, branch: null, session_status: "none", handoff_status: "none" },
    completion: { summary: "", done: [], remaining: [], blocked: "none" },
    counts: { epics_total: 1, tasks_open: 1, tasks_in_progress: 0, tasks_done: 0, handoffs_pending: 0, handoffs_consumed: 0 },
    metrics: {}, epics: [], handoff_queue: [], flow: "github",
  }, null, 2));
  write("backlog/tasks/TASK-R1.md", `---
id: TASK-R1
title: "Ready one"
status: ready
priority: P1
epic_ref: backlog/epics/EPIC-001.md
progress_weight: 1
---
# Task: Ready one
## Scope
probe
## Acceptance Criteria
- [ ] handles CRLF line endings
## Testing
- recommendation: none
`);

  // ── 1. graceful switch ─────────────────────────────────────────────
  assert.equal(ossh(["claim", "TASK-R1"]).status, 0, "claim");
  assert.equal(ossh(["start"]).status, 0, "start");
  const sw = ossh(["switch", "blocked on parser, next: handle CRLF"]);
  assert.equal(sw.status, 0, `switch failed: ${sw.stderr}`);
  assert.ok(!fs.existsSync(path.join(root, "project-state/session.lock")), "switch ends the session");
  const handoffs = fs.readdirSync(path.join(root, "handoffs/session")).filter(f => f.includes("SWITCH"));
  assert.equal(handoffs.length, 1, "one switch handoff written");
  const handoffBody = fs.readFileSync(path.join(root, "handoffs/session", handoffs[0]), "utf8");
  assert.match(handoffBody, /blocked on parser/, "the note is in the handoff");
  const ledger = fs.readFileSync(path.join(root, "project-state/ledger.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
  assert.equal(ledger.at(-1).task, "backlog/tasks/TASK-R1.md", "ledger attributes the claimed task");
  const state = JSON.parse(fs.readFileSync(path.join(root, "project-state/state.json"), "utf8"));
  assert.equal(state.current.task, "TASK-R1", "switch keeps the claim for the next agent");
  assert.ok(state.handoff_queue.some(h => h.id.includes("SWITCH")), "queue derived the handoff");

  // ── 2. onboard: packet content ─────────────────────────────────────
  const on = ossh(["onboard"]);
  assert.equal(on.status, 0, `onboard failed: ${on.stderr}`);
  assert.match(on.stdout, /TASK-R1/, "packet names the task");
  assert.match(on.stdout, /handles CRLF line endings/, "packet shows acceptance criteria");
  assert.match(on.stdout, /HANDOFF-SESSION-SWITCH/, "packet lists the handoff");
  assert.match(on.stdout, /Next action/, "packet has a next action");

  // ── 3. fresh-lock guard + takeover ─────────────────────────────────
  const refuse = ossh(["start"]);
  assert.equal(refuse.status, 1, "fresh lock refuses a second session");
  assert.match(refuse.stderr, /REFUSED/, "refusal explains itself");
  const take = ossh(["start", "--takeover"]);
  assert.equal(take.status, 0, `takeover failed: ${take.stderr}`);
  const crashed = fs.readdirSync(path.join(root, "project-state")).filter(f => f.startsWith("session.lock.crashed-"));
  assert.equal(crashed.length, 1, "takeover preserves the journal as a crash artifact");

  console.log("[agent-switch-test] pass");
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
