---
id: EPIC-002-SLICE-3
title: Motion tokens & base primitives
epic: EPIC-002
status: ready
phase: 1
risk_level: medium
design_refs: [10-design-system.md]
skill_refs: [design-taste-frontend, impeccable, shadcn-ui-builder]
tasks: [TASK-009, TASK-010]
---

# SLICE-3 — Motion tokens & base primitives

> The reusable behaviour + component layer. After this slice, pages compose
> brand-styled shadcn primitives (`Button`, `Card`, `Input`, `Textarea`, `Label`) and
> share one set of motion constants (durations, easings, Framer presets) so every
> animation feels like the same hand (§6, §8). No page content — substrate only.

## Intent
Stop later epics from re-deriving motion timings or re-styling primitives. Encode the
"subtle and smooth" motion appetite (§6) once, and vendor token-bound primitives (§8)
so the design language is consistent and accessible (§10) by default.

## Scope / Non-goals
- **In:** `src/lib/motion.ts` (durations, easing béziers, fade-up/stagger Framer
  variants, reduced-motion helper); `src/components/ui/` primitives styled to tokens
  with hard corners + rose focus; `cva` + `@radix-ui/react-slot` deps.
- **Out:** signature interaction components of §7 (deferred to the page epic that
  needs each); GSAP/Lottie helpers; any page usage of these primitives.

## Content and design
Design lane: design-taste-frontend → Impeccable; **shadcn-ui-builder** governs the
primitive composition. Motion: ease-out cubic-bézier `[0.22, 1, 0.36, 1]`, durations
micro 150 / component 300 / page 500ms, `staggerChildren: .08`. `prefers-reduced-
motion` disables choreography.

## Technical approach
`motion.ts` exports plain constants + `Variants` objects (typed against
`framer-motion`, already installed in EPIC-001). Primitives authored from the known
shadcn source (MIT), edited to use `bg-rose`/`text-background`/`outline-rose` and
`rounded-none`. `cva` drives `Button` variants. No `force-dynamic`.

## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
| [TASK-009](../../backlog/tasks/TASK-009.md) | Shared motion constants + Framer presets + reduced-motion helper | low | lint + typecheck |
| [TASK-010](../../backlog/tasks/TASK-010.md) | Base shadcn primitives (Button/Card/Input/Textarea/Label), token-styled | medium | lint + typecheck + build smoke |

## Gates
- [x] Spine references valid ([10](../../project-spine/10-design-system.md) §6, §8).
- [x] Skills selected (one active design lane + shadcn-ui-builder for primitives).
- [x] Test plan: lint + typecheck; build smoke proves primitives compile statically.
- [x] Protected paths declared (none — `package.json` is not a protected path).
