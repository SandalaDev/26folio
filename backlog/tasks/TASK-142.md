---
id: TASK-142
title: "Reconcile the spine"
status: ready
priority: P1
risk_level: low
epic_ref: EPIC-029
progress_weight: 1
depends_on: [TASK-140]
files_allowed:
  - project-spine/10-design-system.md
  - project-spine/11-content-strategy.md
  - project-spine/12-ui-element-map.md
skill_refs: [writing-style]
parallel:
  suitable: true
  reason: Docs only.
  dependencies: []
  result: null
testing:
  recommendation: none
  reason: Documentation.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---

# Task: Reconcile the spine

## Scope

1. Content strategy section 4 `/work`: replace the v1 rule with EPIC-029's
   content strategy (credit labels, depth, order, page ending, no years).
2. Design system section 9: artefact imagery on ArtefactPlate; AI imagery
   allowed with no visible watermark and never as the artwork itself.
3. UI element map: work blocks, video preview.
4. Note the new design capability.

## Acceptance Criteria

- [ ] The spine no longer contradicts the shipped work section.

## Dependency Evidence

- plan: none

## Testing

- recommendation: none
- rationale: Documentation.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.
