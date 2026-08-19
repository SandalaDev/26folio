---
id: TASK-113
title: "Integrate deposit collection and verified onboarding activation"
status: ready
priority: P2
risk_level: critical
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 1
files_allowed:
  - planning/client-ops/
  - <application-root-from-TASK-107>/src/payments/
  - <application-root-from-TASK-107>/src/client/
  - <application-root-from-TASK-107>/src/jobs/
  - <application-root-from-TASK-107>/migrations/
  - <application-root-from-TASK-107>/tests/payments/
skill_refs: []
---

# Task: Integrate deposit collection and verified onboarding activation

## Purpose

Make the deposit a real operational gate without trusting the browser or
starting unpaid work. Payment checkout is only a client interaction; the
verified provider event and domain transition are the authority.

## Desired outcome

After agreement acceptance, the client sees the exact deposit amount, currency,
invoice/reference, terms, and `Pay project deposit` action. A verified and
idempotently processed provider event records successful payment once, advances
the engagement through `deposit_paid`, activates onboarding, issues a receipt,
and tells both parties what happens next. Failed, abandoned, duplicate, delayed,
or out-of-order events remain recoverable.

## Read first

- Owner-approved deposit/currency/refund decisions from TASK-106
- Payment provider/version and webhook guidance from TASK-107
- TASK-109 state machine
- TASK-112 acceptance record and event
- TASK-110 audit/authorization conventions

## Scope and instructions

### Payment intent/checkout creation

- Create payment requests server-side from the authoritative proposal/deposit
  terms. Never trust amount, currency, client ID, or engagement ID from the
  browser.
- Attach stable internal references using provider-supported metadata.
- Reuse or safely replace an existing unpaid request according to provider
  rules; do not create a new charge on every page refresh.
- Present amount, currency, payment terms, supported methods, and honest status
  before redirecting/embedding approved checkout.
- Keep provider secrets and sensitive payment data out of the client and logs.

### Webhook/event processing

- Verify authenticity using the provider's official raw-body/signature method.
- Store provider event ID, type, safe payload reference, receipt time, processing
  state, and result.
- Process idempotently inside the approved transaction/outbox pattern.
- Match provider amount, currency, environment, account, and internal references
  to the expected deposit before advancing state.
- Handle duplicate, delayed, out-of-order, unknown, malformed, wrong-environment,
  and failed events without false activation.
- A success redirect may refresh display only; it must never mark payment paid.

### State, receipt, and onboarding activation

On confirmed payment:

- Create one authoritative payment record linked to acceptance/proposal.
- Advance `deposit_due → deposit_paid → onboarding_active` through TASK-109's
  commands.
- Emit audit events.
- Enqueue the approved payment receipt, client confirmation, Abe notification,
  and onboarding-initialization event.
- If downstream jobs fail, preserve payment truth and retry those jobs. Never
  ask the client to pay again because email or onboarding creation failed.

Implement display/reconciliation for pending, failed, cancelled/expired, paid,
and approved refund/dispute states required by TASK-106. Do not build full
accounting.

## Acceptance criteria

- [ ] Checkout amount, currency, engagement, and recipient come only from the
      authoritative server record.
- [ ] The client sees exact deposit details and status before acting.
- [ ] Webhooks use official verification and reject forged or wrong-environment
      events without state changes.
- [ ] Browser redirects cannot set payment or onboarding state.
- [ ] Duplicate/retried/concurrent events create one logical payment, receipt,
      audit trail, and onboarding activation.
- [ ] Amount/currency/reference mismatches are quarantined for operator review.
- [ ] Delayed or out-of-order events reconcile safely.
- [ ] Payment truth survives downstream email, receipt, or onboarding-job
      failure and those effects can retry independently.
- [ ] Failed/abandoned payment allows a safe retry without duplicate charging.
- [ ] Provider sandbox tests, webhook fixtures, lint, strict typecheck,
      migrations, and build pass.

## Non-goals

- No full invoicing/accounting ledger, tax engine, subscription billing,
  autonomous refunds, chargeback adjudication, or manual card handling.
- No onboarding checklist UI; TASK-114 owns it.

## Dependencies and handoff

- Depends on: TASK-112 acceptance, TASK-110 audit/security, TASK-109 state
  machine, and approved payment architecture.
- Blocks: TASK-114 through TASK-119.
- Handoff evidence: checkout creation, verified event endpoint, reconciliation
  states, payment record, state transitions, receipt/activation jobs, sandbox
  evidence, and tests.

## Testing

- recommendation: dedicated: TASK-119, plus provider-focused checks here
- rationale: Payment errors create financial and trust harm. Exercise official
  sandbox success/failure flows, forged signatures, amount mismatch, duplicate,
  concurrency, delayed/out-of-order delivery, failed downstream jobs, and retry
  now. TASK-119 validates the complete acceptance-to-onboarding gate.

## Execution guardrail

If the provider cannot support the approved currency, verification method, or
metadata/reconciliation requirements, stop and return to TASK-107. Never weaken
the gate to make the integration appear complete.
