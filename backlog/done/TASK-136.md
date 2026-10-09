---
id: TASK-136
title: Video preview component for cards and heroes
status: done
priority: P1
risk_level: medium
epic_ref: EPIC-029
progress_weight: 2
depends_on:
  - TASK-131
files_allowed:
  - src/components/work/
  - src/components/home/work-card.tsx
skill_refs:
  - framer-motion
parallel:
  suitable: true
  reason: Self-contained component.
  dependencies:
    - TASK-131
  result: null
testing:
  recommendation: with-task
  reason: Reduced motion, hidden tab and slow network are the failure modes; check each in the browser.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
started_at: 2026-10-09T23:10:54Z
completed_at: 2026-10-09T23:23:37Z
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

- [x] Reduced-motion users never see autoplay.
- [x] No layout shift on play.
- [x] Lint, typecheck and build pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Reduced motion, hidden tab and slow network are the failure modes; check each in the browser.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.

## Result (2026-10-10)

`src/components/work/preview-video.tsx`, used by `WorkCard` (hover or keyboard
focus; mostly-in-view on devices with no hover) and `ProjectHeroBlock`
(autoplay while on screen). The clip overlays the still that is already there
and fills its box, stays transparent until the browser reports playback, and
fades back to the still when it stops. `preload="none"`; WebM first, MP4
fallback. Reduced motion renders no `<video>` element.

Evidence, from headless Chrome over the DevTools Protocol with real mouse
input against the dev server:

- `/work` before hover: all four cards `networkState 1, readyState 0`, paused
  (nothing downloaded).
- Hover on Provision: playing, `t` 2.45 s after 2.5 s, opacity 1, `card.webm`.
  Other cards still `readyState 0`.
- Pointer leaves: paused, opacity 0.
- `/work/gardenfare-foods`: hero playing, opacity 1; cumulative layout shift 0.
- `prefers-reduced-motion: reduce`: 0 `<video>` elements on `/work` and on the
  project page.

Not verified here: the no-hover (touch) path. TASK-143 checks it on a phone.
In the app's browser pane the hover test failed; that pane was hidden
(`document.hidden` true, a 0×0 viewport), which is a test-harness artefact,
not a defect.
