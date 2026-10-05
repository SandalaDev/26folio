---
id: TASK-121
title: Refresh Collections wishlists and fix the Who I Am modal close
status: done
priority: P2
risk_level: medium
epic_ref: backlog/epics/EPIC-027.md
progress_weight: 1
files_allowed:
  - src/lib/the-way.ts
  - src/components/ui/dialog.tsx
  - public/images/about/wishlist/
skill_refs: []
parallel:
  suitable: false
  reason: Single data file plus a one-line interaction fix; splitting would cost more context than it saves.
  dependencies: []
  result: null
testing:
  recommendation: with-task
  reason: Static content data plus a CSS stacking fix; verified by lint, typecheck, production build, rendered-page inspection and an explicit final-list validation pass.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
started_at: 2026-10-05T00:18:52Z
completed_at: 2026-10-05T00:33:07Z
---
# Task: Refresh Collections wishlists and fix the Who I Am modal close

Owner brief of 2026-10-05 (chat). All quoted copy in the brief is final and
must be inserted exactly as supplied — no rewriting, paraphrasing or
"improving".

## Scope

1. **Collections intro** (`WISHLIST_INTRO`): append the owner's ADHD sentence
   and the "state of the wishlist as of October 2026" sentence, verbatim.
2. **Audiophile Gear Wishlist** (renamed from "Audiophile gear"): exactly ten
   items in the owner's order — Sennheiser HD 800 S, Meze Arta, Sennheiser
   HDB 630, Dan Clark Audio Noire X (moved from Studio, keeps its existing
   hover line), Status Pro X GoldenSound Edition, Lynx Hilo 2, Topping DX9,
   MOON 371, Focal Sopra No.2, JL Audio Fathom F113v2 — with the supplied
   hover lines.
3. **Studio Wishlist** (renamed from "Dream home music studio"): the owner's
   introduction and exactly twenty items in order — Sequential Prophet-10,
   Moog Muse, UDO Super Gemini, Elektron Analog Rytm MKII, Akai MPC X Special
   Edition, Ableton Push 3, Komplete Kontrol S88 MK3, Neumann U 87 Ai,
   Avalon VT-737sp, Universal Audio Apollo x16 Gen 2, Apogee Symphony Studio,
   Genelec 8351B, Genelec 7360A, Sennheiser HD 490 PRO, LEWITT L6 (moved from
   Audiophile), Ableton Live 12, Komplete 15, Omnisphere 2, FabFilter Total
   Bundle, Valhalla DSP Bundle — with the supplied hover lines.
4. **Removals**: Focal Clear MG, 64 Audio U4s, Thieaudio Hype 4, RME ADI-2
   DAC FS, Eversolo DMP-A6, KEF KC92, KEF R7 Meta and SteelSeries Arctis Nova
   Elite (absent from the owner's final ten) leave the data, and their
   collection-specific images are deleted. Moved items reuse their existing
   image paths; the owner-supplied new images already sit in
   `public/images/about/wishlist/audiophile/`.
5. **Who I Am modal**: the BioReader scroll container (`relative z-10`) stacks
   above the dialog's absolutely-positioned close button (z-auto), so clicks
   land on the scroll area. Raise the close button above the content; no
   visual redesign.

## Acceptance Criteria

- [x] Both wishlists match the owner's final lists exactly (names, order,
      hover lines, one LEWITT L6 in Studio only, one Dan Clark Audio Noire X
      in Audiophile only).
- [x] Collections intro contains both supplied sentences verbatim; Studio
      Wishlist intro is the supplied paragraph verbatim.
- [x] No references remain to any removed product; no dead image references;
      removed images deleted from `public/images/about/wishlist/audiophile/`.
- [x] The Who I Am modal close button closes the modal at mobile, tablet and
      desktop widths.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Verification evidence (2026-10-05)

- `npm run lint`, `npm run typecheck`, `npm run build` all exit 0
  (Next.js 15.5.19 production build, 14/14 static pages).
- Scripted content validation (tmp/validate-wishlists.cjs,
  tmp/validate-copy.cjs): 95 image refs resolve; audiophile list is exactly
  the owner's ten in order; studio list is exactly the owner's twenty in
  order; no banned product references; moved items appear exactly once each;
  all 30 owner hover lines and the studio intro are byte-verbatim.
- Rendered-page inspection (`next start`, /about/the-way-i-am): section
  titles, both new intro sentences and the teaser strips (first six items of
  each refreshed list, confirming order) render; the six key new/moved images
  return 200 through the `/_next/image` optimizer.
- Modal close fix is a one-class z-index correction (`dialog.tsx`): the
  BioReader scroll container (z-10) and mobile hairline (z-20) stacked above
  the z-auto close button and swallowed its clicks; z-30 restores hit-testing
  at every viewport (the hairline is a 1px strip at top-0 and never overlaps
  the top-4 button; the chapter rail is lg+-only on the left edge).

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: The risk is editorial (copy drift, wrong ordering, dead asset
  references) and one interaction regression with a CSS cause. The portfolio's
  standing checks plus a rendered-page inspection and a line-by-line content
  validation against the brief cover it; the repo has no application test
  suite and this task does not justify one.

## Notes

The brief's own item list (§5) and its final-state validation (§16) disagree
on position 4 of the audiophile list; §16 is authoritative and places Dan
Clark Audio Noire X there, with LEWITT L6 only in the Studio Wishlist.
The SteelSeries Arctis Nova Elite is not mentioned anywhere in the brief but
is absent from the final ten, so it is removed and recorded here for the
owner's visibility.
