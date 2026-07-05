---
id: TASK-050
title: "Smooth gradient ramps — low-alpha multi-stop hero fallback, longer MeshBg ramps, shader grain on"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-012
slice: EPIC-012-SLICE-2
depends_on: []
design_refs: [10-design-system.md, 10-design-system.html]
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
  - src/components/home/hero.tsx
  - src/components/site/mesh-bg.tsx
  - src/components/motion/shader-background.tsx
  - backlog/tasks/TASK-050.md
---

# Task: Smooth gradient ramps (kill the banding)

> Owner: "the gradients look jagged, not smooth." Root cause: the hero's static
> fallback runs FULL-strength caramel/rose radials to transparent across the
> viewport — the exact §3 anti-pattern ("never a tight two-stop ramp") — and
> dark long ramps band visibly. The shader's built-in grain dither is off.

## Scope
- `hero.tsx` static fallback: rebuild as low-alpha, multi-stop washes. Accent
  intensity caps near the preview's ceiling (~10–14% via `color-mix`), with an
  intermediate stop per ramp so the falloff is long and low-contrast. Same
  composition (caramel upper-left, rose lower-right, espresso base) so the
  reduced-motion/SSR view keeps its character — just soft.
- `shader-background.tsx`: enable the library's grain (`grainMixer` /
  `grainOverlay` at a low value) to dither the WebGL field; keep
  distortion/swirl/speed as tuned. Re-check the veil still gives AA contrast
  for hero type.
- `mesh-bg.tsx`: add an intermediate stop to each radial so ramps lengthen;
  keep both tone presets and current intensity ceilings.
- No layout, copy, or behavior changes; the shader stays additive above the
  static base exactly as today.

## Acceptance criteria
- [ ] No full-strength accent-to-transparent ramp remains in these files.
- [ ] Hero fallback and section washes show no visible banding at 1440p+
      (verify in-browser, both with the shader mounted and with
      reduced-motion forcing the static fallback).
- [ ] Shader field shows grain-dithered smooth color, not stepped bands.
- [ ] Hero text contrast still AA over both backgrounds.
- [ ] lint / typecheck / build green.
