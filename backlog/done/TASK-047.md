---
id: TASK-047
title: "Featured-work card hover — door-opening tilt + image zoom, smooth"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-011
epic_ref: backlog/epics/EPIC-011-design-refinement.md
slice: EPIC-011-SLICE-3
depends_on: []
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, framer-motion]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: false
handoff_required: false
handoff_type: []
handoff_file: ""
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode."
protected_paths_touched: []
files_allowed:
  - src/components/home/work-card.tsx
  - backlog/tasks/TASK-047.md
progress_weight: 1
---

# Task: Featured-work card door-tilt + image zoom hover

> Owner note 5. The whole card tilts like a door opening while the image zooms —
> one smooth motion, not jerky. EPIC-010 already has a motion-value + spring tilt;
> this task retunes it toward a single-axis "hinge" feel and synchronizes the zoom.

## Scope
- `work-card.tsx`: retune the existing tilt. A door reads as one hinge, so lead
  with a single axis (rotateY toward the pointer's horizontal position) and keep a
  small rotateX for depth, driven by the existing `useMotionValue` + `useSpring`
  pair (never `useState` — design lane §3.B). Raise the tilt magnitude so the
  "door opening" read is clear; soften the spring (lower stiffness / raise damping
  enough) so it eases in and out with no snap.
- Image zoom: ease the zoom on the same enter as the tilt (same transition window)
  so tilt + zoom read as one motion, not two stacked effects. Keep the existing
  warm scrim for AA title contrast.
- Pointer-fine + motion-allowed only (existing gate). Coarse / reduced-motion: a
  static card with a plain CSS zoom on hover (no tilt), as today.
- Keep the imageless placeholder fallback (the pre-EPIC-010 text card) unchanged.

## Acceptance criteria
- [x] Hovering a featured card tilts it like a door opening (clear single-axis
      hinge toward the pointer) while the image zooms, as one smooth motion.
- [x] Motion is spring-driven, no jerk/snap; transitions use transform + opacity only.
- [x] Coarse-pointer / reduced-motion clients get a static card + plain zoom.
- [x] lint / typecheck / build green.
