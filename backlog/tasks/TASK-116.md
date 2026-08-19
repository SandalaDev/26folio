---
id: TASK-116
title: "Build Abe's operating queue and kickoff brief"
status: ready
priority: P2
risk_level: medium
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 1
files_allowed:
  - planning/client-ops/
  - <application-root-from-TASK-107>/src/operator/
  - <application-root-from-TASK-107>/src/kickoff/
  - <application-root-from-TASK-107>/src/jobs/
  - <application-root-from-TASK-107>/tests/operator/
skill_refs: [writing-style]
---

# Task: Build Abe's operating queue and kickoff brief

## Purpose

Reduce Abe's daily administrative scanning. The internal home should answer
what needs attention now and why, without turning into a sales dashboard or a
second project-management system.

## Desired outcome

Abe opens one screen and sees a short, explainable queue of engagements needing
his judgment: proposal review, payment exception, client question/correction,
unsafe upload, missing essential input, decision approval, failed job, or
kickoff readiness. When an engagement becomes ready, the system generates a
source-linked kickoff brief that can be handed to the delivery workflow.

## Read first

- `planning/client-ops/product-contract.md`
- TASK-109 state/event model
- TASK-110 audit events
- TASK-114 readiness and corrections
- TASK-115 documents/decisions

## Scope and instructions

### Explainable work queue

Create deterministic queue items from authoritative state and events. Each item
must include:

- Type, engagement/client, reason, evidence/source, created/updated time,
  priority rule, responsible actor, and one recommended action.
- Deep link to the exact record/action.
- Clear distinction between `requires Abe`, `waiting for client`, `system retry
  underway`, and `no action`.
- Resolution/dismissal semantics that do not hide an unresolved underlying
  condition.

Use transparent rules first. AI may recommend ordering in TASK-117, but it must
not be the only reason an item appears or disappears.

Queue sources should include:

- Draft proposal awaiting internal review.
- Accepted agreement awaiting deposit.
- Payment mismatch/failure requiring investigation.
- Onboarding correction/conflict or essential item awaiting Abe.
- Quarantined/failed upload.
- Decision requiring approval.
- Failed/retried background operation.
- Engagement newly ready for kickoff.

Do not add vanity pipeline metrics, forecasts, unexplained health colours, or
developer delivery tasks.

### Kickoff brief

Generate a versioned brief only from approved/source-linked records. Include:

- Client, stakeholders, and communication roles.
- Business problem, desired outcomes, and success evidence expected.
- Included scope, exclusions, assumptions, dependencies, and responsibilities.
- Accepted agreement/deposit references.
- Supplied assets and secure-access status (never secrets).
- Approved decisions and unresolved questions.
- Risks/blockers and the next expected delivery outcome.
- Source links for every consequential statement.

Generation may be template-driven here. TASK-117 may later draft narrative,
but unsupported statements must never enter the authoritative brief.

Allow Abe to review, correct, approve, version, download/export, and mark the
brief handed off. Preserve superseded versions.

## Acceptance criteria

- [ ] Every queue item comes from a documented rule and links to evidence.
- [ ] Queue categories distinguish Abe action, client wait, system retry, and no
      action without unexplained scores.
- [ ] Resolving/dismissing an item cannot conceal an unresolved payment,
      security, decision, or readiness condition.
- [ ] Cross-client data never leaks through counts, labels, search, links, or
      background generation.
- [ ] The kickoff brief contains all required approved information and source
      links, but no credentials or unsupported claims.
- [ ] Abe explicitly approves one brief version before handoff; changes create a
      new version.
- [ ] Failed generation retries without duplicating briefs or queue items.
- [ ] Operator UI works at practical desktop/tablet widths and supports keyboard
      use and clear empty/error states.
- [ ] Queue/brief tests, lint, strict typecheck, and build pass.

## Non-goals

- No full CRM dashboard, forecasting, client health score, developer task board,
  time tracking, or autonomous prioritization.
- No automatic external project creation unless separately approved later.

## Dependencies and handoff

- Depends on: TASK-115 records, TASK-114 readiness, and TASK-110 audit.
- Blocks: TASK-117 and TASK-119.
- Handoff evidence: queue rule catalog, internal UI, kickoff brief schema,
  generation/approval/version flow, and tests.

## Testing

- recommendation: with-task
- rationale: The queue is deterministic and medium-risk. Test every rule,
  priority tie, stale/resolved condition, retry, empty state, and brief source
  completeness here. TASK-119 still validates the operator side of the complete
  pilot journey and client isolation.

## Execution guardrail

If a queue item cannot explain why it exists using an authoritative record,
do not show it. If a kickoff statement lacks a source, omit it or label it
unresolved rather than making it sound certain.

