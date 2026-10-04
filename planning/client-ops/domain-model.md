---
id: client-ops-domain-model
title: "Client operations — domain model and lifecycle"
epic_ref: ../../backlog/epics/EPIC-025.md
task_ref: ../../backlog/tasks/TASK-109.md
status: current
created: 2026-08-20
---

# Domain model

The canonical vocabulary, written down before screens or integrations invent
competing meanings for "signed", "paid", and "ready". Code and this document
agree; where they drift, the code in `../../../sandala-client-ops/src/domain/`
is the one that runs and this file is the bug.

## Entities

```text
ClientOrganization ──< OrganizationMembership >── Person
        │                                            │
        ├──< Opportunity                             │
        │                                            │
        └──< Engagement ──< EngagementParticipant >──┘
                  │            (signer | project_contact | stakeholder)
                  ├──< Fact          (statement, source, approval)
                  ├──< ScopeItem     ─┐
                  ├──< Assumption     ├─ approved commitments, each may cite a Fact
                  ├──< Dependency    ─┘
                  └──< EngagementEvent  (append-only history)
```

| Entity | Holds | Notes |
|---|---|---|
| `ClientOrganization` | Name, country | The country is not decoration: payment method availability derives from it. |
| `Person` | Name, email | Unique by email. People exist independently of engagements. |
| `OrganizationMembership` | Person's title at an organisation | One row per person per organisation. |
| `Opportunity` | Enquiry source, first contact | Where an engagement came from. |
| `Engagement` | Reference, title, state, who owes the next action, closure | The record everything else hangs off. |
| `EngagementParticipant` | Person plus role, and the signer's claimed authority | Claimed authority is stored as the signer wrote it. |
| `Fact` | Statement, source, capture attribution, approval | The provenance record. Approval is what makes it repeatable to a client. |
| `ScopeItem`, `Assumption`, `Dependency` | Approved commercial and delivery statements | Each may cite the `Fact` it rests on. |
| `EngagementEvent` | What happened, who, when, from and to state, evidence | Append-only. The audit history. |

### Stable references, not stub tables

Proposals, acceptances, payments, onboarding requests, documents, and decisions
belong to later tasks. Rather than create empty tables for them now, an event
carries `evidenceKind` plus `evidenceId` — a kind name and an opaque id. The
history stays complete before those tables exist, and each later task adds its
own table without rewriting anything here.

## Lifecycle

```text
draft
  → proposal_ready
  → proposal_issued
  → agreement_accepted
  → deposit_due
  → deposit_paid
  → onboarding_active
  → onboarding_complete
  → ready_for_kickoff

off-path: proposal_expired · declined · on_hold · cancelled
```

`on_hold` records the state it interrupted and resuming returns there.
`proposal_expired`, `declined`, and `cancelled` are terminal: they close the
engagement, record why, and refuse further events. None of them deletes
anything.

## Transitions

Every row is enforced in `src/domain/engagement-state.ts`, which is pure data
and a single gate function. The table below is generated from the same rules.

| Event | From | To | Actor | Evidence required | Next action | Repeatable |
|---|---|---|---|---|---|---|
| `engagement.created` | — | `draft` | operator | — | operator | no |
| `engagement.proposal_prepared` | `draft` | `proposal_ready` | operator | — (requires ≥1 approved fact) | operator | no |
| `proposal.issued` | `proposal_ready`, `proposal_issued` | `proposal_issued` | operator | `proposal_version` | client | yes, supersedes |
| `proposal.expired` | `proposal_issued` | `proposal_expired` | system | — | operator | no |
| `proposal.declined` | `proposal_issued` | `declined` | client | — | operator | no |
| `agreement.accepted` | `proposal_issued` | `agreement_accepted` | client | `acceptance` | operator | no |
| `deposit.requested` | `agreement_accepted` | `deposit_due` | operator, system | `deposit_request` | client | no |
| `payment.attempt_failed` | `deposit_due` | *(no transition)* | provider | `payment_attempt` | client | yes |
| `payment.verified` | `deposit_due` | `deposit_paid` | provider | `payment` | operator | no |
| `onboarding.released` | `deposit_paid` | `onboarding_active` | operator | `checklist_version` | client | no |
| `onboarding.completed` | `onboarding_active` | `onboarding_complete` | system, operator | — | operator | no |
| `kickoff.ready` | `onboarding_complete` | `ready_for_kickoff` | operator | `kickoff_brief` | operator | no |
| `engagement.held` | any active | `on_hold` | operator | — | operator | no |
| `engagement.resumed` | `on_hold` | *(the interrupted state)* | operator | — | operator | no |
| `engagement.cancelled` | any active, `on_hold` | `cancelled` | operator | `cancellation_reason` | operator | no |

Four things this table decides that the interface must not re-decide:

- **A provider raises `payment.verified`, not an operator and not a client.** A
  browser redirect has no path to this event.
- **An operator raises `onboarding.released`.** A payment cannot perform the
  checklist review that separates `deposit_paid` from `onboarding_active`.
- **A failed payment attempt has no `to` state.** It is history, and the client
  simply retries.
- **`agreement.accepted` hands the next action back to Abe**, not to the
  client, because what follows is the deposit request he issues.

## Invariants

Enforced in the database, so they survive an application bug:

| Invariant | Mechanism |
|---|---|
| An engagement reference is unique and never reused | unique index |
| A closed state has a closure timestamp, and a live one does not | check constraint on `engagements` |
| An approved fact was approved by an operator, with a name and a time | check constraint on `facts` — a client or a model cannot reach `approved` |
| The same person holds a given role once per engagement | unique index |
| A delivered-twice event lands once | unique index on `idempotency_key` |
| History cannot be orphaned | `engagement_events` references engagements `on delete restrict` |

Enforced in the domain layer:

| Invariant | Mechanism |
|---|---|
| State changes only through typed commands | `src/domain/engagement.ts` is the only writer of `engagements.state`; there is no direct setter |
| An invalid transition writes nothing | the gate runs inside the transaction, before any insert |
| A proposal is not prepared before a fact is approved | precondition check in `applyEvent` |
| Concurrent events on one engagement serialise | `select … for update` on the engagement row |

## Duplicate events

A duplicate is identified by `idempotencyKey`, which the caller sets for
anything that can arrive twice — a provider webhook, a retried job.

The key is checked **before** the transition gate, and the ordering is the whole
point. A redelivered payment webhook arrives when the engagement has already
moved to `deposit_paid`, so gating first would refuse an event that should
simply be ignored. Instead the original event's `duplicate_count` increments,
`last_duplicate_at` is stamped, and the call returns `applied: false` with the
current state. The insert still catches a unique violation, which covers the
race where two deliveries pass the pre-check at the same moment.

The result: the engagement moves once, and the record still shows that a
duplicate arrived and when. No unbounded row growth from a provider retrying
for 24 hours.

## Ownership

| Concern | Owner |
|---|---|
| Lifecycle rules | `src/domain/engagement-state.ts`, pure data and one gate function |
| Writes and transactions | `src/domain/engagement.ts` |
| Constraints and migrations | `src/db/schema.ts` and `migrations/` |
| Everything else | Calls a domain command. Route handlers, jobs, and adapters never write state directly. |

## Fixture

`src/fixtures/northwind.ts` loads the synthetic engagement from
[pilot-journey.md](pilot-journey.md) with fixed uuids: Northwind Provisions Ltd,
three people, five approved discovery facts, and one that stays unapproved so
the approval boundary is visible in development. `npm run fixture:load` is
deterministic and safe to run twice.

Northwind is invented. No real client information belongs in a repository
fixture.
