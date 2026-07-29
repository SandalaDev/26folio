---
id: TASK-044
title: "Header — confirm/enforce fully transparent floating header"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-011
epic_ref: backlog/epics/EPIC-011-design-refinement.md
slice: EPIC-011-SLICE-1
depends_on: []
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend]

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
  - src/components/site/site-header.tsx
  - src/components/ui/navigation-menu.tsx
  - src/components/site/mobile-nav.tsx
  - src/app/(site)/layout.tsx
  - backlog/tasks/TASK-044.md
progress_weight: 1
---

# Task: Confirm/enforce transparent floating header

> Owner note 2. The header is already `bg-transparent` in code (EPIC-010
> TASK-038). This task verifies that in the running build and removes anything
> that paints a background, blur, or border on the header, the desktop nav, or the
> mobile-nav trigger, so the logo and links genuinely float.

## Scope
- Confirm in the built/running output that the header paints nothing behind the
  logo and nav (no background, no `backdrop-blur`, no border) — `site-header.tsx`
  is `bg-transparent`; `navigation-menu.tsx` has no background; the `MobileNav`
  trigger carries no surface fill (the drawer itself can keep its surface; only
  the bar floats).
- Remove any stray surface/blur/border that does paint, and leave a comment noting
  the header floats by design (referencing the EPIC-010 decision). If nothing
  paints, make no destructive change — this is a verification task first.
- Keep the header's existing behavior: sticky, hides on scroll-down / shows on
  scroll-up (Framer), disabled (stays put) under `prefers-reduced-motion`.

## Acceptance criteria
- [x] Header renders with zero painted background/blur/border in the live build
      (logo + nav float over the page).
- [x] No change to the header's scroll behavior or the focus ring.
- [x] lint / typecheck / build green.
