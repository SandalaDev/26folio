---
id: client-ops-product-contract
title: "Client operations — first-release product contract"
epic_ref: ../../backlog/epics/EPIC-025.md
task_ref: ../../backlog/tasks/TASK-106.md
status: awaiting-owner-review
owner_review: pending
created: 2026-08-19
---

# First-release product contract

The smallest client-operations release that is worth running with a real
client. It fixes the actors, the record, the states, and the boundaries so
that [TASK-107](../../backlog/tasks/TASK-107.md) can research architecture
against concrete needs.

Read this with [EPIC-025](../../backlog/epics/EPIC-025.md), which stays
authoritative for scope and the experience contract. Where this document says
`TBD — owner decision`, nothing downstream may assume an answer. The decision
table at the end is the review surface, and the recommendations in it are
recommendations, not decisions.

Companion documents: [pilot-journey.md](pilot-journey.md) walks one engagement
end to end, and
[legal-and-commercial-review-brief.md](legal-and-commercial-review-brief.md)
collects what counsel and the owner must answer.

## Actors

| Actor | Who they are | What they can do |
|---|---|---|
| Operator (Abe) | The only internal user in the first release. | Approve discovery facts, issue proposals, approve onboarding checklists, approve every client-facing output, record decisions, export the record. |
| Intended signer | The named person who claims authority to bind the client organisation. | Open the agreement link, review or download the agreement, accept it, and see the state that follows. |
| Project contact | Day-to-day owner of onboarding for the client, often the same person as the signer. | Complete onboarding requests, upload files, assign a request to a stakeholder, see progress and the next action. |
| Stakeholder | Someone the project contact assigns a single request to, such as a designer holding brand files or an IT contact holding domain access. | Open a scoped link, satisfy the one request assigned to them, and nothing else. |

There is no second internal user, no client administrator, and no role editor
in the first release. Adding them later must not require rewriting the audit
history, so every recorded event names its actor explicitly rather than
implying it.

## Product boundary

This is a separate private product. It does not add a database, an
authenticated area, or client data to `sandala.dev`, which stays the static
public front door defined by the charter.

The only planned integration is one narrow handoff: an approved enquiry from
the portfolio contact path becomes an opportunity inside this system. The
handoff carries the enquiry text and its provenance. It gives the portfolio no
read access to engagements, and this system keeps working when the portfolio
is offline.

Repository boundary, hosting, stack, auth method, data store, payment
provider, document storage, and model provider are all out of scope here.
`TASK-107` selects them against this contract.

## The canonical engagement record

One engagement is one record. Everything a client supplies, everything Abe
approves, and everything the system observes attaches to it.

- **Identity** — engagement reference, client organisation, country of the
  client organisation, engagement title, created date, current state, and who
  owes the next action.
- **People** — signer, project contact, and stakeholders, each with name,
  role, email, and how they were introduced to the engagement.
- **Opportunity** — source of the enquiry, first contact date, and the
  approved discovery facts. Each discovery fact keeps its source, the date it
  was captured, and whether Abe has approved it. Unapproved facts stay
  internal and never appear in client-facing output.
- **Engagement definition** — outcomes, scope, explicit exclusions,
  assumptions, and client-side dependencies.
- **Commercial terms** — total fee, deposit amount, currency, invoice
  reference, payment terms, and the conditions that make a start date firm.
  Amounts are `TBD — owner decision` until the owner supplies them.
- **Documents** — proposal and agreement versions, invoices, receipts, the
  acceptance receipt, approved briefs, and client uploads. Each carries
  version, status, provenance, hash, access scope, and download availability.
- **Decisions** — the decision, its owner, date, consequences, related scope,
  evidence, and whether client approval was required and given.
- **Onboarding requests** — each request with its reason, whether it is
  essential or optional, who it is assigned to, its state, and what satisfied
  it.
- **Event history** — append-only. Every entry records the event, the actor,
  UTC time, and the evidence that authorised it.

The record is the authority. Email threads and file shares are inputs to it,
never a substitute for it.

## Lifecycle

One engagement moves through these states. The client always has at most one
open action, and the interface names who acts next.

```text
opportunity approved
  → proposal issued
  → agreement accepted        (signed)
  → deposit paid
  → onboarding active
  → ready for kickoff
```

| State | Entry condition | Evidence that authorises entry | Client's next action | Exit condition |
|---|---|---|---|---|
| opportunity approved | Abe approves the discovery facts and the engagement definition. | Internal approval by Abe, recorded with date. | None. Nothing is client-visible yet. | A proposal version is issued. |
| proposal issued | Abe issues one immutable proposal and service-agreement version and sends a private expiring link to the intended signer. | Version identifier, document hash, link issue time, expiry, recipient. | Review the proposal and agreement. | Acceptance, expiry, decline, or a superseding version. |
| agreement accepted | The intended signer supplies name, company, role, and claimed authority, deliberately selects an unchecked agreement control, and activates the explicit accept action. | Signer identity as supplied, the exact acceptance wording shown, agreement version, document hash, UTC time, and proportionate security evidence. | Pay the deposit. | A verified payment event for the deposit. |
| deposit paid | The payment provider's verified, idempotently processed event confirms the deposit. | Provider event identifier, amount, currency, provider timestamp, and the reconciliation record. A browser redirect is never sufficient. | Wait. The system states that Abe is preparing onboarding. | Abe approves the generated onboarding checklist. |
| onboarding active | Abe approves the scope-derived checklist and releases it to the project contact. | Checklist version, approving actor, release time, and the list of essential and optional requests. | Complete the essential requests. | Every essential request satisfied and accepted. |
| ready for kickoff | Every essential request is satisfied and Abe accepts the supplied material. | Per-request satisfaction evidence, Abe's acceptance, and the generated kickoff brief. | None. The engagement moves to delivery. | Out of scope for this release. |

Off-path states in the first release are `proposal expired`, `declined`,
`on hold`, and `cancelled`. Each is reachable from the states before
`ready for kickoff`, each records who ended the path and when, and none of
them deletes the record or its evidence.

### Four states that must not be collapsed

- **Signed** — the intended signer accepted a specific, immutable agreement
  version. It says nothing about money.
- **Deposit paid** — a verified provider event confirms funds for the recorded
  deposit. It says nothing about whether onboarding is ready.
- **Onboarding active** — Abe approved a checklist tailored to this engagement
  and released it. This stays separate from `deposit paid` because the
  checklist is engagement-specific work that a payment event cannot perform,
  and releasing an unreviewed checklist is how clients get asked for the wrong
  things.
- **Ready for kickoff** — the essential inputs exist and Abe has accepted
  them. It describes delivery readiness, not payment.

Collapsing any pair of these hides a real failure: paid but not started,
started but not paid, active but waiting on Abe, or complete on paper while an
essential input is missing.

## Visibility

| Data | Client-visible | Abe-only | May be processed by AI |
|---|---|---|---|
| Proposal and agreement versions, invoices, receipts, acceptance receipt | Yes, for their own engagement | — | Yes, within the engagement |
| Approved discovery facts and scope | Yes | — | Yes, within the engagement |
| Unapproved discovery facts, internal notes, pricing rationale, effort estimates | No | Yes | Yes, but the output is a draft for Abe and never reaches a client without his approval |
| Onboarding answers and uploaded files | The uploader and the project contact see them; a stakeholder sees only their own request | Yes | Yes, within the engagement, except files the owner marks as excluded |
| Decisions and approval history | Yes for decisions that involve them | Yes | Yes, within the engagement |
| Credentials, passwords, API keys, recovery codes | Never collected | Never stored | Never |
| Another client's engagement, files, links, or derived context | No | Yes, as the operator | No, under any circumstance |

AI assistance stays backstage. It drafts, extracts, classifies, compares, and
recommends. Every output that could reach a client or change the engagement
passes through Abe's approval, and any answer the record does not support says
the record is insufficient instead of guessing.

## Service expectations architecture must support

These are requirements on the stack chosen in `TASK-107`, not implementation
suggestions.

- **Mobile first.** Signers and stakeholders open links on phones, often on
  mobile data. Every client-facing step works on a small screen, by keyboard,
  with assistive technology, and without non-essential motion.
- **No account creation to act.** A private expiring link is enough to review,
  accept, pay, and complete onboarding. Re-entry after expiry must not depend
  on Abe being awake.
- **Expiring links with safe reissue.** Expiry is recorded, reissue is
  recorded, and an expired link never silently grants access.
- **Resumability.** A client can leave any multi-step flow and return without
  losing confirmed work or creating a duplicate record.
- **Idempotent payment handling.** Duplicate provider events, retries, and
  out-of-order delivery converge on one payment state.
- **Auditability.** The event history is append-only and reconstructs how the
  engagement reached its current state, including who acted and what evidence
  authorised it.
- **Export without lock-in.** Abe can export the engagement record in an open
  structured format together with its authoritative documents.
- **Recovery.** Interrupted acceptance, payment, upload, and onboarding flows
  resume. Failed uploads report why and can be retried.
- **Isolation.** One client cannot reach another client's records, links,
  files, or derived AI context. This holds at the data layer, not only in the
  interface.

## First-release scope

In scope: the canonical engagement record, proposal and agreement issuance,
the click acceptance ceremony and receipt, the deposit gate with verified
payment state, the tailored onboarding checklist with delegation and safe
uploads, the document and decision room, Abe's operating queue, the generated
kickoff brief, and evidence-grounded AI assistance with human approval.

Out of scope, restating the epic's non-goals and adding the ones specific to
this release: no CRM or outreach automation, no accounting suite, no developer
task tracking, no self-hosted signature platform, no claim that click
acceptance suits every agreement, no general client chatbot, no autonomous
pricing or sending, no storage of client credentials, no second internal user,
no client-side administration, no multi-language interface, and no
implementation inside the portfolio application.

## Owner decisions

The recommendations below are recommendations. The `owner decision` column is
empty until the owner fills it, and silence is not approval. Decisions that
survive review are recorded durably with
`bash scripts/os.sh decide --title ... --context ... --decision ...`.

| # | Question | Recommended default | Owner decision | Date |
|---|---|---|---|---|
| P1 | Is the first pilot a named real client or a rehearsal with a synthetic engagement? | Rehearse once with the synthetic engagement in `pilot-journey.md`, then run one named real client. | | |
| P2 | Does this epic follow the portfolio launch baseline or interrupt it? | Keep it at P2, after the launch baseline. | | |
| P3 | Is the 15-minute onboarding-effort hypothesis accepted as a measurement target? | Accept it as an internal target to measure in the pilot, never as a public promise. | | |
| P4 | What is the deposit basis: fixed amount, percentage of fee, or set per proposal? | Set per proposal, with the amount stored on the engagement rather than derived in code. | | |
| P5 | Which settlement currency does the first release support? | One settlement currency for the pilot. Other currencies stay display-only until a second is genuinely needed. | | |
| P6 | Which payment methods must the first release accept: card, bank transfer, mobile money, or a combination? | Owner decision required before `TASK-107`. This selects the provider more than any other factor. | | |
| P7 | Do clients ever get an account, or is link-only access the permanent model? | Link-only, with a one-time code sent to the recorded email address once a link has expired. | | |
| P8 | Does Abe approve the generated onboarding checklist before the client sees it? | Yes. `onboarding active` requires his approval. | | |
| P9 | Is the use of AI assistance disclosed to clients? | Yes, in plain language: AI drafts internally and a human approves everything the client receives. | | |
| P10 | What is the interface language for the first release? | English only. | | |
| P11 | Is there a data residency requirement for client documents and engagement data? | Owner decision required before `TASK-107`. It constrains hosting and storage. | | |
| P12 | Who may a stakeholder request be delegated to: anyone with an email address, or only people the project contact names on the engagement? | Only people named on the engagement, so isolation stays provable. | | |

P6 and P11 block `TASK-107`. The rest can be answered alongside it, and none
of them may be assumed by an implementation task.
