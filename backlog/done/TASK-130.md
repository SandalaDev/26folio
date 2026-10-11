---
id: TASK-130
title: Salvage the EPIC-026 build onto this branch
status: done
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
started_at: 2026-10-09T22:11:12Z
completed_at: 2026-10-09T22:15:39Z
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

- [x] The four brand projects render through the composition renderer at /work/<slug>.
- [x] The home page featured-work block still renders.
- [x] Lint, typecheck and build pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: The risk is a bad merge against two months of dev changes. Build, typecheck and a look at /work and one project page catch it.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.

## Result (2026-10-10)

`dev` had not touched any salvaged path since EPIC-026 branched (67afd34), so
the product files were checked out from `feature/EPIC-026` instead of
cherry-picking; that kept EPIC-026's old backlog and state edits out. Brought
over: `public/images/projects/` (four projects plus `MANIFEST.md`),
`src/lib/projects.ts`, `src/components/work/`, `src/app/(site)/work/`,
`planning/content/page-copy/Work.md`, and the `metadataBase` in
`src/app/layout.tsx` (keeps project OpenGraph URLs off localhost).
`case-study-detail.tsx` is removed, as on the EPIC-026 branch.

Removed `ok-pharmacy/dispensary-scene.webp`, the AI scene the owner ruled out
at kickoff; the manifest records why.

Evidence: lint, typecheck and `npm run build` pass (15 static pages). In the
dev server all four project pages return 200, every image URL loads, no image
lacks `alt`, the console has no errors, and the home featured-work block still
links to `/work/provision-finance` and `/work/ok-pharmacy`. `/work` still shows
the two placeholders; TASK-140 retires them. Screenshots were not possible: the
browser pane was hidden.
