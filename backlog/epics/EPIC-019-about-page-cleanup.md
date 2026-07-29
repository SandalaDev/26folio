---
id: EPIC-019
title: About page cleanup — card copy, modal epigraph, timeline epoch watermarks
status: done
phase: 5
priority: P1
risk_level: low
roadmap_ref: 09-roadmap.md
depends_on: [EPIC-014, EPIC-015, EPIC-017]
blocks: []
references:
  - 10-design-system.md
  - 12-ui-element-map.md
related:
  - EPIC-015-about-page-copy.md
  - EPIC-017-who-i-am-modal-redesign.md
roadmap_refs: [ROAD-003]
goal_refs: [GOAL-001, GOAL-002, GOAL-003, GOAL-004]
progress_weight: 1
---

# EPIC-019 — About page cleanup

Owner brief (2026-07-21, root `prompt.md`). Polish pass on `/about`: the two
sticky cards, the "Who I am" modal epigraph, and the timeline epoch header
icons. No structural rework, no copy rewrites beyond the owner's supplied
lines.

1. **Who I am modal** — replace the epigraph tagline with the owner's chosen
   quote ("There's no knowledge that is not power. ~ Ultimate Mortal
   Kombat 3").
2. **About cards** — new description + CTA on both the "Who I am" and
   "The way I am" cards.
3. **Timeline epoch headers** — the small cycling tool icon becomes a large
   watermark filling the header height behind the text (the tool name stays
   legible and clear of the copy). Foundation, Convergence and Awakening
   icon sets updated with the owner's `public/icons/` marks.

## Non-goals

- No biography copy changes; no timeline beat/copy changes.
- No new design tokens, fonts, or dependencies; no schema/auth/infra.
- No route or layout restructure on /about.

## Slices & tasks

### SLICE-1 — Copy + timeline watermarks
| Task | Title | risk | proof |
|---|---|---|---|
| **TASK-076** | Card copy, modal epigraph, epoch icon watermarks | low | lint + typecheck + build + slop + in-browser |

## Definition of done

- [ ] Modal epigraph reads the owner's quote.
- [ ] Both cards carry the new description + CTA.
- [ ] Each epoch header shows a large cycling icon watermark behind the
      text with a legible, non-overlapping tool name; icon sets updated.
- [ ] lint / typecheck / build green; slop >= 35/50 on changed src files;
      in-browser verification.
