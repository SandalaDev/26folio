---
id: TASK-077
title: "About page pass 2: real Muse/AI icons + full-name labels, Convergence icon drop, Now card, favicon, timeline/card polish"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-019
slice: EPIC-019-SLICE-1
depends_on: [TASK-076]
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
  - src/app/
  - src/components/about/
  - public/icons/
  - public/images/logo/
  - planning/content/.slop/
  - planning/slices/EPIC-019-SLICE-1.md
  - backlog/tasks/TASK-077.md
---

# Task: About page cleanup, pass 2

> Owner (2026-07-21, chat, 5 items): (1) use muse.svg for Adobe Muse and
> ai-coding.svg for the AI slot; give all epoch icons full product-name
> titles. (2) remove the "WordPress & Elementor" icon from Convergence.
> (3) new "Now" card copy (Cassandra OS, in the oven). (4) wire the favicon
> from public/images/logo/favicon.svg. (5) take a swing at improving the
> overall look of the timeline and cards.

## Notes

- Foundation now carries both Adobe Muse (muse.svg) and Macromedia
  Fireworks MX (fireworks.svg); Convergence dropped the generic
  WordPress & Elementor globe (its only Phosphor node); Awakening's AI slot
  uses ai-coding.svg. All labels are full product names. No Phosphor nodes
  remain in the tool sets (ICON const + import removed).
- Now card: Beat gained an optional `body` paragraph and made
  takeaway/kept optional, so the current card reads as a statement (title +
  one sentence) instead of the résumé scaffolding.
- Favicon: metadata.icons in layout.tsx -> /images/logo/favicon.svg.
- Design polish (redesign-preserve; brand tokens/content unchanged):
  beat cards get hover border-brighten and the "Now" card a rose-wash
  gradient + larger title; epoch header titles scale up (md:text-4xl) with
  a capped, relaxed epigraph; sticky cards get a larger title, softer
  description, a sliding-arrow CTA, and hover border-brighten. All motion
  transform/opacity, motion-reduce safe.
