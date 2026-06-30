---
id: TASK-008
title: "Typography system — faces, font tokens, type scale, eyebrow utility"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-002
slice: EPIC-002-SLICE-2
depends_on: [TASK-007]
design_refs: [10-design-system.md]
skill_refs: [design-taste-frontend, impeccable]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: false
handoff_required: false
handoff_type: []
protected_paths_touched: []
files_allowed:
  - src/app/globals.css
  - src/app/layout.tsx
  - public/fonts/
---

# Task: Typography system

> **Port, don't re-derive.** The font roles, fallback stacks, sizes, weights, and
> line-heights already exist in [`10-design-system.html`](../../project-spine/10-design-system.html)
> (`--font-display/-sans/-mono` and the type specimens). The one **deliberate change
> from the reference**: the HTML loads fonts from the Fontshare **CDN** (preview only);
> production must self-host via `@font-face` (no CDN/Google Fonts — §4, [07](../../project-spine/07-architecture-principles.md)). Port the
> values; swap the delivery mechanism.

## Scope
Wire the typography roles from [10-design-system.md](../../project-spine/10-design-system.md)
§4 — display / heading / body / mono / eyebrow — as self-hosted font variables and a
type scale, with **no CDN / Google-Fonts call** ([07](../../project-spine/07-architecture-principles.md) §rendering). Faces are
proposals; ship `@font-face` + real fallback stacks so the site renders on system
fonts until binaries are dropped in.

## Acceptance criteria
- [ ] Font CSS variables in `globals.css`: `--font-display`, `--font-sans`,
  `--font-mono`, each ending in a robust system fallback stack.
- [ ] `@font-face` blocks for Clash Display (display), General Sans (sans),
  JetBrains Mono (mono) with `font-display: swap`, pointing at `/fonts/*.woff2`.
- [ ] Type scale wired to the roles: display `clamp(36px,5vw,72px)` weight 600–700,
  line-height ~1.05; body 16px weight 400 line-height ~1.55–1.6; mono ~0.92em.
- [ ] Eyebrow/label utility: uppercase, `letter-spacing:.09em`, weight 700, ~11px.
- [ ] Max body measure ~70ch available (utility or base rule).
- [ ] `layout.tsx` applies the body/sans font variable to `<body>`; no
  `next/font/google`, no external `<link>` to a font CDN.
- [ ] `public/fonts/README.md` lists the exact files to drop in and the licence note
  (Fontshare faces free for this use; JetBrains Mono OFL).
- [ ] `npm run lint` and `npm run typecheck` pass; `npm run build` green + static.

## Notes
Low risk: no logic, no data, no public copy. Visual correctness confirmed at build.
Binaries are intentionally absent (fonts not finalised, §4); fallbacks cover the gap.
