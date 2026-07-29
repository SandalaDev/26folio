---
id: TASK-011
title: "Shared page primitives — Section, Eyebrow, CTACallout"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-003
epic_ref: backlog/epics/EPIC-003-home-page.md
slice: EPIC-003-SLICE-1
depends_on: []
design_refs: [12-ui-element-map.md, 10-design-system.md]
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
  - src/components/site/section.tsx
  - src/components/site/eyebrow.tsx
  - src/components/site/cta-callout.tsx
  - backlog/epics/EPIC-003-home-page.md
  - backlog/tasks/TASK-011.md
progress_weight: 1
---

# Task: Shared page primitives

> **Generic, not home-specific.** [12-ui-element-map.md](../../project-spine/12-ui-element-map.md)
> §1 lists `Section`, `Eyebrow`, `CTACallout` as shared primitives "built once, used
> everywhere" — every later page epic (004–006, 008) imports these. No home-page copy
> or layout decisions belong in this task; `CTACallout`'s copy is passed in by callers.

## Scope
- `Section` — wraps children in the canonical rhythm: `py-20 md:py-28 px-6 md:px-12
  lg:px-24`, `max-w-7xl mx-auto`. Accepts `as` (defaults to `<section>`) and standard
  `className`/`children` props via `cn()`.
- `Eyebrow` — thin wrapper applying the existing `eyebrow` CSS utility
  (`src/app/globals.css`) to its children; accepts a colour className override
  (default `text-rose`).
- `CTACallout` — end-of-page conversion band per [12-ui-element-map.md](../../project-spine/12-ui-element-map.md)
  §1: heading + body copy + a single `Button` (variant `default`) linking to
  `/contact`, all passed as props (`heading`, `body`, `ctaLabel`, `href`) so each page
  epic supplies its own copy. Framer `fadeUp`/`staggerContainer` entry from
  `src/lib/motion.ts` triggered on viewport entry (`whileInView`, `viewport={{ once:
  true }}`), honouring `useReducedMotion()`.

## Acceptance criteria
- [ ] All three are RSC-safe by default; `CTACallout` is the only one needing
  `"use client"` (Framer `whileInView`).
- [ ] `Section` renders semantic `<section>` by default, hard corners inherited (no
  explicit rounding).
- [ ] `Eyebrow` renders the `eyebrow` utility class verbatim — no re-implementing the
  CSS in JS.
- [ ] `CTACallout` uses the shared `Button` from `src/components/ui/button.tsx` and
  `Link` from `next/link` for `href`.
- [ ] No copy is hardcoded in `CTACallout` — every page epic supplies its own via props.
- [ ] `npm run lint` and `npm run typecheck` pass.

## Notes
Low risk: presentational leaf components with no consumers wired in yet (TASK-013/017
compose them into the home page). `CTACallout`'s reduced-motion path renders the same
content with no transform/opacity choreography.
