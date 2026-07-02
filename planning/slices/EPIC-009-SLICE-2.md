---
id: EPIC-009-SLICE-2
title: Hero shader background + signature motion
epic: EPIC-009
status: ready
phase: 4
risk_level: medium
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, gsap, framer-motion]
tasks: [TASK-036, TASK-037]
---

# SLICE-2 — Hero shader + signature motion

> The visible payload of EPIC-009: a warm mesh-gradient shader behind the hero, a
> custom cursor, and a magnetic CTA — the two baunfire-referenced signature
> interactions ([10-design-system.md](../../project-spine/10-design-system.md) §7 #2, #4)
> plus the shader upgrade, all gated behind motion/pointer/reduced-motion checks.

## Intent
Turn the documented static-gradient placeholder into the intended live shader hero, and
ship the first two §7 signature interactions as reusable `src/components/motion/`
components — without regressing the reduced-motion/touch experience.

## Scope / Non-goals
- **In:** `@paper-design/shaders-react`; `ShaderBackground` (warm-remapped MeshGradient);
  `Hero` integration; extend `usePointer`; global `Cursor`; `MagneticButton`; wire the
  hero CTA.
- **Out:** hero copy; replacing the base `Button`; other §7 patterns (work cards,
  timeline, flashlight, tech grid); applying `MagneticButton` site-wide (hero CTA only).

## Content and design
Hero copy unchanged (no public-text change). Design lane: **design-taste-frontend** reads
the brief; motion obeys §6 (ease-out `[0.22,1,0.36,1]`, no springs/overshoot on the
button transform, micro/component durations, `prefers-reduced-motion` disables all) and
the §3 colour guardrails (warm only; no teal, no magenta, no harsh gradient). Cursor +
magnetic effects are pointer-fine only and preserve native focus (§10).

## Technical approach
- **Shader:** new `src/components/motion/shader-background.tsx` (client) wraps
  `MeshGradient` with the demo's `mounted`/resize guard, colours remapped to
  `rose/peach/caramel/soft/surface/background`, low `distortion/swirl/speed`, and a soft
  warm veil. `src/components/home/hero.tsx` keeps its radial-gradient base and mounts the
  shader above it only when `!useReducedMotion()` and pointer-fine.
- **Motion:** extend `src/lib/use-pointer.ts` to expose Framer `MotionValue`s (single
  shared listener) so `Cursor`/`MagneticButton` avoid per-move re-renders.
  `src/components/motion/cursor.tsx` (mounted once in `src/app/(site)/layout.tsx`) grows
  and labels on interactive hover; `src/components/motion/magnetic-button.tsx` uses GSAP
  `quickTo` (matchMedia reduced-motion guard) for the magnetic pull and Framer for the
  cursor-origin fill sweep + text-mask reveal, degrading to the plain `Button`.

## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
| [TASK-036](../../backlog/tasks/TASK-036.md) | Warm shader hero background + Hero integration | medium | lint + typecheck + build |
| [TASK-037](../../backlog/tasks/TASK-037.md) | Custom cursor + magnetic button; wire hero CTA | medium | lint + typecheck + build |

## Gates
- [x] Spine references valid ([10](../../project-spine/10-design-system.md) approved, [12](../../project-spine/12-ui-element-map.md)).
- [x] Skills selected (design-taste-frontend + vendored gsap/framer-motion; one lib per job).
- [x] Test plan: lint/typecheck/build + in-browser verification incl. reduced-motion fallback.
- [x] Protected paths declared (none — hero, motion components, layout, package.json).
