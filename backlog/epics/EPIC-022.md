---
id: EPIC-022
title: "Migrate 26folio to Agent OS v1 without losing project history"
status: done
priority: P1
risk_level: high
roadmap_refs: [ROAD-004]
goal_refs: [GOAL-001, GOAL-002, GOAL-004]
progress_weight: 1
---
# Epic: Migrate 26folio to Agent OS v1 without losing project history

## Outcome

Every supported agent can resume 26folio from repository evidence using the new
non-blocking Agent OS, while the current portfolio, its 75 completed task
records, legacy decisions, design context, and outstanding owner actions remain
recoverable.

## Scope

- Replace legacy OS scripts, hooks, instructions, generated views, and obsolete
  enforcement machinery with the current remote template.
- Convert the uppercase runtime state and heavy spine into the new lowercase
  state plus lean brief, interview, charter, decisions, and roadmap.
- Preserve legacy spine, backlog, slice, content, and project-specific skill
  artifacts as referenced evidence.
- Normalize legacy task and epic metadata so progress can trace to current
  roadmap items and business goals.
- Validate the OS, dependency evidence, Git flow, dashboard, guide, and the
  portfolio's lint, typecheck, and production build.

## Non-goals

- No portfolio redesign, application-feature work, public-copy revision, or
  dependency upgrade beyond the reviewed exact YAML declaration.
- No automatic remediation of npm audit findings or install-script approvals.
- No claim that completed implementation proves business outcomes.

## Tasks

- [x] TASK-081 — Replace legacy Agent OS machinery and state model.
- [x] TASK-082 — Migrate durable context and normalize intent traceability.
- [x] TASK-083 — Validate Agent OS continuity and portfolio integrity.

## Dependency / Architecture Evidence

- plan: `planning/dependencies/DEP-20260729-205420-add.md`

## Testing

- recommendation: dedicated TASK-083
- rationale: Continuity loss or a broken build would affect every later session.
  A focused validation task provides better evidence than distributing shallow
  checks across the migration edits.
