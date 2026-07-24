---
id: TASK-079
title: "Four-pillar services content layer: services.ts schema + final copy; home rail coherent"
status: in-progress
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-021
slice: EPIC-021-SLICE-1
depends_on: []
design_refs: [11-content-strategy.md, 10-design-system.md]
skill_refs: [design-taste-frontend, stop-slop]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: true
handoff_required: false
handoff_type: []
handoff_file: ""
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode."
protected_paths_touched: []
files_allowed:
  - src/lib/
  - src/components/
  - planning/content/
  - planning/slices/EPIC-021-SLICE-1.md
  - backlog/tasks/TASK-079.md
---

# Task: Four-pillar content layer

> Strategy + copy source: planning/content/page-copy/Capabilities.md.
> Owner decisions: global market focus; no pricing numbers on page.

## Plan

- Rewrite `src/lib/services.ts`: four pillars (`platforms`, `operations`,
  `automation`, `data`) with the explorer panel schema (description,
  audience, problem, builds[], replaces[], anchor line, icon). Module
  stays pure data; `serviceIds` export kept.
- Update `ServiceIcon` union + the home CapabilityRail icon map to the
  four pillar icons.
- Draft all public copy from the strategy doc; run stop-slop and
  pre-generate artifacts (gate recomputes, threshold 35/50).
- Grep and fix any references to retired ids (web-development,
  custom-software, ai-integration, mobile-payments, e-commerce).

## Notes

- The rail consumes this module — after the rewrite the home page must
  still typecheck/build and render four cards.
- Banned-language list from the brief applies (no "cutting-edge",
  "revolutionary", "leveraging", "digital transformation", etc.).
