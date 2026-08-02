---
id: TASK-092
title: "Validate continuity: os doctor, os render, portfolio lint, strict TypeScript, production build"
status: in-progress
priority: P1
risk_level: medium
epic_ref: backlog/epics/EPIC-024.md
progress_weight: 1
files_allowed:
  - backlog/
  - project-state/
skill_refs: []
---

# Task: Validate continuity: os doctor, os render, portfolio lint, strict TypeScript, production build

## Scope

After the OS machinery commit in TASK-091, run the full validation suite to
confirm the OS itself is healthy (state integrity, hooks, dependency pin) and
the portfolio application still builds cleanly (lint, strict TypeScript,
production build). Also run the new template tests that the upgrade added
(`dashboard-wiring.test.mjs`, `effort.test.mjs`) and the existing ones
(`progress.test.mjs`, `rendered-artifacts.test.mjs`).

## Acceptance Criteria

- [ ] `bash scripts/os.sh doctor` exits 0 and reports healthy.
- [ ] `bash scripts/os.sh check` exits 0 and reports `state: consistent`.
- [ ] `bash scripts/os.sh render` regenerates the views without errors.
- [ ] The portfolio lint passes (the project's own `scripts/test/lint.sh`).
- [ ] The portfolio strict TypeScript check passes (the project's own
      `scripts/test/typecheck.sh`).
- [ ] The portfolio production build passes (`npm run build` or equivalent).
- [ ] The new template tests pass (`node scripts/test/dashboard-wiring.test.mjs`,
      `node scripts/test/effort.test.mjs`).
- [ ] The existing tests pass (`node scripts/test/progress.test.mjs`,
      `node scripts/test/rendered-artifacts.test.mjs`).
- [ ] Any failure is captured in this task's `## Notes` with the failing
      command and the first 20 lines of its output.

## Dependency Evidence

- plan: none

## Testing

- recommendation: dedicated
- rationale: This task IS the validation. Coverage within the task is the proportionate shape.

## Notes

TASK-092 starts here. The full EPIC-024 task slice is:

- [x] TASK-089 — Preview the OS upgrade with `--dry-run` and capture the diff for human review.
- [x] TASK-090 — Apply the upgrade, re-wire hooks, re-verify the `yaml@2.9.0` pin.
- [x] TASK-091 — Commit the machinery change as a single `chore: update OS machinery from template` commit.
- [ ] TASK-092 — Validate continuity (`os doctor`, `os render`, portfolio lint, strict TypeScript, production build).

TASK-092 finishes EPIC-024.
