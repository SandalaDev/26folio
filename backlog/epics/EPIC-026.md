---
id: EPIC-026
title: "Work section — real project pages composed from each project's own assets"
status: ready
priority: P1
risk_level: medium
roadmap_refs: [ROAD-004]
goal_refs: [GOAL-001, GOAL-002, GOAL-004]
progress_weight: 3
---

# Epic: Work section — real project pages composed from each project's own assets

## Outcome

`/work` stops being a placeholder. It presents four real design and branding
projects, each on its own page, each composed around the assets that project
actually has — not squeezed into a shared case-study template.

A visitor evaluating Abe for design work can see the range in one scroll of the
grid (retail pharmacy identity, food packaging, hospitality branding, financial
services web design), then go deep on any one of them and see the artefacts at a
size that does them justice. This is the proof surface for `GOAL-001` and
`GOAL-004`: the strongest evidence on the site that the practice can design, not
only build.

Today the page actively works against that goal — two fictional entries
("Project three", "Project four") and two real projects whose cover images were
just removed from the working tree. Fixing that is launch-blocking, which is why
this sits in `ROAD-004` rather than post-launch.

## The four projects

| Project | Kind | Assets on hand | Presentation centre of gravity |
|---|---|---|---|
| **OK Pharmacy** | Self-initiated identity | 16 files: 5 logo lockups (svg+png), signage, bag, poster, social banner, FB + LinkedIn mockups, `website.svg` full site mockup, emotive cover | Identity applied in the world — signage and packaging carry the page |
| **Provision Finance** | Self-initiated identity + web design | 12 files: logo system at 4501px, brand treatment board, pattern SVG, card mock, full desktop homepage (1920×1620), full-page scroll (1920×2221), laptop and phone mocks | A web design story — the long scroll and device mocks carry the page |
| **Gardenfare Foods** | Self-initiated packaging | 9 files: 3 logo artboards (SVG), logo colourway sheet, product lineup banner, 4 square SKU renders (juice, oats, soy milk, peanut butter) | A product range — the four SKUs shown as a set |
| **The Flavour Grills Cafe** | **Real client engagement** | 6 files: stationery flatlay, 2 posters, 3 logo colourways | The smallest set, and the only client credit — the flatlay earns a full block |

Owner confirmations captured this session (2026-08-15):

1. **Flavour Grills Cafe is the real client engagement.** The other three are
   self-initiated. The grid and pages must distinguish them honestly, because a
   self-initiated concept presented as client work is the kind of overclaim the
   charter exists to prevent.
2. **Copy is drafted by the agent from what the assets show, then owner-approved.**
   No invented metrics, outcomes, testimonials, or client quotes.
3. **The pages stay in the site's own design system.** Layouts adapt to fit each
   project's assets; the *visual language* does not adapt at all. No project page
   borrows its subject's design primitives, palette, or type. These are projects
   presented on sandala.dev, not four redesigned microsites.

   This supersedes an earlier answer in the same session that would have scoped
   each project's brand palette to a few page surfaces. The owner's clarification:
   *"I don't want pages created with project's design primitives — I want adaptive
   layouts that fit provided assets... the projects have to be presented as
   projects on our existing UI design, not a fully redesigned page."* The
   per-project accent channel is therefore **not built**; see the design-system
   section below for what replaced it.

4. **The SVG assets may be treated creatively.** Vector sources are not only
   flat images to place — they can be inlined, animated, masked, and used as
   structure. Bounded by the faithful-presentation rule below.

## The core design decision: composition, not template

The instruction is explicit: *do not build a rigid templatized project page that
forces each project to adjust to it.* The four asset sets are not
interchangeable — 16 files versus 6, portrait posters versus 4500px square
logos, a full site scroll versus none. A single fixed template would either
starve Flavour Grills or waste OK Pharmacy.

**Mechanism.** Define a small vocabulary of presentation blocks, each shaped for
a kind of artefact. Each project then carries an ordered *composition* naming
which blocks it uses, in what order, with which assets. The route walks that
composition. No project renders a block it has no assets for, and adding a block
to one project changes nothing about the other three.

```text
Project ──► blocks: ProjectBlock[]  ──► ProjectComposition ──► block components
            (ordered, per project)      (exhaustive switch)
```

The initial vocabulary, derived from what these four projects actually have —
each variant exists because a real asset needs it:

| Block | What it presents | Who uses it |
|---|---|---|
| `hero` | Cover artwork, title, discipline tags, client-or-self credit | all four |
| `note` | Prose: the brief, the approach, what was made | all four |
| `logo-suite` | Logo lockups and colourways on brand-coloured plates | all four |
| `palette` | The brand's colours as labelled swatches — shown as content, never applied to chrome | all four |
| `flatlay` | One tall stationery/collateral image given generous room | Flavour Grills, OK |
| `poster` | Print-proportion artwork, one or two up | Flavour Grills, OK |
| `packaging` | Product renders shown as a set | Gardenfare |
| `in-situ` | Environmental mockups (signage, bag, card) | OK, Provision |
| `screens` | Long web mockup inside a scroll-clipped frame | Provision, OK |
| `devices` | Laptop and phone mocks in composed rows | Provision |
| `social` | Social-media application set | OK |

This is generative in the sense asked for: supply a new project's assets, assign
them to blocks, and a page exists. It is deliberately *not* a CMS — no database,
no admin, no runtime content fetching. `src/lib/projects.ts` stays a typed static
array and every page stays statically generated (architecture principle #2).

## Design-system alignment: the site's language, adaptive layout only

**The rule.** Every project page is built entirely from the existing system:
warm-dark base, rose/caramel/peach accents, `font-display` / `text-display`
scale, 90° corners, `Section` rhythm, `PageHero` family, `display-gradient`, rose
focus ring, existing framer-motion primitives (`useDoorTilt`, `fadeUp`,
`staggerContainer`), reduced-motion gating. No page introduces a colour, a
typeface, a corner radius, or a motif borrowed from its subject.

**What adapts is the layout.** Block choice, block order, image scale, grid
counts, and page length all follow what a project actually has — a six-file
project and a sixteen-file project produce visibly different pages. What never
adapts is the chrome those layouts are made of. That distinction is the whole
brief: *adaptive layouts, existing UI*.

The practical test, applied to any proposal in this epic: could a visitor tell
which project they were on with the artwork removed? If yes, the page has drifted
into redesigning itself and the treatment is wrong.

### One amendment the system genuinely needs

`10-design-system.md` §9 currently rules: *"no cold, blue-cast stock imagery
dropped onto a warm canvas."* Provision Finance is navy and red. OK Pharmacy is
teal and green. Gardenfare is orange and grass green. Recolouring or warm-washing
any of it would misrepresent the work, which is worse than a palette clash — so
§9 as written cannot be satisfied by these four projects.

Amendment: **site imagery** (portraits, decorative illustration, backdrops —
palette is Abe's to choose) keeps the rule unchanged. **Artefact imagery**
(project and client work) is presented faithfully and mediated by an
`ArtefactPlate` — a surface built from `surface` / `surface-2` / `border` with a
defined inset, hairline edge, and soft shadow, separating foreign artwork from the
warm canvas instead of pretending it belongs to it. The plate is the seam, and it
is made of *our* tokens. Same idea as matting a print: the mat is the gallery's,
the print is the artist's.

This is the mechanism that makes clashing artwork sit correctly in our language
without either recolouring it or letting it take the page over. It replaces the
per-project accent channel that an earlier answer in this session would have
built (see owner confirmation 3). `TASK-104` writes it into the spine.

**No accent channel is built.** `--project-accent` is not added. Project brand
colours appear in exactly two places: inside the artwork itself, and as labelled
swatches in a `palette` block — where they are *content being shown*, not chrome
doing the showing. Nothing on the page is tinted by the project it describes.

### Creative license on the SVG assets

Vector sources are not merely images to place. Where an asset is a true SVG it may
be inlined and treated as structure or motion: a path draw-on as a mark enters
view, a logo silhouette used as a `mask-image` over a site-token fill, an outline
at display scale as a section marker, the Provision pattern SVG as a low-contrast
texture behind a block. `framer-motion` already handles path animation and no new
package is needed.

Two bounds, and they are the point of the license rather than exceptions to it:

1. **Faithful where it is the artefact.** In `logo-suite`, `poster`, `packaging`,
   `in-situ`, `screens`, and `social`, the artwork is evidence: correct colours,
   correct proportions, no filters, no recolouring. That is what the viewer is
   there to assess.
2. **Ours where it is decoration.** A mark reused as a mask, watermark, divider,
   or entry animation is site chrome derived from the asset, and it is filled with
   site tokens — `ink`, `soft`, `border`, or a rose wash. It must be unmistakably
   a treatment and never read as a colour-inaccurate reproduction of the logo. If
   a viewer could mistake a decorative use for the real mark, it belongs in
   category 1 or not at all.

Usable SVG inventory: `ok/logo-symbol-svg.svg` (2KB), `full-logo-svg.svg` (10KB),
`symbol-name-svg.svg` (11KB), `provision/logosvg.svg` (81KB),
`provision/bg svg.svg` (920KB, a pattern), and the Gardenfare artboards. Note that
`ok/website.svg` (1.4MB) is a full site mockup rather than a mark and is
rasterized by `TASK-093`; it is not a candidate for inlining.

The §3 guardrails bind throughout: accents stay seasoning, no accent on a large
surface, no tight two-stop gradients, 90° corners on chrome, no all-caps.

## Supersedes: the v1 "no deep dives" content rule

`11-content-strategy.md` §4 `/work` says *"No case-study deep dives, testimonials,
or metrics in v1 — projects stand on their own for now,"* and `EPIC-005` honoured
it with a deliberately minimal `CaseStudyDetail`. That rule was written when the
only project content was fictional placeholders; it was a guard against inventing
case studies, not a preference for thin pages.

This epic supersedes the deep-dive half of it under the owner's direct
instruction. **Testimonials and metrics remain excluded** — that half of the rule
is still correct and still binds. The distinction: showing more *artwork* with
honest description is not the same as claiming unverified *results*.

`TASK-104` records this in the spine rather than leaving the code silently
contradicting an approved document.

## Scope

- Normalize, optimize, and commit the four asset sets as web-safe derivatives.
- Extend `Project` into a composition model; author all four compositions.
- Build the accent + plate primitives and the block component vocabulary.
- Build the `ProjectComposition` renderer; replace `CaseStudyDetail`.
- Rebuild the `/work` grid around four real projects with honest credits.
- Draft per-project copy and alt text for owner approval.
- Add hover video previews to the cards (owner input pending — see `TASK-103`).
- Reconcile the three spine documents; validate accessibility and performance.

## Non-goals

- **No CMS, database, or admin UI.** "Generative" describes the composition
  model, not runtime content management. `projects.ts` stays static and typed.
- **No testimonials, metrics, or outcome claims.** Excluded by content rule and
  by the absence of evidence. No "increased footfall 30%".
- **No client logos-of-companies-I've-worked-with strip.** One client engagement
  does not make a client roster.
- **No redesign of `/`, `/about`, `/capabilities`, or `/contact`.** `FeaturedWork`
  on the home page must keep compiling and rendering throughout; the `Project`
  changes are additive for exactly that reason.
- **No new runtime dependency.** Blocks are built from `next/image`,
  `framer-motion`, and existing primitives. Asset processing uses the already
  installed `sharp` from a throwaway script, so `package.json` is untouched and
  no dependency plan is required. If any task finds it genuinely needs a new
  package, it stops and files a plan under `planning/dependencies/` first.
- **No presenting self-initiated concept work as client work.** Hard line.
- **No mockup fabrication.** Every artefact shown is one the owner supplied. The
  agent does not generate new mockups, new brand extensions, or new applications
  to fill out a thin page. A short page for a small asset set is the correct
  outcome; `note` blocks carry the difference, not invented artwork.

## Tasks

- [ ] TASK-093 — Normalize, optimize, and commit the four project asset sets, with a manifest mapping every file to its intended block role.
- [ ] TASK-094 — Extend `Project` into the composition model and author all four project compositions.
- [ ] TASK-095 — Build the `ArtefactPlate` surface and the SVG treatment primitives.
- [ ] TASK-096 — Build the foundational blocks: `hero`, `note`, `logo-suite`, `palette`.
- [ ] TASK-097 — Build the print and object blocks: `flatlay`, `poster`, `packaging`, `in-situ`, `social`.
- [ ] TASK-098 — Build the digital blocks: `screens` scroll frame and `devices` rows.
- [ ] TASK-099 — Build the `ProjectComposition` renderer and rebuild `/work/[slug]` around it, retiring `CaseStudyDetail`.
- [ ] TASK-100 — Rebuild the `/work` grid for four real projects with honest client-versus-self credits.
- [ ] TASK-101 — Draft per-project copy and alt text for owner approval.
- [ ] TASK-102 — Retire the placeholder projects and the two orphaned cover images.
- [ ] TASK-103 — Card hover video previews (`HoverVideo`) — **owner input required before starting**.
- [ ] TASK-104 — Reconcile the spine: content strategy §4, UI element map §3, design system §9 and the SVG treatment rule.
- [ ] TASK-105 — Validate: accessibility, artefact legibility on site surfaces, design-system conformance, image performance budget, build, typecheck, lint.

Suggested order: 093 → 094 → 095 → (096, 097, 098 in parallel) → 099 → 100 →
102 → 101 → 105 → 104, with 103 slotted in whenever the owner's clips land.

## Dependency / Architecture Evidence

- plan: none

No new package is added. Asset processing uses `sharp@0.34.5`, already resolvable
as a Next transitive dependency, invoked from a throwaway script outside
`package.json`. Blocks use `next/image` and `framer-motion@12`, both present.

Two known tooling gaps, both handled without a manifest change:

- **`svgo` is not resolvable.** SVG minification is therefore not available.
  `TASK-093` instead rasterizes the large illustrative SVGs that are used as
  images (`ok/website.svg` at 1.4MB, `provision/bg svg.svg` at 920KB, the
  Gardenfare artboards) and keeps only genuinely small true-vector logos as SVG.
- **`ffmpeg` is not installed.** `TASK-103` cannot encode video locally, which is
  one reason the owner supplies finished clips. Recorded there as an open item.

If a task concludes a package is genuinely needed, `AGENTS.md` applies: stop,
run `bash scripts/os.sh deps plan add ...`, apply `opensrc-research`, and wait
for human approval before installing.

## Testing

- recommendation: dedicated TASK-105
- rationale: The repository has no application test suite (`npm test` exits 1),
  and standing one up would need a package and a dependency plan — out of scope
  here and a poor fit for the actual risk, which is visual and editorial rather
  than logical. What can genuinely break is worth checking deliberately: a
  discriminated-union renderer that silently drops an unhandled block type,
  light-background artwork or a caption going illegible on a warm-dark surface, a
  decorative SVG treatment drifting into a colour-inaccurate reproduction of a
  logo, missing or decorative-when-it-should-be-meaningful `alt` text, 22MB of
  source imagery
  arriving on a page as unoptimized payload, and Next's image optimizer rejecting
  filenames it cannot serve. `TASK-105` covers those as an explicit checklist
  plus `build` / `typecheck` / `lint`, and `TASK-099` makes the union exhaustive
  at compile time so TypeScript catches the renderer gap rather than a test.
  Testing cannot establish that a page flatters the work; that judgment is the
  owner's, at review.

## Files allowed (advisory)

- `src/lib/projects.ts`
- `src/components/work/` (new block components and the renderer)
- `src/components/home/work-card.tsx` (card treatment, video preview)
- `src/app/(site)/work/page.tsx`, `src/app/(site)/work/[slug]/page.tsx`
- `src/app/globals.css` (artefact plate and SVG treatment utilities only — no new colour tokens)
- `public/images/projects/`
- `project-spine/10-design-system.md`, `11-content-strategy.md`, `12-ui-element-map.md` (TASK-104 only)
- `backlog/`

Out of scope: `src/app/(site)/about/`, `capabilities/`, `contact/`,
`src/components/{about,capabilities,the-way}/`, `src/lib/{capabilities,services,the-way,who-i-am}.ts`,
`package.json`, and every OS machinery path.

## Notes

`public/projects/` currently holds the owner's unoptimized originals: filenames
with spaces and mixed case, 4501px PNGs, Webflow hash prefixes on the Gardenfare
SVGs. That directory is gitignored on purpose — `TASK-093` reads from it and
commits normalized derivatives under `public/images/projects/<slug>/`. The
originals are the owner's local masters and are not in version control, which
`TASK-093` records in its manifest.

Two prior findings apply directly and should not be rediscovered the hard way:
filenames that are not plain ascii slugs make Next's image optimizer fail the
request rather than degrade, and a hidden preview tab freezes
`requestAnimationFrame`, so framer-motion work looks broken for reasons that have
nothing to do with the code. Check `document.hidden` before debugging motion.
