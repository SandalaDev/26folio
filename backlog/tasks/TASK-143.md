---
id: TASK-143
title: "tests: validate the work section"
status: ready
priority: P1
risk_level: medium
epic_ref: EPIC-029
progress_weight: 2
depends_on: [TASK-137, TASK-139, TASK-140, TASK-141]
files_allowed: []
skill_refs: []
parallel:
  suitable: false
  reason: Runs last against the integrated branch.
  dependencies: [TASK-140]
  result: null
testing:
  recommendation: dedicated
  reason: This is the dedicated validation task for EPIC-029.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---

# Task: tests: validate the work section

## Scope

Checklist:

- [ ] Every block kind renders; no project renders an empty block.
- [ ] Reduced motion: no autoplay anywhere; posters show.
- [ ] Payload: card clips about 1 MB, hero clips about 3 MB, `preload="none"` on cards.
- [ ] Artwork and captions legible on site surfaces.
- [ ] Alt text on every meaningful image.
- [ ] Credit labels correct; nothing self-commissioned reads as client work.
- [ ] No years, metrics or testimonials.
- [ ] Every page ends on its capability, then "Start a project".
- [ ] Lint, typecheck, build.

## Acceptance Criteria

- [ ] Every checklist line passes or has a recorded exception.

## Dependency Evidence

- plan: none

## Testing

- recommendation: dedicated
- rationale: This is the dedicated validation task for EPIC-029.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.
