---
id: EPIC-020
title: Hero + typography harmonization (project-wide, to the-way-i-am)
status: done
phase: 5
priority: P1
risk_level: low
roadmap_ref: 09-roadmap.md
depends_on: [EPIC-016, EPIC-018, EPIC-019]
blocks: []
references:
  - 10-design-system.md
  - 12-ui-element-map.md
related:
  - EPIC-016-the-way-i-am-page.md
roadmap_refs: [ROAD-003]
goal_refs: [GOAL-001, GOAL-002, GOAL-003, GOAL-004]
progress_weight: 1
---

# EPIC-020 — Hero + typography harmonization

Owner brief (2026-07-21): after the /about/the-way-i-am improvements, the
rest of the project reads as if it has drifted from the design. Bring every
page's first screen and typography back in line with that page.

1. **Heroes.** Every page hero follows the /about/the-way-i-am hero layout:
   a centered editorial-manifesto opener (centered display-gradient h1 over
   a centered, measured supporting column), not the left-aligned asymmetric
   heroes home/about/work/capabilities/contact currently use.
2. **Typography.** Align the rest of the project's type to the-way-i-am:
   the display-gradient h1 signature, the `text-heading` h2 system, and the
   measured muted body, applied consistently. Fix outliers (e.g. the case
   study title dropped the display gradient).

## Design read

Redesign-preserve. Personal engineer/designer portfolio, editorial dark-tech
language (espresso dark, rose/amber/peach accents, Clash Display, hard
corners). The reference (WayHero) is already the exemplar; this epic pulls
the other openers to the same centered manifesto and locks the pattern into
a shared component so the site stops drifting. Dials match existing
(variance ~7, motion ~5, density ~4).

## Non-goals

- No copy rewrites (owner-approved page copy stays); no new fonts/tokens;
  no route/IA changes; no schema/auth/infra.
- The-way-i-am hero (the reference) is not changed.

## Slices & tasks

### SLICE-1 — Shared centered hero + type alignment
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-078** | Shared PageHero (centered manifesto); center home/about/work/capabilities/contact; type outliers | low | lint + typecheck + build + slop + in-browser |

## Definition of done

- [ ] A shared `PageHero` renders the centered manifesto opener.
- [ ] Home, about, work, capabilities, contact heroes are centered and
      match the-way-i-am's composition.
- [ ] h1 (display-gradient) and h2 (`text-heading`) treatments consistent
      project-wide; case-study title uses the display gradient.
- [ ] lint / typecheck / build green; slop >= 35/50 on changed src files;
      in-browser verification of every hero at desktop and mobile.
