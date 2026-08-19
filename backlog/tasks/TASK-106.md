---
id: TASK-106
title: "Confirm the first-release product contract and pilot journey"
status: in-progress
blocked: "owner decisions P6, P11, L4, L7 — payment methods, data residency, model-provider access"
priority: P2
risk_level: medium
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 1
files_allowed:
  - backlog/epics/EPIC-025.md
  - planning/client-ops/
  - project-state/decisions.md
skill_refs: [writing-style]
---

# Task: Confirm the first-release product contract and pilot journey

## Purpose

Turn the approved epic into an unambiguous first-release contract before any
technical architecture is selected. Later tasks must not guess who the first
client is, what “deposit paid” means, which onboarding inputs are essential, or
where ordinary click acceptance stops being appropriate.

## Desired outcome

The owner can review one concise product packet and explicitly approve the
first pilot journey, commercial assumptions, legal-review boundary, success
signals, and product sequencing. `TASK-107` can then research architecture
against concrete needs instead of a generic portal wishlist.

## Read first

1. `backlog/epics/EPIC-025.md` — authoritative scope and experience contract.
2. `project-spine/01-charter.md` — portfolio position and human authority.
3. `project-spine/02-decisions.md` — the static portfolio boundary.
4. The relevant sections of `project-spine/00-original-intent.md` about
   consulting positioning and qualified opportunities.

## Scope and instructions

Create `planning/client-ops/` if it does not exist, then produce three linked
documents. Use questions and explicit `TBD — owner decision` markers rather
than inventing commercial or legal facts.

### 1. `product-contract.md`

Define the smallest first release:

- Primary operator: Abe.
- Primary client roles: intended signer, project contact, and a stakeholder who
  may be assigned an onboarding request.
- The exact lifecycle from approved opportunity to `ready for kickoff`.
- What one canonical engagement record contains.
- What clients can see, what only Abe can see, and what AI may process.
- The rule that there is one obvious client action at a time.
- What “signed”, “deposit paid”, “onboarding active”, and “ready for kickoff”
  each mean. Do not collapse these states.
- First-release scope and the epic's non-goals.
- The intended relationship to `sandala.dev`: a narrow handoff into a separate
  product, never an authenticated section or database added to the portfolio.
- Service expectations that architecture must support, such as mobile use,
  expiring links, resumability, export, auditability, and recovery.

### 2. `pilot-journey.md`

Describe one representative journey end to end. Use either a named real pilot
approved by the owner or a clearly labelled synthetic company. Include:

- The starting enquiry and approved discovery facts.
- The proposal version the client receives.
- Signer identity, company, role, and claimed authority.
- Agreement review and explicit click acceptance.
- Deposit amount/currency as a placeholder until the owner supplies it.
- A failed-payment path and successful retry.
- A project-specific onboarding checklist with essential and optional items.
- One request delegated to another stakeholder.
- One safe document upload and one secure credential handoff that occurs
  outside ordinary uploads.
- One client decision requiring approval.
- The generated kickoff brief and final `ready for kickoff` state.
- What the client sees after every action, especially who acts next.

Add a state table with `starting state`, `event`, `resulting state`, `actor`,
and `evidence recorded`. This table becomes the input for `TASK-109`.

### 3. `legal-and-commercial-review-brief.md`

Prepare questions for qualified counsel and for the owner. Do not draft final
legal clauses and do not claim the click flow is valid for every jurisdiction.
Cover:

- Governing law and cross-border client treatment.
- Which ordinary consulting agreements may use click acceptance.
- Which agreement types require a managed or advanced signature method.
- Signer authority and how it is represented.
- Deposit amount or formula, supported currencies, taxes, refundability,
  cancellation, rescheduling, and when a start date becomes firm.
- Privacy notice, AI disclosure/consent, file retention, deletion, export, and
  transcription consent if meeting data enters the product later.
- Evidence that should appear in an acceptance receipt.
- Human review required before any client-facing legal or compliance copy is
  published.

### Owner review

End each document with a decision table: `question`, `recommended default`,
`owner decision`, and `date`. Recommendations must be labelled as
recommendations. The task is complete only when the owner has resolved the
decisions that materially affect architecture; counsel-dependent items may
remain explicitly pending if architecture can safely keep them configurable.

Record durable owner decisions through `bash scripts/os.sh decide ...`; do not
hand-edit generated state or pretend silence is approval.

## Acceptance criteria

- [ ] The three planning documents exist and link back to EPIC-025.
- [ ] The first release has named actors, visible permissions, states, entry and
      exit conditions, and explicit non-goals.
- [ ] The representative journey covers acceptance, a failed and successful
      deposit attempt, tailored onboarding, delegation, documents, decisions,
      and kickoff readiness.
- [ ] Every state transition identifies the event and evidence that authorises
      it; browser redirects are not treated as payment evidence.
- [ ] Deposit, currency, sequencing, pilot identity, legal review, retention,
      and AI disclosure decisions are either owner-approved or clearly marked
      as unresolved constraints.
- [ ] The product packet preserves the separate-product boundary and does not
      select a stack or provider.
- [ ] Public/legal/commercial wording is identified as requiring human approval.
- [ ] The owner can approve the packet without needing this chat for context.

## Non-goals

- No application code, repository creation, UI mockups, package research, or
  provider selection.
- No final contract clauses, privacy policy, pricing, or legal conclusion.
- No expansion into CRM campaigns, accounting, developer task tracking, or a
  general client chatbot.

## Dependencies and handoff

- Depends on: owner reactivation of EPIC-025, recorded 2026-08-19.
- Blocks: TASK-107 and every implementation task.
- Handoff evidence: the three approved files under `planning/client-ops/` and
  durable decisions recorded through the OS.

## Testing

- recommendation: with-task
- rationale: This task changes no runtime behaviour. Validate it by tracing the
  representative journey against every epic acceptance criterion and by owner
  review of the decision tables. Automated tests would not prove that the
  commercial and legal assumptions are correct.

## Execution guardrail

If an unresolved answer would change authentication, payment support, legal
evidence, tenancy, data residency, or the product boundary, stop and request
the owner decision. Do not choose the easiest implementation and disguise it
as a product decision.
