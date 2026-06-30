---
id: TASK-021
title: "Timeline — GSAP scroll-revealed career beats"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-004
slice: EPIC-004-SLICE-4
depends_on: []
design_refs: [12-ui-element-map.md, 11-content-strategy.md]
skill_refs: [design-taste-frontend, impeccable]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: false
handoff_required: true
handoff_type:
  - review
handoff_file: handoffs/review/HANDOFF-REVIEW-TASK-021.md
protected_paths_touched: []
files_allowed:
  - src/components/about/timeline.tsx
  - backlog/tasks/TASK-021.md
---

# Task: Timeline

> **GSAP owns this** (architecture principle #4: scroll-driven multi-element
> reveal). **Placeholder beats** (epic decision #1) — no real career history exists
> in the spine, so this ships generic milestone placeholders, not invented dates or
> employers.

## Scope
`Timeline`: vertical list of 3-4 beats, each revealing (opacity/translate-in) as it
scrolls into view via GSAP `ScrollTrigger` (one trigger per beat is simplest and
keeps each beat independently testable). Degrades to a plain static stacked list —
fully visible, no animation — under `prefers-reduced-motion`.

## Acceptance criteria
- [ ] Each beat's `ScrollTrigger` is created in a `useEffect`/`gsap.context` and torn
  down on unmount — no leaked instances across navigations.
- [ ] Under `prefers-reduced-motion`, no `ScrollTrigger` is created at all; beats
  render at full opacity immediately.
- [ ] Beats remain in normal document flow and keyboard/reader order regardless of
  animation state (no `display: none` hiding content from assistive tech before
  reveal).
- [ ] Beat content is generic placeholder ("Milestone — a short description"), not
  fabricated specific employers/dates/projects.
- [ ] `npm run lint` and `npm run typecheck` pass; `npm run build` green + static.

## Notes
Medium risk: GSAP lifecycle (same risk class as EPIC-003's `CapabilityRail`) — route
via cross-model review (`handoffs/review/HANDOFF-REVIEW-TASK-021.md`).
