---
id: EPIC-027
title: "About page: collections wishlist refresh and Who I Am modal fix"
status: done
priority: P2
roadmap_refs: []
goal_refs: [GOAL-001]
progress_weight: 1
---
# Epic: About page: collections wishlist refresh and Who I Am modal fix

Owner brief delivered in full in chat on 2026-10-05 (Cline Desktop, Kimi K3):
all section copy and hover lines are final owner copy, to be inserted exactly
as supplied. This is a content and collection update, not a redesign — the
existing wishlist architecture, components, styling and image handling are
reused unchanged.

## Outcome

The Collections section of /about/the-way-i-am reads as what it actually is:
the current state of Abe's wishlists as of October 2026, in his voice. The
audiophile list becomes the Audiophile Gear Wishlist (10 items) and the studio
list becomes the Studio Wishlist (20 items) with its own personal introduction;
the "Who I Am" modal close button reliably closes the modal on every layout.

## Scope

- Collections intro gains the owner's ADHD sentence and the October 2026
  wishlist-state sentence, verbatim.
- Audiophile gear → "Audiophile Gear Wishlist": exactly Sennheiser HD 800 S,
  Meze Arta, Sennheiser HDB 630, Dan Clark Audio Noire X (moved from Studio),
  Status Pro X GoldenSound Edition, Lynx Hilo 2, Topping DX9, MOON 371,
  Focal Sopra No.2, JL Audio Fathom F113v2 — in that order, with the owner's
  hover lines.
- "Dream home music studio" → "Studio Wishlist": the owner's 20-item list and
  introduction, verbatim; LEWITT L6 moves in from the audiophile list.
- Removed outright: Focal Clear MG, 64 Audio U4s, Thieaudio Hype 4,
  RME ADI-2 DAC FS, Eversolo DMP-A6, KEF KC92, KEF R7 Meta, SteelSeries
  Arctis Nova Elite (not in the owner's final ten). Their collection-specific
  images are deleted; moved items reuse their existing image references.
- The "Who I Am" modal close button is fixed with the smallest possible
  change; no visual redesign.

## Tasks

- [x] TASK-121 — Refresh Collections wishlists and fix the Who I Am modal close

## Dependency / Architecture Evidence

- plan: none

No new packages. New product images were supplied by the owner in
`public/images/about/wishlist/audiophile/` ahead of the brief and are served
through the existing `next/image` mechanism.

## Testing

- recommendation: with-task (TASK-121)
- rationale: The repository has no application test suite (`npm test` exits 1),
  and the risk here is editorial and interaction-level, not logical: wrong or
  reworded copy, dead image references, a broken render, and the modal close
  regression. TASK-121 covers these with the portfolio's standing checks
  (lint, strict typecheck, production build), a rendered-page inspection, an
  explicit content validation pass against the owner's final lists, and a
  diff review for unrelated changes. A dedicated test task would buy nothing
  for static data + one CSS stacking fix.
