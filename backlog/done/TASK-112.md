---
id: TASK-112
title: "Implement auditable click acceptance and acceptance receipts"
status: done
priority: P2
risk_level: critical
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 1
files_allowed:
  - planning/client-ops/
  - ../sandala-client-ops/src/acceptance/
  - ../sandala-client-ops/src/proposals/
  - ../sandala-client-ops/src/client/
  - ../sandala-client-ops/src/documents/
  - ../sandala-client-ops/migrations/
  - ../sandala-client-ops/tests/acceptance/
skill_refs: [writing-style]
---

# Task: Implement auditable click acceptance and acceptance receipts

## Purpose

Turn deliberate client assent into durable evidence bound to one immutable
agreement version. The product does not need a drawn signature, but it must be
able to show who acted, what they agreed to, when, under what authority claim,
and that the accepted content has not changed.

## Desired outcome

The intended signer reviews the complete issued agreement, verifies their
identity as required, enters/affirms their name, company, role, and authority,
checks an initially empty agreement control, and activates an explicit
`Accept and sign agreement` action. Both parties receive an immutable acceptance
copy and receipt. The engagement moves once to `agreement_accepted` and then
`deposit_due`.

## Preconditions

- TASK-106's acceptance wording and legal-review boundary have human approval.
- The agreement type is eligible for ordinary click acceptance. If the record
  requires an advanced/managed signature, the UI must stop and route it outside
  this workflow.
- TASK-111 has an issued, current, immutable proposal version.

## Scope and instructions

### Signing ceremony

- Require the approved signer authentication/re-verification from TASK-110.
- Show the exact agreement version and a clear way to review/download it.
- Collect or confirm full legal name, company, role/title, and claimed authority.
- Use an unchecked control with owner/counsel-approved wording that names the
  agreement version/date and the electronic intent to accept.
- Keep the final action disabled until required information is present and the
  unchecked control is deliberately selected.
- Label the action exactly and clearly; do not use ambiguous `Continue`, hide
  terms behind links, or treat viewing/scrolling as acceptance.
- Give the signer a final confirmation state before exposing payment.

### Atomic acceptance record

In one transactional domain operation:

- Confirm the version is current, issued, eligible, unexpired, and assigned to
  this signer/organization.
- Recompute/verify the canonical hash.
- Store signer identity references, supplied identity/authority fields, exact
  acceptance wording, agreement version/hash, UTC time, approved security
  metadata, and request correlation.
- Advance the state through `agreement_accepted` to `deposit_due` according to
  TASK-109's state machine.
- Write audit events and enqueue receipt/document work through an idempotent
  outbox/job pattern approved in TASK-107.

Never store raw authentication tokens, unnecessary fingerprinting data, or
secrets in the acceptance record.

### Receipt and immutable copy

Generate a human-readable receipt and accepted agreement copy containing the
approved evidence fields. Make both available to Abe and the signer, and send
the approved notification. The canonical database record remains authoritative;
the PDF is a verifiable derivative. A retry may regenerate delivery but never
create a second logical acceptance.

### Exceptional paths

Handle expired/revoked links, superseded versions, a second click, concurrent
submissions, identity mismatch, ineligible agreement type, receipt-rendering
failure, and notification failure. Acceptance may succeed while delivery is
retried, but the client must see an honest status.

## Acceptance criteria

- [x] The agreement control starts unchecked and the final action clearly
      communicates intent to accept/sign.
- [x] Acceptance is allowed only for the authenticated intended signer and the
      current eligible agreement version.
- [x] The record binds identity/authority fields, exact wording, immutable
      version/hash, timestamp, correlation, and approved security evidence.
- [x] A stale, superseded, altered, expired, revoked, cross-client, or ineligible
      agreement cannot be accepted.
- [x] Double clicks, retries, and concurrent requests create one acceptance and
      one logical state transition.
- [x] Acceptance receipt and immutable copy match the accepted hash and are
      recoverable if rendering/email initially fails.
- [x] Payment is shown only after authoritative acceptance, but no payment state
      is changed in this task.
- [x] Keyboard, screen-reader, mobile, error, and interrupted-session behaviour
      is clear and usable.
- [x] Acceptance/audit tests, lint, strict typecheck, migrations, and build pass.

## Non-goals

- No claim of universal legal enforceability, drawn signature, public PKI,
  self-hosted signing platform, deposit collection, or final legal drafting.
- No acceptance by email-open, page-view, scroll depth, or prechecked consent.

## Dependencies and handoff

- Depends on: TASK-111, TASK-110, TASK-109, and human-approved TASK-106 wording.
- Blocks: TASK-113 through TASK-119.
- Handoff evidence: ceremony UI, transactional acceptance command, immutable
  record, receipt/copy generation, notification retry, audit events, and tests.

## Testing

- recommendation: dedicated: TASK-119, plus adversarial checks in this task
- rationale: This is legal evidence and a critical state transition. Test stale
  versions, tampered hashes, wrong signer, expired links, double submit,
  concurrency, receipt failure, and notification retry now. TASK-119 performs
  the full manual ceremony and cross-system evidence audit.

## Execution guardrail

Any change to acceptance wording, evidence retention, eligible agreement types,
or signer verification requires human/legal review. Do not “improve” that copy
as ordinary UX prose.
