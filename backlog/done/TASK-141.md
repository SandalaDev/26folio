---
id: TASK-141
title: Add the brand and web design capability
status: done
priority: P1
risk_level: low
epic_ref: EPIC-029
progress_weight: 2
depends_on:
  - TASK-131
files_allowed:
  - src/lib/capabilities.ts
  - src/app/(site)/capabilities/
skill_refs:
  - writing-style
  - stop-slop
parallel:
  suitable: true
  reason: Only touches capabilities.
  dependencies:
    - TASK-131
  result: null
testing:
  recommendation: with-task
  reason: One new entry in an existing list; build and a look at /capabilities.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
started_at: 2026-10-09T23:29:19Z
completed_at: 2026-10-10T00:05:51Z
---

# Task: Add the brand and web design capability

## Scope

1. Add one service: brand identity and web design, written in the same
   problem-led voice as the other services.
2. It lists the four brand projects as evidence.
3. No other change to /capabilities. Owner approves the copy.

## Acceptance Criteria

- [x] The service renders and its id resolves from the four brand pages.
- [x] Owner approved the copy.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: One new entry in an existing list; build and a look at /capabilities.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.

## Carried from TASK-131

The four brand projects already set `capability: "design"`. Give the new
service `id: "design"` (it becomes the `/capabilities#design` anchor) and the
links appear with no further change.

## Result (2026-10-10): built, copy awaiting owner approval

Service `design`, index 09, "Brand Identity & Interface Design", added to
`capabilityServices` in the same scenario-led voice as the other eight.
`CapabilityService` gains an optional `evidence` list, rendered by the dossier
as "In the work:" links; the design service lists the four brand projects. The
four brand pages now end on "The capability behind it: Brand Identity &
Interface Design". stop-slop: 50/50.

Verified in the dev server: `/capabilities` renders `id="design"` with the
evidence links; `/work/provision-finance` links to `/capabilities#design`.

Open: owner approval of the copy. The task stays open until then.

## Approved (2026-10-10)

The owner chose "Approve as written" in chat.
