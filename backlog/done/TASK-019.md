---
id: TASK-019
title: "AboutIntro — hybrid business/personal opening"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-004
epic_ref: backlog/epics/EPIC-004-about-page.md
slice: EPIC-004-SLICE-2
depends_on: [TASK-018]
design_refs: [12-ui-element-map.md, 11-content-strategy.md]
skill_refs: [design-taste-frontend, impeccable]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: false
handoff_required: false
handoff_type: []
protected_paths_touched: []
files_allowed:
  - src/components/about/about-intro.tsx
  - backlog/tasks/TASK-019.md
progress_weight: 1
---

# Task: AboutIntro

> **Placeholder, not invented biography (epic decision #1).** The content outline
> calls for "one opening that earns trust and shows personality" — readable as both
> a business intro and a personal one. No spine document records Abe's actual
> personal facts, so this ships structurally complete placeholder copy, clearly not
> final, rather than guessed specifics dressed up to look real.

## Scope
`AboutIntro`: a single opening section, `<h1>` (first on `/about`) + 1-2 paragraphs,
`FlashlightCursor` mounted behind the content, Framer fade-up entry honouring
`useReducedMotion()`.

## Acceptance criteria
- [ ] `<h1>` is the first heading on the page.
- [ ] `FlashlightCursor` is mounted once, behind the text content (`z-0`), and text
  remains fully legible/contrast-safe regardless of pointer position.
- [ ] Copy is placeholder-quality but structurally complete (right length, right
  tone register) — not a single generic filler sentence and not invented specifics
  presented as fact.
- [ ] `npm run lint` and `npm run typecheck` pass.

## Notes
Low risk: presentational, no data dependency. `public_text: false` — explicitly not
ready to ship; STATE.json carries this forward as owner-input-needed.
