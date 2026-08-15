---
id: TASK-095
title: "Build the ArtefactPlate surface and the SVG treatment primitives"
status: ready
priority: P1
risk_level: medium
epic_ref: backlog/epics/EPIC-026.md
progress_weight: 1
files_allowed:
  - src/components/work/artefact-plate.tsx
  - src/components/work/svg-treatment.tsx
  - src/app/globals.css
skill_refs: [design-taste-frontend, framer-motion]
---

# Task: Build the ArtefactPlate surface and the SVG treatment primitives

## Scope

The two primitives every block component in `TASK-096`–`TASK-098` builds on. Both
exist to hold a hard line: **the artwork is the project's, the page is ours.**

Owner clarification (2026-08-15): *"I don't want pages created with project's
design primitives — I want adaptive layouts that fit provided assets... the
projects have to be presented as projects on our existing UI design, not a fully
redesigned page."*

### Not building: a per-project accent channel

An earlier plan in this epic proposed `ProjectAccent`, scoping
`--project-accent` / `--project-accent-ink` so page surfaces could pick up each
project's brand colour. **That is cancelled.** No new colour token is added, no
page surface is tinted by its subject, and `globals.css` gains no colour values at
all — only layout and treatment utilities.

Project brand colours appear in exactly two places on the whole site: inside the
artwork itself, and as labelled swatches in a `palette` block, where they are
content being displayed rather than chrome doing the displaying.

This is recorded here rather than silently dropped so the next session does not
re-derive the rejected idea from the epic's history.

### `ArtefactPlate`

The seam between foreign artwork and the warm-dark canvas — and the mechanism that
makes the amendment in `EPIC-026` work. `10-design-system.md` §9 bans cold
blue-cast imagery on the warm base, but Provision is navy and red, OK Pharmacy is
teal, Gardenfare is orange and green. Recolouring any of it would misrepresent the
work. So the artwork is presented faithfully and *matted* instead: the mat is
built from our tokens, the print stays the artist's.

```tsx
<ArtefactPlate tone="neutral" | "sunken" | "bare" inset="sm" | "md" | "lg">
  <Image … />
</ArtefactPlate>
```

- `neutral` — `surface` mat with a `border` hairline. The default, correct for most
  artwork.
- `sunken` — `surface-2`, slightly recessed. For cut-out artwork that would read as
  floating debris on a flat mat: the Gardenfare packaging renders, the logo
  colourway sheets. **This replaces the `brand`-tinted tone the earlier plan
  proposed** — the recess does the separating work that a brand tint was going to
  do, using only site tokens.
- `bare` — no mat, for photography that already fills its frame edge to edge (the
  signage, card mock, and flatlay shots, which carry their own environment).

90° corners, no rounding, per §3. Optional caption slot at the plate's foot in
`text-soft`, never overlaid on the artwork.

Every tone is composed from `--color-surface`, `--color-surface-2`, and
`--color-border` as they already exist. No new values.

### `SvgTreatment`

The owner granted creative license on the SVG assets: vector sources may be
inlined and treated as structure or motion, not only placed as flat images. This
primitive is where that license lives, so it stays in one auditable place instead
of being improvised per block.

Supported treatments, all filled with **site tokens only** (`ink`, `soft`,
`border`, or a rose wash):

- **`draw`** — path draw-on as a mark enters the viewport, via `framer-motion`
  `pathLength`. Already supported by the installed version; no package needed.
- **`mask`** — the mark's silhouette as a `mask-image` over a site-token fill or
  a rose wash, so the shape reads without the colour.
- **`outline`** — stroke-only at display scale, as a quiet section marker.
- **`texture`** — a pattern SVG (Provision's `bg svg.svg`) as a very low-contrast
  ground behind a block. Must stay under the threshold where it competes with body
  copy; §3 forbids busy or high-contrast large surfaces.

**The bound that makes this safe.** A treatment is *chrome derived from an asset*,
never a reproduction of it. It must be unmistakably a treatment — monochrome,
masked, outlined, or washed — and must never be mistakable for a colour-inaccurate
version of the real logo. If a viewer could plausibly read a treatment as "that is
the logo, rendered wrong", it does not ship: the artefact blocks show the real
mark faithfully, and that is what the treatment must visibly not be pretending to
be.

Faithful presentation remains absolute in `logo-suite`, `poster`, `packaging`,
`in-situ`, `screens`, and `social`. `SvgTreatment` is never used inside those
blocks.

Practical notes: inlining means importing the SVG as a React component or reading
it at build time, not `next/image` — `next/image` cannot animate or recolour paths.
Only the small true-vector marks are candidates (`ok/logo-symbol-svg.svg` 2KB,
`full-logo-svg.svg` 10KB, `symbol-name-svg.svg` 11KB, `provision/logosvg.svg`
81KB). `ok/website.svg` at 1.4MB is a full site mockup, not a mark, and is
rasterized by `TASK-093`; never inline it. Check the Gardenfare artboards
individually — some are illustrations rather than marks.

### Legibility is verified, not assumed

The problem the cancelled accent channel was going to create is gone, but a real
one remains: several artefacts are light artwork on white grounds (OK Pharmacy's
logos, Gardenfare's colourway sheet, the packaging cut-outs), and Flavour Grills
ships an explicitly white logo variant. Both directions must work — a white-ink
mark needs a plate dark enough to show it, and a white-ground lockup needs a mat
that contains it rather than letting it bleed into the page.

Measure captions and any adjacent text against each plate tone. AA (4.5:1) is the
floor. Record the figures in the Notes so `TASK-104` documents the amendment with
evidence rather than assertion.

## Acceptance Criteria

- [ ] No `--project-accent` token, utility, or wrapper exists anywhere in the
      codebase; `globals.css` gains no new colour values.
- [ ] `ArtefactPlate` supports `neutral`, `sunken`, and `bare` tones plus the inset
      scale, composed only from existing `surface` / `surface-2` / `border` tokens.
- [ ] Plates have 90° corners and render an optional caption below the artwork,
      never over it.
- [ ] A white-ground lockup and a white-ink lockup both render legibly, each on an
      appropriate tone — verified in the browser at desktop and mobile widths.
- [ ] Caption text meets AA on all three tones, with ratios recorded in the Notes.
- [ ] `SvgTreatment` supports `draw`, `mask`, `outline`, and `texture`, filled
      exclusively from site tokens.
- [ ] Every treatment is visibly a treatment: reviewed against the real mark side
      by side, and none could be mistaken for a colour-inaccurate reproduction.
- [ ] `SvgTreatment` honours `prefers-reduced-motion` — `draw` renders as its
      completed final state, not a frozen partial path.
- [ ] `texture` stays low enough in contrast that body copy over it remains AA.
- [ ] No page surface is tinted by the project it describes.
- [ ] `npm run typecheck` and `npm run lint` pass clean.

## Dependency Evidence

- plan: none

`framer-motion@12.42.0` already animates `pathLength`. SVG inlining uses the
existing Next and Webpack setup. If inlining turns out to need an SVG loader
package, stop and run `bash scripts/os.sh deps plan add ...` with
`opensrc-research` before installing.

## Testing

- recommendation: with-task
- rationale: Two failures here would propagate into every block that builds on
  these primitives, so both are worth catching now. The first is measurable: caption
  and artwork legibility across three plate tones is a small finite matrix, and this
  task should measure and record it rather than assume it. The second is a judgment
  that only a person can make — whether a decorative SVG treatment reads as a
  treatment or as the logo rendered wrong — so it is framed as a side-by-side
  review against the real mark rather than as a test. A `draw` animation that
  freezes mid-path under reduced motion is the third, and is checked directly with
  the setting enabled. `TASK-105` re-checks all of it against the assembled pages.

## Notes

Record measured contrast ratios here as they are found, so `TASK-104` can write the
§9 amendment with evidence.

The cancelled accent channel is documented above on purpose. `EPIC-026`'s history
contains the rejected proposal, and without this note a later session could
reasonably conclude it was simply forgotten.
