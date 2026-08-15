---
id: TASK-096
title: "Build the foundational blocks: hero, note, logo-suite, palette"
status: ready
priority: P1
risk_level: low
epic_ref: backlog/epics/EPIC-026.md
progress_weight: 1
files_allowed:
  - src/components/work/blocks/
skill_refs: [framer-motion, design-taste-frontend]
---

# Task: Build the foundational blocks: hero, note, logo-suite, palette

## Scope

The four blocks every one of the four projects uses. Each is a self-contained
component taking exactly one `ProjectBlock` variant plus the project's identity
fields.

Every block is built from site tokens only. Per the owner's clarification
(`EPIC-026`, owner confirmation 3) these pages present the work inside sandala.dev's
own visual language — adaptive layout, unchanged chrome. Nothing here reads a
project brand colour, and there is no accent wrapper to consume.

### `ProjectHeroBlock` — `kind: "hero"`

Full-bleed cover artwork with the project title over it. Reuses the established
`PageHero` family feel — `font-display` `text-display` with `display-gradient` —
so a project page's first screen reads as part of the same site, then diverges
below. Carries the discipline tags and the engagement credit.

The engagement credit is not decoration. `"client"` reads as a real client
credit; `"self-initiated"` says so plainly, in the same size and weight, not
buried in small print. Three of four projects are self-initiated and the site
must not let a visitor assume otherwise.

Cover art varies wildly in proportion — OK Pharmacy's cover is a 830×830 square
with a white background, Provision's is a 898×898 square photograph, Gardenfare's
is a 1280×800 landscape product lineup on a pale green field. Two of the four are
light-background artwork on a warm-dark page, which the warm scrim treatment used
by `WorkCard` will not save. Handle it with `ArtefactPlate` rather than a scrim:
let light artwork sit on its own plate at a contained size instead of forcing it
full-bleed behind text it cannot support.

The hero is the natural home for `TASK-095`'s `SvgTreatment` where a project has an
inlinable mark: a masked or outlined silhouette in site tokens behind the title,
in the role `MeshBg` and `Blob` play on other pages. That is chrome derived from the
asset, so it is filled with `ink` / `soft` / `border` or a rose wash, never the
brand's colours, and it must be visibly a treatment rather than a mis-coloured
logo. The faithful mark appears below, in `logo-suite`.

### `ProjectNoteBlock` — `kind: "note"`

Prose. `measure` (70ch) for readability, optional heading in `text-heading`,
generous vertical rhythm. This is where a thin asset set earns its page length —
Flavour Grills Cafe has six files, and honest description is what makes its page
feel considered rather than empty.

### `LogoSuiteBlock` — `kind: "logo-suite"`

Lockups and colourways shown as a set. This is where light-on-dark bites hardest:
OK Pharmacy's logos are teal and green on white, Gardenfare's colourway sheet is
white and orange and dark red, Flavour Grills has explicit blue, main, and white
variants. Give each lockup its own `ArtefactPlate` so a white-background lockup
gets a mat rather than bleeding into the page, and a white-ink variant gets a
plate dark enough to show it.

Lay out by count, not by a fixed grid: three colourways read as a row, five
lockups read as two rows with the primary given more room. The layout follows the
assets.

### `PaletteBlock` — `kind: "palette"`

The brand's actual colours as a swatch strip. Hard 90° corners per §3 (swatches
are explicitly named there). Each swatch labelled with its name and hex in
`text-soft`. This block is quietly the most useful proof on the page — it says
the identity was designed, not assembled.

Swatches are the **only** place a project's brand colour touches the page as a
fill, and it is legitimate because the colour is the subject: a labelled swatch is
a specimen, not a theme. The strip's own chrome — labels, gaps, borders, the
container — stays in site tokens. Do not let a swatch colour escape into a heading,
a rule, or a hover state.

### Shared conventions

- Compose on `Section` for rhythm; do not hand-roll padding.
- Motion is the existing `fadeUp` / `staggerContainer` from `src/lib/motion.ts`,
  gated on `useReducedMotion` the way `PageHero` does it. No new motion system.
- `next/image` with real `width` / `height` from the asset and honest `sizes`.
  Never `fill` without a positioned wrapper of known aspect.
- **Site tokens only.** No project brand colour is applied to any surface, rule,
  label, heading, or hover state. The `palette` swatch fills are the sole
  exception, for the reason stated above.
- Server components by default; `"use client"` only where motion or pointer
  interaction genuinely requires it.

## Acceptance Criteria

- [ ] Four components exist, each accepting exactly one block variant, and none
      reads a block kind it does not own.
- [ ] Light-background artwork (OK Pharmacy logos, Gardenfare colourway sheet)
      renders legibly on the warm-dark page — verified in the browser at desktop
      and mobile widths, not asserted.
- [ ] White-ink logo variants (Flavour Grills `white`) are visible against their
      plate.
- [ ] `LogoSuiteBlock` lays out differently for a 3-item and a 5-item set; it does
      not stretch or pad a short set into a fixed grid.
- [ ] The engagement credit is legible at the same visual weight for both
      `"client"` and `"self-initiated"`.
- [ ] Every block honours `prefers-reduced-motion`.
- [ ] Swatches are square-cornered and labelled with name and hex, and no swatch
      colour appears anywhere outside the swatch fills.
- [ ] No block applies a project brand colour to any surface, rule, label, heading,
      or hover state.
- [ ] Any `SvgTreatment` used in the hero is filled from site tokens and is visibly
      a treatment, reviewed side by side against the faithful mark in `logo-suite`.
- [ ] With the artwork removed, the four pages are indistinguishable from each other
      in visual language — the epic's stated test that a page has not drifted into
      redesigning itself.
- [ ] `npm run typecheck` and `npm run lint` pass clean.

## Dependency Evidence

- plan: none

Uses `next/image`, `framer-motion@12`, and existing primitives.

## Testing

- recommendation: none
- rationale: These are presentational components with no logic worth asserting on
  — the outcome is whether artwork looks right on a warm-dark page, which a test
  cannot judge and a browser check can. The one mechanical risk, an unhandled
  block kind, is caught at compile time by `TASK-099`'s exhaustive switch rather
  than here. Verification is the acceptance criteria above, performed in the
  preview at both breakpoints; `TASK-105` covers the accessibility and
  performance sweep across all blocks at once.

## Notes

Depends on `TASK-094` for the block types and `TASK-095` for `ArtefactPlate` and
`SvgTreatment`. Can run in parallel with `TASK-097` and `TASK-098` once both
land — the three tasks touch disjoint files under
`src/components/work/blocks/`.

A prior finding worth remembering while building motion here: a hidden preview
tab freezes `requestAnimationFrame`, so every framer-motion animation looks
broken for reasons unrelated to the code. Check `document.hidden` before
debugging.
