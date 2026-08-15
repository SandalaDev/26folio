---
id: EPIC-025
title: "Client onboarding and engagement system — first usable release"
status: deferred
priority: P2
risk_level: critical
roadmap_refs: []
goal_refs: [GOAL-001, GOAL-004]
progress_weight: 1
---

# Epic: Client onboarding and engagement system — first usable release

## Deferred (owner decision, 2026-08-15)

Not started. The owner deferred this epic until there is budget to take it on
properly — it is the largest unplanned surface in the backlog (a separate
product with auth, payments, and document authority) and slicing it costs
real planning effort before any code exists.

Nothing here is cancelled and nothing is stale: the plan below stands as
written, no tasks were created, and the `## Owner decisions before approval`
list is still the correct entry point when it is picked up. `EPIC-026` was
planned ahead of it and carries the current priority.

## Outcome

The practice can move an accepted prospect from approved proposal to a
ready-to-start engagement without repeated questions, scattered attachments,
or uncertainty about what happens next. The client gets a calm, branded path
through acceptance, deposit, and tailored onboarding. Abe gets one reliable
record of the agreement, payment state, supplied material, decisions,
approvals, and next action.

The initial experience targets no more than 15 minutes of client effort between
accepting the agreement and completing a typical onboarding checklist. This is
a hypothesis to validate with real engagements, not a public promise.

## Project boundary

This is a new private client-operations product, not a database or authenticated
area added to `sandala.dev`. The portfolio remains the static, public front door
defined by the current charter. Its eventual integration is limited to handing
an approved enquiry into the private system.

The implementation repository, deployment boundary, application stack, auth,
data store, payment provider, document storage, and model provider remain
undecided. If this epic is approved, those choices require an architecture
dependency plan and version-matched OpenSrc research before implementation.

## Experience contract

- Ask for information once, reuse it with visible provenance, and let the
  client correct it.
- Ask only for what is relevant now and explain why each request matters.
- Give the client one obvious next action and show what happens after it.
- Keep AI backstage. Clients experience preparedness and speed, not an AI
  performance.
- Keep consequential judgment human: commitments, pricing, scope, legal terms,
  approvals, and substantive external communication.
- Preserve an authoritative record rather than relying on inbox history or a
  folder of similarly named PDFs.

## Signature workflow

```text
Review proposal
→ Accept and sign agreement
→ Pay project deposit
→ Complete tailored onboarding
→ Ready for kickoff
```

1. Abe approves and issues one immutable proposal and service-agreement
   version.
2. The intended signer opens a private, expiring link and reviews or downloads
   the complete agreement.
3. The signer provides their full name, company, role, and claimed authority;
   deliberately selects an unchecked agreement control; and activates an
   explicit `Accept and sign agreement` action.
4. The system records the signer, exact acceptance wording, agreement version,
   document hash, UTC time, and proportionate security evidence. It generates
   an acceptance receipt and immutable copy for both parties.
5. The signed state reveals `Pay project deposit`, with the exact amount,
   currency, invoice reference, and payment terms.
6. Only a verified, idempotently processed payment event marks the deposit as
   paid and activates onboarding. A browser redirect never authorises kickoff.
7. Completing the essential onboarding requests moves the engagement to
   `ready for kickoff`.

This flow is intended for ordinary consulting agreements. The contract
template, acceptance ceremony, deposit terms, and jurisdiction-specific limits
require human and legal review. Agreements requiring advanced signatures or
other formalities use a managed signing provider outside this workflow.

## Scope

### Canonical engagement record

- Client, company, stakeholders, opportunity source, engagement, outcomes,
  scope, assumptions, dependencies, commercial terms, and current state.
- Source-linked discovery facts with explicit human approval before they become
  commitments.
- Audit history for acceptance, payment, document, decision, approval, and
  onboarding events.

### Proposal acceptance and deposit gate

- Hosted proposal and combined service-agreement view with an authoritative
  version and downloadable copy.
- Auditable click-to-accept ceremony described above; no self-hosted electronic
  signature platform.
- Deposit request, verified payment-state transitions, retry handling, receipt,
  and explicit separation between `signed`, `deposit paid`, and `ready for
  kickoff`.

### Client onboarding concierge

- A branded, mobile-friendly welcome reached without unnecessary account
  creation.
- A scope-derived checklist with prefilled answers, expected completion time,
  save-and-resume behaviour, examples, and reasons for each request.
- One prominent next action, clear progress, and a clear distinction between
  work waiting on the client and work underway with Abe.
- Relevant asset and document requests, safe uploads, and the ability to assign
  a request to another stakeholder.
- Secure access status tracking; credentials are never collected in ordinary
  forms, messages, or documents.

### Document and decision room

- Current authoritative agreement, invoices, receipts, approved briefs,
  decisions, and handover material.
- Version, status, provenance, access control, download, and export for each
  record.
- Decision entries that capture the decision, owner, date, consequences,
  related scope, evidence, and whether client approval is required.
- Source-cited retrieval across approved engagement knowledge. Unsupported AI
  answers must say that the record is insufficient.

### Internal operating view

- A short queue of prospects, clients, missing inputs, approvals, payments,
  documents, and decisions that require Abe's attention.
- AI-assisted research, extraction, classification, comparison, drafting, and
  recommendations, with evidence and an approval step wherever output could
  affect the client or engagement.
- A generated kickoff brief containing approved scope, supplied assets,
  dependencies, decisions, unresolved questions, and project-system handoff.

## Acceptance criteria

- [ ] One representative engagement can complete the full signature workflow
      without duplicated data entry or manual copying between stages.
- [ ] The client always sees one next action, why it matters, and what follows.
- [ ] Agreement acceptance is attributable to the intended signer and bound to
      an immutable, recoverable agreement version.
- [ ] Onboarding cannot activate from a payment redirect, duplicate webhook, or
      unverified client-side event.
- [ ] Documents and decisions expose their authoritative version, source,
      status, access, and approval history.
- [ ] One client cannot access another client's records, links, files, or
      derived AI context.
- [ ] Interrupted acceptance, payment, upload, and onboarding flows can resume
      without losing confirmed work or creating duplicate records.
- [ ] The experience works on mobile, by keyboard, with assistive technology,
      and without non-essential motion.
- [ ] Abe can export the engagement record and its authoritative documents
      without vendor lock-in.
- [ ] The first pilot produces evidence for client completion time, repeated
      questions, missing-input reminders, time from acceptance to kickoff
      readiness, and client confidence about the next step.

## Non-goals

- No full CRM, automated outreach, sales forecasting, team chat, developer task
  tracking, accounting suite, or replacement for Linear.
- No self-hosted Documenso, home-grown cryptographic signature service, or
  claim that ordinary click acceptance satisfies every kind of agreement.
- No public AI diagnostic, autonomous pricing, autonomous proposal sending,
  general client chatbot, unexplained client-health score, or adversarial
  scope-drift enforcement in the first release.
- No ordinary storage of passwords, API keys, recovery codes, or other client
  credentials.
- No implementation inside the static portfolio application and no package or
  platform selection before the required architecture evidence is approved.

## Tasks

No tasks are created while this epic is in draft. After owner approval, apply
the `ds-task-slicer` skill to produce bounded tasks with acceptance criteria,
dependencies, intent traceability, and advisory file scopes.

Likely slicing lanes are product and architecture evidence, the engagement
record, acceptance and payment, client onboarding, documents and decisions,
internal AI assistance, portfolio handoff, and validation. These are review
prompts, not committed task boundaries.

## Dependency / Architecture Evidence

- plan: required after epic approval

Before choosing or installing the application framework, authentication, data
access, payments, document storage, AI providers, email, observability, or
deployment foundation:

1. Use `bash scripts/os.sh deps plan architecture ...` with exact candidates.
2. Apply `opensrc-research` to version-matched source and official docs.
3. Cross-check engines, peers, migrations, security assumptions, overlapping
   responsibilities, hosting constraints, and exit paths.
4. Obtain the required human approval on the dependency plan before install.

## Testing

- recommendation: dedicated test task, created during post-approval slicing
- rationale: This epic handles contract acceptance evidence, payments,
  confidential client data, document authority, access isolation, and AI-derived
  project knowledge. A failure could start unpaid work, expose another client's
  information, alter the accepted record, or misstate an approved decision.
  Dedicated coverage should exercise authorization and client isolation,
  immutable acceptance records, payment-webhook verification and idempotency,
  state transitions, document versioning, resumable failure paths, export, and
  source-grounded AI behaviour. A manual QA checklist should cover the complete
  client journey on mobile and desktop, keyboard and assistive-technology use,
  email delivery, payment failure and retry, expired links, and recovery from
  interrupted uploads. Tests cannot prove legal enforceability or that the
  experience feels impressive; counsel review and a real pilot remain separate
  human evidence.

The dedicated task is deliberately not scaffolded before the epic itself is
approved and sliced. The owner may accept, decline, or reprioritize the testing
recommendation with the rest of the backlog.

## Owner decisions before approval

- Confirm that this system becomes a separate product boundary rather than part
  of the static portfolio.
- Confirm whether it follows portfolio launch readiness or interrupts it; P2
  after the launch baseline is the current recommendation.
- Approve or revise the 15-minute onboarding-effort hypothesis.
- Approve the ordinary-agreement click acceptance policy and commission legal
  review of the agreement, deposit, cancellation, privacy, and retention terms.
- Define the deposit policy and currencies that the first release must support.
- Name the first representative engagement or synthetic fixture used to prove
  the end-to-end workflow.
