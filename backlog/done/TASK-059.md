---
id: TASK-059
title: "InterestsModal: chip-and-reveal restructure"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-014
slice: EPIC-014-SLICE-2
depends_on: []
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend]

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
  - src/components/about/interests-modal.tsx
  - backlog/epics/EPIC-014-about-page-content.md
  - planning/slices/EPIC-014-SLICE-2.md
  - backlog/tasks/TASK-059.md
---

# Task: "The Way I Am" chip-and-reveal restructure

> Owner (2026-07-06): pasted content blueprint, Part 1 — a grid of 5-8
> clickable topic chips, each revealing a short (40-80 word) paragraph.
> Suggested topics: The Design Gene, The Systems Brain, What I
> Read/Watch/Play, Off the Clock, The Tools I Love, optional Zambia/Home.

## Scope

1. Replace `INTEREST_CATEGORIES` (placeholder categories + empty
   `aspect-video` image boxes) with 6 real topic chips: The Design Gene, The
   Systems Brain, What I Read Watch and Play, Off the Clock, The Tools I Love,
   Zambia and Home.
2. Each chip click/tap reveals its paragraph (client-side toggle state, no new
   dependency) — copy is real, specific, stop-slop compliant, no placeholder
   image boxes.
3. Keep the existing `Dialog`/`DialogContent` shell and heading structure.

## Acceptance criteria
- [x] Grid of 6 clickable chips, no placeholder image boxes remain.
- [x] Each chip reveals a real 40-80 word paragraph on click.
- [x] lint / typecheck / build green; slop score >= 35/50.

## Verified (2026-07-06)
`INTEREST_CATEGORIES` replaced with 6 real chips (The Design Gene, The
Systems Brain, What I Read/Watch/Play, Off the Clock, The Tools I Love,
Zambia and Home), each a specific 40-70 word paragraph, `useState` toggle,
no new dependency, placeholder `aspect-video` boxes removed. Confirmed
in-browser: opened "The way I am", clicked between chips, active chip gets
the rose border/`aria-pressed` state and its paragraph swaps correctly.
lint + typecheck + `next build` (8 routes) green; stop-slop score 46/50.
