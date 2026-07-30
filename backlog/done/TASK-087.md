---
id: TASK-087
title: "Validate responsive motion, accessibility, and content migration"
status: done
priority: P1
risk_level: high
epic_ref: backlog/epics/EPIC-023.md
depends_on: [TASK-084, TASK-085, TASK-086]
progress_weight: 1
files_allowed:
  - backlog/
  - src/app/(site)/capabilities/
  - src/components/capabilities/
  - src/lib/capabilities.ts
  - src/lib/services.ts
  - capabilities-services-page-copy.md
skill_refs: [ds-test-planner, writing-style, stop-slop]
---
# Task: Validate responsive motion, accessibility, and content migration

## Scope

Validate the completed page in code and a real browser across desktop, mobile,
keyboard, reduced-motion, and no-hover conditions; confirm the source content
has been integrated before deleting the untracked brief.

## Acceptance Criteria

- [x] Lint, strict TypeScript, and the production build results are recorded.
- [x] Desktop and mobile layouts remain readable with no overflow or hidden content.
- [x] Keyboard interaction and focus visibility work for services, technologies, and FAQs.
- [x] Reduced motion disables timed, scrubbed, and ambient choreography without removing content.
- [x] Every configured colored SVG resolves and missing-icon fallbacks are intact.
- [x] Source sections are accounted for; the untracked brief is then deleted as requested.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: This is the epic's dedicated validation task; its purpose is to
  execute and record the focused automated and browser checks.

## Notes

The user explicitly requested deletion of
`capabilities-services-page-copy.md` after implementation. It is never staged.

Validation passed: ESLint, strict TypeScript, production build, and all 13
generated routes. Browser review covered desktop and 375px mobile layouts,
service and technology anchors, category selection, FAQ disclosure, focus
visibility, image loading, and document overflow. The configured icon audit
found 41 supplied SVG paths and zero missing files. Motion code gates GSAP
timelines, timed category swaps, and Framer entrances with reduced-motion
checks; content renders in its final state when choreography is disabled.

The source brief was compared against the typed model and rendered section
outline, then deleted untracked as requested.
