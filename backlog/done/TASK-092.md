---
id: TASK-092
title: "Validate continuity: os doctor, os render, portfolio lint, strict TypeScript, production build"
status: done
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

### Validation results (2026-08-02)

All checks PASS. The OS upgrade is fully validated end-to-end on
`feature/EPIC-024`.

| Check | Command | Result |
|---|---|---|
| OS health | `bash scripts/os.sh doctor` | `[doctor] ✓ healthy.` (all 11 subcommands green, state.epics matches backlog/epics/ 23 epics, state.completion matches completion.md) |
| State consistency | `bash scripts/os.sh check` | `state: consistent` (after a self-healing render pass; see notes below) |
| View regeneration | `bash scripts/os.sh render` | `dashboard.html`, `guide.html`, `current-state.md`, `metrics.md` regenerated; `epics:23 done:85 pending-handoffs:0` |
| New template test | `node scripts/test/dashboard-wiring.test.mjs` | `[dashboard-wiring-test] pass` (exit 0) |
| New template test | `node scripts/test/effort.test.mjs` | `[effort-test] pass` (exit 0) |
| Existing template test | `node scripts/test/progress.test.mjs` | `[progress-test] pass` (exit 0) |
| Existing template test | `node scripts/test/rendered-artifacts.test.mjs` | `[rendered-artifacts-test] pass` (exit 0) |
| Portfolio lint | `bash scripts/test/lint.sh` (= `npm run lint`) | `eslint . --max-warnings 0` — exit 0, no warnings, no errors |
| Portfolio strict TypeScript | `bash scripts/test/typecheck.sh` (= `npm run typecheck`) | `tsc --noEmit` — exit 0 |
| Portfolio production build | `npm run build` | 13 static pages generated; bundle sizes unchanged from EPIC-023 baseline; exit 0 |

### Self-healing bookkeeping observed during validation

The first `bash scripts/os.sh check` after TASK-091 reported three drift
items, all of which are bookkeeping artifacts the new render pass resolved
in the same step (this is the documented self-heal path, not a regression):

- `counts.tasks_in_progress: state=1 recomputed=2` — TASK-092 had been
  claimed in `backlog/tasks/` since the previous render, so the recomputed
  count is 2 (TASK-088 paused + TASK-092 in-progress).
- `counts.tasks_done: state=83 recomputed=85` — TASK-089, TASK-090,
  TASK-091 had all been moved to `backlog/done/` since the previous
  render; the recomputed count is 85.
- `current.epic: state=null derived=EPIC-024` — the derived epic
  (`Phase 3a`) was stale because `os release` from TASK-089 had cleared
  `current.epic`; the active claim of TASK-092 (with `epic_ref:
  backlog/epics/EPIC-024.md`) re-derives it correctly.

A subsequent `os render` + `os check` confirmed `state: consistent`. The
drift was data, not machinery — the upgrade did not regress state
derivation; it just surfaced bookkeeping that the agent had not yet
re-rendered.

### Risks called out in the PR description

- Schema touchpoint: `state.json` is rebuilt by the render pass; old
  metrics tokens self-heal.
- Hooks: `core.hooksPath = .githooks` confirmed post-apply.
- Dependency pin: `yaml@2.9.0` confirmed post-apply; no new packages
  introduced by the upgrade (`package.json` was unchanged per the
  dry-run preview).
- Build parity: bundle sizes and the 13-page static surface are
  unchanged from the EPIC-023 baseline. The upgrade did not regress
  portfolio application behavior.

TASK-092 completes EPIC-024.
