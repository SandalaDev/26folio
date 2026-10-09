---
id: TASK-138
title: "Cloudege page and product-suite block"
status: blocked
priority: P1
risk_level: medium
epic_ref: EPIC-029
progress_weight: 2
depends_on: [TASK-131, TASK-132]
files_allowed:
  - src/lib/projects.ts
  - src/components/work/
skill_refs: [writing-style, stop-slop, design-taste-frontend]
parallel:
  suitable: false
  reason: Edits projects.ts.
  dependencies: [TASK-132]
  result: null
testing:
  recommendation: with-task
  reason: Six sections must render whatever the product count turns out to be.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---

# Task: Cloudege page and product-suite block

## Scope

1. Build the `product-suite` block: suite intro, then one section per
   product with name, purpose, status and screens on ArtefactPlate.
2. Author the Cloudege entry: credit "Own venture", role "Co-founder, design and
   engineering".
3. Capability link chosen once the product list is known.
4. The partner signs off on the page before it merges.

## Acceptance Criteria

- [ ] Page renders all products.
- [ ] The partner's sign-off is recorded in this task.
- [ ] Lint, typecheck and build pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Six sections must render whatever the product count turns out to be.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.
