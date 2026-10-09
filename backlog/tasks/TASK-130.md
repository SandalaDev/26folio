---
id: TASK-130
title: "Salvage the EPIC-026 build onto this branch"
status: ready
priority: P1
risk_level: medium
epic_ref: EPIC-029
progress_weight: 2
depends_on: []
files_allowed:
  - public/images/projects/
  - src/lib/projects.ts
  - src/components/work/
  - src/app/(site)/work/
  - src/app/layout.tsx
skill_refs: []
parallel:
  suitable: false
  reason: First task; everything else builds on what it brings over.
  dependencies: []
  result: null
testing:
  recommendation: with-task
  reason: The risk is a bad merge against two months of dev changes. Build, typecheck and a look at /work and one project page catch it.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---

# Task: Salvage the EPIC-026 build onto this branch

## Scope

1. Bring the five EPIC-026 implementation commits from local branch
   `feature/EPIC-026` (b43c099, 32ca107, 923ad9e, 825dcc8, 0eab424) onto
   `feature/EPIC-029`. Skip 7c20554 (bookkeeping).
2. Resolve conflicts in favour of current `dev` for anything outside the work
   section. Check what the `src/app/layout.tsx` change was for before keeping it.
3. Keep the EPIC-026 copy as a draft only; TASK-139 revises it.
4. After this lands, `feature/EPIC-026` can be deleted with the owner's say-so.

## Acceptance Criteria

- [ ] The four brand projects render through the composition renderer at /work/<slug>.
- [ ] The home page featured-work block still renders.
- [ ] Lint, typecheck and build pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: The risk is a bad merge against two months of dev changes. Build, typecheck and a look at /work and one project page catch it.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.
