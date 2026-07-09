---
id: EPIC-010-SLICE-2
title: Hero — blob-masked portrait + asymmetric recomposition
epic: EPIC-010
status: ready
phase: 4
risk_level: medium
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, framer-motion]
tasks: [TASK-040]
---

# SLICE-2 — Hero

> The hero keeps its EPIC-009 machinery (shader background, magnetic CTA) and
> gains the owner's portrait in a morphing blob mask, small and deliberately
> third in the visual hierarchy, inside an asymmetric composition that uses the
> new full-viewport width.

## Intent
Put a human face on the brand without letting it dominate: h1 (heavy/light
contrast) → subhead + CTA → portrait.

## Scope / Non-goals
- **In:** `hero.tsx` recomposition; `public/images/portrait.png` via next/image
  in a blob mask (SLICE-1 utilities); a soft `Blob` echo behind it.
- **Out:** hero copy (unchanged), shader/CTA internals, other sections.

## Content and design
Hero stack stays ≤ 4 text elements (h1, subhead, CTA); portrait is a visual, alt
"Abe Sandala". Blob mask uses the §Blob-motif rules; morph pauses under
`prefers-reduced-motion`. Desktop: content left, portrait offset right below the
midline, ~200px. Mobile: portrait small (~120px) above the h1.

## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
| [TASK-040](../../backlog/tasks/TASK-040.md) | Portrait + hero layout | medium | lint + typecheck + build |

## Gates
- [x] Spine references valid.
- [x] Skills selected (design lane + framer-motion).
- [x] Test plan: lint/typecheck/build + hierarchy check in-browser.
- [x] Protected paths declared (none).
