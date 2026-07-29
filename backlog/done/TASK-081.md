---
id: TASK-081
title: "Replace legacy Agent OS machinery and state model"
status: done
priority: P1
risk_level: high
epic_ref: backlog/epics/EPIC-022.md
progress_weight: 1
files_allowed:
  - AGENTS.md
  - CLAUDE.md
  - .cursorrules
  - .agents/
  - .github/
  - .githooks/
  - .gitignore
  - OPERATING_MANUAL.md
  - README.md
  - docs/
  - pack-frontend/
  - scripts/
  - setup.sh
  - package.json
  - package-lock.json
  - project-state/
skill_refs: [opensrc-research, ds-task-slicer, ds-test-planner]
---
# Task: Replace legacy Agent OS machinery and state model

## Scope

Install the current template machinery, remove obsolete enforcement files,
create the lowercase canonical state, archive historical review handoffs, and
keep project-specific utilities and domain skills.

## Acceptance Criteria

- [x] New OS commands, portable skills, hooks, guide, and dashboard renderers are present.
- [x] `project-state/state.json` is the only active runtime state.
- [x] Obsolete gates and uppercase generated views are removed.
- [x] Project-specific Spotify tooling, tests, and domain skills remain.

## Dependency Evidence

- plan: `planning/dependencies/DEP-20260729-205420-add.md`

## Testing

- recommendation: dedicated TASK-083
- rationale: State and workflow regressions are verified after context migration
  so the checks exercise the complete resulting system.

## Notes

The template updater was run from `C:\_git\projectStart` at `main`.
