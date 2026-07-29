---
id: EPIC-013
title: Content phase 1 — real brand + content assets replacing placeholders
status: done
                              # SLICE-1/TASK-055 done; later slices unscoped, epic stays open
phase: 5
priority: P1
risk_level: low
roadmap_ref: 09-roadmap.md
depends_on: [EPIC-012]
blocks: []
references:
  - 10-design-system.md
  - 11-content-strategy.md
  - 12-ui-element-map.md
related:
  - 09-roadmap.md
roadmap_refs: [ROAD-003]
goal_refs: [GOAL-001, GOAL-002, GOAL-003, GOAL-004]
progress_weight: 1
---

# EPIC-013 — Content phase 1 (real assets replacing placeholders)

The design system is fidelity-complete as of EPIC-012 (pending owner review/merge
to dev). This epic starts working through the "owner-confirmed follow-up" backlog
accumulated across EPIC-004/005/006/010/011/012: real brand assets and real copy
replacing neutral drafts and placeholders — without touching layout, motion, or
tokens established by prior epics.

## Non-goals

- No new design tokens, layout recomposition, or motion primitives — this epic
  *fills in* content, it does not restyle.
- No schema/auth/billing/infra changes.

## Slices & tasks

### SLICE-1 — Brand mark rollout
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-055** | Apply the real logo SVGs (`public/images/logo/`) to `SiteHeader` and `SiteFooter`, replacing the text-only "Sandala" wordmark; pick color/mark variant for a subtle, low-contrast read in each chrome context. | low | lint + typecheck + build |

## Backlog for later slices (not yet scoped into tasks — needs owner input first)

Carried over from STATE.json `completion.remaining`, still open as of 2026-07-05:
- Real biography/interests/timeline/social URLs (EPIC-004 follow-up).
- Full real project list + confirmed descriptors for Provision Finance / OK
  Pharmacy (EPIC-005/EPIC-010 follow-up); `src/lib/projects.ts`.
- TechGrid real-but-partial stack list confirmation (EPIC-006 follow-up).
- Real contact email for the contact-details block (`src/lib/site-config`-style
  constant, not schema); Resend delivery wiring is its own future epic.
- New services copy confirmation (`src/lib/services.ts`: mobile-payments,
  e-commerce item lists).

## Definition of done (this epic's first slice)

- [ ] Header and footer both render the real logo (no more literal "Sandala"
      text-only wordmark) at a size and color that reads as subtle/low-contrast
      chrome, not a loud brand stamp.
- [ ] No layout shift/regression in nav, mobile nav, or footer columns.
- [ ] lint / typecheck / build green.
