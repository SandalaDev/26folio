---
id: EPIC-016
title: The Way I Am — dedicated page (museum walk, modal retired)
status: done
phase: 5
priority: P1
risk_level: medium
roadmap_ref: 09-roadmap.md
depends_on: [EPIC-014, EPIC-015]
blocks: []
references:
  - 10-design-system.md
  - 11-content-strategy.md
  - 12-ui-element-map.md
related:
  - EPIC-014-about-page-content.md
  - EPIC-015-about-page-copy.md
roadmap_refs: [ROAD-003]
goal_refs: [GOAL-001, GOAL-002, GOAL-003, GOAL-004]
progress_weight: 1
---

# EPIC-016 — "The Way I Am" as a first-class page

The owner's brief (2026-07-15, `planning/content/page-copy/TheWay.md` +
prompt): promote "The Way I Am" from an about-page modal to a dedicated page
with its own URL, navigation, transitions and identity. The page should read
as a walk through a curated personal museum, not an About tab: editorial,
premium, tactile, calm confidence over loud animation. The agent holds full
creative control on design within the existing design system (warm espresso
dark, rose/caramel/peach accents, Clash Display/General Sans, hard corners).

## Scope

- New route `/about/the-way-i-am` (App Router, force-static).
- Sections: Hero, Curiosity (interactive two-column knowledge table), Hobbies,
  Music (album wall + artist chips + now-playing card), Creative Practice,
  Collections (display shelves), Principles (large editorial type cards),
  Sources of Inspiration (virtual bookshelf with expanding editorial spreads),
  closing "Let's Build Something" CTA.
- Navigation: persistent back link to About, previous/next pager between
  "Who I Am" and "The Way I Am", scroll progress indicator, floating table of
  contents highlighting the current section.
- Motion: Framer Motion scroll-linked reveals, soft parallax, pointer-reactive
  cards; every effect honors `prefers-reduced-motion`; 60fps budget
  (transform/opacity only).
- Retire the modal: delete `InterestsModal`, repoint the about-page card at
  the new route.

## Non-goals

- No album artwork downloads (covers stay typographic tiles until the owner
  supplies licensed art in `public/images/albums/`).
- No new design tokens; no schema/auth/billing/infra changes.
- "Who I Am" stays a modal on /about; only its pager slot references it here.

## Slices & tasks

### SLICE-1 — The page and the modal retirement
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-064** | Build `/about/the-way-i-am`: content data module + nine sections + nav/progress/TOC + motion | medium | lint + typecheck + build + slop + in-browser |
| **TASK-065** | About page integration: sticky card links to the route (no Dialog), `InterestsModal` deleted | low | same |

## Definition of done

- [x] Route renders all nine sections with the owner's real content.
- [x] Modal logic removed; about-page card navigates to the page.
- [x] Back nav, pager, progress indicator and floating TOC all work.
- [x] Reduced-motion path verified; animations transform/opacity only.
- [x] lint / typecheck / build green; slop >= 35/50 on changed src files;
      in-browser verification at desktop and mobile widths (DOM-level; see
      TASK-064's verified note on the hidden-pane screenshot quirk).

Done on feature/EPIC-016, 2026-07-15. Pending: owner eyeballs the page in a
visible browser (museum feel is a taste call) and supplies album artwork
for public/images/albums/ if the typographic sleeves shouldn't stay.
