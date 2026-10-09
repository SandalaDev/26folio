---
id: TASK-141
title: "Add the brand and web design capability"
status: ready
priority: P1
risk_level: low
epic_ref: EPIC-029
progress_weight: 2
depends_on: [TASK-131]
files_allowed:
  - src/lib/capabilities.ts
  - src/app/(site)/capabilities/
skill_refs: [writing-style, stop-slop]
parallel:
  suitable: true
  reason: Only touches capabilities.
  dependencies: [TASK-131]
  result: null
testing:
  recommendation: with-task
  reason: One new entry in an existing list; build and a look at /capabilities.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---

# Task: Add the brand and web design capability

## Scope

1. Add one service: brand identity and web design, written in the same
   problem-led voice as the other services.
2. It lists the four brand projects as evidence.
3. No other change to /capabilities. Owner approves the copy.

## Acceptance Criteria

- [ ] The service renders and its id resolves from the four brand pages.
- [ ] Owner approved the copy.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: One new entry in an existing list; build and a look at /capabilities.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.
