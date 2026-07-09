---
id: EPIC-014-SLICE-2
title: Modals & closing CTA — the dive depth + conversion
epic: EPIC-014
status: ready
phase: 5
risk_level: low
design_refs: [10-design-system.md, 12-ui-element-map.md]
content_refs: [11-content-strategy.md]
skill_refs: [design-taste-frontend]
tasks: [TASK-058, TASK-059, TASK-060]
---

# SLICE-2 — Modals & closing CTA

## Intent
Land the third "reading depth" (the 3-5 minute dive: the two modals) and add
the conversion band the page is currently missing entirely. "Who I Am" carries
the business case and leads; "The Way I Am" is the personality layer and
follows. Per the blueprint's core rule: the timeline states facts, the bio
states meaning — these sections give the *why* behind the timeline's *what*.

## Scope / Non-goals
- **In:** `bio-modal.tsx` (six-section biography), `sticky-card.tsx` (card
  reorder + new teaser/cta copy + an optional `cta` line prop), `interests-
  modal.tsx` (chip-and-reveal restructure, placeholder image boxes removed), a
  new `dual-cta-band.tsx` component, and swapping the about page's closing
  `CTACallout` for it.
- **Out:** real social profile URLs (separate follow-up, `social-links.tsx`
  untouched), any CV/resume asset (none exists; the teams/employer CTA path
  points at `/work` instead).

## Content and design
- Bio: six sections per the blueprint (opening hook, design roots, telecom
  chapter, the turn, how I work, the close), ~550-700 words total, first
  person, no em dashes/buzzwords (stop-slop gate).
- Sticky cards: "Who I am" first, "The way I am" second (blueprint's
  recommended swap — the business case leads), each with a one-line teaser and
  a short CTA-style affordance line ("Read the full story" / "Poke around").
- Interests modal: a grid of 5-6 clickable topic chips (The Design Gene, The
  Systems Brain, What I Read/Watch/Play, Off the Clock, The Tools I Love,
  Zambia and Home), each revealing a 40-80 word paragraph specific enough to be
  unfakeable, on click/tap — no placeholder image boxes.
- Closing band: full-width, two paths — clients ("Have a product in mind?" ->
  `/contact`) and teams/employers ("Looking for the formal version?" -> `/work`,
  standing in for a CV download until one exists).

## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
| [TASK-058](../../backlog/tasks/TASK-058.md) | Real "Who I Am" bio + card reorder/copy | low | lint + typecheck + build + slop |
| [TASK-059](../../backlog/tasks/TASK-059.md) | "The Way I Am" chip-and-reveal restructure | low | lint + typecheck + build + slop |
| [TASK-060](../../backlog/tasks/TASK-060.md) | New dual-CTA closing band | low | lint + typecheck + build + slop |

## Gates
- [x] Spine references valid (11-content-strategy §4 About page #2a; 12-ui-element-map §3 About #2a).
- [x] Skills selected (design lane).
- [x] Test plan: lint/typecheck/build + slop + in-browser modal/click check.
- [x] Protected paths declared (none).
