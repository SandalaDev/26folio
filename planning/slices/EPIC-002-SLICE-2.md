---
id: EPIC-002-SLICE-2
title: Typography system
epic: EPIC-002
status: ready
phase: 1
risk_level: low
design_refs: [10-design-system.md]
skill_refs: [design-taste-frontend, impeccable]
tasks: [TASK-008]
---

# SLICE-2 — Typography system

> The type layer. After this slice the display/heading/body/mono/label *roles* (§4)
> exist as font variables + a type scale + the tracked eyebrow utility, served by
> self-hosted `@font-face` with robust fallbacks. The site renders correctly on
> system fallbacks today; dropping the real binaries in later is a no-code step.

## Intent
Give every page the same editorial-technical voice (§4) without a CDN call — the
architecture forbids `next/font/google` ([07](../../project-spine/07-architecture-principles.md) §rendering; §4). Roles are fixed; the
specific faces remain owner-tunable proposals.

## Scope / Non-goals
- **In:** font CSS variables (`--font-display/-sans/-mono`), `@font-face` blocks with
  fallback stacks, type scale + line-heights, uppercase tracked eyebrow/label utility,
  `public/fonts/README.md` drop-in doc, body font wiring in `layout.tsx`.
- **Out:** real font binaries (owner-confirmed later), headings/copy on any page,
  components.

## Content and design
Design lane: design-taste-frontend → Impeccable. Display = Clash Display (proposal),
sans = General Sans (proposal), mono = JetBrains Mono. Fallbacks are real system
stacks so nothing breaks before binaries land.

## Technical approach
`@font-face` + `@theme`/`:root` font variables in `globals.css`; type scale via
Tailwind v4 `@theme` font-size tokens or base element rules; eyebrow utility in
`@layer components` or `@layer utilities`. `public/fonts/README.md` lists exact files
(Clash Display, General Sans, JetBrains Mono — woff2) and the licence note (§4).

## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
| [TASK-008](../../backlog/tasks/TASK-008.md) | Font faces, font tokens, type scale, eyebrow utility, fonts README | low | lint + typecheck |

## Gates
- [x] Spine references valid ([10](../../project-spine/10-design-system.md) §4).
- [x] Skills selected (one active lane).
- [x] Test plan: lint + typecheck (no logic; visual confirmed at build).
- [x] Protected paths declared (none).
