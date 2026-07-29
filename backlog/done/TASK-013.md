---
id: TASK-013
title: "Hero — headline, CTA, static warm-gradient background"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-003
epic_ref: backlog/epics/EPIC-003-home-page.md
slice: EPIC-003-SLICE-3
depends_on: [TASK-011]
design_refs: [12-ui-element-map.md, 11-content-strategy.md]
skill_refs: [design-taste-frontend, impeccable]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: true
handoff_required: false
handoff_type: []
protected_paths_touched: []
files_allowed:
  - src/components/home/hero.tsx
  - backlog/tasks/TASK-013.md
progress_weight: 1
---

# Task: Hero

> **Shader deferred (epic decision #3).** [12-ui-element-map.md](../../project-spine/12-ui-element-map.md)
> §3 specs a 21st.dev WebGL `ShaderBackground`; this task ships the static warm-gradient
> version that the map *already requires* as the `prefers-reduced-motion`/low-power
> fallback, so the page is complete without it. Swapping in WebGL is a follow-up task.

## Scope
`Hero`: full-bleed first viewport block — eyebrow-less headline (the one-line
positioning: a strategic engineering partner, not a commodity freelancer, per
[11-content-strategy.md](../../project-spine/11-content-strategy.md) §4), a sub-headline,
and a primary CTA `Button` ("Let's talk" → `/contact`). Background is a static warm
gradient using only `rose`/`peach`/`caramel` tokens (§3: no magenta, no harsh two-stop
ramp). Framer fade-up entry on mount, full `prefers-reduced-motion` fallback (gradient
renders either way; only the entry transform is skipped).

## Acceptance criteria
- [ ] Headline + sub-headline copy is voice-correct
  ([11-content-strategy.md](../../project-spine/11-content-strategy.md) §2: intelligent,
  fun, resourceful; first person; no corporate throat-clearing, no buzzword stacking,
  no em dashes, no "unlock/elevate/empower/seamless/leverage").
- [ ] CTA is the shared `Button` (`variant="default"`, `size="lg"`), linking to
  `/contact` via `next/link`.
- [ ] Background gradient uses only `--color-rose`/`--color-peach`/`--color-caramel`
  blended with `--color-background`; no magenta, no two-stop hard ramp.
- [ ] `useReducedMotion()` disables the entry transform; the gradient is always
  present (it's the documented reduced-motion fallback, not decoration on top of one).
- [ ] Semantic markup: `<section>` with an `<h1>` headline (first `<h1>` on the page).
- [ ] `npm run lint` and `npm run typecheck` pass.

## Notes
Low risk: presentational, no data dependency. `public_text: true` — copy reviewed by
hand against the stop-slop TELLS list; the automated `score.mjs` only scans
`.md/.html` files so it doesn't reach JSX copy directly (a gate gap to flag for the
spine, not a reason to skip the manual pass).
