---
id: TASK-137
title: "Scrumtrulescent and sandala.dev pages"
status: ready
priority: P1
risk_level: medium
epic_ref: EPIC-029
progress_weight: 2
depends_on: [TASK-131, TASK-133]
files_allowed:
  - src/lib/projects.ts
skill_refs: [writing-style, stop-slop]
parallel:
  suitable: false
  reason: Edits projects.ts alongside 138 and 139.
  dependencies: [TASK-133]
  result: null
testing:
  recommendation: with-task
  reason: Copy is owner-approved; renders checked in the browser.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---

# Task: Scrumtrulescent and sandala.dev pages

## Scope

1. Scrumtrulescent: reader side against editor side. Links to the `cms`
   capability.
2. sandala.dev: short; design system, motion, contact delivery. Links to the
   `motion` proof area.
3. Short narrative (150 to 300 words), stack in one line, no metrics.
4. Owner approves the copy.

## Acceptance Criteria

- [ ] Both pages render with real screens and owner-approved copy.
- [ ] Lint, typecheck and build pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Copy is owner-approved; renders checked in the browser.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.
