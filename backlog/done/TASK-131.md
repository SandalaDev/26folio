---
id: TASK-131
title: "Extend the project model: credits, disciplines, capability link, video, product suite"
status: done
priority: P1
risk_level: medium
epic_ref: EPIC-029
progress_weight: 2
depends_on:
  - TASK-130
files_allowed:
  - src/lib/projects.ts
  - src/components/work/project-composition.tsx
skill_refs: []
parallel:
  suitable: false
  reason: Defines the types every later task uses.
  dependencies:
    - TASK-130
  result: null
testing:
  recommendation: with-task
  reason: Typed static data; an exhaustive switch on block kind makes TypeScript catch a missing renderer branch.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
started_at: 2026-10-09T22:17:49Z
completed_at: 2026-10-09T22:21:43Z
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

- [x] Every project entry type-checks with credit, disciplines and capability.
- [x] The renderer switch is exhaustive over block kinds.
- [x] Lint, typecheck and build pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Typed static data; an exhaustive switch on block kind makes TypeScript catch a missing renderer branch.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.

## Result (2026-10-10)

- `engagement` is replaced by `credit: "Client" | "Own venture" |
  "Self-commissioned"`; the hero's meta row shows it as "Credit", plus "Role"
  when set. `year` is removed from the type, the data and the hero.
- `capability` names a `CapabilityService.id`. The route resolves it and the
  page ends on a "The capability behind it" link to `/capabilities#<id>`. An id
  that does not resolve renders nothing, so the brand pages, which point at
  `design`, show no link until TASK-141 adds that service. Verified by
  pointing Flavour Grills at `cms` temporarily: the link rendered to
  `/capabilities#cms` with the service title, then was reverted.
- The previous/next links EPIC-026 built are removed: the owner chose
  "link to the capability" over "both" at kickoff.
- `video?: { card?, hero? }` with `VideoClip { mp4, webm?, poster }`.
- Grid order is now Flavour Grills, Provision, OK, Gardenfare; the three own
  ventures go in front as their pages land.
- The home page no longer takes the first two projects: `featuredOnHome` names
  them (Provision, OK), and an unknown slug fails the build.

**Moved to TASK-138:** the `product-suite` block kind. Adding the type here
would force the exhaustive renderer either to stub it or to render nothing,
which is the failure the switch exists to prevent.

Evidence: lint, typecheck and build pass. In the dev server all four project
pages, `/` and `/work` return 200 with the expected credits, order and home
links.
