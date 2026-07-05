---
id: TASK-054
title: "Card motion repair + rollout: fix the dead door-tilt (motion values never bound), then a smooth door-opening tilt on every card"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-012
slice: EPIC-012-SLICE-4
depends_on: []
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, framer-motion]

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
handoff_file: ""
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode."
protected_paths_touched: []
files_allowed:
  - src/components/motion/tilt-card.tsx
  - src/components/home/work-card.tsx
  - src/components/home/capability-rail.tsx
  - src/components/home/magazine-teaser.tsx
  - src/components/about/magazine-section.tsx
  - src/components/about/sticky-card.tsx
  - src/components/capabilities/tech-grid.tsx
  - backlog/tasks/TASK-054.md
  # Dev-tooling: autoPort added while diagnosing this bug (a stale dev server
  # held port 3000; the preview needed a second port). Harness config, not app
  # code; declared here because the diagnosis session produced it.
  - .claude/launch.json
---

# Task: Card motion repair + door-tilt rollout

> Owner (2026-07-05): "You have broken the motion design on the featured work
> cards — the tilt animation is no longer working. Fix: I want the cards to
> tilt like an opening door on hover. Add this to all cards in the project
> after you fix it. The animation should be smooth — it's currently too
> abrupt."

## Root cause (verified in-browser 2026-07-05, do not re-diagnose)

`work-card.tsx` gates the binding, not the input:
`style={tiltEnabled ? { rotateX, rotateY } : undefined}`. `tiltEnabled`
starts `false` (set in a post-mount effect), so the `motion.div` mounts with
`style=undefined`; when the effect flips it, framer-motion (v12) never
subscribes to the motion values that newly appear in `style` — the DOM
transform stays `transform: none` forever. Verified live: pointer-fine true,
reduced-motion false, the tiltEnabled class branch rendered, hover events
dispatched → both wrappers stayed `transform: none`.

This was latent since EPIC-010 (the tilt likely never worked), but EPIC-010's
image zoom was pure CSS (`group-hover:scale`) so hover still felt alive.
EPIC-011 (TASK-047) moved the zoom onto the same dead motion-value path —
since then the card shows NO smooth hover motion at all, which is the owner's
"broken + abrupt".

## Scope

1. **Fix the binding.** Pass motion values in `style` unconditionally from
   the first render; gate the INPUT instead (handleMove already checks
   `tiltEnabled`; values rest at 0 → identity transform, harmless for
   reduced-motion/coarse pointers). Never conditionally introduce motion
   values into `style` after mount — add a one-line comment warning in the
   shared primitive.
2. **Kill the measurement feedback loop.** `handleMove` measures
   `getBoundingClientRect()` of the Link INSIDE the rotated wrapper; at 9° the
   rect changes as the card tilts, so the pointer math chases its own output
   (jitter). Measure the un-transformed perspective parent (or a stable ref)
   instead.
3. **Make it read as an opening door, smoothly.** Dominant rotateY (vertical
   hinge) with the hinge at a card EDGE (`transformOrigin` left/right — a
   door swings from its hinge, not its center), small rotateX for depth,
   soft spring (in the current 120/18 neighborhood, tune by feel — no snap on
   enter OR leave), image zoom driven by the same spring so tilt + zoom stay
   one motion. Keep all existing gates: pointer-fine, reduced-motion,
   `will-change-transform`, imageless-fallback card unchanged.
4. **Extract a shared primitive** `src/components/motion/tilt-card.tsx`
   (design lane §3.B: MotionValues + springs, zero re-renders per move) and
   apply it to every card-like interactive surface:
   - `work-card.tsx` — home featured + /work grid (the fix itself)
   - `capability-rail.tsx` — the 5 rail cards
   - `about/magazine-section.tsx` — the magazine card link
   - `about/sticky-card.tsx` — sticky stack cards (hover only; keep the
     sticky/modal behavior untouched)
   - `capabilities/tech-grid.tsx` — tiles get a REDUCED amplitude (small
     surfaces need fewer degrees; §3 restraint)
   - `home/magazine-teaser.tsx` — only if it renders a card-like surface;
     skip if it is a plain section (judgment call, note it in the commit)
   Amplitude scales with card size; the door reads consistent site-wide.

## Acceptance criteria
- [ ] Featured-work cards visibly tilt like an opening door on hover, DOM
      transform actually changes (verify computed style in-browser, not just
      code review — that is how this bug hid).
- [ ] Enter/leave both glide; no snap, no jitter near card edges.
- [ ] Image zoom and tilt move as one; imageless fallback cards unchanged.
- [ ] All rollout surfaces tilt with size-appropriate amplitude; sticky-card
      modals, rail anchors, and all links still work.
- [ ] Coarse-pointer / reduced-motion clients get no tilt (values rest at 0)
      and keep a usable hover affordance.
- [ ] Zero React re-renders per pointer move (MotionValue-driven throughout).
- [ ] lint / typecheck / build green.
