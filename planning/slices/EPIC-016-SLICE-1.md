# EPIC-016 SLICE-1 — "The Way I Am" page + modal retirement

Owner brief 2026-07-15. Content source: `planning/content/page-copy/TheWay.md`
(copied verbatim from the owner's `theway.md`). Design system stays locked:
warm espresso dark, rose primary accent with caramel/peach support, Clash
Display for display type, hard 90-degree corners, blob motif for decorative
masks only.

## Design read

Personal-museum editorial page for design-conscious visitors. Dials:
variance 7 (asymmetric editorial, calm), motion 6 (scroll-linked, fluid,
no springs per design system), density 3 (gallery air). Every section gets
its own layout family so the walk feels like changing exhibit rooms:

1. **Hero** — editorial manifesto, oversized display type, portrait absent
   (the about page owns the portrait; this page opens with words).
2. **Curiosity** — the knowledge table: two-column rows, hover reveals an
   accent hairline + depth shift on the row.
3. **Hobbies** — oversized type index, one line per hobby, hover slide.
4. **Music** — three movements: now-playing card (recently listening),
   favorite-artist chips, desert-island album wall (responsive grid of
   typographic tiles; palette-cycled duotones stand in for artwork).
5. **Creative Practice** — single flowing row of display words with
   hairline separators (differs from Hobbies' vertical index).
6. **Collections** — display shelves: items stand on shelf hairlines,
   Phosphor icons as objects, audiophile gear on the top shelf.
7. **Principles** — twelve large editorial type cards in an asymmetric
   two-column rhythm; typography carries the weight.
8. **Sources of Inspiration** — bookshelf: spines standing upright;
   clicking a spine expands an editorial spread (cover, title, author,
   personal takeaway; no reviews).
9. **CTA** — "Let's Build Something" with Start a Project (/contact) and
   Explore My Work (/work) magnetic buttons.

## Navigation & motion contract

- Sticky top hairline scroll-progress bar (Framer `useScroll` + `scaleX`).
- Floating TOC rail (xl+), IntersectionObserver-driven active state,
  mirrors the EpochNav interaction language (hard-cornered markers).
- Persistent "About" back link at top; prev/next pager at the page foot
  (previous: Who I Am on /about; next slot empty for a future page).
- Page entrance choreography on mount stands in for the About transition.
- All motion: transform/opacity only, EASE_OUT curve from `src/lib/motion`,
  gated behind `useReducedMotion`.

## Files

- `src/app/(site)/about/the-way-i-am/page.tsx`
- `src/lib/the-way.ts` (typed content data)
- `src/components/the-way/*` (section components + nav)
- `src/app/(site)/about/page.tsx`, `src/components/about/sticky-card.tsx`
  (link mode), `src/components/about/interests-modal.tsx` (deleted)
