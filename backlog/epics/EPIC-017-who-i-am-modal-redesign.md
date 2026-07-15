---
id: EPIC-017
title: Who I Am modal — wide chaptered reading experience
status: done           # ready -> in-progress -> done
phase: 5
priority: P1
risk_level: medium
roadmap_ref: 09-roadmap.md
depends_on: [EPIC-014, EPIC-015, EPIC-016]
blocks: []
references:
  - 10-design-system.md
  - 11-content-strategy.md
  - 12-ui-element-map.md
related:
  - EPIC-014-about-page-content.md
  - EPIC-016-the-way-i-am-page.md
---

# EPIC-017 — "Who I Am" as a chaptered reading experience

The owner's brief (2026-07-15): the "Who I Am" card on /about opens `BioModal`
(`src/components/about/bio-modal.tsx`) — a 44rem-capped Dialog holding the full
biography as a flat stack of paragraphs. It is a long read presented like a
scroll of plain text. Three asks:

1. **Width.** Expand the modal so the bio is easier to read — around 80vw
   (final value is the agent's call; the extra width must buy layout, not
   longer lines).
2. **Typography.** Redesign the type for better aesthetics: an improved mix
   of font weights and layout, not just bigger text.
3. **Interactivity.** Break the long read into parts and use tasteful motion
   to move through the story — scroll-linked techniques (parallax or
   equivalent) with the project's Framer Motion vocabulary. Explore a
   low-transparency instance of the logo symbol as a watermark.

The bio copy itself is owner-approved (EPIC-014/015) and does NOT change in
this epic. This is a reading-experience redesign of an existing text.

## Direction (design read)

A wide modal is only better for reading if the width is spent on structure.
Target shell: `w-[min(80vw,80rem)]` at lg+ (falling back to ~92vw below),
fixed height ~85vh, internal scroll. Inside, a two-region layout:

- **Chapter rail** (left, lg+): the story's spine — Prologue plus the three
  epochs (Foundation/Convergence/Awakening) as hard-cornered markers in the
  EpochNav interaction language, with scroll progress and click-to-jump.
  Collapses to a top progress hairline on mobile.
- **Reading pane** (right): body measure stays capped (~65–70ch) regardless
  of shell width. Chapters open with an oversized Clash Display title using
  weight contrast, the epoch numeral as a large low-contrast backdrop
  drifting on parallax, and a lede treatment on the first paragraph.
  Selected key lines get pull-quote moments. Epoch accents keep the
  timeline's mapping (Foundation = caramel, Convergence = peach,
  Awakening = rose).
- **Watermark**: the standalone logo symbol (`public/images/logo/logo_*.svg`,
  CSS-mask tinted like the timeline icons) at very low opacity, large,
  drifting slower than the text (parallax depth), never competing with it.

Motion: Framer Motion only (already in the bundle) — `useScroll` bound to the
modal's scroll container, transform/opacity, EASE_OUT, no springs, all gated
by `useReducedMotion`/`motion-reduce`. GSAP stays out unless a technique
genuinely cannot be done with Framer (decision recorded in the task if so).
The modal stays a Radix Dialog (focus trap, Esc, overlay) — richer inside,
same a11y contract.

## Scope

- Rebuild `BioModal` into a chaptered reader: content extracted to a typed
  module, chapter structure, rail + reading pane layout, full typography
  pass (weights, scale, lede, pull quotes, numerals).
- Motion layer: scroll progress, active-chapter tracking, parallax numerals
  and watermark, chapter reveal choreography, entrance choreography.
- The about-page card copy/trigger may be touched only if the new modal
  needs it (e.g. cta line), nothing else on /about moves.

## Non-goals

- No copy changes to the biography (owner-approved text).
- No new design tokens, fonts, or dependencies (GSAP only with a recorded
  justification); no schema/auth/billing/infra changes.
- No route change: "Who I Am" stays a modal on /about (EPIC-016 already
  gave "The Way I Am" the dedicated-page treatment).
- No change to the shared `Dialog` primitive's defaults — the width
  override is local to this modal.

## Slices & tasks

### SLICE-1 — The chaptered reader
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-066** | Rebuild BioModal: wide shell, chapter structure, typography system | medium | lint + typecheck + build + slop + in-browser |
| **TASK-067** | Motion layer: chapter rail navigation, parallax, watermark, reveal choreography | medium | same |

## Definition of done

- [x] Modal opens at ~80vw on desktop; body measure stays <= ~70ch.
- [x] Story reads as chapters (Prologue + three epochs), each with its own
      typographic opening; pull quotes and ledes in place.
- [x] Chapter rail tracks scroll position and jumps on click; progress
      indicator works; mobile fallback works.
- [x] Parallax numerals + low-opacity logo watermark present and subtle;
      60fps (transform/opacity only); reduced-motion collapses to static.
- [x] Dialog a11y intact (focus trap, Esc, overlay close, close button).
- [x] lint / typecheck / build green; slop >= 35/50 on changed src files;
      in-browser verification at desktop and mobile widths (DOM-level; see
      the tasks' verified notes on the hidden-pane rAF quirk).

Done on feature/EPIC-017, 2026-07-15. Pending: owner eyeballs the chaptered
reader in a visible browser (reading rhythm and motion feel are taste calls).
