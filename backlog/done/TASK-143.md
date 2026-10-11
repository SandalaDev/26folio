---
id: TASK-143
title: "tests: validate the work section"
status: done
priority: P1
risk_level: medium
epic_ref: EPIC-029
progress_weight: 2
depends_on:
  - TASK-137
  - TASK-139
  - TASK-140
  - TASK-141
files_allowed: []
skill_refs: []
parallel:
  suitable: false
  reason: Runs last against the integrated branch.
  dependencies:
    - TASK-140
  result: null
testing:
  recommendation: dedicated
  reason: This is the dedicated validation task for EPIC-029.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
started_at: 2026-10-09T23:48:36Z
completed_at: 2026-10-09T23:53:21Z
---

# Task: tests: validate the work section

## Scope

Checklist:

- [x] Every block kind renders; no project renders an empty block.
- [x] Reduced motion: no autoplay anywhere; posters show. (Exception recorded below: page headings.)
- [x] Payload: card clips about 1 MB, hero clips about 3 MB, `preload="none"` on cards.
- [x] Artwork and captions legible on site surfaces.
- [x] Alt text on every meaningful image.
- [x] Credit labels correct; nothing self-commissioned reads as client work.
- [x] No years, metrics or testimonials.
- [x] Every page ends on its capability, then "Start a project".
- [x] Lint, typecheck, build.

## Acceptance Criteria

- [x] Every checklist line passes or has a recorded exception.

## Dependency Evidence

- plan: none

## Testing

- recommendation: dedicated
- rationale: This is the dedicated validation task for EPIC-029.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.

## Result (2026-10-10)

Run against the dev server through headless Chrome over the DevTools Protocol,
every page at 1440×900 and at 390×844 (phone emulation): `/work`, the five
project pages and `/capabilities`.

| Check | Result |
|---|---|
| Horizontal overflow | None at either width |
| Images | All load; none lacks `alt`; no meaningful image has empty `alt` on `/work` pages |
| Empty blocks | None |
| Page ending | Every project page: `/capabilities#design` link, then "Start a project" |
| Credits | Own venture, Client, Self-commissioned ×3, as intended |
| Years, metrics, testimonials, "self-initiated", "Concept" | None found |
| Reduced motion | 0 `<video>` elements on `/work` and project pages |
| Hover (desktop) | Plays and fades in on hover; pauses and fades out on leave; other cards load nothing |
| Touch (emulated `hover: none`, coarse pointer) | Only the card crossing the middle of the screen plays (fixed in this task: three stacked cards used to play at once) |
| Hero | Autoplays; cumulative layout shift 0 |
| Clip budgets | Card 0.5 to 0.6 MB, hero 1.4 to 2.4 MB |
| Legibility | Full-page captures of sandala.dev, Flavour Grills, OK Pharmacy and the grid reviewed |
| Lint, typecheck, build | Pass; 14 static pages |

**Recorded exception.** For reduced-motion visitors every page's `h1` stays at
opacity 0, including `/work`'s `PageHero`. Cause: 22 components branch their
framer-motion props on `useReducedMotion`, which is null during server render,
and React does not patch the mismatched style attribute. It predates EPIC-029
and spans the whole site, so it is filed as its own task rather than fixed here.
`/capabilities` also has two technology logos (motion.svg, remotion.svg) with
empty `alt` beside their visible names; acceptable, and outside this epic.

**Not covered yet.** Cloudege and Scrumtrulescent have no pages; rerun this
sweep when they land. Touch behaviour was verified in emulation, not on a
physical phone.
