---
id: EPIC-014-SLICE-1
title: Intro & timeline — the skim + scan depths
epic: EPIC-014
status: ready
phase: 5
risk_level: low
design_refs: [10-design-system.md, 12-ui-element-map.md]
content_refs: [11-content-strategy.md]
skill_refs: [design-taste-frontend]
tasks: [TASK-056, TASK-057]
---

# SLICE-1 — Intro & timeline

## Intent
Land the first two "reading depths" from the owner's content blueprint: a
10-second skim (the intro passage) and a 60-second scan (the timeline). The
intro must work simultaneously as a business pitch and a personal bio, and end
with a line that hands off to the two-column layout below it. The timeline
turns a career history into a three-movement story (curiosity ->
dissatisfaction/yearning -> intellectual fulfillment) using named epochs, not a
flat list of milestones.

## Scope / Non-goals
- **In:** `about-intro.tsx` copy; `timeline.tsx` full restructure (epoch data,
  per-epoch card anatomy, sticky epoch headers, the "current" treatment on the
  final card); the about page's grid order (timeline moves to the left column).
- **Out:** the two sticky cards' own copy (SLICE-2), the closing CTA (SLICE-2),
  any new design tokens.

## Content and design
- Intro: Variation C from the blueprint (business + personal hybrid), adapted
  to the site's actual voice rules (no em dashes, no buzzwords) — ends with
  "The short version of how I got here is on the left. The longer, more human
  version is on the right," which only makes sense once the grid is reordered.
- Timeline: one intro paragraph ("How I Became a Web Systems Developer") above
  three epoch sections (Foundation, Convergence, Awakening), each with a
  sticky-positioned header (numeral + title + tagline + epigraph) and its own
  card anatomy per the blueprint (single-role cards / dual-track split cards /
  milestone cards). GSAP ScrollTrigger reveal-on-scroll is kept, just retargeted
  at every card across all three epochs. The final Awakening card ("Now") gets
  a visibly different treatment (rose border + pulsing dot) since it is the one
  card without an ending.

## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
| [TASK-056](../../backlog/tasks/TASK-056.md) | Real hybrid intro copy | low | lint + typecheck + build + slop |
| [TASK-057](../../backlog/tasks/TASK-057.md) | Three-epoch timeline restructure + grid reorder | medium | lint + typecheck + build + slop |

## Gates
- [x] Spine references valid (11-content-strategy §4 About page; 12-ui-element-map §3 About #1/#2b).
- [x] Skills selected (design lane).
- [x] Test plan: lint/typecheck/build + slop + in-browser scroll check.
- [x] Protected paths declared (none).
