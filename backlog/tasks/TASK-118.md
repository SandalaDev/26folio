---
id: TASK-118
title: "Connect the portfolio handoff and lifecycle notifications"
status: ready
priority: P2
risk_level: medium
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 1
files_allowed:
  - planning/client-ops/
  - src/app/api/contact/
  - src/components/site/contact-form.tsx
  - ../sandala-client-ops/src/intake/
  - ../sandala-client-ops/src/notifications/
  - ../sandala-client-ops/src/jobs/
  - ../sandala-client-ops/tests/integration/
skill_refs: [writing-style]
---

# Task: Connect the portfolio handoff and lifecycle notifications

## Purpose

Join the existing public front door to the private client-operations product
without making the static portfolio depend on a database, authenticated client
area, or fragile downstream service. Deliver timely, useful notifications while
keeping the product itself—not email—as the authority.

## Desired outcome

An enquiry can enter the private system once through the owner-approved handoff,
without duplicate opportunities or lost contact email. Abe can approve/convert
it into the representative engagement. Lifecycle events send concise,
idempotent notifications with safe deep links and honest next steps. Delivery
failure is visible and retryable but never rewrites business truth.

## Read first

- `project-spine/01-charter.md` and `02-decisions.md`
- Existing portfolio contact route/form and Resend behaviour
- Handoff architecture from TASK-107
- TASK-109 opportunity/engagement model
- TASK-110 link/auth and audit rules
- TASK-113 through TASK-116 lifecycle events
- Owner-approved external copy/consent decisions from TASK-106

## Scope and instructions

### Portfolio-to-product handoff

Implement only the boundary approved in TASK-107. It may be an authenticated
server-to-server event or an operator import; do not invent a second public
client application inside `sandala.dev`.

The handoff must:

- Preserve the existing portfolio's primary contact-email delivery.
- Never block or falsely fail the visitor's successful enquiry because the
  private system is unavailable. Queue/retry or allow operator recovery.
- Send the minimum approved fields with consent/purpose context, source,
  submission ID/idempotency key, and UTC time.
- Authenticate and verify the sender at the private-system boundary.
- Reject forged, malformed, replayed, oversized, or unexpected payloads.
- Deduplicate retries into one opportunity while preserving delivery attempts.
- Keep public responses free of internal IDs, stack details, or client data.
- Let Abe review and explicitly convert/approve an opportunity. A public
  submission alone must not create a proposal or engagement commitment.

If the owner chooses manual import for the first release, implement a reliable
operator workflow and document it rather than building an unnecessary public
integration.

### Lifecycle notifications

Create controlled, owner-approved templates and idempotent notification jobs
for the first release:

- Enquiry received acknowledgement, if retained by the product contract.
- Proposal issued.
- Agreement accepted receipt/delivery status.
- Deposit due, payment failed/pending where useful, and deposit confirmed.
- Onboarding activated, request assigned, reminder approved by policy, and
  onboarding completed.
- Decision approval requested/completed.
- Engagement ready for kickoff.
- Operator alerts for payment mismatch, quarantined upload, repeated job
  failure, or expiring critical link.

Each notification must identify the engagement safely, state the action or
status, explain what happens next, and link to the exact authorized product
screen. Avoid sending sensitive proposal, payment, document, or decision
content in email when a secure link is enough.

### Delivery mechanics

- Use the approved queue/outbox and stable notification key so retries do not
  send logical duplicates.
- Record queued, attempted, delivered/provider-accepted, failed, suppressed,
  and retried states. Do not claim inbox delivery if the provider only accepted
  the message.
- Respect revocation, changed recipient, superseded proposal, cancelled
  engagement, and owner-approved reminder limits.
- Log/audit safely without message secrets or raw access tokens.
- Provide Abe a visible failed-notification item through TASK-116's queue.

## Acceptance criteria

- [ ] The portfolio remains static-first with no client auth, database, or
      private engagement records added to it.
- [ ] Existing contact delivery remains functional when the client-operations
      product is unavailable.
- [ ] Authenticated handoff/import creates one opportunity for repeated delivery
      of the same submission and rejects forged/replayed invalid payloads.
- [ ] Abe must approve conversion; an enquiry cannot automatically issue a
      proposal, accept terms, request money, or start onboarding.
- [ ] Every first-release lifecycle notification has owner-approved copy,
      recipient rules, triggering event, idempotency key, secure destination,
      and retry/suppression behaviour.
- [ ] Notifications contain no unnecessary confidential material or reusable
      raw tokens.
- [ ] Failures surface in the operator queue and retry without changing the
      underlying engagement/payment/document truth.
- [ ] Cancelled, superseded, revoked, or reassigned records do not send stale
      calls to action.
- [ ] Integration/notification tests, portfolio lint/typecheck/build, and client
      product lint/typecheck/build pass.

## Non-goals

- No marketing automation, newsletter, cold outreach, lead scoring, drip
  campaign, inbox sync, autonomous follow-up, or CRM forecasting.
- No replacement of the current portfolio contact experience with a chatbot.

## Dependencies and handoff

- Depends on: TASK-116 deterministic queue, TASK-113 payment events, TASK-114
  onboarding events, TASK-115 decisions, and TASK-107 handoff design.
- May proceed in parallel with TASK-117 if it consumes no AI output.
- Blocks: TASK-119.
- Handoff evidence: handoff/import endpoint or workflow, idempotency/recovery
  evidence, approved template catalog, notification jobs/status, operator error
  visibility, and integration tests.

## Testing

- recommendation: with-task
- rationale: Test portfolio-downstream failure tolerance, authentication,
  replay/deduplication, conversion approval, notification idempotency, stale
  suppression, safe content, and retry here. TASK-119 later exercises all
  notifications through the full pilot sequence.

## Execution guardrail

The contact form's job is to let a person reach Abe. Never make its success
depend on the private product, a model call, or an enrichment service.

