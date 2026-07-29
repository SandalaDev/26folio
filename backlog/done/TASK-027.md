---
id: TASK-027
title: "useTabbedContent — headless tab primitive"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-006
epic_ref: backlog/epics/EPIC-006-capabilities-page.md
slice: EPIC-006-SLICE-1
depends_on: []
design_refs: [12-ui-element-map.md]
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
  - src/lib/use-tabbed-content.ts
  - backlog/tasks/TASK-027.md
progress_weight: 1
---

# Task: useTabbedContent

> **One primitive, two skins** (epic decision #2, ui-element-map §6 decision #4).
> Build this before `ServiceTabs`/`ProcessSteps` so they share one implementation
> instead of forking.

## Scope
`useTabbedContent(items, options?)`: headless hook taking a list of tab ids and
returning everything a skin needs to render real ARIA tabs — active id/index,
a setter, and pre-wired prop-getters (`getTabListProps`, `getTabProps(id)`,
`getTabPanelProps(id)`) that supply `role`, `id`, `aria-selected`,
`aria-controls`/`aria-labelledby`, and `tabIndex` (roving tabindex pattern).
Arrow-key navigation (`orientation: "horizontal" | "vertical"`, default
horizontal) moves focus + selection between tabs; `Home`/`End` jump to
first/last. Accepts an optional `initialId` so a caller can pre-select a tab
(e.g. from a URL hash).

## Acceptance criteria
- [ ] No visual/CSS opinion in this file — purely behavioural/ARIA wiring.
- [ ] Roving tabindex: only the active tab has `tabIndex={0}`, others `-1`.
- [ ] Arrow keys move both focus and selection (per the WAI-ARIA tabs pattern);
  `Home`/`End` work.
- [ ] `aria-controls` on each tab matches its panel's `id`; each panel has
  `aria-labelledby` pointing back at its tab.
- [ ] `npm run lint` and `npm run typecheck` pass.

## Notes
Low risk: pure behavioural hook, no DOM side effects beyond what the consuming
component's refs/handlers do.
