---
id: TASK-031
title: "Assemble /capabilities"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-006
slice: EPIC-006-SLICE-5
depends_on: [TASK-028, TASK-029, TASK-030]
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
  - src/app/(site)/capabilities/page.tsx
  - backlog/tasks/TASK-031.md
---

# Task: Assemble `/capabilities`

## Scope
Compose `ServiceTabs` → `TechnologiesSection` → `ProcessSteps` →
`CTACallout` ("Request a proposal & quote" → `/contact`, per
[11-content-strategy.md](../../project-spine/11-content-strategy.md) §3).

## Acceptance criteria
- [ ] `force-static` preserved.
- [ ] EPIC-003's `CapabilityRail` anchors (`/capabilities#web-development` etc.)
  resolve to this page and pre-select the matching `ServiceTabs` tab.
- [ ] `npm run lint`, `npm run typecheck` pass; `npm run build` green and
  `/capabilities` is prerendered static.

## Notes
Low risk: pure composition. Manually verify in-browser that the home page's
Capability Rail links land on the correct tab.
