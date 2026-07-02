---
id: EPIC-011-SLICE-1
title: Hero & header — first-viewport calibration (owner notes 1 & 2)
epic: EPIC-011
status: ready
phase: 4
risk_level: medium
design_refs: [10-design-system.md, 12-ui-element-map.md]
content_refs: [11-content-strategy.md]
skill_refs: [design-taste-frontend, framer-motion]
tasks: [TASK-043, TASK-044]
---

# SLICE-1 — Hero & header

> Owner notes 1 and 2. The hero's heavy/light h1 contrast is dropped for a single
> larger weight; the CTA and the portrait align to the h1's ends; the portrait
> grows and crops to the face. The header is confirmed fully transparent.

## Intent
Make the first viewport read as one calm, confident statement: a big single-weight
headline, with the portrait and the call to action anchored to its edges, over a
header that floats with no chrome.

## Scope / Non-goals
- **In:** `hero.tsx` recomposition; `--text-display` clamp raise in `globals.css`;
  portrait crop/size; `site-header.tsx` + `navigation-menu.tsx` + `mobile-nav.tsx`
  transparency verification.
- **Out:** hero copy (unchanged), shader background, magnetic CTA internals,
  other sections, the mobile-nav drawer styling (only the trigger's chrome, if any).

## Content and design
- h1 keeps its single display weight (token targets 650); the inline
  `font-semibold`/`font-extralight` spans are removed. Enlarge via the token clamp
  ceiling, not an ad-hoc size class.
- Alignment: the portrait + CTA sit in one row whose edges line up with the h1's
  left and right margins (the h1's block width), on desktop. Mobile collapses to
  a single column (portrait above h1, then CTA), as EPIC-010 already does.
- Portrait: larger, portrait (taller) aspect, `object-cover` + `object-position`
  bias toward the face; still blob-masked and reduced-motion safe.
- Hero guardrails from the design lane (§4.7): fits the viewport, top padding <=
  pt-24, <= 4 text elements, subtext <= 20 words (existing copy already meets this).
- Header: `bg-transparent`, no border/blur/backdrop. The lane's nav rules (one
  line desktop, height <= 80px) already hold.

## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
| [TASK-043](../../backlog/tasks/TASK-043.md) | Hero single-weight enlarged h1 + aligned CTA/portrait + larger portrait crop | medium | lint + typecheck + build + slop |
| [TASK-044](../../backlog/tasks/TASK-044.md) | Confirm/enforce transparent floating header | low | lint + typecheck + build |

## Gates
- [x] Spine references valid (10-design-system §4 type, §5 layout; 12-ui-element-map §3 hero, §2 header).
- [x] Skills selected (design lane + framer-motion for the entry stagger).
- [x] Test plan: lint/typecheck/build + in-browser hero/header check.
- [x] Protected paths declared (none).
