---
id: TASK-105
title: "tests: validate the work section — accessibility, design-system conformance, image budget, build"
status: ready
priority: P1
risk_level: medium
epic_ref: backlog/epics/EPIC-026.md
progress_weight: 1
files_allowed:
  - src/components/work/
  - src/lib/projects.ts
  - src/app/globals.css
  - backlog/
skill_refs: []
---

# Task: tests: validate the work section — accessibility, design-system conformance, image budget, build

## Scope

The epic's dedicated validation task. This repository has no application test
suite — `npm test` exits 1 by design, and standing one up would need a package and
a dependency plan, which is disproportionate to work whose risk is visual and
editorial rather than logical. So this task is a deliberate checklist executed
against the finished pages, plus the mechanical checks that do exist.

Record every result here as it is measured. A checked box with no recorded figure
is not evidence.

### 1. Accessibility

- **Alt text.** Every image on `/work` and all four project pages either carries
  real alt text or is deliberately `alt=""`. On these pages the artwork *is* the
  content, so a blanket `alt=""` would make the entire work section invisible to a
  screen reader. Enumerate every image and account for it.
- **Heading order.** One `h1` per page; no skipped levels across a composition
  whose block sequence differs per project. Worth checking on all four separately,
  because the block order differs and so can the heading order.
- **Keyboard.** Every card, the previous/next navigation, the back link, the CTA,
  and anything focusable inside `ScreensBlock` are reachable and operable, with a
  visible rose focus ring. The full `ScreensBlock` design must be reachable without
  a pointer.
- **Reduced motion.** With `prefers-reduced-motion: reduce`: card tilt, block entry
  animations, the `ScreensBlock` reveal, and any hover preview from `TASK-103` are
  all disabled, and nothing becomes unreachable as a result.
- **Touch.** Hover-dependent affordances degrade rather than disappear.

### 2. Design-system conformance

The owner's clarification is the acceptance bar for this whole epic: the pages
present the work inside sandala.dev's own visual language, with adaptive layout and
unchanged chrome. Verify it rather than trusting it, because drift here is gradual
and each individual step looks reasonable.

- **The removed-artwork test.** With every artefact image hidden (block the image
  requests, or set `visibility: hidden` on them), the four project pages must be
  indistinguishable from each other in visual language — same colours, type,
  spacing vocabulary, and chrome. Only layout and length should differ. If a page is
  identifiable by its chrome, it has drifted into redesigning itself.
- **No brand colour on chrome.** Audit every project page for a computed colour that
  is not a site token. The only legitimate non-token colours are inside artwork and
  inside `palette` swatch fills. Check headings, rules, eyebrows, borders, hover
  states, and backgrounds.
- **No new colour tokens.** `git diff` on `src/app/globals.css` for the epic adds no
  values inside `@theme`.
- **No `--project-accent`** anywhere in the codebase — the cancelled channel
  (`TASK-095`) has left nothing behind.
- **SVG treatments stay treatments.** Every decorative `SvgTreatment` use, reviewed
  side by side against the faithful mark in the same project's `logo-suite`. None may
  read as the real logo rendered in wrong colours.

### 2b. Artefact legibility on site surfaces

Recolouring artwork is forbidden, so legibility is the plate's job and must be
measured on the real surfaces.

Check caption and adjacent text against each `ArtefactPlate` tone (`neutral`,
`sunken`, `bare`) and against page background `#1a1411`, `surface` `#241c18`, and
`surface-2` `#2e2420`. AA (4.5:1) is the floor.

Then check the artwork itself in both directions, which is where these four projects
are genuinely awkward: white-ground lockups (OK Pharmacy's logos, Gardenfare's
colourway sheet, the packaging cut-outs) must be contained by their mat rather than
bleeding into the page, and Flavour Grills' white-ink variant must be visible on
whatever tone it sits on. Also confirm the card titles stay AA over all four cover
images, two of which are light artwork.

Record the actual ratio for every pairing. Any failure is a defect to fix in this
task, not a finding to log.

### 3. Image performance budget

`GOAL-004`'s success signal is real-device performance. These are the heaviest
pages on the site and the ones meant to prove craft, so a slow work section
undercuts the exact thing it exists to demonstrate.

- Total committed weight under `public/images/projects/` is under 6MB
  (`TASK-093`'s target, from 22MB of originals). Record the actual figure.
- No single committed raster over 400KB.
- Every page requests appropriately sized variants — inspect the actual optimizer
  URLs in the network panel at mobile and desktop widths. A 2400px asset arriving
  on a 390px viewport is a defect.
- Provision Finance is the heaviest page (`screens` plus `devices` plus `in-situ`).
  Record its total transferred bytes and largest contentful paint on a throttled
  connection.
- Nothing below the fold uses `priority`.
- Every image URL returns 200 with an image content-type. A prior finding on this
  project: `naturalWidth` is not a reliable check — fetch the optimizer URL.

### 4. Build and static generation

- `npm run build` clean; every `/work` and `/work/[slug]` route statically
  generated.
- `npm run typecheck` and `npm run lint` clean (`lint` runs at
  `--max-warnings 0`).
- Unknown slugs 404 (`dynamicParams = false`).
- The removed placeholder routes are gone.
- Do not run the build while the dev server is running — a prior finding on this
  project is that it clobbers `.next` and produces failures unrelated to the code.

### 5. Regression sweep

- Home page `FeaturedWork` renders correctly — `WorkCard` is shared.
- `/about`, `/about/the-way-i-am`, `/capabilities`, `/contact` are untouched and
  unaffected, particularly by the `globals.css` accent additions.
- No global token changed and nothing leaks out of the work section. Verify by
  inspecting computed styles on site chrome across the other routes, since the only
  shared file this epic touches is `globals.css`.

### 6. Honesty check

Not a technical check, but the one with the most at stake. Read all four pages as a
visitor:

- Exactly one project reads as a real client engagement.
- No page can be read as claiming a real institution as a client — Provision
  Finance's mockup contains the text "A Bank of Zambia accredited financial
  institution" *inside the artwork*, and the page must not let that be mistaken for
  a client claim.
- No metric, outcome, testimonial, or client quote appears anywhere.

## Acceptance Criteria

- [ ] Every image on all five pages enumerated and accounted for as meaningful or
      decorative.
- [ ] Heading order verified on all four project pages plus the grid.
- [ ] Full keyboard traversal verified, including the `ScreensBlock` design.
- [ ] Reduced-motion verified with nothing rendered unreachable.
- [ ] The removed-artwork test passes: the four pages are indistinguishable in
      visual language with the artefacts hidden.
- [ ] No project brand colour appears on chrome; no new colour token was added; no
      `--project-accent` remains anywhere.
- [ ] Every decorative SVG treatment reviewed against its faithful mark and confirmed
      to read as a treatment.
- [ ] Caption and adjacent text measured against all three plate tones and the three
      page surfaces, with ratios recorded here; every pairing meets AA or is fixed.
- [ ] White-ground and white-ink artwork both verified legible on their tones.
- [ ] Committed asset weight and largest single raster recorded and within budget.
- [ ] Provision Finance page transferred bytes and LCP recorded on a throttled
      connection.
- [ ] Correctly sized image variants confirmed at mobile and desktop from the
      network panel.
- [ ] `build`, `typecheck`, and `lint` all clean; static generation confirmed.
- [ ] Home page and the four other routes confirmed unaffected.
- [ ] No global token changed; accent scoping confirmed on site chrome.
- [ ] The honesty check passes on all four pages.

## Dependency Evidence

- plan: none

Browser tooling and the existing npm scripts. No package: introducing a test
runner or an axe integration would need `bash scripts/os.sh deps plan add ...`,
`opensrc-research`, and human approval, and is out of scope for this epic.

## Testing

- recommendation: dedicated — this is that task
- rationale: `EPIC-026` routes its epic-level testing here rather than diffusing it
  across the construction tasks, because the things most likely to be wrong are only
  observable once the pages are assembled: whether the four pages still read as one
  design system with the artwork hidden, artefact and caption legibility on the real
  plate surfaces, total image payload, heading order across four different block
  sequences, and reduced-motion behaviour across every block at once. Each construction task
  verifies its own local behaviour; this one verifies the properties that only exist
  at the whole-section level. What it explicitly cannot establish is whether the
  pages flatter the work — that judgment is the owner's, at review, and no check
  here substitutes for it.

## Notes

Runs after `TASK-102`, and after `TASK-103` if the owner's video decision lands
before this task starts. If `TASK-103` is still blocked, run this anyway and re-run
the payload and reduced-motion checks when previews arrive.

Record measurements inline above as they are taken. The point of this task is the
evidence it leaves behind, not the checkmarks.
