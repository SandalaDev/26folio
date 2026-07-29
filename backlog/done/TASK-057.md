---
id: TASK-057
title: "Timeline: three-epoch restructure + grid reorder"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-014
epic_ref: backlog/epics/EPIC-014-about-page-content.md
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
  - src/components/about/epoch-nav.tsx
  - src/app/(site)/about/page.tsx
  - .claude/launch.json
  - backlog/epics/EPIC-014-about-page-content.md
  - planning/slices/EPIC-014-SLICE-1.md
  - backlog/tasks/TASK-057.md
progress_weight: 1
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
- [x] Timeline renders three named epochs, each with its own epigraph and
      card anatomy (not a flat generic list).
- [x] Epoch headers behave as sticky dividers while scrolling their own cards.
- [x] Final Awakening card is visually distinct (present-tense treatment).
- [x] Timeline is the left column on the about page; sticky cards are the right.
- [x] Reduced-motion still renders full content immediately (no motion-gated content).
- [x] lint / typecheck / build green; slop score >= 35/50.

## Verified (2026-07-06)
Three epoch sections (Foundation/Convergence/Awakening) with sticky
(`position: sticky top-24`) headers, real beats from the owner's blueprint
(Foundation: single-role cards with skill tags + "seed planted"; Convergence:
dual-track split cards + "converging" line; Awakening: milestone cards + the
"Now" card visually distinct via `bg-surface` panel + pulsing rose dot).
GSAP `ScrollTrigger` re-scoped to `[data-beat]` across the whole container.
About page grid reordered: `Timeline` first (left), sticky-card column
second (right). Confirmed in-browser: scrolled through all three epochs,
sticky headers pin/unpin correctly, final card reads as present-tense/live.
lint + typecheck + `next build` (8 routes) green; stop-slop score 42/50.

## Follow-up (2026-07-07, owner feedback on PR #17)
Owner asked for four refinements; the timeline-side ones land here:
1. Epochs color-coded with the three brand accents: Foundation = caramel,
   Convergence = peach (the design system's own rose-to-caramel bridge color,
   matching the two-crafts-merging movement), Awakening = rose.
2. Beats redesigned as cards (border + surface + colored left edge) hanging
   off a per-epoch rail whose color fill draws in with scroll (GSAP scrub);
   rail markers switched from rounded dots to brand-correct diamonds.
3. Entrance upgraded to a blur-dissolve rise (opacity + y + blur, power3.out)
   per card, plus a settle on each epoch header; reduced-motion still renders
   everything statically.
4. New `EpochNav` (src/components/about/epoch-nav.tsx) under the right-column
   cards: brittanychiang-inspired scroll indicator, differentiated (numeral
   squares rotate into filled epoch-colored diamonds; the active tagline
   expands downward instead of a sideways line). IntersectionObserver on
   `[data-epoch]`, click scrolls to the epoch, hidden on mobile.
Also `.claude/launch.json` gained autoPort so the preview can verify while
the owner's own dev server holds port 3000. Verified in-browser at 1280x900:
active state tracks scroll through all three epochs, click-to-scroll lands
at the section (scroll-mt offset correct), both cards + all three nav rows
fit the sticky viewport, no console errors; mobile hides the nav with no
overflow. lint + typecheck + build green; slop 38-50/50.
