---
id: TASK-049
title: "Global flashlight at design-system spec — site-wide mount, 520px peach-led recipe, MotionValue-driven"
status: ready
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-012
slice: EPIC-012-SLICE-1
depends_on: []
design_refs: [10-design-system.md, 10-design-system.html, 12-ui-element-map.md]
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
  - src/components/site/flashlight-cursor.tsx
  - src/lib/use-pointer.ts
  - src/app/(site)/layout.tsx
  - src/components/about/about-intro.tsx
  - backlog/tasks/TASK-049.md
  # Gate fix (cherry-picked from unmerged EPIC-008 4e8ea56): the scope check
  # aborted under `set -euo pipefail` before running, blocking every push from
  # this branch. Declared here because it blocks this epic's own verification —
  # same precedent as TASK-034's original declaration.
  - scripts/verify-task.sh
---

# Task: Global flashlight at design-system spec

> Owner: the flashlight in `10-design-system.html` looks better than the site's,
> and /capabilities has none at all. Make the preview's flashlight the site's:
> global, bigger, warmer, smoother.
>
> Owner (2026-07-05, second pass): the About-page flashlight is specifically
> **too narrow** — the 280px circle reads as a tight puck following the cursor,
> not ambient light. The preview's 520px implementation is the reference. Width
> is not a tunable here; match the preview.

## Scope
- Mount `FlashlightCursor` once in `src/app/(site)/layout.tsx` (global fixed
  overlay, like the preview's `.flashlight`), and remove the About-only mount
  from `about-intro.tsx` so it isn't doubled there.
- Match the preview recipe exactly: `radial-gradient(520px circle at x y,
  peach @ 10% alpha, rose @ 5% alpha 38%, transparent 70%)` — peach-led, long
  falloff. Express alphas via `color-mix(... , transparent)` on the tokens, as
  the component already does (no raw hexes).
- Rewrite the driver: consume `usePointerMotion()` (MotionValues) with
  `useMotionTemplate` on a `motion.div` background so pointer moves cause NO
  React re-render (design lane §3.B). The state-based `usePointer` reader can
  be deleted from `use-pointer.ts` if this was its last consumer.
- Reproduce the preview's glide: either springs on the x/y MotionValues (soft,
  low-stiffness) or the preview's `transition: background 300ms var(--ease)`.
  Subtle — the light trails the cursor slightly; it does not lag.
- Keep every existing gate: pointer-fine only, `prefers-reduced-motion` off
  switch, `aria-hidden`, `pointer-events-none`, `fixed inset-0` beneath page
  content (verify stacking on all five pages — content must sit above it).

## Acceptance criteria
- [ ] Flashlight visible on /, /capabilities, /about, /work, /contact.
- [ ] Recipe matches the preview (520px, peach→rose, 38%/70% stops) via tokens.
- [ ] On /about specifically, the light reads as wide ambient glow, not a
      tight cursor puck (owner's 2026-07-05 complaint — eyeball it there).
- [ ] Zero React re-renders on pointer move (MotionValue-driven).
- [ ] Movement glides like the preview; no stutter.
- [ ] Coarse-pointer / reduced-motion clients never see it; focus rings and
      all interactions unaffected.
- [ ] lint / typecheck / build green.
