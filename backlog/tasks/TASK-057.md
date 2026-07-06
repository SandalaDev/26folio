---
id: TASK-057
title: "Timeline: three-epoch restructure + grid reorder"
status: ready
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-014
slice: EPIC-014-SLICE-1
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
  - src/components/about/timeline.tsx
  - src/app/(site)/about/page.tsx
  - backlog/epics/EPIC-014-about-page-content.md
  - planning/slices/EPIC-014-SLICE-1.md
  - backlog/tasks/TASK-057.md
---

# Task: Three-epoch timeline restructure

> Owner (2026-07-06): pasted content blueprint, Part 1 — the timeline is
> organized as three named epochs (Foundation, Convergence, Awakening), each
> with its own header, epigraph, and card anatomy, plus an intro paragraph
> above the first epoch. Real beats/cards are supplied in the blueprint, not
> invented here.

## Scope

1. Replace the flat `BEATS` placeholder array in `timeline.tsx` with three
   epoch sections:
   - **Foundation** ("Seeds, planted early") — single-role cards (marker,
     title, description, skills tags, "seed planted" line). 3 beats: 2002
     Fireworks, telecom entry as hands-on artisan, Field Operations Engineer.
   - **Convergence** ("Two crafts, one person") — dual-track split cards
     (primary telecom role / parallel design practice / one "converging"
     line). 3 beats: QA Engineer + design side hustle; Huawei 1,000-tower
     project + website-builder years; promotion to Implementation Manager +
     "every builder tool eventually says no."
   - **Awakening** ("The path that demands all of it") — milestone cards
     (marker, milestone, description, "points to" line). 4 beats: 2021
     self-taught; Payload CMS vindication; professional end-to-end practice;
     "Now" (Web Systems Developer) — visually distinct (rose border + pulsing
     dot), since it is the one card without an ending.
2. Add the epoch intro paragraph ("How I Became a Web Systems Developer")
   above the first epoch, inside the same component.
3. Each epoch gets a sticky header (numeral + title + tagline + epigraph)
   using `position: sticky` so it stays pinned while its own cards scroll past,
   unpinning at the next epoch — no new JS needed for this, CSS sticky only.
4. Keep the existing GSAP `ScrollTrigger` reveal-on-scroll, retargeted at every
   `[data-beat]` card across all three epochs (single `querySelectorAll` scoped
   to the whole timeline container, not per-epoch).
5. In `src/app/(site)/about/page.tsx`, swap the two-column grid order so
   `Timeline` renders first (left column, "scan" depth) and the sticky-card
   column renders second (right column, "dive" depth) — this is what makes
   TASK-056's hand-off sentence ("...on the left... on the right.") correct.

## Acceptance criteria
- [ ] Timeline renders three named epochs, each with its own epigraph and
      card anatomy (not a flat generic list).
- [ ] Epoch headers behave as sticky dividers while scrolling their own cards.
- [ ] Final Awakening card is visually distinct (present-tense treatment).
- [ ] Timeline is the left column on the about page; sticky cards are the right.
- [ ] Reduced-motion still renders full content immediately (no motion-gated content).
- [ ] lint / typecheck / build green; slop score >= 35/50.
