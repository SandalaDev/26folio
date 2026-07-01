---
id: TASK-030
title: "ProcessSteps — engagement process section"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-006
slice: EPIC-006-SLICE-4
depends_on: [TASK-027]
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
  - src/components/capabilities/process-steps.tsx
  - backlog/tasks/TASK-030.md
---

# Task: ProcessSteps

> **Stages are already decided** — [12-ui-element-map.md](../../project-spine/12-ui-element-map.md)
> §3 `/capabilities` #3: inquiry → signed contract + down payment → delivery →
> handover. This task writes short, generic step descriptions (what each stage
> involves, not personal claims about Abe's history) and ports the stage order.

## Scope
`ProcessSteps`: horizontal icon-tab skin of `useTabbedContent` (`orientation:
"horizontal"`), one tab per stage — **Inquiry**, **Contract & deposit**,
**Delivery**, **Handover** — Framer step-content swap on selection.

## Acceptance criteria
- [ ] Four stages, in the documented order, built on `useTabbedContent` (not a
  fork).
- [ ] Step copy describes what happens at that stage generically (e.g. "Contract &
  deposit: we agree scope and terms in writing before work starts") — no invented
  specifics about past engagements.
- [ ] `npm run lint` and `npm run typecheck` pass.

## Notes
Low risk: content-driven, same primitive as `ServiceTabs`, no GSAP.
