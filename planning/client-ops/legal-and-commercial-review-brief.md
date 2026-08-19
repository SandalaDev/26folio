---
id: client-ops-legal-and-commercial-review-brief
title: "Client operations — legal and commercial review brief"
epic_ref: ../../backlog/epics/EPIC-025.md
task_ref: ../../backlog/tasks/TASK-106.md
status: awaiting-owner-review
owner_review: "decisions recorded 2026-08-19; document read-through pending"
counsel_review: not-started
created: 2026-08-19
---

# Legal and commercial review brief

Questions for qualified counsel and for the owner, prepared so that
[TASK-107](../../backlog/tasks/TASK-107.md) knows which answers architecture
must keep configurable.

**This document is not legal advice and contains no drafted clauses.** It does
not claim that the acceptance flow in
[product-contract.md](product-contract.md) is valid in any jurisdiction. That
judgement belongs to a qualified lawyer reviewing the real agreement, the real
clients, and the real jurisdictions involved.

Nothing built from EPIC-025 may publish client-facing legal, privacy, or
compliance wording without human approval. Agents may draft it; a person
approves it, and counsel approves anything that carries legal weight.

## What counsel is being asked to review

A short factual description, so counsel reviews the mechanism rather than a
summary of it.

1. Abe issues one immutable proposal and service-agreement version and sends a
   private, expiring link to a named intended signer.
2. The signer opens the link, reviews the complete agreement, and can download
   it before acting.
3. The signer supplies full name, company, role, and a statement of authority
   to bind the company.
4. The signer deliberately selects an unchecked control that references the
   specific agreement version, then activates a separate, explicitly labelled
   accept action.
5. The system records the supplied identity, the exact acceptance wording
   displayed, the agreement version, the document hash, the UTC time, and
   proportionate security evidence, then issues an acceptance receipt and an
   immutable copy to both parties.
6. A deposit is requested after acceptance. Only a verified payment event
   marks it paid.

No cryptographic signature service is self-hosted, and no claim is made that
this ceremony suits every agreement type.

## Questions for counsel

### Jurisdiction and reach

- Which law governs the standard consulting agreement, and where are disputes
  resolved?
- The practice expects clients in several countries, including clients outside
  the practice's own jurisdiction. Which of those relationships can use the
  standard agreement unchanged, and which need country-specific handling?
- Does any expected client type fall under consumer protection rules rather
  than business-to-business rules, and does that change the acceptance flow?

### Acceptance method

- For which categories of ordinary consulting agreement is click acceptance
  with the evidence listed above acceptable?
- Which agreement types must instead use a managed or advanced electronic
  signature service, or a wet signature? Assignments of intellectual property,
  agreements involving land or regulated data, and anything requiring
  notarisation or witnessing are the categories the product currently assumes
  it must route elsewhere. Is that list right, and what is missing?
- How should the product behave when an agreement is out of scope for click
  acceptance? The current intent is to refuse the ceremony and route the
  agreement to a managed signing provider outside this workflow.

### Signer authority

- What representation of authority is sufficient: a self-declared role and
  confirmation, a named authorised signatory recorded in advance, or something
  stronger?
- What should happen when the person who opens the link is not the intended
  signer, or forwards it to someone else?
- Is any verification of identity expected beyond a private link to a named
  email address, and if so, what kind?

### Evidence and the receipt

The receipt currently proposes to carry: signer name, company, role, claimed
authority, the exact acceptance wording shown, agreement version, document
hash, UTC timestamp, the engagement reference, and proportionate technical
evidence of the session.

- Is this the right evidence set, and what should be added or removed?
- How long must acceptance evidence be retained, and in what form must it be
  producible if the agreement is later disputed?
- Does the client need the receipt delivered by a specific channel, or is
  download plus an emailed copy sufficient?

### Data, privacy, and AI

- What privacy notice must the client-facing product show, and who authors it?
- What lawful basis covers processing the client's data and their staff's
  contact details, and what notice must those staff receive?
- The product uses AI internally to draft, extract, classify, and compare
  engagement material, with a human approving anything the client receives.
  What disclosure is required, and is consent required rather than notice?
- Which categories of client material must be excluded from AI processing by
  default?
- Are there restrictions on where client documents and engagement data may be
  stored or processed? This constrains the hosting decision in `TASK-107` and
  is the single most expensive answer to get late.
- What are the retention, deletion, and export obligations for engagement
  records and uploaded documents after an engagement ends?
- If meeting recordings or transcripts enter the product later, what consent
  is required from every participant?

### Payments

The owner has decided the first release accepts card and mobile money, with
mobile money offered to local clients only and the interface stating which
methods apply.

- Are there licensing, tax invoicing, or receipting requirements attached to
  collecting a deposit in the practice's jurisdiction, and do they change
  between card and mobile money?
- Does collecting local deposits by mobile money carry any registration or
  reporting obligation the practice does not already meet?
- Do either of these methods carry obligations the product must reflect in
  what it shows the client before payment, such as a tax breakdown or a
  specific receipt format?
- Does offering different payment methods to local and international clients
  raise any issue counsel would want changed?

## Questions for the owner

Commercial questions counsel cannot answer.

- What is the deposit: a fixed amount, a percentage of the fee, or set per
  proposal?
- Which currency do card deposits settle in? Local mobile money deposits
  settle locally, and the card side is decided in `TASK-107` with provider
  coverage evidence attached.
- Is the deposit refundable, and under what conditions?
- How is the invoicing entity named on invoices and receipts?
- What are the cancellation and rescheduling terms, and what happens to a paid
  deposit under each?
- What makes a start date firm: acceptance, deposit, completed onboarding, or
  an explicit confirmation from Abe?
- What are the payment terms shown with the deposit request, and what happens
  when a deposit is never paid?
- Should taxes be shown separately on the deposit request, and at what rate?
- Who reviews client-facing legal and commercial wording before it is
  published, and how is that approval recorded?

## Effect on architecture

Answers that must stay configurable rather than hard-coded, because they may
change or may arrive after implementation begins:

- The acceptance wording, the agreement version bound to it, and the receipt's
  evidence set.
- Retention and deletion periods for engagement records, documents, and
  acceptance evidence.
- The list of agreement types routed away from click acceptance.
- Currency, tax presentation, and payment terms shown before payment.
- The privacy notice and AI disclosure text.

Answers that cannot be deferred, because they change the shape of the system:

- Data residency and processing location.
- Required payment methods.
- Whether identity verification stronger than a private link is required.

## Owner decisions

| # | Question | Recommended default | Owner decision | Date |
|---|---|---|---|---|
| L1 | Is counsel engaged for this review, and by when? | Engage before the first real pilot, not before `TASK-107`. Architecture can proceed on configurable assumptions. | | |
| L2 | Which jurisdiction is the practice's legal seat for these agreements? | `TBD — owner decision`. Nothing in the repository establishes this, and no task may infer it. | | |
| L3 | Do we accept that the pilot runs on ordinary consulting agreements only? | Yes. Anything needing advanced signature or notarisation stays outside this workflow in the first release. | | |
| L4 | Is there a data residency constraint on client documents and engagement data? | `TBD — owner decision`. Required before `TASK-107` selects hosting and storage. | None today. Region stays configurable so counsel can impose one later without a migration | 2026-08-19 |
| L5 | Is AI use disclosed to clients as notice, or is explicit consent captured? | Notice in the privacy statement plus a plain sentence in the client-facing experience, upgraded to consent if counsel requires it. | | |
| L6 | What is the default retention period for engagement records and uploaded documents? | Keep for the life of the engagement plus a period counsel confirms. Make it configurable and record deletions. | | |
| L7 | May client documents be processed by a third-party model provider? | `TBD — owner decision`, and it constrains provider selection in `TASK-107`. | Yes, under commercial terms that exclude training on the data. Terms are evidence `TASK-107` must record | 2026-08-19 |
| L8 | Who approves client-facing legal and compliance copy? | Abe, after counsel review, with the approval recorded on the document version. | | |

L4 and L7 were answered by the owner on 2026-08-19 and are recorded in
`project-state/decisions.md`. Neither answer is a legal opinion: L4 says no
constraint is known today, and L7 approves third-party processing on
commercial terms. Counsel can still narrow both, which is why region and model
provider stay configuration rather than assumptions in code.

L2 blocks the first real pilot rather than the architecture work, and it is
also the question the mobile money decision makes harder to defer, since
payment licensing and tax invoicing follow the practice's legal seat.
Counsel-dependent items may stay open while architecture keeps them
configurable, and an open item is never treated as approved.
