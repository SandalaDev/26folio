---
id: TASK-094
title: "Extend Project into the composition model and author all four compositions"
status: ready
priority: P1
risk_level: medium
epic_ref: backlog/epics/EPIC-026.md
progress_weight: 1
files_allowed:
  - src/lib/projects.ts
skill_refs: []
---

# Task: Extend Project into the composition model and author all four compositions

## Scope

Grow `src/lib/projects.ts` from a flat card shape into the composition model the
epic describes: each project carries an **ordered list of typed blocks** naming
which assets it presents and how. This is the data half of "generative, not
templatized" — the component half is `TASK-096` through `TASK-098`, and the
renderer is `TASK-099`.

### Additive, not a reshape

`src/components/home/featured-work.tsx` and `work-card.tsx` already import
`Project`, `projects`, and read `title` / `tagline` / `description` / `href` /
`image`. **Every one of those fields stays**, with the same meaning. New fields
are added alongside. The home page must keep compiling and rendering with zero
changes — same discipline `EPIC-005` used when it extended `EPIC-003`'s shape.

### Shape

```ts
type ProjectBlock =
  | { kind: "hero";       cover: Asset; }
  | { kind: "note";       heading?: string; body: string; }
  | { kind: "logo-suite"; lockups: Asset[]; }
  | { kind: "palette";    swatches: { hex: string; name: string }[]; }
  | { kind: "flatlay";    image: Asset; }
  | { kind: "poster";     posters: Asset[]; }
  | { kind: "packaging";  items: Asset[]; }
  | { kind: "in-situ";    scenes: Asset[]; }
  | { kind: "screens";    shot: Asset; }
  | { kind: "devices";    mocks: Asset[]; }
  | { kind: "social";     items: Asset[]; };
```

`Asset` carries `src`, intrinsic `width` / `height` (Next needs them for
non-`fill` images and the manifest already records them), and `alt`. `alt` is
left as an explicit empty string only where an image is genuinely decorative;
`TASK-101` supplies real values.

Project-level additions:

- `blocks: ProjectBlock[]` — the composition, in render order.
- `disciplines: string[]` — e.g. `["Brand identity", "Packaging"]`.
- `engagement: "client" | "self-initiated"` — drives the honest credit. Flavour
  Grills Cafe is the only `"client"`.
- `year?: string`, `role?: string` — omit rather than guess. Provision's homepage
  mockup carries a visible `© 2018` and a `05/05/18` timestamp, which is evidence
  for that one project; the others have none, so leave them unset for the owner
  to fill.

Union members exist because a real asset needs them. Do not add a block kind
speculatively.

### The four compositions

Author each from `public/images/projects/MANIFEST.md` (`TASK-093`). Shape follows
the assets, and the four lists are deliberately different lengths:

- **OK Pharmacy** — `hero` (cover) · `note` · `logo-suite` (5 lockups: symbol,
  symbol+name, full, square) · `palette` (teal/green) · `in-situ` (signage, bag) ·
  `poster` · `social` (FB, LinkedIn, banner) · `screens` (website mockup).
- **Provision Finance** — `hero` (signage cover) · `note` · `logo-suite`
  (navy and red reversals) · `palette` (navy/red) · `screens` (full-page scroll) ·
  `devices` (laptop, phone) · `in-situ` (card mock).
- **Gardenfare Foods** — `hero` (product lineup banner) · `note` · `logo-suite`
  (artboards and colourway sheet) · `palette` (green/orange/yellow) ·
  `packaging` (the four SKUs as a set).
- **The Flavour Grills Cafe** — `hero` · `note` · `logo-suite` (3 colourways) ·
  `palette` (navy/coral) · `flatlay` (the stationery flatlay, given full room) ·
  `poster` (both posters).

`note` bodies are placeholders in this task — a single honest sentence each, no
invented claims. `TASK-101` writes the real copy.

### Palette swatches

Sample the hexes from the actual artwork rather than eyeballing them, and record
where each came from in a comment. A wrong swatch misrepresents the brand.
Flavour Grills' navy and coral, for instance, come from the logo colourways, not
from the flatlay photography (where lighting shifts them).

These hexes are **content only** — the values a `palette` block displays as
labelled swatches. Per the owner's clarification (`EPIC-026`, owner confirmation
3) no project brand colour is applied to any page surface, so there is deliberately
no project-level `accent` field. If a future block wants to tint chrome from one of
these values, the answer is no.

## Acceptance Criteria

- [ ] `Project` retains `slug`, `title`, `tagline`, `description`, `problem`,
      `outcome`, `href`, `image` with unchanged meaning; new fields are additive.
- [ ] `src/components/home/featured-work.tsx` and `work-card.tsx` compile and
      render unchanged with no edits to either file.
- [ ] `ProjectBlock` is a discriminated union on `kind`, exported for `TASK-099`.
- [ ] All four projects have a populated `blocks` array, and no two projects have
      the same block sequence.
- [ ] No block references an asset absent from `public/images/projects/`.
- [ ] Every `Asset` has `width` and `height` matching the manifest.
- [ ] Exactly one project is `engagement: "client"` (Flavour Grills Cafe).
- [ ] `year` / `role` are unset where there is no evidence, not guessed.
- [ ] Palette hexes carry a source comment naming the artwork they came from.
- [ ] `npm run typecheck` and `npm run lint` pass clean.

## Dependency Evidence

- plan: none

Types and data only.

## Testing

- recommendation: with-task
- rationale: TypeScript is the real check here, and it is a strong one — a
  discriminated union plus required `width`/`height` makes a malformed block a
  compile error rather than a runtime surprise. The one thing the compiler cannot
  catch is a `src` pointing at a file that does not exist, so verify each path
  against the committed asset directory as part of this task. Correctness of the
  palette hexes and the honesty of the credits are review judgments, not testable
  properties.

## Notes

Depends on `TASK-093` for the asset paths, dimensions, and block-role
assignments. Starting before the manifest exists means guessing at filenames and
redoing the work.

The two placeholder projects (`placeholder-three`, `placeholder-four`) stay in
place for now so nothing breaks mid-epic; `TASK-102` removes them once the grid
and routes are rebuilt.
