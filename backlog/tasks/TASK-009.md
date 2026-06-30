---
id: TASK-009
title: "Shared motion constants (durations, easings, Framer presets)"
status: ready
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-002
slice: EPIC-002-SLICE-3
depends_on: []
design_refs: [10-design-system.md]
skill_refs: [design-taste-frontend, impeccable]

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
protected_paths_touched: []
files_allowed:
  - src/lib/motion.ts
---

# Task: Shared motion constants

> **Port, don't re-derive.** The motion values already exist in
> [`10-design-system.html`](../../project-spine/10-design-system.html)
> (`--ease: cubic-bezier(0.22,1,0.36,1)`, `--dur-micro/component/page` = 150/300/500ms).
> This task only re-expresses them as typed Framer constants for React. Same numbers.

## Scope
Encode the motion system from [10-design-system.md](../../project-spine/10-design-system.md)
§6 as a single typed constants module so every later component animates with the same
"subtle and smooth" timing. Constants only — no React components, no GSAP/Lottie
helpers (those arrive with the components that use them).

## Acceptance criteria
- [ ] `src/lib/motion.ts` exports:
  - `DURATION` = `{ micro: 0.15, component: 0.3, page: 0.5 }` (seconds).
  - `EASE_OUT` = `[0.22, 1, 0.36, 1]` (the §6 custom cubic-bézier), typed for
    `framer-motion`.
  - `fadeUp` Framer `Variants` (`opacity 0→1`, `y 20→0`, ease-out, component duration).
  - `staggerContainer` Framer `Variants` with `staggerChildren: 0.08` (§6).
  - `prefersReducedMotion()` — SSR-safe helper returning a boolean (guards
    `window.matchMedia('(prefers-reduced-motion: reduce)')`).
- [ ] No aggressive springs / overshoot (§6) — easing only.
- [ ] Types check against the installed `framer-motion` (`Variants`, `Transition`).
- [ ] `npm run lint` and `npm run typecheck` pass.

## Notes
Low risk: a leaf utility module with no consumers yet. `prefersReducedMotion()` must
not touch `window` at module scope (RSC/SSR safe).
