---
id: TASK-015
title: "Capability rail — GSAP pinned horizontal scroll"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-003
slice: EPIC-003-SLICE-5
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

public_text: false
handoff_required: true
handoff_type:
  - review
handoff_file: handoffs/review/HANDOFF-REVIEW-TASK-015.md
protected_paths_touched: []
files_allowed:
  - src/components/home/capability-rail.tsx
  - backlog/tasks/TASK-015.md
---

# Task: Capability rail

> **GSAP is the correct owner here.** [07-architecture-principles.md](../../project-spine/07-architecture-principles.md)
> §4 assigns "scroll-driven sequences that span multiple elements" to GSAP, not
> Framer — this is the one block in EPIC-003 that legitimately uses it.
> [12-ui-element-map.md](../../project-spine/12-ui-element-map.md) §6 risk #2 requires
> the pin to stay keyboard-reachable and degrade to a stacked list on touch/reduced
> motion — that's not optional polish, it's the acceptance bar.

## Scope
`CapabilityRail`: pins the section and scrubs three panels (Web development ·
Custom software · AI integration, per
[11-content-strategy.md](../../project-spine/11-content-strategy.md) §4) horizontally as
the user scrolls, using `gsap` + `ScrollTrigger`. Each panel deep-links to its future
`/capabilities#<anchor>` section (EPIC-006 ships the page; the anchor is a forward
link, not a bug — epic decision #4). On `prefers-reduced-motion`, touch input, or
before JS hydrates, renders the same three panels as a normal stacked vertical list —
no pin, no horizontal scrub.

## Acceptance criteria
- [ ] `ScrollTrigger` instance (and any GSAP timeline) is created in a `useEffect` and
  torn down (`.kill()`) on unmount/dependency change — no leaked instances
  (architecture principle #3).
- [ ] `useReducedMotion()` (or an explicit `matchMedia` check) gates whether the pin/
  scrub is set up at all; when disabled, the three panels render as a normal stacked
  list with no GSAP involvement.
- [ ] Panels remain reachable via keyboard (each panel's link is a normal focusable
  `<a>`/`Link` in document order; the horizontal scrub doesn't trap or skip focus).
- [ ] No Framer is used for the scroll-driven scrub itself (one-lib-per-job); Framer
  may still be used for any non-scroll hover/entry detail within a panel.
- [ ] `npm run lint` and `npm run typecheck` pass; `npm run build` green + static.

## Notes
Medium risk: GSAP/ScrollTrigger lifecycle bugs (leaked instances, scroll-jank, broken
keyboard access) are easy to introduce and hard to spot in a quick look — route via
cross-model review (`handoffs/review/HANDOFF-REVIEW-TASK-015.md`).
