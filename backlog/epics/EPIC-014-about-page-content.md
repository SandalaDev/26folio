---
id: EPIC-014
title: About page content — three-epoch timeline, bio, interests, closing CTA
status: in-progress          # ready -> in-progress -> done
phase: 5
priority: P1
risk_level: low
roadmap_ref: 09-roadmap.md
depends_on: [EPIC-004]
blocks: []
references:
  - 10-design-system.md
  - 11-content-strategy.md
  - 12-ui-element-map.md
related:
  - EPIC-013-content-phase-1.md
---

# EPIC-014 — About page content (real biography, timeline, interests, closing CTA)

The about page (EPIC-004) has shipped its structure since 2026-06-30 — hybrid
intro, sticky cards + modals, GSAP timeline, magazine section, socials — but
every word of copy inside it has been a structural placeholder, flagged
repeatedly across EPIC-004/EPIC-010/EPIC-013 as "owner-confirmed follow-up."
The owner supplied a full content blueprint (2026-07-06): a three-depth
narrative logic (skim -> scan -> dive), a three-epoch career timeline
(Foundation -> Convergence -> Awakening), a six-section "Who I Am" bio, a
"The Way I Am" interests grid, and a bottom dual-CTA band the page currently
lacks entirely. This epic fills in that content and reshapes the components
that need new anatomy to carry it (the timeline's per-epoch card shapes, the
interests modal's chip-and-reveal pattern, the new closing band) — it does not
touch tokens, page-level layout rhythm, or motion primitives outside what the
new anatomy requires.

## Non-goals

- No new design tokens or type scale changes — reuses `10-design-system.md` §2/§4.
- No real social profile URLs (`SocialLinks` stays placeholder; separate follow-up).
- No CV/resume asset — no such file exists in the repo; the "employer" path of
  the closing CTA band points at `/work` instead of a CV download until the
  owner supplies one.
- No schema/auth/billing/infra changes.

## Content source

All career facts, epoch structure, bio talking points, and interest topics come
directly from the owner's pasted content blueprint (2026-07-06) — not invented.
Prose is adapted to the site's actual voice rules (`11-content-strategy.md`
§2: Intelligent/Fun/Resourceful, first person, no corporate filler) and passes
the stop-slop gate (no em dashes, no buzzwords, no binary-contrast filler).

## Slices & tasks

### SLICE-1 — Intro & timeline (the skim + scan depths)
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-056** | `AboutIntro`: real hybrid intro (business + personal), ends with the two-column hand-off line. | low | lint + typecheck + build + slop |
| **TASK-057** | `Timeline`: restructure into three named epochs (Foundation/Convergence/Awakening), each with a sticky header + epigraph + epoch-specific card anatomy; swap the about-page grid so the timeline reads as the left ("scan") column. | medium | lint + typecheck + build + slop |

### SLICE-2 — Modals & closing CTA (the dive depth + conversion)
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-058** | `BioModal` + `StickyCard`: real six-section "Who I Am" biography; cards reordered (Who I Am first) with real teaser/CTA copy. | low | lint + typecheck + build + slop |
| **TASK-059** | `InterestsModal`: restructure from category-cards-with-placeholder-images into a grid of clickable topic chips, each revealing a real 40-80 word paragraph. | low | lint + typecheck + build + slop |
| **TASK-060** | New `DualCtaBand`: full-width closing band with two paths (clients -> `/contact`, teams -> `/work`), replacing the page's single generic `CTACallout`. | low | lint + typecheck + build + slop |

## Definition of done

- [ ] Intro reads as one opening that works as both a hiring pitch and a personal
      bio, and ends with a sentence that hands off to the two-column layout below it.
- [ ] Timeline shows three named epochs in order, each with its own epigraph and
      card anatomy; epoch headers behave as sticky dividers while their cards
      scroll past; the final ("Now") card is visually distinct (present-tense,
      pulsing accent).
- [ ] "Who I Am" modal contains the real six-section bio (~550-700 words); its
      sticky card is first in the right-column order with real teaser/CTA copy.
- [ ] "The Way I Am" modal is a grid of clickable chips, each revealing a real
      paragraph; the placeholder image boxes are gone.
- [ ] A full-width dual-CTA band closes the page with a client path and a
      teams/employer path.
- [ ] lint / typecheck / build green; slop artifacts present and >= 35/50 for
      every public-text task; in-browser verification done.
