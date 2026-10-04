---
id: TASK-093
title: "Normalize, optimize, and commit the four project asset sets"
status: ready
priority: P1
risk_level: medium
epic_ref: backlog/epics/EPIC-026.md
progress_weight: 1
files_allowed:
  - public/images/projects/
  - backlog/
skill_refs: []
---

# Task: Normalize, optimize, and commit the four project asset sets

## Scope

Turn the owner's local originals in the gitignored `public/projects/` into
web-safe, committed derivatives under `public/images/projects/<slug>/`, and
record what each asset is for so `TASK-094` can author compositions without
re-opening every file.

Slugs: `ok-pharmacy`, `provision-finance`, `gardenfare-foods`,
`flavour-grills-cafe`.

### Why this is first

Three problems block every later task:

1. **Filenames are not servable.** `flavour grills/`, `FB Page Mockup.jpg`,
   `bg svg.svg`, `symbol-name- png.png` (note the stray space before the
   extension), and Webflow hash prefixes like
   `603e765912965dd577c2d705_GardenFare SVG_Artboard 11.svg`. A prior finding on
   this project: filenames that are not plain ascii slugs make Next's image
   optimizer fail the request outright rather than degrade. Rename everything to
   lowercase ascii kebab-case.
2. **Sizes are print-scale, not web-scale.** `provision/treatment.png` is
   4501×4501 at 2.2MB, `logopng.png` 4501×4501 at 1016KB, `concept.png`
   4500×4500, `homepage.png` 1920×1620 at 2.7MB, `scroll.jpg` 1920×2221 at
   1.4MB. `public/projects/` totals 22MB. Shipping that raw would wreck the
   `GOAL-004` performance signal on the very pages meant to demonstrate craft.
3. **The two current cover images are orphaned.** `src/lib/projects.ts` points at
   `/images/projects/provision.png` and `/images/projects/ok-pharmacy.jpg`. Both
   were deleted from the working tree during this session's asset drop and
   restored so the branch keeps rendering. Their replacements come from here;
   `TASK-102` removes them once nothing references them.

### Processing rules

- **Raster → WebP** at quality 82, plus a 2× variant only where a block displays
  the asset large (hero covers, flatlay, poster, screens). Keep the source
  extension's original as the fallback only where WebP would lose something
  real; otherwise WebP is the single committed form.
- **Cap long edge at 2400px** for full-bleed and screens assets, 1600px for
  in-situ and packaging, 1200px for social and logo raster. Nothing on this site
  is displayed above 2400px.
- **True-vector logos stay SVG.** `ok/logo-symbol-svg.svg` (2KB),
  `full-logo-svg.svg` (10KB), `symbol-name-svg.svg` (11KB), and
  `provision/logosvg.svg` (81KB) are small and scale — keep them.
- **Rasterize the large illustrative SVGs.** `ok/website.svg` (1.4MB, a full
  1920×1836 site mockup), `provision/bg svg.svg` (920KB pattern), and the
  Gardenfare artboards (370KB / 87KB / 94KB) are illustrations, not logos, and
  `svgo` is not resolvable in this repo so they cannot be minified. Rasterize to
  WebP at the display cap. Keep `60637b9834ed753fb04040a9_GF logo-01.svg` as
  `logo.svg` if it is the clean mark rather than an illustration; inspect before
  deciding.
- **Use the already installed `sharp@0.34.5`** from a throwaway script in the
  session scratchpad. Do **not** add it, `svgo`, or anything else to
  `package.json` — that would need a dependency plan (`AGENTS.md`), and it is not
  needed for a one-time conversion.
- **Do not crop, recolour, retouch, or composite.** Resize and re-encode only.
  Altering the artwork would misrepresent the work.
- **Do not delete or move the originals** in `public/projects/`. Read from them;
  leave them exactly as the owner left them.

### Manifest

Write `public/images/projects/MANIFEST.md`: one table per project mapping
original filename → committed derivative → pixel dimensions → intended block
role (`hero`, `logo-suite`, `palette`, `flatlay`, `poster`, `packaging`,
`in-situ`, `screens`, `devices`, `social`) → a one-line description of what the
image actually shows. `TASK-094` authors compositions from this table and
`TASK-101` writes alt text from the descriptions.

Also record in the manifest that the originals are the owner's local masters and
are **not** in version control, so their loss is a real and unmitigated risk.
Flag it for the owner rather than silently assuming a backup exists.

## Acceptance Criteria

- [ ] Every committed file under `public/images/projects/` matches
      `^[a-z0-9]+(-[a-z0-9]+)*\.(webp|svg|jpg|png)$` — no spaces, no uppercase,
      no hash prefixes, no double extensions.
- [ ] Four project directories exist, named for the four slugs.
- [ ] Total committed weight for all four projects is under 6MB (from 22MB of
      originals). Record the actual figure in the manifest.
- [ ] No single committed raster exceeds 400KB.
- [ ] Every asset the owner supplied is either committed as a derivative or
      listed in the manifest with a stated reason for exclusion. Nothing is
      silently dropped — in particular, decide explicitly about
      `ok/Gemini_Generated_Image_tlbsl7tlbsl7tlbs.png` (1.8MB, AI-generated), and
      flag for the owner whether an AI-generated image belongs in a portfolio of
      hand-designed work at all.
- [ ] `MANIFEST.md` covers every committed file with dimensions, block role, and
      description, and states the originals-not-in-git risk.
- [ ] Each derivative opens and renders correctly — verified by fetching the URLs
      through the running dev server, not by reading file sizes. A prior finding
      on this project: `naturalWidth` is not a reliable check here; fetch the
      optimizer URL and confirm a 200 with an image content-type.
- [ ] `public/projects/` is unchanged and still gitignored; `git status` shows no
      untracked originals.

## Dependency Evidence

- plan: none

`sharp@0.34.5` is already resolvable as a Next transitive dependency and is used
from a throwaway script, so `package.json` is untouched. If conversion turns out
to need a package that must be installed, stop and run
`bash scripts/os.sh deps plan add ...` with `opensrc-research` first.

## Testing

- recommendation: with-task
- rationale: The failure mode is silent and specific — a renamed file that Next's
  optimizer still refuses, or a derivative that is written but corrupt. Both are
  caught by fetching every committed URL through the dev server and asserting a
  200 with an image content-type, which is cheap and belongs in this task. Weight
  and dimension caps are checked by listing the output directory. No test
  framework is warranted for a one-time conversion; `TASK-105` re-checks the
  performance budget once the pages actually consume these files.

## Notes

Asset counts to reconcile against: OK Pharmacy 16 files / 6.7MB, Provision
Finance 12 / 12MB, Gardenfare Foods 9 / 2.6MB, Flavour Grills Cafe 6 / 1.5MB.

`tmp/pdfs/maxisave-*.jpg` in the working tree is unrelated scratch from an
earlier session and is now gitignored. It is **not** part of this epic; do not
process or commit it.
