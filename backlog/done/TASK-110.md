---
id: TASK-110
title: "Implement authorization, client isolation, and audit history"
status: done
priority: P2
risk_level: critical
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 1
files_allowed:
  - planning/client-ops/security-baseline.md
  - ../sandala-client-ops/src/auth/
  - ../sandala-client-ops/src/authorization/
  - ../sandala-client-ops/src/audit/
  - ../sandala-client-ops/src/data/
  - ../sandala-client-ops/migrations/
  - ../sandala-client-ops/tests/security/
skill_refs: []
---

# Task: Implement authorization, client isolation, and audit history

## Purpose

Establish who may access each engagement and preserve evidence of important
actions before any confidential client screen is built. Authentication answers
“who is this?”; authorization must separately answer “may this person act on
this exact organization, engagement, record, or file?”

## Desired outcome

Abe can access every engagement as the operator. A client receives only the
minimum approved access to their own engagement. A guessed identifier, reused
link, stale membership, storage URL, search query, or background job cannot
cross the client boundary. Security-relevant and business-relevant actions
produce append-only audit evidence.

## Read first

- `planning/client-ops/security-baseline.md`
- `planning/client-ops/product-contract.md` role/visibility rules
- `planning/client-ops/domain-model.md`
- Official auth/session guidance selected in TASK-107

## Scope and instructions

### Identity and session flows

- Implement Abe's operator authentication using the approved method.
- Implement low-friction client access using the approved private-link, email
  verification, OTP, or session flow. Do not require a permanent password or
  account if TASK-106 did not approve one.
- Store invitation/link tokens only in a safe derived form, with purpose,
  engagement, intended recipient, expiry, use state, and revocation.
- Rotate or invalidate sessions when access is revoked or a sensitive action
  requires re-verification.
- Prevent open redirects and avoid leaking whether arbitrary client emails exist.

### Central authorization policy

Create one policy/service layer used by routes, server actions, jobs, storage
downloads, and AI retrieval. It must cover:

- Operator access.
- Organization membership.
- Engagement membership and role.
- Signer-only actions.
- Project-contact actions.
- Assigned stakeholder request actions.
- Client-visible versus internal-only records.
- Revoked, expired, archived, or cancelled access.

Use deny-by-default behaviour. Do not scatter `if (userId === ...)` checks
through UI components.

### Audit history

Implement append-only `AuditEvent` storage or the approved equivalent. Each
event must include stable event ID, event type, actor type/ID, organization and
engagement scope, target reference, UTC time, request/job correlation, source
channel, and safe metadata. Record at minimum:

- Authentication/invitation issued, consumed, expired, and revoked.
- Authorization denial for sensitive operations, without recording secrets.
- Domain-state changes.
- Later proposal issue, acceptance, payment, document, decision, export, and
  AI approval events through a typed audit interface.

Audit data must not contain raw tokens, credentials, full payment details, or
unbounded uploaded content.

### Storage and query boundary

Provide scoped repository/query helpers that require organization/engagement
context. If architecture uses database row-level security, apply and test it;
if not, document the equivalent enforcement. Provide signed/authorized file
access hooks for TASK-114 and TASK-115 without exposing public bucket keys.

## Acceptance criteria

- [x] Operator and client identities use the approved authentication method.
- [x] Client access tokens are purpose-bound, expiring, revocable, safely
      stored, and cannot be replayed beyond approved behaviour.
- [x] Authorization is centralized, deny-by-default, and applies equally to UI,
      APIs, jobs, storage, exports, and future AI retrieval.
- [x] A person assigned to Client A cannot read, enumerate, mutate, search,
      download, or infer Client B's data even with known IDs.
- [x] Revoked or expired access fails without changing data.
- [x] Audit events are append-only through application interfaces, attributable,
      scoped, correlated, timestamped, and free of secrets.
- [x] Domain state changes from TASK-109 emit audit events without breaking
      idempotency.
- [x] Security-focused tests cover positive access, cross-client denial,
      revoked/expired links, token replay, identifier guessing, and storage
      access.
- [x] Lint, strict typecheck, migrations, tests, and build pass.

## Non-goals

- No proposal content, acceptance wording, payment, onboarding screens,
  document room, AI search, or production identity migration.
- No home-grown cryptography. Use approved platform primitives correctly.
- No public sharing links for client files.

## Dependencies and handoff

- Depends on: TASK-109 domain model and TASK-108 foundation.
- Blocks: TASK-111 through TASK-119.
- Handoff evidence: auth flows, policy matrix, scoped data helpers, audit schema
  and interface, security tests, and updated security-baseline notes.

## Testing

- recommendation: dedicated: TASK-119, plus security tests in this task
- rationale: Client isolation is a critical invariant. Prove the basic policy
  matrix and common attacks here. TASK-119 must later repeat isolation checks
  across every feature adapter, storage path, export, background job, and AI
  retrieval route.

## Execution guardrail

Do not continue if any query or file operation can run without explicit client
scope. “The route already checked” is not enough for a reusable service.
