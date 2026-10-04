---
id: client-ops-pilot-journey
title: "Client operations — representative pilot journey"
epic_ref: ../../backlog/epics/EPIC-025.md
task_ref: ../../backlog/tasks/TASK-106.md
status: awaiting-owner-review
owner_review: "decisions recorded 2026-08-19; document read-through pending"
subject: synthetic
created: 2026-08-19
---

# Representative pilot journey

> **This engagement is synthetic.** Northwind Provisions Ltd, every person
> named below, and every amount are invented for review. No real client, real
> price, real agreement, or real payment is described here. The owner replaces
> this with a named pilot under decision J1 in
> [product-contract.md](product-contract.md). Northwind is treated as a local
> company, which is what makes mobile money appear in its deposit request.

One engagement walked end to end, so the states in
[product-contract.md](product-contract.md) can be checked against something
concrete. The state table at the end is the direct input to
[TASK-109](../../backlog/tasks/TASK-109.md).

Money appears as `[DEPOSIT_AMOUNT]` and `[CURRENCY]` throughout. Those stay
placeholders until the owner answers P4 of the product contract and J2 below.
Method availability is already settled: mobile money for local clients, card
for international ones.

## The cast

| Name | Role | Notes |
|---|---|---|
| Abe | Operator | Approves everything the client sees. |
| Dora Mwansa | Operations director at Northwind, intended signer | Claims authority to bind the company. |
| Chris Bell | Marketing manager at Northwind, project contact | Runs onboarding day to day. |
| Ruth Osei | Freelance designer working for Northwind, stakeholder | Holds the brand files. Never sees the rest of the engagement. |

## 1. Enquiry and approved discovery

An enquiry arrives through the portfolio contact path: Northwind wants to
replace a manual order intake process that runs on email and spreadsheets.
Abe holds a discovery call and records five facts on the engagement, each with
its source and date.

- Orders arrive by email and are re-keyed into a spreadsheet. Source: discovery
  call, 2026-09-02.
- Roughly 120 orders a week. Source: discovery call, 2026-09-02.
- Three staff touch every order. Source: discovery call, 2026-09-02.
- The existing supplier portal must keep working during the change. Source:
  Dora's follow-up email, 2026-09-03.
- No internal developer. Source: discovery call, 2026-09-02.

A sixth candidate fact, an estimate of hours lost per week, arrives second-hand
and stays unapproved. It is visible to Abe and appears in nothing the client
receives.

Abe approves the five facts and the engagement definition. The engagement
enters `opportunity approved`. Nothing is client-visible yet.

## 2. Proposal issued

Abe issues proposal and service-agreement version `v1.0`, and the system
records its hash. Dora receives a private link that expires in 14 days.

**What Dora sees:** the proposal and the complete agreement in one view, a
download for both, the deposit amount and terms stated before she commits, and
one action labelled `Accept and sign agreement`. The page says what happens
after she accepts.

## 3. Acceptance

Dora enters her full name, company, and role, and confirms that she is
authorised to enter the agreement on Northwind's behalf. She deliberately
selects an unchecked control that references the exact agreement version, then
activates the accept action.

The system records the identity she supplied, the exact acceptance wording
displayed to her, agreement version `v1.0`, the document hash, the UTC time,
and proportionate security evidence. It generates an acceptance receipt and an
immutable copy for both parties.

**What Dora sees:** confirmation that the agreement is accepted, her receipt
available to download, and the single next action `Pay project deposit` with
the amount, currency, invoice reference, and terms. The page names her as the
person who acts next.

## 4. Deposit, failed and retried

Northwind is a local company, so the deposit request offers mobile money as
well as card, and says why mobile money is available to them. An international
client on the same engagement type would see card only, with no mention of a
method they cannot use. Dora chooses mobile money.

Her first payment attempt fails. The provider reports the failure, the
engagement stays in `agreement accepted`, and the failed attempt is recorded
with the provider's reason.

**What Dora sees:** a plain statement that the payment did not go through, the
reason as the provider gave it, that nothing was charged, and the same
`Pay project deposit` action ready to try again. No blame, no dead end, and no
instruction to email Abe.

She retries the next morning and it succeeds. The provider's verified event,
processed idempotently, moves the engagement to `deposit paid`. A duplicate
delivery of the same event later that day changes nothing. The browser
redirect that returned her to the page is treated as navigation, not as
evidence of payment.

**What Dora sees:** the deposit recorded as paid, a receipt to download, and a
statement that Abe is preparing onboarding and will notify Chris. She has no
open action.

## 5. Onboarding released

The system generates a checklist from the approved scope. Abe reviews it,
removes one request that does not apply to this engagement, and releases it.
The engagement moves to `onboarding active` and Chris is invited.

Essential requests: current order-intake spreadsheet, the list of staff who
handle orders and what each does, brand files, access to the supplier portal
for one read-only account, and confirmation of the target go-live window.

Optional requests: examples of orders that went wrong, and any existing
process documentation.

Each request states why it is needed and roughly how long it should take.
Answers Abe already holds are prefilled and marked with where they came from,
and Chris can correct any of them.

**What Chris sees:** a branded welcome reached without creating an account,
progress across the essential requests, one prominent next action, and a clear
split between what waits on Northwind and what is underway with Abe.

## 6. Delegation

Chris does not hold the brand files. He assigns that single request to Ruth,
the freelance designer, and adds a sentence of context.

Ruth receives a scoped link that opens one request. She cannot see the
agreement, the deposit, the other requests, or anything else on the
engagement. She uploads the logo pack and the brand guide, and the request is
satisfied.

**What Chris sees:** the request marked as assigned to Ruth, then satisfied by
her, with the time it was completed. His own progress accounts for it without
him chasing her.

## 7. Documents and credentials

Chris uploads the order-intake spreadsheet. The system checks the file type
and size, stores it against the request with its provenance, and shows it in
the document room with a version and download.

Supplier portal access is different, and the product treats it differently.
The system never asks for the password. It records that access is required,
who owns it at Northwind, and its status. Chris grants access by creating a
read-only account inside the supplier portal itself and confirming that he has
done so. If a secret genuinely has to move, it moves through a managed
secret-sharing channel selected in `TASK-107`, never through a form, a
message, or an uploaded document, and the engagement records only that the
handoff happened.

**What Chris sees:** access status as `requested`, then `granted`, with an
explanation of why the system does not want his password.

## 8. A decision requiring approval

Abe proposes keeping the existing supplier portal untouched in phase one and
integrating with it read-only, rather than replacing it. He records the
decision with its consequences: a slower long-term consolidation, in exchange
for no disruption at go-live.

The decision is marked as requiring client approval. Dora approves it, and the
approval is recorded with her name, the date, and the version of the decision
she approved.

**What Dora sees:** the decision in plain language, what it costs and what it
protects, and one action to approve or ask a question.

## 9. Kickoff readiness

Every essential request is satisfied. Abe reviews the supplied material,
accepts it, and the system generates a kickoff brief containing approved
scope, supplied assets, dependencies, decisions with their approvals,
unresolved questions, and the project-system handoff.

The engagement moves to `ready for kickoff`.

**What Chris and Dora see:** onboarding complete, what Abe does next, and the
date the work starts under the terms they accepted.

## State table

Direct input to `TASK-109`. Every transition names the event that caused it
and the evidence that authorises it.

| # | Starting state | Event | Resulting state | Actor | Evidence recorded |
|---|---|---|---|---|---|
| 1 | none | Enquiry received and engagement created | opportunity draft | Abe | Enquiry text, source, first contact date |
| 2 | opportunity draft | Discovery facts approved and engagement defined | opportunity approved | Abe | Each fact with source and date, approval actor and date |
| 3 | opportunity approved | Proposal and agreement `v1.0` issued, private link sent | proposal issued | Abe | Version identifier, document hash, link issue time, expiry, recipient |
| 4 | proposal issued | Link opened by recipient | proposal issued | Dora | Access time, link identifier, proportionate security evidence |
| 5 | proposal issued | Explicit acceptance completed | agreement accepted | Dora | Signer name, company, role, claimed authority, exact acceptance wording, version `v1.0`, document hash, UTC time, security evidence, receipt identifier |
| 6 | agreement accepted | Deposit payment attempt failed | agreement accepted | Payment provider | Provider event identifier, failure reason, amount, currency, provider timestamp |
| 7 | agreement accepted | Verified deposit payment event processed | deposit paid | Payment provider | Provider event identifier, amount `[DEPOSIT_AMOUNT] [CURRENCY]`, provider timestamp, idempotency key, reconciliation record |
| 8 | deposit paid | Duplicate provider event delivered | deposit paid | Payment provider | Duplicate event identifier, resolution as no-op |
| 9 | deposit paid | Onboarding checklist reviewed, edited, and released | onboarding active | Abe | Checklist version, edits made, approving actor, release time, essential and optional request lists |
| 10 | onboarding active | Request assigned to a stakeholder | onboarding active | Chris | Request identifier, assignee, assigning actor, scoped link issue time and expiry |
| 11 | onboarding active | Stakeholder satisfied the assigned request | onboarding active | Ruth | Uploaded file names, sizes, hashes, upload time, satisfying actor, request identifier |
| 12 | onboarding active | Document uploaded against a request | onboarding active | Chris | File name, size, hash, type check result, upload time, request identifier |
| 13 | onboarding active | Access granted outside the product, confirmed by the client | onboarding active | Chris | Access item, owner, status change, confirming actor, time. No credential material |
| 14 | onboarding active | Decision recorded and marked as needing client approval | onboarding active | Abe | Decision text, consequences, related scope, evidence, approval requirement |
| 15 | onboarding active | Client approved the decision | onboarding active | Dora | Approving actor, decision version, UTC time |
| 16 | onboarding active | Essential requests accepted and kickoff brief generated | ready for kickoff | Abe | Per-request satisfaction evidence, accepting actor, brief version and contents |

Off-path transitions the first release must also support: proposal expiry
without acceptance, decline by the signer, engagement placed on hold, and
engagement cancelled. Each records the actor, the time, and the reason, and
none of them removes prior evidence.

## Owner decisions

| # | Question | Recommended default | Owner decision | Date |
|---|---|---|---|---|
| J1 | Who is the real pilot client, and may they be named in the repository? | Rehearse with this synthetic engagement, then run one named real client whose name stays in private planning only. | Rehearse here first, then one named real client. The client is not yet chosen | 2026-08-19 |
| J2 | What is the deposit amount and currency for the pilot? | `TBD — owner decision`. No implementation task may invent an amount. Method availability is settled: mobile money for local clients, card for international | | |
| J3 | How long is a proposal link valid, and who may reissue it? | 14 days, reissued by Abe, with both the expiry and the reissue recorded. | | |
| J4 | How many failed payment attempts before the system stops offering a retry and tells the client to contact Abe? | Three, then a message that names Abe as the next step. | | |
| J5 | Does a stakeholder link expire on completion of its one request? | Yes, immediately on satisfaction, with reissue possible if the request reopens. | | |
| J6 | Which managed channel handles the rare case where a secret genuinely has to move? | Selected in `TASK-107` from the options that leave an audit trail without storing the secret in this system. | | |
| J7 | Must every decision marked `needs client approval` block kickoff readiness? | Yes. An unapproved decision keeps the engagement out of `ready for kickoff`. | | |
| J8 | What does the pilot measure? | Client completion time, repeated questions, reminders sent, time from acceptance to kickoff readiness, and client confidence about the next step. | | |
