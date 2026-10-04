---
id: TASK-119
title: "Validate the end-to-end client journey and prepare the first pilot"
status: ready
priority: P2
risk_level: critical
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 2
files_allowed:
  - planning/client-ops/
  - ../sandala-client-ops/tests/
  - ../sandala-client-ops/scripts/
  - ../sandala-client-ops/docs/
  - ../sandala-client-ops/src/
  - backlog/epics/EPIC-025.md
skill_refs: [ds-test-planner, writing-style]
---

# Task: Validate the end-to-end client journey and prepare the first pilot

## Purpose

Prove the critical claims made by EPIC-025 before a real client's agreement,
money, documents, or confidential context rely on them. This is the dedicated
test task recommended by the epic. It combines automated adversarial coverage,
manual client/operator QA, recovery exercises, and a cautious pilot runbook.

## Desired outcome

The synthetic representative engagement completes from enquiry through
`ready_for_kickoff` with one canonical record, no repeated information, verified
acceptance/payment evidence, strict client isolation, recoverable failures,
usable mobile/accessibility behaviour, and a verifiable export. Known residual
risks and human approvals are explicit. The owner has enough evidence to decide
whether to run the first real pilot; passing tests do not make that decision.

## Preconditions

- TASK-106 through TASK-118 are complete or explicitly marked out of pilot
  scope with owner approval.
- The application runs in an isolated non-production environment using provider
  sandboxes and synthetic data.
- Owner/counsel has reviewed the acceptance, deposit, privacy, retention, and AI
  disclosure wording required for the pilot.

If a prerequisite is false, record it as a blocker. Do not test production with
real money or real client data to compensate.

## Scope and instructions

### 1. Build the end-to-end fixture and harness

Use the synthetic pilot from TASK-106 and TASK-109. Create deterministic setup
and teardown that provisions:

- Abe operator.
- Client A organization, signer/project contact, and delegated stakeholder.
- Client B with similar-looking IDs/names solely for isolation attacks.
- Approved discovery facts, scope, exclusions, dependencies, and deposit terms.
- Provider sandbox identities and safe files, including a quarantined sample
  designed for the approved scanner test mechanism.

The harness must never point to production providers by accident. Add explicit
environment assertions.

### 2. Automate the critical state journey

Exercise and assert:

```text
enquiry/import
→ operator approval
→ proposal draft/review/issue
→ hosted client review
→ explicit acceptance
→ deposit due
→ failed/abandoned payment
→ successful verified payment
→ onboarding activation
→ prefill/correction/delegation/upload
→ decision approval
→ essential completion
→ ready for kickoff
→ kickoff brief/export
```

At every step verify current state, authoritative record, audit event, visible
next action, notification intent/status, and absence of duplicated logical
records.

### 3. Adversarial security and isolation suite

Test at minimum:

- Client A reading/mutating Client B records with known/guessed IDs.
- Cross-client download, export, search, AI retrieval, cache, job, and signed URL
  attempts.
- Expired, revoked, replayed, wrong-purpose, and reassigned access links.
- Session fixation/rotation and operator/client role confusion according to the
  approved auth architecture.
- Forged/replayed payment webhook, wrong environment, amount/currency/reference
  mismatch, duplicate and out-of-order events.
- Altered/superseded agreement version/hash and concurrent acceptance.
- Unauthorized decision approval and version mismatch.
- Upload filename/content-type spoofing, over-limit files, quarantine bypass,
  direct object access, and blocked secret submission.
- Prompt/document injection, unsupported AI answer, superseded source, and
  attempted cross-client retrieval.
- Export enumeration and expired download reuse.

Use only approved security testing in the controlled environment. Do not target
third-party production systems.

### 4. Failure, retry, and recovery exercises

Simulate provider timeout/outage and worker restarts around:

- Proposal/document rendering.
- Acceptance receipt and email.
- Payment webhook processing and downstream onboarding job.
- Upload scanning/storage.
- Notification delivery.
- AI provider calls.
- Export generation.

Verify truth remains correct, idempotent work retries safely, and the operator
can see/action failures. Exercise database backup/restore, object-storage
reconciliation, signing/hash evidence recovery, and export verification using
the procedures approved in TASK-107.

### 5. Manual client experience QA

Create `planning/client-ops/manual-pilot-checklist.md` and execute it on current
mobile and desktop browser sizes. Include:

- Fresh client with only the invitation email.
- Keyboard-only and screen-reader pass.
- Zoom/reflow, focus/error handling, session expiry, save/resume, and interrupted
  upload.
- One obvious next action at every client state.
- Clear reason/examples for every onboarding request.
- Honest waiting states and “you have done your part” completion.
- No hidden terms, prechecked agreement, dark pattern, unnecessary account, or
  exposed internal note.
- Reduced/non-essential motion behaviour.

Measure the synthetic pilot's active client effort and report it against the
15-minute hypothesis. Do not tune the result or publish the metric as a promise.

### 6. Performance, operations, and privacy checks

- Measure key client pages on realistic mobile/network conditions.
- Verify rate limits, size limits, timeouts, CSP/security headers, secret
  scanning, dependency audit review, log redaction, and error-report redaction.
- Verify retention/archive/deletion markers and the approved provider data
  controls.
- Confirm observability alerts identify failures without leaking client content.
- Confirm core acceptance/payment/onboarding/documents work during AI outage.

### 7. Evidence and pilot runbook

Produce:

- `planning/client-ops/validation-report.md` mapping each epic acceptance
  criterion to automated/manual evidence, result, and residual risk.
- `planning/client-ops/manual-pilot-checklist.md` with executed results.
- `planning/client-ops/recovery-drill.md` with backup/restore and retry evidence.
- `planning/client-ops/pilot-runbook.md` covering environment checks, synthetic
  dry run, real-pilot eligibility, monitoring, support contacts, rollback/stop
  conditions, export, incident handling, and post-pilot questions.

Any failed critical invariant remains visible. Fix bounded defects when safe and
rerun the affected evidence; otherwise create a follow-up task and mark pilot
readiness blocked. Tests are advisory backlog work, but the epic cannot honestly
claim a result that the evidence contradicts.

## Acceptance criteria

- [ ] The synthetic journey completes end to end and every transition has one
      authoritative record, evidence link, audit event, and next action.
- [ ] Browser redirects, duplicate jobs, retries, concurrency, and out-of-order
      events cannot create duplicate acceptance/payment/onboarding truth.
- [ ] Client B remains inaccessible from every Client A surface: UI, API,
      storage, export, jobs, search, AI, caches, and notifications.
- [ ] Agreement acceptance is bound to the intended signer and exact immutable
      version/hash; tampered/stale versions fail.
- [ ] Only verified matching payment evidence activates onboarding.
- [ ] Upload, delegation, decision approval, documents, exports, and AI respect
      authorization and version boundaries.
- [ ] Provider/worker failures recover without data loss, double action, or
      asking the client to repeat confirmed work.
- [ ] Backup/restore and export integrity are demonstrated in the approved test
      environment.
- [ ] Manual mobile, keyboard, screen-reader, reflow, save/resume, session-expiry,
      and error-path checks have recorded results.
- [ ] The active-effort measurement and “one next action” review are reported
      honestly against the pilot hypothesis.
- [ ] Core client flow works without the AI provider.
- [ ] Legal/commercial/privacy/AI copy has the required human review status.
- [ ] Validation report maps every EPIC-025 acceptance criterion to evidence and
      names all residual risks.
- [ ] The owner explicitly decides `pilot approved`, `pilot approved with named
      constraints`, or `pilot not approved`; the test task never makes that
      business decision automatically.

## Non-goals

- No production launch, real payment, real client invitation, penetration test
  against third parties, claim of legal enforceability, or claim that tests
  prove client delight.
- No broad feature redesign during validation. Record follow-up work separately
  when a fix is not small and directly attributable.

## Dependencies and handoff

- Depends on: TASK-106 through TASK-118.
- Blocks: first real pilot and completion of EPIC-025.
- Handoff evidence: automated suite/results, validation report, manual
  checklist, recovery drill, pilot runbook, residual-risk list, and explicit
  owner pilot decision.

## Testing

- recommendation: with-task (this is the dedicated test task)
- rationale: The work of this task is the planned validation itself. Run and
  preserve all automated, adversarial, provider-sandbox, recovery, accessibility,
  and manual journey evidence described above. Do not create another generic
  “test the tests” task.

## Execution guardrail

Never substitute a green build for the evidence requested here. Conversely, do
not silently turn advisory findings into new scope. Report the risk, apply only
bounded corrections, and leave the owner a clear pilot decision.
