---
id: TASK-084
title: "Structure the capabilities narrative and content model"
status: done
priority: P1
risk_level: medium
epic_ref: backlog/epics/EPIC-023.md
progress_weight: 1
files_allowed:
  - capabilities-services-page-copy.md
  - src/lib/services.ts
  - src/lib/capabilities.ts
  - src/app/(site)/capabilities/page.tsx
  - backlog/
skill_refs: [writing-style, design-taste-frontend, ds-test-planner]
---
# Task: Structure the capabilities narrative and content model

## Scope

Translate the owner-supplied brief into typed, reusable page data and a semantic
page outline. Preserve claims and qualifications while removing source-only
placeholders for the contact email and response-time commitment.

## Acceptance Criteria

- [x] Every substantive source section maps to a visible page section or typed data record.
- [x] Services, examples, starting points, standards, fit guidance, FAQs, and technologies remain source-faithful.
- [x] The page outline follows a problem → possibilities → proof → partnership → fit → action argument.
- [x] No unverifiable metric, pricing, response time, credential, or client outcome is introduced.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Compare the typed model against the source headings and run
  TypeScript while implementing; TASK-087 performs the final rendered-content
  review.

## Notes

The source brief stays untracked and is deleted only after TASK-087 confirms the
content migration.

Implemented in `src/lib/capabilities.ts` and the semantic section order in
`src/app/(site)/capabilities/page.tsx`.
