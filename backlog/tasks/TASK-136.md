---
id: TASK-136
title: "Video preview component for cards and heroes"
status: ready
priority: P1
risk_level: medium
epic_ref: EPIC-029
progress_weight: 2
depends_on: [TASK-131]
files_allowed:
  - src/components/work/
  - src/components/home/work-card.tsx
skill_refs: [framer-motion]
parallel:
  suitable: true
  reason: Self-contained component.
  dependencies: [TASK-131]
  result: null
testing:
  recommendation: with-task
  reason: Reduced motion, hidden tab and slow network are the failure modes; check each in the browser.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---

# Task: Video preview component for cards and heroes

## Scope

1. Cards: play the muted loop on hover and focus (in view on touch devices),
   pause on leave.
2. Heroes: autoplay muted loop.
3. Reduced motion: poster only, no autoplay. No video: poster only.
4. `preload="none"` on cards; no layout shift when the video starts.
5. Replaces EPIC-026 TASK-103.

## Acceptance Criteria

- [ ] Reduced-motion users never see autoplay.
- [ ] No layout shift on play.
- [ ] Lint, typecheck and build pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Reduced motion, hidden tab and slow network are the failure modes; check each in the browser.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.
