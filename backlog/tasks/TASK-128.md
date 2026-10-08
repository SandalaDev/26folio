---
id: TASK-128
title: "Verify end to end on Cloudflare staging and hand off the launch checklist"
status: ready
priority: P1
risk_level: high
epic_ref: backlog/epics/EPIC-028.md
progress_weight: 2
files_allowed:
  - backlog/epics/EPIC-028.md
  - docs/
skill_refs: []
parallel:
  suitable: false
  reason: Final integration check that needs every other task and owner action complete.
  dependencies: [TASK-126, TASK-129]
  result: null
testing:
  recommendation: with-task
  reason: A manual QA checklist is the whole task; there is no code to test.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---
# Task: Verify end to end on Cloudflare staging and hand off the launch checklist

## Scope

Manual QA with owner participation. The agent prepares and records; the owner
performs the DNS and secret steps.

1. **Staging environment:** the four secrets and the public Turnstile site key
   are set in the Cloudflare staging (preview) environment by the owner, and
   the Turnstile widget allows the staging hostname. Confirm the route returns 503
   when they are absent and 200 when present.
2. **Real send:** submit the form on staging. Record that the inquiry arrives,
   reply-to is the visitor, and the auto-reply arrives at a test address.
3. **Deliverability (risk R02):** check SPF, DKIM and DMARC pass in the
   received headers; confirm neither message lands in spam in at least two
   mailboxes.
4. **Abuse paths:** honeypot and oversized body behave as in TASK-123, and
   the Cloudflare rate limit configured in TASK-129 actually returns 429
   across repeated requests from one client, observed on the deployed
   environment rather than assumed.
5. **Failure honesty:** with a bad Resend key, the visitor sees the
   delivery-failure state, never success. With a failed Turnstile check,
   nothing is sent.
6. **Device and accessibility pass:** mobile and desktop widths, keyboard-only
   submission, screen reader labels for errors and status, reduced motion.
7. **Go-live checklist** in the epic: production variables, DNS, a first real
   production submission, and who watches the inbox the first week.

## Acceptance Criteria

- [ ] Every item above has a recorded result with date and evidence.
- [ ] R02's mitigations are checked off, or each gap is named as an accepted
      risk by the owner.
- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass on the
      release candidate.
- [ ] Epic closeout interview can demonstrate the working flow.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: The task is verification. Manual QA checklist above.

## Notes

Never paste the API key or a real visitor's message into chat, the repository
or logs. Use throwaway test content.
