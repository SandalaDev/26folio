---
id: TASK-109
title: "Implement the canonical engagement model and state machine"
status: ready
priority: P2
risk_level: critical
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 1
files_allowed:
  - planning/client-ops/
  - ../sandala-client-ops/src/domain/
  - ../sandala-client-ops/src/data/
  - ../sandala-client-ops/migrations/
  - ../sandala-client-ops/tests/domain/
skill_refs: []
---

# Task: Implement the canonical engagement model and state machine

## Purpose

Give the product one authoritative vocabulary and one controlled lifecycle
before screens or integrations create conflicting meanings for “signed”,
“paid”, or “ready”. Later features must write through explicit domain commands.

## Desired outcome

The application can create a representative engagement, store approved facts
with provenance, and move only through permitted states. Invalid, duplicate, or
out-of-order events do not corrupt the record.

## Read first

- `planning/client-ops/product-contract.md`
- `planning/client-ops/pilot-journey.md`, especially its state table
- `planning/client-ops/architecture.md`
- The approved data-access and migration conventions

Do not infer fields from the static portfolio domain model.

## Scope and instructions

### Canonical entities

Implement the smallest normalized model needed for the first release:

- `ClientOrganization` — legal/customer organization.
- `Person` and `OrganizationMembership` — people and roles.
- `Opportunity` — source enquiry and qualification context.
- `Engagement` — central relationship and lifecycle state.
- `Fact` or equivalent — information with source, verification status, author,
  and approval state.
- `ScopeItem`, `Assumption`, and `Dependency` — approved commercial/delivery
  facts used by proposals and kickoff.
- Stable references for later proposal, acceptance, payment, onboarding,
  document, decision, and audit records. Do not implement their behaviour here.

Use opaque stable IDs, UTC timestamps, explicit attribution, and database
constraints for invariants that must survive application bugs.

### Engagement state machine

Use the approved journey's exact names. At minimum, distinguish the equivalent
of:

```text
draft → proposal_ready → proposal_issued → agreement_accepted
→ deposit_due → deposit_paid → onboarding_active
→ onboarding_complete → ready_for_kickoff
```

Also define cancellation/expiry without deleting history. For every transition,
record the allowed event, trusted actor, preconditions, evidence reference,
result, side-effect intent, duplicate-event behaviour, and rejection behaviour.

UI routes must never assign state strings directly. Expose typed domain
commands and make later adapters call them.

### Representative fixture

Create a deterministic synthetic fixture matching the approved pilot. Never put
real client information into repository fixtures without explicit authority.

### Model documentation

Create `planning/client-ops/domain-model.md` with an entity diagram, lifecycle
diagram, invariants, event vocabulary, and ownership notes. Code and document
must agree.

## Acceptance criteria

- [ ] Schema and documentation cover the canonical entities and stable
      references without implementing later features early.
- [ ] State changes only through typed domain operations.
- [ ] Every transition names event, preconditions, actor, evidence, result, and
      duplicate-event behaviour.
- [ ] Invalid transitions, including payment without acceptance/payment
      evidence, fail without partial writes.
- [ ] Duplicate domain events produce one logical result.
- [ ] Facts preserve provenance and cannot become approved commitments through
      an AI or client write alone.
- [ ] IDs, timestamps, constraints, uniqueness, and archive semantics are
      enforced appropriately.
- [ ] The synthetic fixture loads on a clean database.
- [ ] Migration, domain tests, lint, strict typecheck, and build pass.

## Non-goals

- No login/session UI, authorization rules, proposal rendering, acceptance,
  payment provider, onboarding UI, document room, or AI.
- No event-sourcing framework unless TASK-107 approved one.
- No real client data in fixtures.

## Dependencies and handoff

- Depends on: TASK-108 and TASK-106's state table.
- Blocks: TASK-110 through TASK-119.
- Handoff evidence: migration(s), domain commands, transition tests, synthetic
  fixture, and `domain-model.md`.

## Testing

- recommendation: dedicated: TASK-119, plus focused checks in this task
- rationale: Add focused tests for allowed, invalid, out-of-order, cancelled,
  and duplicate transitions now. TASK-119 later proves the same invariants
  through real adapters, concurrency, authorization, and the complete journey.

## Execution guardrail

If a transition or invariant is ambiguous, request a decision. Never add a
permissive direct-status-update escape hatch “temporarily”.
