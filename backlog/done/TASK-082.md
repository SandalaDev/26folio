---
id: TASK-082
title: "Migrate durable context and normalize intent traceability"
status: done
priority: P1
risk_level: high
epic_ref: backlog/epics/EPIC-022.md
depends_on: [TASK-081]
progress_weight: 1
files_allowed:
  - project-spine/
  - project-state/
  - memory/
  - handoffs/
  - backlog/
  - planning/
skill_refs: [ds-task-slicer, writing-style]
---
# Task: Migrate durable context and normalize intent traceability

## Scope

Create lean current context from owner-authored legacy artifacts, preserve
historical evidence by path, summarize remaining owner actions, and connect old
tasks through epics to current roadmap and business goals.

## Acceptance Criteria

- [x] Intake and three-file lean context pass the new readiness contract.
- [x] Legacy spine, task, epic, slice, and content evidence remains available.
- [x] Old completed tasks inherit valid epic, roadmap, and goal references.
- [x] Completion status gives the next agent a concise, accurate starting point.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Render progress and inspect unlinked-task output after metadata
  normalization; human review remains necessary for intent and outcome weights.

## Notes

No public copy is changed by this task.
