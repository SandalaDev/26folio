---
id: TASK-131
title: "Extend the project model: credits, disciplines, capability link, video, product suite"
status: ready
priority: P1
risk_level: medium
epic_ref: EPIC-029
progress_weight: 2
depends_on: [TASK-130]
files_allowed:
  - src/lib/projects.ts
  - src/components/work/project-composition.tsx
skill_refs: []
parallel:
  suitable: false
  reason: Defines the types every later task uses.
  dependencies: [TASK-130]
  result: null
testing:
  recommendation: with-task
  reason: Typed static data; an exhaustive switch on block kind makes TypeScript catch a missing renderer branch.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---

# Task: Extend the project model: credits, disciplines, capability link, video, product suite

## Scope

1. `credit`: "Client" | "Own venture" | "Self-commissioned".
2. `disciplines`: short tags shown on cards and heroes.
3. `capability`: the /capabilities id the page links to at its end.
4. `video`: optional card and hero clips (mp4, webm, poster), with the poster
   used whenever video is absent or motion is reduced.
5. A `product-suite` block kind for Cloudege: a list of products, each with
   name, one-line purpose, status and screens.
6. Order: Cloudege, Scrumtrulescent, sandala.dev, The Flavour Grills Cafe,
   Provision Finance, OK Pharmacy, Gardenfare Foods. No year field.

## Acceptance Criteria

- [ ] Every project entry type-checks with credit, disciplines and capability.
- [ ] The renderer switch is exhaustive over block kinds.
- [ ] Lint, typecheck and build pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Typed static data; an exhaustive switch on block kind makes TypeScript catch a missing renderer branch.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.
