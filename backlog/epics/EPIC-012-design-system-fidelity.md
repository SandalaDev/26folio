---
id: EPIC-012
title: Design-system fidelity — flashlight, gradient smoothness, full token application
status: done
phase: 4
priority: P1
risk_level: medium
roadmap_ref: 09-roadmap.md
depends_on: [EPIC-011]
blocks: []
references:
  - 10-design-system.md
  - 10-design-system.html
  - 12-ui-element-map.md
related:
  - 09-roadmap.md
roadmap_refs: [ROAD-002]
goal_refs: [GOAL-002, GOAL-004]
progress_weight: 1
---

# EPIC-012 — Design-system fidelity (the preview looks better than the site)

> Owner review (2026-07-04): `project-spine/10-design-system.html` reads better
> than the shipped site. Three concrete complaints: (1) the flashlight effect —
> wanted on /capabilities and everywhere — looks better in the preview, (2) the
> site's gradients look jagged, not smooth, (3) the token set defined in the
> design system is not fully applied. This epic closes the gap between the
> preview and the build without dropping any shipped functionality.
>
> Owner second pass (2026-07-05), added to this epic: (4) the About flashlight
> is **too narrow** — folded into TASK-049 (the 520px preview recipe is the
> reference, not a tunable); (5) the featured-work card tilt is **broken** —
> no door-opening motion on hover and what remains feels abrupt. Fix it, then
> roll the door-tilt out to **all cards in the project**, smooth — TASK-054.

## Gap analysis (what the preview does that the site doesn't)

### 1. Flashlight

| Aspect | Preview (`10-design-system.html`) | Site today |
|---|---|---|
| Mounted | Globally — fixed overlay on every page | Only inside the About intro section (`about-intro.tsx`); /capabilities has none |
| Geometry | 520px circle | 280px circle — reads as a tight puck, not ambient light |
| Recipe | peach 10% → rose 5% @ 38% → transparent @ 70% (warm-led, long falloff) | rose 12% → peach 6% @ 60% → transparent @ 80% (pinker, hotter, tighter tail) |
| Update path | rAF-throttled CSS custom properties + a 300ms eased `background` transition (soft glide) | React `setState` on every `mousemove` (`usePointer`) — a full re-render per event, no rAF batching, no easing |

### 2. Gradient smoothness

- `hero.tsx` static fallback paints **full-strength** `--color-caramel` /
  `--color-rose` radials fading to transparent across most of the viewport.
  That is exactly the §3 anti-pattern ("never a tight two-stop ramp") and the
  main source of visible banding ("jagged") on the dark base — dark 8-bit
  ramps over long distances band badly. The preview never exceeds ~10% alpha
  on any accent wash.
- `ShaderBackground` has `grainMixer={0} grainOverlay={0}` — the library's
  built-in dither is off, so the WebGL field bands too.
- `Blob` washes use tiny CSS blurs (2–8px) on SVGs scaled to 26rem+, so the
  soft-wash intent renders as visibly stepped organic edges. §3 says "soft
  washes, **large blur radii**".

### 3. Token application (component-level grep, 2026-07-04)

| Token | Design-system role | Uses in src/ |
|---|---|---|
| `soft` | tertiary text / captions everywhere | 1 |
| `surface-2` | elevated surface (cards, hover states) | 1 |
| `border-2` | elevated / focused border (swatch hover pattern) | 4 |
| `caramel` | secondary accent — labels, section numbers, mono accents | 9 (mostly blob fills) |
| `peach` | bridge highlight, mono/code accent | 8 |
| `success` | quiet functional sage | 0 (contact success state doesn't use it) |
| `rose` | primary accent — *seasoning* | 42 (every eyebrow, tab, hover) |

The preview distributes the palette (caramel section numbers and table
headers, soft captions, peach mono, surface→surface-2 elevation steps); the
site is a rose/ink/muted monoculture, which is why it reads flatter. The
preview also renders the display h1 as an ink→soft gradient text fill, and
its display type is single-weight — several page h1s still carry the
extralight/semibold span mix that EPIC-011 (owner note 1) removed from the
hero.

### 4. Card motion (owner second pass, 2026-07-05)

The featured-work door-tilt is **dead in production** — root-caused live
(in-browser, pointer-fine, motion allowed; full write-up in TASK-054):
`work-card.tsx` passes its motion values conditionally —
`style={tiltEnabled ? { rotateX, rotateY } : undefined}` — and `tiltEnabled`
only flips true in a post-mount effect. framer-motion never subscribes to
motion values that first appear in `style` after mount, so the DOM transform
stays `transform: none` forever. Latent since EPIC-010 (masked then by the
pure-CSS `group-hover` image zoom); EPIC-011/TASK-047 moved the zoom onto the
same dead motion-value path, so since then the card has had NO smooth hover
motion — the owner's "broken + abrupt". A second defect compounds it:
`handleMove` measures the rect of the element INSIDE the rotated wrapper, so
at 9° the pointer math chases its own tilt (edge jitter).

## Goal & non-goals

**Goal:** make the shipped site match or beat the preview on these three
axes — a global DS-spec flashlight, band-free smooth gradients, and the full
§2 palette actually working — with zero functional regression (all existing
interactions, gates, and fallbacks keep working).

**Non-goals:**
- No new tokens, no palette changes, no type-scale changes. This epic *applies*
  the system; it does not extend it.
- No copy changes (no public_text tasks; heading weight changes don't alter words).
- No layout recomposition (hero/EPIC-011 composition stays).
- The `Button` primitive variants and `MagneticButton` machinery stay as-is.

## Slices & tasks

### SLICE-1 — Flashlight (§7)
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-049** | Global flashlight at DS spec: mount site-wide, 520px peach-led recipe, MotionValue-driven (no per-move re-render), eased glide. | medium | lint + typecheck + build |

### SLICE-2 — Gradient smoothness (§3 guardrail)
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-050** | Smooth ramps: hero static fallback rebuilt as low-alpha multi-stop washes; MeshBg longer ramps; shader grain on to dither banding. | medium | lint + typecheck + build |
| **TASK-051** | De-jag blob washes: blur scaled to rendered size (SVG-space feGaussianBlur or proportionally larger CSS blur), consumer opacity retuned. | low | lint + typecheck + build |

### SLICE-3 — Full token application (§2/§4)
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-052** | Palette redistribution: soft for captions/tertiary, caramel for labels/section accents, peach for mono/bridge highlights, surface-2/border-2 elevation steps; rose returns to seasoning. | medium | lint + typecheck + build |
| **TASK-053** | Type & functional fidelity: page h1s single-weight like the hero (+ optional ink→soft display gradient), contact success state uses `success`. | low | lint + typecheck + build |

### SLICE-4 — Card motion (owner second pass)
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-054** | Fix the dead door-tilt (bind motion values at mount, stable rect measurement, edge-hinged smooth spring) and roll the tilt out to all card surfaces via a shared `TiltCard` primitive. | medium | lint + typecheck + build + in-browser computed-transform check |

## Key decisions

1. **The flashlight becomes global chrome.** It mounts once in the (site)
   layout next to `Cursor`, replacing the About-only mount. It reuses the
   shared pointer stream via `usePointerMotion` (MotionValues + a motion
   template — no React re-render per mousemove, per design lane §3.B) and
   reproduces the preview's soft glide. Same gates as today: pointer-fine,
   motion-allowed, `aria-hidden`, `pointer-events-none`, beneath content.
2. **Banding is fixed at the source, then dithered.** First lower the ramp
   contrast (accent washes cap near the preview's ~10% alpha, multi-stop),
   then enable the shader's built-in grain. If large CSS washes still band on
   the owner's monitors, a reusable ~2% SVG-turbulence grain utility is the
   sanctioned follow-up — not a stronger gradient.
3. **Blur must be proportional to rendered size.** `Blob` blurs in SVG user
   space (feGaussianBlur inside the SVG, stdDeviation relative to the 200×200
   viewBox) so a 26rem blob gets a 26rem-scale blur; consumers stop passing
   px-blur numbers tuned to nothing.
4. **Token redistribution follows the preview's own usage**, not invention:
   caramel = section numbers / labels / table headers, soft = captions and
   tertiary lines, peach = mono/code accents and the ghost-button accent,
   surface→surface-2 + border→border-2 = the elevation/hover step. Rose keeps
   primary CTAs, active states, and the focus ring.
5. **Heading weight follows owner note 1 to its conclusion.** EPIC-011 made
   the hero h1 single-weight; the remaining page h1s still mix
   extralight/semibold. Default: all `text-display` h1s go single-weight.
   Section h2 mixes ("…<span class=font-extralight>looks like</span>") are a
   deliberate EPIC-010 counterpoint — they stay unless the owner says
   otherwise (open question below).

## Definition of done

- [ ] Flashlight renders on every page (incl. /capabilities), matches the
      preview's 520px peach-led recipe, glides smoothly, and causes no React
      re-render per pointer move; reduced-motion/coarse-pointer clients never
      see it.
- [ ] No full-strength accent-to-transparent ramp remains; hero fallback and
      section washes are long, low-contrast, multi-stop; shader grain is on;
      gradients show no visible banding at 1440p+.
- [ ] Blob washes read as soft light pools, no stepped edges at any shipped size.
- [ ] `soft`, `caramel`, `peach`, `surface-2`, `border-2`, `success` all carry
      their §2 roles somewhere real; rose count drops materially from 42.
- [ ] Page h1s are single-weight display; contact success state is sage.
- [ ] Card door-tilt WORKS (computed transform changes on hover — verify in
      the browser, this bug hid from code review), glides on enter and leave,
      and every card surface in the project carries it at size-appropriate
      amplitude.
- [ ] All existing functionality intact: tabs, anchors, magnetic buttons,
      form states, sticky-card modals, reduced-motion fallbacks.
- [ ] lint / typecheck / build green; in-browser verification on /,
      /capabilities, /about, /work, /contact.

## Open questions for the owner

1. Keep the extralight counterpoint spans in section h2s, or go single-weight
   everywhere like the preview? (Default: keep h2 mixes, fix h1s only.)
2. The preview's h1 is an ink→soft gradient text fill — want that signature on
   the site's display headings? (TASK-053 ships it behind a one-line utility;
   trivially removable.)
