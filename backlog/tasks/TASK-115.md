---
id: TASK-115
title: "Build the authoritative document and decision room"
status: ready
priority: P2
risk_level: high
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 1
files_allowed:
  - planning/client-ops/
  - ../sandala-client-ops/src/documents/
  - ../sandala-client-ops/src/decisions/
  - ../sandala-client-ops/src/client/
  - ../sandala-client-ops/src/exports/
  - ../sandala-client-ops/migrations/
  - ../sandala-client-ops/tests/records/
skill_refs: [writing-style]
---

# Task: Build the authoritative document and decision room

## Purpose

Replace scattered attachments and “I thought we agreed” memory with a controlled
room that shows the current authoritative record while preserving every prior
version, source, approval, and access event.

## Desired outcome

Clients can find the current agreement, acceptance receipt, payment receipt,
approved brief, decisions, and later handover material without browsing an
internal project tool. Abe can create, supersede, approve, export, and recover
records. Nobody can silently overwrite or mistake an old version for the
current authority.

## Read first

- TASK-111 proposal/version model
- TASK-112 acceptance record
- TASK-113 payment record
- TASK-114 uploaded assets/facts
- TASK-110 authorization and audit conventions
- Retention/export decisions from TASK-106

## Scope and instructions

### Document registry

Implement a registry separate from raw blob storage. Each document record needs:

- Organization and engagement scope.
- Type, title, stable logical document ID, version ID, status, and authority
  flag/current-version relationship.
- Source record(s), uploader/generator, created/issued/approved/superseded times,
  content hash, storage object reference, sensitivity, visibility, retention
  class, and audit references.
- States appropriate to the first release, such as draft, internal review,
  issued, approved, superseded, archived, or quarantined.

Only explicit domain operations may promote, supersede, archive, or change
visibility. Replacing a file creates a new version.

### Decision register

Support structured decisions with:

- Decision statement and context.
- Alternatives considered when supplied.
- Decision owner and affected stakeholders.
- UTC decision date and status.
- Consequences and related scope/onboarding/document references.
- Evidence/source links.
- Whether client approval is required.
- Approval request, response, approver, time, and exact version.

AI may propose extraction in TASK-117, but only a human-approved entry becomes
authoritative.

### Client room

Build a simple mobile-friendly view grouped by current documents, decisions
requiring action, and history. It must:

- Lead with current authoritative items.
- Clearly label drafts, superseded/archived versions, pending approval, and
  internal-only items.
- Allow authorized download through short-lived scoped access.
- Present one pending approval action at a time with the exact decision version.
- Never expose internal notes or other clients through search, IDs, or file URLs.

### Export and retention

Implement an engagement export containing a machine-readable manifest, domain
records, document metadata, decisions/approvals, audit references allowed by
policy, and authoritative files. The manifest must include hashes so integrity
can be checked. Exports are authorized, audited, generated asynchronously,
expiring, and isolated.

Implement approved archive/retention markers and deletion requests as explicit
workflows. Do not hard-delete authoritative evidence merely because a UI record
is hidden. Actual legal retention policy remains owner/counsel-approved.

## Acceptance criteria

- [ ] Every document has scope, type, stable identity, version, status, source,
      hash, visibility, retention class, and storage reference.
- [ ] Replacing/superseding creates a new version and never changes the bytes or
      hash of an issued/approved version.
- [ ] One current authoritative version is obvious to both client and operator.
- [ ] Decision approval binds the approver to one exact decision version and
      preserves later changes as new versions.
- [ ] Internal/quarantined records never appear to clients.
- [ ] Downloads and exports are short-lived, authorized, audited, client-scoped,
      and cannot be enumerated.
- [ ] Export contains a verifiable manifest and all required authoritative
      records without provider-specific lock-in.
- [ ] Archive/retention/deletion workflows preserve required evidence and expose
      honest status.
- [ ] Document/decision tests, lint, strict typecheck, migrations, and build pass.

## Non-goals

- No collaborative word processor, arbitrary folder tree, general cloud drive,
  autonomous document deletion, accounting archive, or legal-retention claim.
- No AI Q&A; TASK-117 owns evidence-grounded retrieval.

## Dependencies and handoff

- Depends on: TASK-114, TASK-113, TASK-112, and TASK-110.
- Blocks: TASK-116, TASK-117, and TASK-119.
- Handoff evidence: registry/version operations, decision/approval flow, client
  room, export/manifest job, retention markers, audit events, and tests.

## Testing

- recommendation: dedicated: TASK-119, plus focused checks here
- rationale: Authority, isolation, and export integrity are high-risk. Test
  immutable versions, exact-version approval, visibility, scoped downloads,
  export hashes, retry/idempotency, and retention status now. TASK-119 later
  audits the complete engagement package and cross-client denial paths.

## Execution guardrail

Never infer “current” from the newest timestamp or filename. Authority must be
an explicit, validated relationship created by a domain operation.
