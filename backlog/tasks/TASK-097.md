---
id: TASK-097
title: "Build the print and object blocks: flatlay, poster, packaging, in-situ, social"
status: superseded
priority: P2
risk_level: low
epic_ref: backlog/epics/EPIC-026.md
progress_weight: 1
files_allowed:
  - src/components/work/blocks/
skill_refs: [framer-motion, design-taste-frontend]
---

# Task: Build the print and object blocks: flatlay, poster, packaging, in-situ, social

## Scope

The blocks for physical and print artefacts. Each is used by one or two of the
four projects, and each exists because a specific asset needs a specific
treatment.

### `FlatlayBlock` — `kind: "flatlay"`

One tall image, given real room. Flavour Grills Cafe's `branding.jpg` is 633×948
portrait — a dark slate and wood flatlay of menu folder, business cards, spice
jars, coffee pouch, and leather tags. It is the single strongest artefact in that
project and the reason a six-file project can carry a full page. Show it large,
`bare` tone (it has its own environment and needs no mat), with the caption
carrying the detail the image cannot state.

Constrain to a sensible max height so a portrait image does not become three
screens of scroll on desktop, and let it go full width on mobile.

### `PosterBlock` — `kind: "poster"`

Print-proportion artwork, one or two up. Flavour Grills has two
(`flavour_posterwhite.png` 408×612, `postr2.png` 634×950 — the stacked-pastry
photograph with the logo lockup); OK Pharmacy has one 1439×830 landscape. So the
block must handle both portrait pairs and a single landscape without a fixed
aspect assumption. Pair portraits side by side on desktop, stack on mobile;
give a lone landscape poster the full column.

`neutral` plate tone — these are prints, and a mat is exactly right for them.

### `PackagingBlock` — `kind: "packaging"`

Product renders shown as a set. Gardenfare Foods' four SKUs are near-square
cut-outs at different sizes (`gardenfruit` 694×694, `gardenoats` 793×793,
`gardensoy` 750×750, `gardenspread` 600×600) on white or near-white. They are the
whole point of that project — a *range*, not four unrelated images — so they must
read as a family: one consistent frame size, consistent baseline, even gaps.
`sunken` plate tone, since cut-outs on a warm-dark page read as floating debris
otherwise — the recess does that separating work using only site tokens, which is
why `TASK-095` replaced the originally proposed brand-tinted tone with it.

Four items on a 2×2 at desktop and a single column on mobile is the obvious
answer; if a fifth SKU is ever added, the layout must absorb it without a
rewrite.

### `InSituBlock` — `kind: "in-situ"`

Environmental mockups — the artefact in the world. OK Pharmacy's hanging signage
(1500×1000, "OPEN 24 HOURS") and shopping bag (1725×1200); Provision Finance's
card mock (1500×1200). These are photographs, so `bare` tone, edge to edge, at
generous size. This block does the most persuasive work on the page: a logo on a
white artboard is a file, a logo on a lit sign in a mall is a business.

### `SocialBlock` — `kind: "social"`

The identity applied to social platforms. OK Pharmacy only: Facebook page mockup
(2550×1538), LinkedIn mockup (945×1390 portrait), social banner (1100×417 wide).
Three assets in three completely different proportions, which rules out a grid —
compose them as a deliberate arrangement instead, portrait beside landscape, and
let the banner run wide underneath.

Keep this block quieter than the others. Social mockups are the least interesting
proof on the page and should not outweigh the signage.

### Shared conventions

Same as `TASK-096`: `Section` for rhythm, existing `fadeUp` / `staggerContainer`
gated on `useReducedMotion`, `next/image` with real dimensions and honest `sizes`,
server components unless motion demands otherwise.

**Site tokens only, and faithful artwork.** Every block in this task shows the work
as evidence — posters, packaging, signage, social. Colours, proportions, and framing
are exactly as supplied: no filters, no recolouring, no cropping, no brand tint on
the surrounding chrome. `SvgTreatment` is never used inside these blocks; that
license belongs to decorative chrome only (`TASK-095`).

## Acceptance Criteria

- [ ] Five components exist, each owning exactly one block variant.
- [ ] `PosterBlock` handles a portrait pair and a single landscape correctly
      without a hardcoded aspect ratio.
- [ ] `PackagingBlock` renders the four Gardenfare SKUs as a visually consistent
      family — same frame, aligned baseline, even gaps — despite their differing
      source dimensions, and absorbs a fifth item without layout changes.
- [ ] `FlatlayBlock` does not exceed a reasonable viewport height on desktop and
      goes full width on mobile.
- [ ] `SocialBlock` composes three mismatched proportions without stretching or
      cropping any of them.
- [ ] No block distorts an image: aspect ratio is preserved everywhere, verified
      by comparing rendered dimensions against intrinsic ones in the browser.
- [ ] Every artefact is shown faithfully — no filter, recolour, or crop — and no
      surrounding chrome is tinted by the project's brand colours.
- [ ] All blocks honour `prefers-reduced-motion`.
- [ ] `npm run typecheck` and `npm run lint` pass clean.

## Dependency Evidence

- plan: none

## Testing

- recommendation: none
- rationale: Presentational components whose success criterion is visual. The one
  mechanical defect worth guarding against is aspect-ratio distortion, which is
  checked in the browser by comparing rendered against intrinsic dimensions and is
  listed as an acceptance criterion above. `TASK-105` handles the cross-cutting
  accessibility and performance pass once these blocks are composed into real
  pages, which is the only place their combined payload can be measured.

## Notes

Depends on `TASK-094` and `TASK-095`. Runs in parallel with `TASK-096` and
`TASK-098` — disjoint files under `src/components/work/blocks/`.

`SocialBlock` is used by exactly one project. That is fine and expected: the
vocabulary is meant to grow one block per genuine need, not to be uniformly
consumed. If a second project never needs it, it stays a one-user block.

## Superseded by EPIC-029 (2026-10-09)

EPIC-029 replaces EPIC-026. Work built for this task on the unmerged local
branch `feature/EPIC-026` is salvaged by TASK-130; what remains is re-planned
in EPIC-029.
