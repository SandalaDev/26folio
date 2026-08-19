---
id: TASK-114
title: "Build adaptive onboarding, stakeholder requests, and safe uploads"
status: ready
priority: P2
risk_level: high
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 2
files_allowed:
  - planning/client-ops/
  - <application-root-from-TASK-107>/src/onboarding/
  - <application-root-from-TASK-107>/src/uploads/
  - <application-root-from-TASK-107>/src/client/
  - <application-root-from-TASK-107>/src/jobs/
  - <application-root-from-TASK-107>/migrations/
  - <application-root-from-TASK-107>/tests/onboarding/
skill_refs: [writing-style]
---

# Task: Build adaptive onboarding, stakeholder requests, and safe uploads

## Purpose

Deliver the epic's signature client experience: a short, prepared path that
asks only for relevant information, reuses known facts, explains each request,
and makes the next actor obvious. The checklist must be derived from approved
scope, not a generic intake form.

## Desired outcome

Confirmed deposit payment initializes one onboarding plan. The client sees an
estimated effort, one primary next action, saved progress, prefilled verified
facts, relevant requests, and a clear division between essential and optional
items. They can upload safe files or assign a request to another stakeholder.
Completing essential items advances the engagement to `onboarding_complete` and
then `ready_for_kickoff`; optional items do not falsely block the project.

## Read first

- `planning/client-ops/product-contract.md`
- The approved pilot checklist in `pilot-journey.md`
- TASK-109 state machine and fact provenance rules
- TASK-110 authorization policy
- TASK-113 onboarding-activation event
- Upload/storage guidance in `security-baseline.md`

## Scope and instructions

### Onboarding template and plan model

Implement controlled templates/rules for approved project categories. Each
request must support:

- Stable request ID and engagement scope.
- Title, plain-language reason, example/help, expected effort, and ordering.
- Input type: answer, confirmation, document/file, or secure-access status.
- Essential or optional classification.
- Applicability condition tied to approved scope/capability, not an AI guess.
- Source fact reference and prefilled value where safe.
- Assigned person, due/needed-by date if approved, state, and completion evidence.
- Internal-only notes kept separate from client-visible text.

Initialization must be idempotent. Replaying the payment/activation event cannot
duplicate requests.

### Client concierge UI

- Show a branded welcome, estimated effort, overall progress, what Abe is doing,
  and the one most useful client action.
- Render only applicable requests and explain why each matters.
- Prefill known information with its source and allow correction. A correction
  creates a new fact/proposal for review; it must not silently rewrite an
  approved commitment.
- Save valid progress automatically or explicitly, survive refresh/session
  expiry, and show which work is confirmed versus still draft.
- On completion, say clearly that the client has done their part and what Abe
  will do next.

### Delegation

- Permit the project contact to assign an eligible request to a named/email
  stakeholder.
- Issue a purpose-bound, expiring invitation limited to that request and
  engagement.
- The delegate can see only the assigned request, its explanation, and files
  they are authorized to provide—not the full proposal, payment, or other
  engagement data unless separately authorized.
- Reassignment/revocation invalidates earlier access and preserves history.

### Safe uploads

Use private object storage and authorized short-lived access. Enforce the
approved file-size/type/count limits. Implement filename normalization,
content-type/content inspection, malware scanning or quarantine workflow,
hashing, duplicate detection, and upload status. Never make a file authoritative
or downloadable to the client/operator until it passes required processing.

Do not collect passwords, API keys, recovery codes, or secrets in answers,
uploads, comments, or generated documents. A secure-access request records
provider/system, responsible person, status, tested time, and revocation status,
while directing the actual secret through an approved external secure flow.

### Completion and recovery

- Compute readiness from essential request completion and approved validation,
  not from percentage alone.
- Advance state through TASK-109 commands and emit audit events.
- Allow Abe to reopen/reject an item with a reason; preserve earlier evidence.
- Handle upload interruption, scan failure, expired delegate link, conflicting
  correction, and activation replay without data loss or duplication.

## Acceptance criteria

- [ ] Payment activation creates exactly one scope-derived onboarding plan.
- [ ] The pilot receives only applicable requests with reason, example, effort,
      essential/optional status, and one obvious next action.
- [ ] Known facts are prefilled with provenance and client corrections do not
      silently overwrite approved commitments.
- [ ] Saved progress survives refresh, session expiry, and interrupted uploads.
- [ ] A delegate is limited to the assigned request; revocation/reassignment is
      immediate and auditable.
- [ ] Files remain private, scoped, validated/scanned or quarantined, hashed,
      and inaccessible across clients.
- [ ] The product blocks ordinary secret/credential submission and tracks only
      secure-access status.
- [ ] Optional items do not block readiness; incomplete/rejected essential items
      do.
- [ ] Completion advances state once and explains what happens next.
- [ ] Mobile, keyboard, screen-reader, error, empty, and long-content states are
      usable.
- [ ] Onboarding/upload tests, lint, strict typecheck, migrations, and build pass.

## Non-goals

- No general form builder, arbitrary workflow automation, AI-generated checklist
  rules, password vault, project task tracker, or client chat.
- No silent deletion, overwrite, or automatic acceptance of uploaded content.

## Dependencies and handoff

- Depends on: TASK-113 payment gate, TASK-110 authorization/storage boundary,
  and TASK-109 fact/state model.
- Blocks: TASK-115 through TASK-119.
- Handoff evidence: template/rule model, pilot template, initialization job,
  client UI, delegation, private upload pipeline, readiness command, audit
  events, and recovery tests.

## Testing

- recommendation: dedicated: TASK-119, plus feature checks here
- rationale: This task combines client isolation, uploads, delegation, and a
  critical readiness transition. Test applicability, idempotent initialization,
  save/resume, correction provenance, delegate boundaries, quarantine, file
  access, essential/optional readiness, and interrupted flows now. TASK-119
  repeats them in the complete pilot journey and adversarial client-isolation
  suite.

## Execution guardrail

Do not add another question because it might be useful someday. Every request
must trace to approved scope, a known dependency, legal/commercial need, or a
specific pilot requirement.
