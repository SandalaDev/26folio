---
id: TASK-039
title: "Blob motif + background system (Blob / MeshBg / MasonryPattern) + spine update"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-010
slice: EPIC-010-SLICE-1
depends_on: [TASK-038]
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
  - src/app/globals.css
  - src/app/(site)/
  - src/components/site/
  - src/components/home/
  - src/components/about/
  - src/components/capabilities/
  - src/components/work/
  - project-spine/10-design-system.md
  - backlog/tasks/TASK-039.md
---

# Task: Blob motif + background system

> Owner brief items 3–4: blob shapes as the brand's vitiligo reference, added to
> the design system; creative backgrounds (blobs, mesh gradients, irregular
> masonry) replacing plain areas. Owner authorized the spine edit and chose
> generated blob assets (component accepts custom SVG paths later).

## Scope
- `src/components/site/blob.tsx`: decorative `Blob` (preset organic SVG paths,
  props `variant | path | fill | opacity | blur | className`, aria-hidden).
- globals.css: organic border-radius tokens (`--blob-1/2/3`), `blob-morph`
  keyframes (paused under reduced motion), `.blob-mask-*` utilities.
- `src/components/site/mesh-bg.tsx` (layered radial-gradient wash, CSS only) and
  `src/components/site/masonry-pattern.tsx` (irregular offset-rectangle SVG,
  hairline, very low opacity).
- Apply to plain areas: capability rail (mesh), magazine teaser (blob cluster),
  CTA callout (large blob + mesh), footer (masonry), capabilities page head
  (blob), about intro (blob accent), work page head (mesh).
- `10-design-system.md`: new Blob-motif section + §4/§5 revisions from TASK-038
  (owner-authorized spine edit).

## Acceptance criteria
- [x] Blob/MeshBg/MasonryPattern are aria-hidden, warm-token-only, low-opacity,
      behind content, and never sit behind long-form text.
- [x] Blob morph animation is CSS-only and disabled under
      `prefers-reduced-motion`.
- [x] The flagged plain sections each carry a background layer; body text on
      them still meets AA contrast.
- [x] Spine documents the motif (meaning + usage rules) and matches shipped CSS.
- [x] lint / typecheck / build green.

## Notes
Blob shapes are the one sanctioned deviation from the hard-corner rule: masks and
washes only; UI chrome (buttons, cards, inputs) stays 90°.
