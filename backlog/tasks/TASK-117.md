---
id: TASK-117
title: "Add evidence-grounded AI assistance with human approval"
status: ready
priority: P2
risk_level: high
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 2
files_allowed:
  - planning/client-ops/
  - <application-root-from-TASK-107>/src/ai/
  - <application-root-from-TASK-107>/src/operator/
  - <application-root-from-TASK-107>/src/jobs/
  - <application-root-from-TASK-107>/tests/ai/
skill_refs: [writing-style]
---

# Task: Add evidence-grounded AI assistance with human approval

## Purpose

Apply AI where it removes clerical work—research organization, extraction,
comparison, drafting, retrieval, and recommendation—without letting a model
create commitments, cross client boundaries, or present unsupported text as
project truth.

## Desired outcome

Abe can ask evidence-backed questions, review proposed facts/decisions, and
receive drafts or next-action recommendations whose sources are visible. Model
output remains a proposal until a human accepts it through the owning domain
operation. A client never sees raw model output or another client's context.

## Read first

- EPIC-025 `Experience contract`
- `planning/client-ops/security-baseline.md`
- TASK-109 fact provenance and approval rules
- TASK-110 authorization/client isolation
- TASK-115 documents/decisions
- TASK-116 queue/kickoff brief
- Model/provider architecture from TASK-107

## Scope and instructions

### Approved first-release capabilities

Implement only these bounded uses:

1. **Extraction proposal:** extract candidate facts, requirements, risks,
   decisions, dates, and unanswered questions from authorized text/documents.
2. **Evidence retrieval:** answer an operator question from approved engagement
   records and cite exact sources/sections.
3. **Drafting:** prepare internal drafts for a response, reminder, proposal
   section, decision summary, or kickoff narrative from approved facts.
4. **Comparison:** identify potential conflict between a new statement and an
   approved scope/decision, explaining both sources without declaring a legal
   scope verdict.
5. **Recommendation:** suggest the next operator action with evidence; it may not
   execute the action or hide deterministic queue rules.

Do not add a general client chatbot, autonomous sending, autonomous pricing,
legal clause generation, or client health scoring.

### Source and isolation pipeline

- Authorize before retrieval, at every lookup and file read—not only when the
  screen opens.
- Scope indexes, caches, embeddings, prompts, jobs, traces, and evaluation data
  to one organization/engagement.
- Store stable source references and relevant location/section metadata.
- Prefer approved/authoritative records; clearly label drafts, superseded
  versions, client-supplied unverified facts, and missing evidence.
- Configure provider data retention/training controls according to TASK-107 and
  TASK-106. Never send credentials, secrets, unnecessary personal data, or
  another client's content.

### Human approval boundary

Represent model output as `AIProposal` or equivalent with task type, prompt
template/version, model/version, source IDs, generated time, status, reviewer,
edits, and resulting authoritative record reference. Provide explicit accept,
edit-and-accept, reject, and regenerate actions.

Acceptance must call the owning domain operation:

- Facts use TASK-109 approval rules.
- Decisions use TASK-115 decision/version rules.
- Draft communications remain drafts until a human sends them.
- Proposal/contract commitments use TASK-111's controlled review and never
  bypass clause or pricing approval.

Record audit events without storing secrets or uncontrolled chain-of-thought.

### Failure and quality behaviour

- If evidence is absent, say the record is insufficient.
- If sources conflict, show the conflict and ask for resolution.
- If retrieval confidence/grounding checks fail, withhold the answer/draft.
- Make model timeout/rate-limit/provider outage recoverable; core agreement,
  payment, onboarding, documents, and decisions must still work without AI.
- Use structured outputs with schema validation for extraction/comparison.

Create a small synthetic evaluation set from the pilot fixture covering correct
answers, insufficient evidence, conflicting sources, superseded documents,
malicious document instructions, and attempted cross-client retrieval.

## Acceptance criteria

- [ ] Only the five bounded capabilities above are implemented.
- [ ] Every retrieval and model job is authorized and scoped to one client and
      engagement, including caches/indexes/evaluation traces.
- [ ] Answers/drafts cite exact sources and distinguish authoritative, draft,
      superseded, unverified, conflicting, and missing evidence.
- [ ] Model output cannot directly change scope, price, legal terms, payment,
      state, decisions, or external communication.
- [ ] Accept/edit/reject actions are explicit, attributable, versioned, and call
      existing domain operations.
- [ ] Prompt/document injection cannot grant tools, reveal other-client data,
      override the system boundary, or turn untrusted content into instructions.
- [ ] Provider outage leaves the non-AI product usable and queues/retries only
      safe operations.
- [ ] Synthetic evaluations cover supported, unsupported, conflicting,
      superseded, injection, and cross-client cases with recorded results.
- [ ] AI tests/evals, lint, strict typecheck, and build pass.

## Non-goals

- No autonomous agent acting on client systems, autonomous email, pricing,
  proposal sending, legal advice, health score, cold outreach, or client-facing
  general chat.
- No model fine-tuning on client data in the first release.

## Dependencies and handoff

- Depends on: TASK-116, TASK-115, TASK-110, and approved model architecture.
- Blocks: TASK-119. TASK-118 may proceed in parallel if it does not consume AI.
- Handoff evidence: bounded AI interfaces, authorization/source pipeline,
  approval model/UI, prompt/version registry, provider failure handling,
  synthetic evaluation set, and results.

## Testing

- recommendation: dedicated: TASK-119, plus evaluations in this task
- rationale: Model behaviour is probabilistic and client isolation is high-risk.
  Run deterministic schema/auth tests and the synthetic grounding/injection set
  here. TASK-119 repeats critical cross-client, source-authority, and no-AI
  fallback scenarios in the full application.

## Execution guardrail

If the model can take an action that would matter without a separate human
confirmation backed by an existing domain operation, the boundary is wrong.
Fix the boundary before adding more prompts.
