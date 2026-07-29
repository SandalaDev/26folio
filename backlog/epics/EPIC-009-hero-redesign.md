---
id: EPIC-009
title: Hero shader background + signature motion (cursor + magnetic buttons)
status: done
phase: 4
priority: P1
risk_level: medium
roadmap_ref: 09-roadmap.md
depends_on: [EPIC-002, EPIC-003]
blocks: []
references:
  - 10-design-system.md
  - 12-ui-element-map.md
related:
  - 09-roadmap.md
roadmap_refs: [ROAD-002]
goal_refs: [GOAL-002, GOAL-004]
progress_weight: 1
---

# EPIC-009 — Hero redesign + signature motion

> Realizes two already-recorded follow-ups: STATE.json's *"vendor the 21st.dev
> ShaderBackground as a Hero upgrade once perf/a11y-audited"* and the §7 signature
> button reserved in `src/components/ui/button.tsx` ("magnetic pull, cursor-origin
> fill sweep, text-mask reveal — a separate motion component a page epic builds on
> top of this + src/lib/motion.ts"). Both trace to
> [10-design-system.md](../../project-spine/10-design-system.md) §6–§7, whose motion
> benchmark is **baunfire.com**.

## Goal & non-goals

**Goal:** replace the home hero's static warm-gradient with a **live WebGL mesh-gradient
shader** (21st.dev `hero-section-with-smooth-bg-shader`, `@paper-design/shaders-react`),
**remapped to the warm skin palette** (§2–§3: no teal, no magenta, no harsh gradient),
and layer in the two baunfire-referenced **signature interactions**: a custom **cursor**
(§7 #2) and a **magnetic button** (§7 #4). The existing static gradient is **kept as
the always-present base and the `prefers-reduced-motion`/touch/low-power fallback** —
the shader and cursor are additive, never load-bearing.

**Non-goals:**
- No hero **copy** change — the headline/subhead/CTA text is untouched (no new public
  text, so the slop gate stays off).
- No global replacement of every `Button` — the base primitive
  ([button.tsx](../../src/components/ui/button.tsx)) is unchanged; `MagneticButton`
  wraps it and is opted into (hero CTA first).
- Not the other §7 patterns (work-card zoom, timeline, flashlight, tech-grid) — those
  are their own epics; this epic only touches hero + the shared cursor + magnetic CTA.
- No new `mousemove` listener — cursor/magnetic reuse the single shared pointer source
  ([use-pointer.ts](../../src/lib/use-pointer.ts)), which already anticipates this.

## Key decisions

1. **Shader is additive, static gradient stays.** `ShaderBackground` mounts *above* the
   existing radial-gradient only when motion is allowed and the pointer is fine (desktop).
   Reduced-motion / touch / SSR → the documented static fallback shows through unchanged.
2. **Palette remap is a hard requirement.** The upstream demo's teal/green colors
   (`#72b9bb …`) violate §3. Colors are remapped to `rose/peach/caramel/soft/surface/
   background` tokens; `distortion/swirl/speed` tuned **low** for §6's "subtle & smooth".
3. **One library per job (§6).** Framer drives declarative React motion (cursor spring,
   fill/reveal); GSAP `quickTo` drives the imperative magnetic transform (matchMedia
   reduced-motion guard). Lottie is vendored per request but unused by the hero.
4. **Accessibility is non-negotiable (§10).** Custom cursor never removes native focus,
   is pointer-fine only, and everything degrades to the plain primitive under
   reduced-motion.

## Slices & tasks

### SLICE-1 — Foundations (cleanup + animation skills)
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-035** | Repo cleanup (gitignore Obsidian workspace state, keep loose notes) + vendor the gsap / framer-motion / lottie skills (registry + lock). | low | lint + typecheck |

### SLICE-2 — Hero shader + signature motion
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-036** | Shader hero background: add `@paper-design/shaders-react`, warm-remapped `ShaderBackground`, integrate into `Hero` above the static fallback. | medium | lint + typecheck + build |
| **TASK-037** | Signature motion: extend the shared pointer source; custom `Cursor` (mounted globally) + `MagneticButton` (magnetic pull + fill sweep + text-mask), wire hero CTA. | medium | lint + typecheck + build |

## Definition of done

- [ ] `@paper-design/shaders-react` added; `ShaderBackground` renders the warm palette
      (no teal/magenta), tuned subtle, mounted only when motion is allowed.
- [ ] `Hero` keeps the static radial-gradient as base + reduced-motion/touch fallback;
      shader and cursor add nothing to the reduced-motion experience.
- [ ] Custom `Cursor` reuses `usePointer` (no second listener), pointer-fine only,
      preserves native focus; `MagneticButton` degrades to the plain `Button` under
      reduced-motion/touch and wires the hero CTA.
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` all green; no WebGL/hydration
      console errors; verified in-browser incl. the reduced-motion fallback.
- [ ] gsap / framer-motion / lottie vendored, registered, pinned in `lock.json`.
