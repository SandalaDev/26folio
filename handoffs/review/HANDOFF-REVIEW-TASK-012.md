---
handoff_type: review
id: HANDOFF-REVIEW-TASK-012
created: 2026-06-30T21:21:51.083Z
created_by: claude-code
task_ref: backlog/done/TASK-012.md
slice_ref: planning/slices/EPIC-003-SLICE-2.md
epic_ref: backlog/epics/EPIC-003-*.md
implementation_status: complete
verification:
  (none declared)
review_focus:
  - architecture conformance to the slice plan and 07-architecture-principles.md
  - correctness of risk-bearing behaviour
  - scope: every changed file is inside files_allowed
review_notes_path: .agents/reviews/REVIEW-TASK-012.md
---
# Handoff: Review TASK-012

## Purpose
Cross-model review of TASK-012 ("Global chrome — SiteHeader, MobileNav, SiteFooter") before human merge.
Reviewer family must differ from `claude-code`.

## Current State
Implementation complete; gate proofs as recorded above. Diff scoped to
`files_allowed` in backlog/done/TASK-012.md.

## Completed
- See backlog/done/TASK-012.md acceptance criteria.

## Remaining (for reviewer)
- Architecture / slice conformance
- Correctness + edge-case audit on risk-bearing logic
- Scope check against files_allowed

## Risks
- (fill in: anything the reviewer should scrutinise first)

## Suggested Skills
- ds-reviewer
