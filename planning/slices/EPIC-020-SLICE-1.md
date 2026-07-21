# EPIC-020 SLICE-1 — Shared centered hero + type alignment

Owner brief 2026-07-21. Harmonize every page opener and the typography to
/about/the-way-i-am (WayHero).

## The reference (WayHero)

Centered editorial manifesto: a centered `display-gradient font-display
text-display` h1, then a centered `max-w-2xl` column (portrait, a bold lead
line, a muted `measure` paragraph). Motion is `fadeUp` / `staggerContainer`
gated by reduced motion.

## Changes

- **`src/components/site/page-hero.tsx` (new):** the shared centered shell.
  Props: `title`, optional `backdrop` (Blob/MeshBg passed by the page so each
  keeps its accent), `children` (supporting copy), `className`. Renders a
  `Section` with `text-center`, a centered `max-w-2xl` motion column, the
  display-gradient h1, then the children. One component so the pattern can't
  drift again.
- **about-intro / work / capabilities / contact:** swap the left-aligned
  `Section + h1` for `PageHero`, keeping each page's backdrop and intro copy,
  now centered.
- **home hero:** re-centered to the same composition (title, blob portrait
  under it, subhead, CTA), keeping the shader/gradient background and the
  MagneticButton CTA. Portrait sizing tuned so the CTA stays in view.
- **case-study-detail:** h1 gains the `display-gradient` (was `text-ink`),
  matching every other page hero.

## Notes

- Owner copy unchanged. Long intros (about, home) are preserved and centered;
  the `measure`/`max-w-2xl` cap keeps line length readable.
- h2 headings already use `text-heading font-display text-ink` project-wide;
  no change needed there.
