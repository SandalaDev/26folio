---
id: TASK-037
title: "Signature motion — custom cursor + magnetic button; wire hero CTA"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-009
slice: EPIC-009-SLICE-2
depends_on: [TASK-036]
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, gsap, framer-motion]

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
review_waiver: "Solo dev (reviewer: human). Cross-model review is reassigned to the human at the PR into dev, per OS degraded mode; no separate handoff artifact materialized."
protected_paths_touched: []
files_allowed:
  - src/lib/use-pointer.ts
  - src/components/motion/cursor.tsx
  - src/components/motion/magnetic-button.tsx
  - src/app/(site)/layout.tsx
  - src/components/home/hero.tsx
  - backlog/tasks/TASK-037.md
---

# Task: Signature motion — cursor + magnetic button

> The §7 baunfire interactions: **#2 custom cursor** and **#4 button hover**. Realizes
> the reservation in [button.tsx](../../src/components/ui/button.tsx) ("magnetic pull,
> cursor-origin fill sweep, text-mask reveal — a separate motion component").

## Scope
- Extend `src/lib/use-pointer.ts` to expose Framer `MotionValue`s from the **single**
  shared `mousemove` source (the hook already anticipates "a later `Cursor` component
  subscribes to the same hook rather than adding a second listener"), so cursor/button
  read pointer position without per-move React re-renders.
- `src/components/motion/cursor.tsx`: custom cursor that grows / shows a label over
  interactive elements. **Pointer-fine only** (disabled on touch/coarse), reduced-motion
  safe, and it **never removes the native focus path** (§10). Mounted once in
  `src/app/(site)/layout.tsx`.
- `src/components/motion/magnetic-button.tsx`: wraps the base `Button` with a
  baunfire-style **magnetic pull** (GSAP `quickTo`, `gsap.matchMedia` reduced-motion
  guard), **cursor-origin fill sweep**, and **text-mask reveal** (Framer). Degrades to the
  plain `Button` under reduced-motion / touch. Wire the hero CTA to it.

## Acceptance criteria
- [x] No second `mousemove` listener is added — cursor + magnetic reuse `usePointer`.
- [x] Custom cursor is pointer-fine only and preserves keyboard focus rings.
- [x] `MagneticButton` renders the plain `Button` (no transforms) under reduced-motion /
      touch; magnetic + fill + reveal work on desktop.
- [x] Hero CTA uses `MagneticButton`; `npm run lint`, `npm run typecheck` pass;
      `npm run build` green; no console errors in-browser.

## Notes
Medium risk: a global client-side cursor + imperative GSAP transforms. One library per job
(§6): GSAP for the imperative magnetic transform, Framer for declarative fill/reveal.
