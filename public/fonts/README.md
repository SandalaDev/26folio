# Self-hosted fonts

The design system (`project-spine/10-design-system.md` §4) mandates **self-hosted**
typefaces — **no CDN / Google-Fonts call** in production
(`07-architecture-principles.md` §rendering). The `@font-face` rules live in
`src/app/globals.css`; this directory holds the binaries they point at.

**Binaries are SHIPPED as of EPIC-010** — the faces below are live, not proposals.
`font-display: swap` still falls back to the system stacks in `--font-display` /
`--font-sans` / `--font-mono` while the woff2 loads.

## Shipped files (exact names the CSS expects)

| File | Family | Source | Licence |
|---|---|---|---|
| `ClashDisplay-Variable.woff2` | Clash Display (display / H1) | [Fontshare](https://www.fontshare.com/fonts/clash-display) | Fontshare — free for commercial use |
| `GeneralSans-Variable.woff2` | General Sans (headings + body) | [Fontshare](https://www.fontshare.com/fonts/general-sans) | Fontshare — free for commercial use |
| `GeneralSans-VariableItalic.woff2` | General Sans italic (emphasis) | [Fontshare](https://www.fontshare.com/fonts/general-sans) | Fontshare — free for commercial use |
| `JetBrainsMono-Variable.woff2` | JetBrains Mono (code / mono) | [fontsource](https://fontsource.org/fonts/jetbrains-mono) (latin subset) | SIL Open Font License 1.1 |

All are variable woff2 files; the `@font-face` weight ranges (`200 700` for the
Fontshare faces, `100 800` for JetBrains Mono) match the variable axes. The type
system leans on that range for its heavy/light weight contrast
(`10-design-system.md` §4). No build step is required — Next serves
`/public/fonts/*` at `/fonts/*`.

To swap a face: replace the file, keep the filename (or update `globals.css`'s
`@font-face` block to match); the *roles* (display / sans / mono) are fixed.
