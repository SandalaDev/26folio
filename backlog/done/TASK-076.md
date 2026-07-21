---
id: TASK-076
title: "About page cleanup: card copy, modal epigraph, epoch icon watermarks"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-019
slice: EPIC-019-SLICE-1
depends_on: []
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, framer-motion, stop-slop]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: true
handoff_required: false
handoff_type: []
handoff_file: ""
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode."
protected_paths_touched: []
files_allowed:
  - src/app/(site)/about/
  - src/components/about/
  - src/lib/who-i-am.ts
  - public/icons/
  - planning/content/.slop/
  - planning/slices/EPIC-019-SLICE-1.md
  - backlog/tasks/TASK-076.md
---

# Task: About page cleanup

> Owner (2026-07-21, root prompt.md): (1) Who-I-am modal epigraph -> the
> Ultimate Mortal Kombat 3 quote. (2) new description + CTA on the Who-I-am
> and The-way-I-am cards. (3) timeline epoch header icons become large
> watermarks behind the text with legible names; Foundation icons ->
> wordpress/elementor/muse/electronics, Convergence += webflow, Awakening
> += a tasteful devops/platform pair.

## Notes

- `muse.svg` does not exist in public/icons; `fireworks.svg` (freshly added,
  and the Foundation era's actual origin tool) stands in, titled "Fireworks".
  FLAG for owner: swap if an Adobe Muse mark was intended.
- Awakening devops pair chosen: Docker + Prometheus (containers +
  observability), kept to two so the set stays tasteful.
- StickyCard already appends " ->" to the CTA, so CTA strings omit the arrow.
- Epoch watermark: large cycling glyph, right-anchored, low opacity, behind
  content; small tool-name label kept clear of the copy. Reduced-motion and
  hidden-tab safe (reuses the cycler's guards).
