---
id: TASK-140
title: "Rebuild the /work grid for seven projects and retire placeholders"
status: ready
priority: P1
risk_level: medium
epic_ref: EPIC-029
progress_weight: 2
depends_on: [TASK-131, TASK-136]
files_allowed:
  - src/app/(site)/work/page.tsx
  - src/components/work/work-grid.tsx
  - src/components/home/work-card.tsx
  - src/lib/projects.ts
skill_refs: [design-taste-frontend, impeccable]
parallel:
  suitable: false
  reason: Integrates the card and the data.
  dependencies: [TASK-136]
  result: null
testing:
  recommendation: with-task
  reason: Check grid order, labels and the home featured-work block in the browser.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---

# Task: Rebuild the /work grid for seven projects and retire placeholders

## Scope

1. Seven cards in the confirmed order, each with credit label, discipline tags
   and video preview.
2. Remove "Project three" and "Project four" and the two orphaned cover images.
3. The home featured-work block keeps rendering.
4. Cloudege's card stays hidden until TASK-138 merges.

## Acceptance Criteria

- [ ] No placeholder project remains.
- [ ] Home page unchanged in behaviour.
- [ ] Lint, typecheck and build pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Check grid order, labels and the home featured-work block in the browser.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.
