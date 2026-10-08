---
id: TASK-124
title: "Send an auto-reply confirmation to the sender"
status: ready
priority: P2
risk_level: medium
epic_ref: backlog/epics/EPIC-028.md
progress_weight: 2
files_allowed:
  - src/lib/contact/
  - src/app/api/contact/route.ts
skill_refs: [writing-style, stop-slop]
parallel:
  suitable: true
  reason: Independent of the form work in TASK-125 once the route contract exists; touches the library and the route's send step only.
  dependencies: [TASK-123]
  result: null
testing:
  recommendation: with-task
  reason: Outbound mail to a stranger. Verify the template output and that a failed auto-reply never fails the inquiry.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---
# Task: Send an auto-reply confirmation to the sender

## Scope

1. After the inquiry email is accepted, send the visitor a short plain-text
   confirmation from `RESEND_FROM_EMAIL`. Wording matches the on-page success
   state: the message was received, Abe reads every inquiry and replies to the
   ones that fit, and silence after a few days means it is likely not a match.
   Apply writing-style and stop-slop; draft for the owner to approve.
2. The auto-reply never includes the visitor's message text and never uses
   unsanitised input in a header; the greeting uses the sanitised name.
3. An auto-reply failure is logged as a code and does not change the response
   to the visitor, because the inquiry already reached Abe.
4. The auto-reply cannot be turned into a relay: it only goes to the address
   submitted with a request that passed validation, the honeypot and the rate
   limit.

## Acceptance Criteria

- [ ] A valid inquiry produces exactly one inquiry email and one auto-reply.
- [ ] Honeypot and rate-limited requests produce neither.
- [ ] If the auto-reply fails, the visitor still gets success and the failure
      is logged without content.
- [ ] The owner has approved the auto-reply wording.
- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Template and failure-isolation checks against a stubbed sender.
  The real send is exercised in TASK-128.

## Notes

Auto-replies to unverified addresses can be abused to mail third parties. The
rate limit and the one-per-request rule are the mitigation; flag this in the
PR description.
