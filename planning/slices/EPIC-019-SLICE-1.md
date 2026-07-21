# EPIC-019 SLICE-1 — About page cleanup

Owner brief 2026-07-21 (root `prompt.md`). Polish pass on `/about`.

## Design read

`/about` is settled; this is a fidelity pass, not a redesign. One line: **the
timeline headers earn a bolder icon presence, the cards say what they link to
plainly.** Keep the espresso-dark editorial calm, hard corners, epoch accents
(Foundation amber, Convergence peach, Awakening rose).

## Changes

1. **Who I am modal epigraph** (`src/lib/who-i-am.ts` `BIO_TAGLINE`): replace
   with the owner's quote, attributed.
2. **About cards** (`src/app/(site)/about/page.tsx`, `StickyCard`): the card
   component already appends " →" to the CTA, so CTA strings carry no arrow.
   - Who I am: description "Learn more about my background, interests, values
     and the experiences that shaped who I am today." / CTA "Read my
     biography".
   - The way I am: description "My principles, inspirations, creative
     pursuits, and the things I care about outside of work." / CTA "Explore
     my interests".
3. **Timeline epoch header icons** (`src/components/about/timeline.tsx`,
   `src/components/about/epoch-icon-cycler.tsx`):
   - The header's small square cycler becomes a large **watermark**: the
     current tool's glyph fills the header height, right-anchored, low
     opacity, behind the text (overlap allowed). The tool **name** stays a
     small label placed clear of the title/epigraph. Still cycles one tool
     at a time; reduced-motion / hidden-tab safe.
   - Foundation icons -> WordPress, Elementor, Fireworks (owner wrote
     "muse.svg" but no such file exists and `fireworks.svg` was the icon
     added; Foundation's origin in the bio is Macromedia Fireworks, so
     Fireworks stands in — FLAG for owner), Electronics.
   - Convergence: add Webflow.
   - Awakening: add a tasteful pair of platform/devops marks (Docker,
     Prometheus) to the existing web-stack set.

## Notes

- `EpochTool` gains an SVG `src` (and optional Phosphor `node`) so the
  watermark can render each mark at large size; `IconGlyph` takes a size
  className.
- Icons are single-path SVGs under `public/icons/` rendered as CSS masks
  over the epoch accent color (existing technique).
