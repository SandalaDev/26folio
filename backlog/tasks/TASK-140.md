---
id: TASK-140
title: Rebuild the /work grid for seven projects and retire placeholders
status: ready
priority: P1
risk_level: medium
epic_ref: EPIC-029
progress_weight: 2
depends_on:
  - TASK-131
  - TASK-136
files_allowed:
  - src/app/(site)/work/page.tsx
  - src/components/work/work-grid.tsx
  - src/components/home/work-card.tsx
  - src/lib/projects.ts
skill_refs:
  - design-taste-frontend
  - impeccable
parallel:
  suitable: false
  reason: Integrates the card and the data.
  dependencies:
    - TASK-136
  result: null
testing:
  recommendation: with-task
  reason: Check grid order, labels and the home featured-work block in the browser.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
started_at: 2026-10-09T23:36:16Z
completed_at: 2026-10-09T23:43:56Z
---

# Task: Rebuild the /work grid for seven projects and retire placeholders

## Scope

1. Seven cards in the confirmed order, each with credit label, discipline tags
   and video preview.
2. Remove "Project three" and "Project four" and the two orphaned cover images.
3. The home featured-work block keeps rendering.
4. Cloudege's card stays hidden until TASK-138 merges.

## Acceptance Criteria

- [x] No placeholder project remains.
- [x] Home page unchanged in behaviour.
- [x] Lint, typecheck and build pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Check grid order, labels and the home featured-work block in the browser.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.

## Result (2026-10-10)

- "Project three", "Project four" and the orphaned `provision.png` and
  `ok-pharmacy.jpg` are gone.
- Cards show "<credit> · <disciplines>" under the title, and play their loop
  on hover or focus (TASK-136).
- With an odd count the lead card spans both columns (`featured` sizing), so
  the grid never ends on a lone card; decided from the data as projects join.
- The supporting line no longer counts projects: "My own ventures, a brand
  identity for a client, and brand work I set myself. Each card says which is
  which." Awaiting owner approval with the rest of `Work.md`.
- Home featured work still renders Provision and OK Pharmacy.
- Order today: sandala.dev, Flavour Grills, Provision, OK, Gardenfare.
  Cloudege and Scrumtrulescent have no entries, so nothing of theirs shows.

Found and fixed during this task: `PreviewVideo` rendered a `<video>` on the
server that reduced-motion clients dropped, a hydration mismatch. It now
renders only after mount. Video checks re-run afterwards: unchanged.

Found and not fixed (out of scope, filed separately): every page's `h1` stays
at opacity 0 for reduced-motion visitors, because 22 components branch their
framer-motion props on `useReducedMotion`, which is null on the server. It
affects `/work`'s `PageHero` too.
