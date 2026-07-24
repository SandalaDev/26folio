---
id: EPIC-021
title: Capabilities page repositioning — engineering partner, capability explorer
status: in-progress
phase: 5
priority: P1
risk_level: medium
roadmap_ref: 09-roadmap.md
depends_on: [EPIC-006, EPIC-010, EPIC-020]
blocks: []
references:
  - 11-content-strategy.md
  - 12-ui-element-map.md
  - 10-design-system.md
related:
  - EPIC-006-capabilities-page.md
---

# EPIC-021 — Capabilities page repositioning

Owner brief (2026-07-24): rebuild /capabilities from the two market-research
reports + relationship-pricing doc into the most convincing page on the
portfolio — engineering partner positioning, interactive exploration over
card walls, premium and specific, no buzzwords. Owner decisions in chat:
**global market focus** (creators / agencies / operators), **straight to
code**. Full synthesis and copy source:
[Capabilities.md](../../planning/content/page-copy/Capabilities.md).

What changes, concretely:

1. **Positioning.** From "what I can do for you" service list to an
   engineering-partner narrative: systems and outcomes, ownership as the
   differentiator, AI as leverage not headline.
2. **Taxonomy.** Five draft services collapse into four researched pillars:
   Platforms you own · Operations systems · Automation & applied AI ·
   Data & integrations. services.ts stays the single source; the home
   CapabilityRail follows by construction.
3. **Page.** ServiceTabs → a progressive-disclosure capability explorer;
   ProcessSteps' transactional stages → the Build/Evolve engagement model
   with the ownership guarantee; TechGrid demoted to proof layer; hero and
   CTA patterns kept.

## Design read

Redesign-preserve. Editorial dark-tech language (espresso dark, rose/amber/
peach accents, Clash Display, hard corners) is the fixed frame; this epic
changes what the page says and how it discloses, not the design system.
Explorer = disclosure rows with height-reveal (EPIC-018 bookshelf
precedent), house motion only (fadeUp/stagger, EASE_OUT, reduced-motion
gated). Dials match existing (variance ~7, motion ~5, density ~4).

## Non-goals

- No numeric pricing on the page (owner decision pending; structure must
  support adding ranges later).
- No route/IA changes beyond /capabilities content; no schema/auth/infra;
  no new fonts/tokens; no contact-form changes.
- No Zambia-led positioning (global focus per owner; local capabilities
  fold into the pillars).

## Slices & tasks

### SLICE-1 — Content layer + page rebuild
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-079** | Pillar content layer: services.ts → four-pillar schema + final copy (stop-slop); home rail coherent | medium | lint + typecheck + build + slop |
| **TASK-080** | Page rebuild: capability explorer, why-one-engineer strip, Build/Evolve engagement section, TechGrid demotion, CTA | medium | lint + typecheck + build + slop + in-browser |

## Definition of done

- [ ] /capabilities renders: hero → capability explorer (4 pillars,
      progressive disclosure, ARIA + keyboard + reduced-motion safe) →
      why-one-engineer strip → Build/Evolve engagement model with
      ownership guarantee → technologies → CTA.
- [ ] services.ts carries the four-pillar taxonomy as the single source;
      home CapabilityRail renders four coherent cards; /capabilities#<id>
      anchors resolve; no stray references to retired service ids.
- [ ] Copy is final via stop-slop (>= 35/50 recomputed by the gate);
      no buzzwords per the brief's banned list.
- [ ] lint / typecheck / build green; in-browser verification desktop +
      mobile (explorer open/close, anchors, no overflow, zero console
      errors).
