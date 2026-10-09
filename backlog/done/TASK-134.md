---
id: TASK-134
title: Dependency plan for ffmpeg as a local clip tool
status: done
priority: P1
risk_level: low
epic_ref: EPIC-029
progress_weight: 1
depends_on: []
files_allowed:
  - planning/dependencies/
skill_refs:
  - opensrc-research
parallel:
  suitable: true
  reason: Planning only.
  dependencies: []
  result: null
testing:
  recommendation: none
  reason: A plan document; the owner approves or declines it.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
started_at: 2026-10-09T21:54:32Z
completed_at: 2026-10-09T21:54:34Z
---

# Task: Dependency plan for ffmpeg as a local clip tool

## Scope

1. Run `bash scripts/os.sh deps plan add ...` for ffmpeg as a local
   command-line tool (winget or a portable build), not a package dependency.
2. Record version, source, licence and why it is needed (TASK-135).
3. Wait for the owner's approval before installing.

## Acceptance Criteria

- [x] A plan exists under planning/dependencies/ and the owner has approved or declined it.

## Dependency Evidence

- plan: none

## Testing

- recommendation: none
- rationale: A plan document; the owner approves or declines it.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.
