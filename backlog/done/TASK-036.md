---
id: TASK-036
title: "Shader hero background — warm-remapped MeshGradient + Hero integration"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-009
slice: EPIC-009-SLICE-2
depends_on: [TASK-035]
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
review_waiver: "Solo dev (reviewer: human). Cross-model review is reassigned to the human at the PR into dev, per OS degraded mode; no separate handoff artifact materialized."
protected_paths_touched: []
files_allowed:
  - package.json
  - package-lock.json
  - src/components/motion/shader-background.tsx
  - src/components/home/hero.tsx
  - backlog/tasks/TASK-036.md
---

# Task: Shader hero background

> Realizes STATE.json's follow-up *"vendor the 21st.dev ShaderBackground as a Hero
> upgrade once perf/a11y-audited"* and epic decision #3 in
> [hero.tsx](../../src/components/home/hero.tsx) ("the eventual WebGL shader").

## Scope
- Add `@paper-design/shaders-react` (the MeshGradient dependency).
- `src/components/motion/shader-background.tsx` (client): wrap `MeshGradient` with the
  upstream `mounted`/resize guard, **colours remapped to the warm skin palette**
  (`rose #ec8ca0`, `peach #f0a98a`, `caramel #c99368`, `soft #e9c8d3`, `surface #241c18`,
  `background #1a1411`) — **no teal, no magenta, no harsh two-stop gradient** (§3) — with
  low `distortion/swirl/speed` for §6's "subtle & smooth", and a soft warm veil.
- Integrate into `src/components/home/hero.tsx`: keep the existing static radial-gradient
  as the always-present base layer; mount `ShaderBackground` above it **only when motion
  is allowed** (`!useReducedMotion()`) and the pointer is fine (desktop). Hero copy is
  unchanged.

## Acceptance criteria
- [x] `@paper-design/shaders-react` in `package.json`/lockfile.
- [x] Shader renders warm tones only (traceable to §2 tokens); no teal/magenta.
- [x] Reduced-motion / touch / SSR path shows the static gradient fallback unchanged; the
      shader adds nothing to the reduced-motion experience.
- [x] `npm run lint`, `npm run typecheck` pass; `npm run build` green; no WebGL/hydration
      console errors in-browser.

## Notes
Medium risk: a new client-side WebGL dependency. Gated behind motion/pointer checks so it
is strictly additive over the documented fallback.
