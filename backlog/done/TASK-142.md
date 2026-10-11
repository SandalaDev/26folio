---
id: TASK-142
title: Reconcile the spine
status: done
priority: P1
risk_level: low
epic_ref: EPIC-029
progress_weight: 1
depends_on:
  - TASK-140
files_allowed:
  - project-spine/10-design-system.md
  - project-spine/11-content-strategy.md
  - project-spine/12-ui-element-map.md
skill_refs:
  - writing-style
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
started_at: 2026-10-09T23:45:27Z
completed_at: 2026-10-09T23:46:31Z
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

- [x] The spine no longer contradicts the shipped work section.

## Dependency Evidence

- plan: none

## Testing

- recommendation: none
- rationale: Documentation.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.

## Result (2026-10-10)

- `10-design-system.md` §9: site imagery versus artefact imagery and the
  `ArtefactPlate`; the AI-imagery rule; the preview-video rules and budget.
- `11-content-strategy.md` §4 `/work`: replaced the v1 "no deep dives" rule
  with EPIC-029's strategy (role, order, credit labels, cards, page depth, page
  ending, the never list). §4 `/capabilities` notes the new design service.
  §5 inventory: project copy drafted and awaiting approval; testimonials,
  metrics and client logos excluded.
- `12-ui-element-map.md`: `/work` grid row updated; new `/work/[slug]` table
  (composition, hero, artefact blocks, capability link, CTA).

Left as intent, not edited: design system §10 says reduced motion is honoured
everywhere. That is the rule; the site currently breaks it (headings stay at
opacity 0), which is filed as a separate task rather than written into the spine.
