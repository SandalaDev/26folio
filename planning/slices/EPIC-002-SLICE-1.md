---
id: EPIC-002-SLICE-1
title: Tokens & global foundation
epic: EPIC-002
status: ready
phase: 1
risk_level: medium
design_refs: [10-design-system.md]
skill_refs: [design-taste-frontend, impeccable]
tasks: [TASK-007]
---

# SLICE-1 — Tokens & global foundation

> The canonical token layer. After this slice, the warm-dark skin palette (§2) and
> the global base rules (§3) exist in the Tailwind v4 `@theme`, so every later epic
> styles against `bg-background`, `text-ink`, `text-rose`, `border-border` instead of
> hex literals. This is the foundation the whole design system stands on — hence
> medium risk and a cross-model review.

## Intent
Advance Phase-1 "world-class portfolio" by encoding the approved palette and colour
guardrails ([10-design-system.md](../../project-spine/10-design-system.md) §2–3, §10) as live, named tokens — the single
source of truth from which the doc and any future preview are reconciled (§12).

## Scope / Non-goals
- **In:** colour tokens (base, surface, text, accents, functional), `--radius: 0`
  default, rose focus ring, warm selection, base `body` background/text.
- **Out:** fonts (SLICE-2), motion (SLICE-3), components (SLICE-3), any copy.

## Content and design
Design lane: **design-taste-frontend** reads the brief, **Impeccable** implements.
One active lane. Colour guardrails §3 are hard rules: no magenta, no harsh gradient,
no pure black / cold navy, no rounded corners.

## Technical approach
Tailwind v4 is CSS-first: tokens go in a `@theme` block in `src/app/globals.css`
(decision 1 of the epic). `tailwind.config.ts` becomes a thin documented companion.
Base layer rules (`background`, `ink`, `:focus-visible` ring, `::selection`,
`*{border-radius:0}` default) live in an `@layer base` block. `layout.tsx` carries
the body background/text class.

## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
| [TASK-007](../../backlog/tasks/TASK-007.md) | Colour + base tokens + global base layer | medium | lint + typecheck + build smoke |

## Gates
- [x] Spine references valid ([10](../../project-spine/10-design-system.md) approved).
- [x] Skills selected (design-taste-frontend + impeccable, one active lane).
- [x] Test plan: lint/typecheck/build matched to low-logic, high-cascade CSS risk.
- [x] Protected paths declared (none — `globals.css`/config are not protected).
