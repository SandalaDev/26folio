---
id: EPIC-024
title: "Upgrade agentic system (OS machinery) from the upstream template without losing project memory"
status: done
priority: P1
risk_level: medium
roadmap_refs: [ROAD-004]
goal_refs: [GOAL-001, GOAL-002, GOAL-004]
progress_weight: 1
---

# Epic: Upgrade agentic system (OS machinery) from the upstream template without losing project memory

## Outcome

The repository's OS machinery (`scripts/`, `.githooks/`, `.agents/skills/`,
`pack-frontend/`, `AGENTS.md`, `OPERATING_MANUAL.md`, `setup.sh`,
`.gitattributes`, plus a careful `package.json` merge) is brought up to date
with the upstream `SandalaDev/agenticOS` template, so every supported agent
resumes work on the current runtime. Project memory
(`project-state/state.json`, `project-state/ledger.jsonl`, `backlog/`,
`handoffs/`, `planning/`, `project-spine/`, `memory/`) is left untouched. The
portfolio application and its prior history remain recoverable.

## Scope

- Run `bash scripts/update-from-template.sh --from git@github.com:SandalaDev/agenticOS.git --ref main --dry-run` first and review what the template would change.
- Apply the upgrade by re-running without `--dry-run`.
- Review `git diff --cached` before committing; never auto-commit the diff.
- Re-wire hooks (the upgrader re-installs them) and re-verify that `yaml@2.9.0` remains pinned via `planning/dependencies/DEP-20260729-205420-add.md`.
- Run `bash scripts/os.sh doctor` and `bash scripts/os.sh render` to confirm state integrity and that the dashboard, guide, current-state, and metrics views regenerate cleanly.
- Commit as a single `chore: update OS machinery from template` commit, scoped to the machinery paths only.

## Non-goals

- No portfolio application code changes, dependency upgrades, design edits, or public-copy revision.
- No hand-edits to `project-state/state.json`, `project-state/ledger.jsonl`, `backlog/`, `handoffs/`, `planning/`, or `project-spine/`. The old ledger rows and old state metrics are allowed to self-heal on the next render; we do not pre-rewrite them.
- No new project-owned memory files.
- No automatic remediation of npm audit findings or install-script approvals.
- No claim that completed machinery upgrade proves business outcomes.

## Caveats captured from the upgrading agent's thread

These are recorded here so the work is self-contained and the reviewer can spot
risky changes quickly.

- **No state migration needed.** Old ledger rows keep their token/cost fields; the new readers ignore them. The old `state.json` metrics block self-heals: the first `os render` (or the next `os start`/`os end`) rewrites it without token fields.
- **`.gitignore` is deliberately not clobbered.** The script prints a "merge by hand" note if it differs. The project may still carry a now-stale `/.session-usage.json` line — delete it manually, harmless if not.
- **`docs/` is classified as machinery.** Files matching template paths (e.g. `docs/guide/*`) get overwritten. If the project stashed its own docs under template paths, move them first.

## Tasks

- [x] TASK-089 — Preview the OS upgrade with `--dry-run` and capture the diff for human review.
- [x] TASK-090 — Apply the upgrade, re-wire hooks, re-verify the `yaml@2.9.0` pin.
- [x] TASK-091 — Commit the machinery change as a single `chore: update OS machinery from template` commit.
- [x] TASK-092 — Validate continuity (`os doctor`, `os render`, portfolio lint, strict TypeScript, production build).

## Dependency / Architecture Evidence

- plan: none

The selective upgrader already shipped in the current OS handles machinery-only
updates and refuses to touch project memory. `yaml@2.9.0` is pinned by
`planning/dependencies/DEP-20260729-205420-add.md`; the upgrade re-verifies
this pin.

Apply the `opensrc-research` skill when the upstream diff needs explanation
(e.g. a new machinery script, a hook change, a skill folder change). Refresh
source with: `os deps path <exact-spec>`.

## Testing

- recommendation: dedicated TASK-092
- rationale: The change touches OS machinery broadly and affects every later session. A focused validation task protects the OS itself (state integrity, hooks, dependency pins) and the portfolio application (lint, strict TypeScript, production build) better than shallow checks distributed across the construction tasks.

## Files allowed (advisory)

- `scripts/`
- `.githooks/`
- `.agents/skills/`
- `pack-frontend/`
- `AGENTS.md`
- `OPERATING_MANUAL.md`
- `docs/`
- `setup.sh`
- `.gitattributes`
- `package.json` (merges carefully — never blindly overwritten)
- `project-state/state.json` and `project-state/ledger.jsonl` (rendered/regenerated only — never hand-edited as part of this epic)

Anything else (especially `backlog/`, `handoffs/`, `planning/`, `project-spine/`, `memory/`, `src/`) is out of scope.

## Notes

This epic replaces the would-be ad-hoc "let me just run the upgrader in main"
move with a reviewable, branchable, testable unit of work. The merged PR
description should call out the three caveats above and link the diff
reviewer to this epic file.
