---
id: TASK-083
title: "Validate migrated Agent OS and portfolio integrity"
status: done
priority: P1
risk_level: medium
epic_ref: backlog/epics/EPIC-022.md
depends_on: [TASK-081, TASK-082]
progress_weight: 1
files_allowed:
  - backlog/
  - project-state/
  - planning/
  - package.json
  - package-lock.json
skill_refs: [ds-test-planner]
---
# Task: Validate migrated Agent OS and portfolio integrity

## Scope

Run the new OS checks and isolated regressions, validate skills and dependency
evidence, render the guide/dashboard, and run 26folio lint, typecheck, and build.
Record failures honestly without auto-fixing unrelated application or security
work.

## Acceptance Criteria

- [x] Intake readiness, OS check, doctor, skill audit, and render tests complete.
- [x] Dependency evidence and exact lockfile checks complete.
- [x] Portfolio lint, typecheck, and production build results are recorded.
- [x] Untracked owner files remain untouched and outside the migration commit.

## Dependency Evidence

- plan: `planning/dependencies/DEP-20260729-205420-add.md`

## Testing

- recommendation: with-task
- rationale: This task is the dedicated verification slice; additional test
  scaffolding would duplicate the checks it exists to run.

## Notes

Four npm high-severity audit findings and two install-script approval notices
were observed during dependency alignment. They are separate security and
package-lifecycle decisions, not automatically remediated here.

Validation passed: 17 derived-state assertions, progress/dependency/render
regressions, OS consistency, doctor, all 13 skill contracts, ESLint, TypeScript,
and the Next.js production build. The build produced all 13 expected routes.
