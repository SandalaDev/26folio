---
id: TASK-078
title: "Shared PageHero (centered manifesto); center all page heroes; align type outliers"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-020
slice: EPIC-020-SLICE-1
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
  - src/app/
  - src/components/
  - public/icons/
  - public/images/
  - planning/content/.slop/
  - planning/slices/EPIC-020-SLICE-1.md
  - backlog/tasks/TASK-078.md
---

# Task: Harmonize heroes + typography to /about/the-way-i-am

> Owner (2026-07-21): (1) every page hero should follow the centered
> editorial-manifesto layout of the /about/the-way-i-am hero. (2) align the
> rest of the project's typography to that page; it has drifted since the
> improvements there.

## Plan

- New `PageHero` (centered manifesto shell) locks the pattern.
- Center home/about/work/capabilities/contact heroes via PageHero (or inline
  for home, which keeps its portrait + CTA + shader background).
- Fix the case-study title to use `display-gradient`.
- Also commits two stray asset improvements sitting in the tree (proper
  Next.js brand mark in public/icons/next.svg, higher-res Self Esteem album
  art) as repo cleanup.

## Notes

- Owner copy unchanged. h2 headings already consistent
  (`text-heading font-display text-ink`).
- Verify every hero at desktop + mobile; confirm the home CTA stays in view.
