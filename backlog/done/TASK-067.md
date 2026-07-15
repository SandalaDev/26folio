---
id: TASK-067
title: "BioModal motion layer: chapter rail, parallax, watermark, reveals"
status: ready
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-017
slice: EPIC-017-SLICE-1
depends_on: [TASK-066]
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, framer-motion, stop-slop]

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
handoff_file: ""
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode."
protected_paths_touched: []
files_allowed:
  - src/components/about/bio-modal.tsx
  - src/components/about/who-i-am/
  - src/lib/who-i-am.ts
  - src/app/(site)/about/page.tsx
  - planning/content/.slop/
  - planning/slices/EPIC-017-SLICE-1.md
  - backlog/tasks/TASK-066.md
  - backlog/tasks/TASK-067.md
---

# Task: Motion layer for the chaptered reader

> Owner (2026-07-15): break the long read into parts and navigate the story
> with tasteful motion — parallax scroll or an equivalent scroll-linked
> technique; explore a low-transparency logo-symbol watermark.

## Scope

1. Scroll wiring: `useScroll` bound to the modal's scroll container;
   progress rendered on the chapter rail (lg+) and the mobile hairline.
2. Chapter rail interactivity: IntersectionObserver active-chapter state
   (EpochNav marker language), click-to-jump smooth scroll.
3. Parallax: oversized epoch numerals and the logo-symbol watermark
   (CSS-mask tinted, ~3–6% opacity) drift slower than the text via
   `useTransform`; offsets stay subtle (tens of px).
4. Reveal choreography: chapter title/lede reveal on viewport entry;
   modal entrance stagger on open.
5. Reduced-motion + performance: every effect behind `useReducedMotion` /
   `motion-reduce`; transform/opacity only; EASE_OUT + DURATION from
   `src/lib/motion`. Framer Motion only — if any technique truly requires
   GSAP, record the justification here before adding it.

## Acceptance criteria
- [ ] Rail highlights the current chapter while scrolling; click jumps to
      the chapter; progress indicator fills correctly end to end.
- [ ] Parallax numerals + watermark visible but recessive; no jank
      (transform/opacity only, no layout thrash on scroll).
- [ ] Reduced-motion collapses all choreography to static; content and
      navigation still fully usable.
- [ ] Dialog a11y intact after the motion layer (focus trap, Esc, overlay).
- [ ] lint / typecheck / build green; slop >= 35/50 on changed src files;
      in-browser verification at desktop + 375px, including a
      reduced-motion pass.
