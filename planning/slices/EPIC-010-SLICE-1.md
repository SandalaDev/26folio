---
id: EPIC-010-SLICE-1
title: Global foundations — typography, layout width, header, blob + background system
epic: EPIC-010
status: ready
phase: 4
risk_level: medium
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, framer-motion]
tasks: [TASK-038, TASK-039]
---

# SLICE-1 — Global foundations

> Everything site-wide: the type system finally ships its real faces and gains
> heavy/light contrast; all-caps goes; the layout cap goes; the header goes
> transparent; and the blob motif enters the design system with a background kit
> (blob / static mesh / irregular masonry) applied to the flagged plain sections.

## Intent
Express the brand (two tones, one surface — §1) at the global level so every page
inherits it, before any per-section work.

## Scope / Non-goals
- **In:** `public/fonts/` binaries; globals.css (eyebrow restyle, subhead/light
  utilities, display tuning, blob radii + morph keyframes); `section.tsx` and
  `site-header.tsx` (width + transparency); heading sweep across section
  components (weight contrast + eyebrow thinning); `blob.tsx`, `mesh-bg.tsx`,
  `masonry-pattern.tsx` + application to plain sections; `10-design-system.md`
  spine update (owner-authorized).
- **Out:** hero composition (SLICE-2), card redesigns (SLICE-3), any copy change.

## Content and design
Design lane: design-taste-frontend. Read: portfolio overhaul, warm-dark brand,
dials 8/7/3. Hard rules honoured: no caps, eyebrow restraint (≤1 per 3 sections),
warm tokens only, decorative layers aria-hidden and never behind long-form text,
`prefers-reduced-motion` disables the blob morph.

## Technical approach
Fonts: Fontshare variable woff2 (Clash Display, General Sans + italic), fontsource
variable woff2 (JetBrains Mono) — filenames match the existing @font-face block.
Backgrounds are CSS/SVG only (no WebGL): layered radial-gradients for mesh, one
inline SVG pattern for masonry, preset organic paths for Blob (custom `path` prop
accepted for future owner assets).

## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
| [TASK-038](../../backlog/tasks/TASK-038.md) | Type + width + header + heading sweep | medium | lint + typecheck + build |
| [TASK-039](../../backlog/tasks/TASK-039.md) | Blob motif + background kit + spine | medium | lint + typecheck + build |

## Gates
- [x] Spine references valid; spine edit owner-authorized in the brief.
- [x] Skills selected (design-taste-frontend lane; framer-motion for reveals).
- [x] Test plan: lint/typecheck/build + in-browser computed-style checks.
- [x] Protected paths declared (none).
