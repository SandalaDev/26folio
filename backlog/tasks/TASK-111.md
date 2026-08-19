---
id: TASK-111
title: "Build immutable proposal issuance and hosted review"
status: ready
priority: P2
risk_level: high
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 1
files_allowed:
  - planning/client-ops/
  - ../sandala-client-ops/src/proposals/
  - ../sandala-client-ops/src/documents/
  - ../sandala-client-ops/src/client/
  - ../sandala-client-ops/migrations/
  - ../sandala-client-ops/tests/proposals/
skill_refs: [writing-style]
---

# Task: Build immutable proposal issuance and hosted review

## Purpose

Generate a clear proposal and service-agreement experience from approved facts
without allowing issued terms to drift. Acceptance in TASK-112 is meaningful
only if the system can prove exactly which version the client reviewed.

## Desired outcome

Abe can compose a draft from verified engagement data, review it, issue one
immutable version to a named client, and give that client a calm mobile-friendly
review/download experience. Editing creates a new draft/version; it never
rewrites an issued record.

## Read first

- `planning/client-ops/product-contract.md`
- Approved legal/commercial outputs from TASK-106
- `planning/client-ops/domain-model.md`
- TASK-110 authorization policy and audit interface

## Scope and instructions

### Structured proposal model

Implement proposal records using structured, source-linked fields rather than
an opaque editable PDF. At minimum support:

- Client legal name and engagement reference.
- Context/problem and desired outcomes.
- Included scope and explicit exclusions.
- Assumptions, dependencies, and client responsibilities.
- Delivery approach and milestones if approved.
- Commercial terms, deposit amount/currency, and payment timing.
- Approved clauses from a controlled clause/template source.
- Version, status, author, approver, issue time, recipient, and source fact IDs.

AI may assist drafting only in TASK-117. This task uses approved data and human
edits; it must not invent clauses, prices, outcomes, or commitments.

### Draft, approve, and issue

- Abe may create and revise drafts.
- Issuance requires an explicit internal review/approval action.
- Issuance snapshots all rendered content and source references, assigns an
  immutable version ID, calculates a canonical content/document hash, records
  the intended signer, and writes an audit event.
- Changes after issuance create a new draft and later a new version. The old
  version remains accessible and clearly superseded if another is issued.
- Only one version may be authoritative for acceptance at a time unless the
  product contract explicitly allows multiple concurrent offers.

### Hosted client review

Build an accessible, responsive review route protected by TASK-110's approved
client access flow. It must:

- Identify the client, engagement, version, and issue date.
- Present the complete terms in readable sections with persistent progress or
  navigation for a long document.
- Expose a downloadable immutable copy generated from the same snapshot.
- Clearly label superseded, expired, cancelled, or already accepted versions.
- Show the next action without enabling acceptance yet; TASK-112 owns the
  ceremony.
- Avoid dark patterns, prechecked agreement controls, or hidden terms.

### Rendering and recovery

Use the document-rendering approach approved in TASK-107. Rendering jobs must
be retryable and idempotent. Store the snapshot and hash independently of the
rendered file so a missing derivative can be regenerated and verified.

## Acceptance criteria

- [ ] Proposal content comes from approved structured fields and controlled
      clauses; missing data is visible rather than fabricated.
- [ ] Draft changes do not alter an issued version.
- [ ] Issuance requires Abe's explicit approval and records recipient, version,
      snapshot, hash, sources, timestamp, status, and audit event atomically.
- [ ] Reissuing creates a new version and clearly supersedes the old one without
      deleting its history.
- [ ] Hosted review and downloadable copy represent the same hashed snapshot.
- [ ] Unauthorized, expired, revoked, wrong-client, or superseded access cannot
      expose or accept the proposal.
- [ ] The review works on small screens, keyboard, and assistive technology and
      keeps the complete terms available before any acceptance action.
- [ ] Rendering retries do not create duplicate proposal versions.
- [ ] Proposal tests, lint, strict typecheck, migrations, and build pass.

## Non-goals

- No acceptance checkbox/button, acceptance receipt, payment checkout,
  autonomous AI proposal generation, or final legal-clause authorship.
- No general document editor or template marketplace.

## Dependencies and handoff

- Depends on: TASK-110 authorization/audit and TASK-109 domain state.
- Blocks: TASK-112 and all later client-flow tasks.
- Handoff evidence: schema, controlled template/clauses interface, issuance
  command, review/download routes, hashes, audit events, and tests.

## Testing

- recommendation: dedicated: TASK-119, plus focused checks in this task
- rationale: Test immutable versioning, snapshot/hash agreement, supersession,
  authorization, and idempotent rendering here. TASK-119 later validates the
  full legal/payment journey and recovery after real service failures.

## Execution guardrail

If approved legal wording or deposit terms are missing, render a blocking
internal validation error. Never fill gaps with plausible copy.
