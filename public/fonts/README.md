# Self-hosted fonts

The design system (`project-spine/10-design-system.md` §4) mandates **self-hosted**
typefaces — **no CDN / Google-Fonts call** in production
(`07-architecture-principles.md` §rendering). The `@font-face` rules live in
`src/app/globals.css`; this directory holds the binaries they point at.

Until the binaries are added, `font-display: swap` falls back to the system stacks
declared in `--font-display` / `--font-sans` / `--font-mono`, so the site renders
correctly — it just isn't yet showing the brand faces. Fonts are **proposals** (§4):
swap the faces here and update the `@font-face`/`--font-*` values if a different
face is chosen; the *roles* (display / sans / mono) are what's fixed.

## Drop these files in (exact names the CSS expects)

| File | Family | Source | Licence |
|---|---|---|---|
| `ClashDisplay-Variable.woff2` | Clash Display (display / H1) | [Fontshare](https://www.fontshare.com/fonts/clash-display) | Fontshare — free for commercial use |
| `GeneralSans-Variable.woff2` | General Sans (headings + body) | [Fontshare](https://www.fontshare.com/fonts/general-sans) | Fontshare — free for commercial use |
| `JetBrainsMono-Variable.woff2` | JetBrains Mono (code / mono) | [JetBrains](https://www.jetbrains.com/lp/mono/) / [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono) | SIL Open Font License 1.1 |

All three are variable woff2 files; the `@font-face` weight ranges
(`200 700` for the Fontshare faces, `100 800` for JetBrains Mono) match the variable
axes. Download the woff2 (not the whole zip), rename to the filenames above, and place
them in this folder. No build step is required — Next serves `/public/fonts/*` at
`/fonts/*`.

> Keep binaries out of unnecessary bloat: ship only the woff2 weights actually used
> (display 600–700, sans 400/600/700, mono 400). If you self-subset, preserve the
> filenames above so `globals.css` resolves without edits.
