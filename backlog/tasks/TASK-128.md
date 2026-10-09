---
id: TASK-128
title: Verify end to end on Cloudflare staging and hand off the launch checklist
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
  dependencies:
    - TASK-126
    - TASK-129
  result: null
testing:
  recommendation: with-task
  reason: A manual QA checklist is the whole task; there is no code to test.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
started_at: 2026-10-09T15:11:22Z
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

## Progress notes (2026-10-09)

Staging: `https://sandala-dev-staging.sandala-r2.workers.dev` (Worker
`sandala-dev-staging`), real Turnstile widget (hostname added by the owner after
a 110200 "domain not allowed" error), three secrets set by the owner.

Item 1, staging environment: 503 with no secrets (2026-10-08); 200 and
`outcome=sent` with them (2026-10-09 18:10).
Item 2, real send: the owner submitted the form; log `outcome=sent`, no
`auto-reply-failed`. The inquiry arrived at the owner's Gmail, in Spam. Arrival
of the auto-reply and the reply-to header are not yet confirmed by the owner.
Item 3, deliverability: Gmail headers on that message: SPF PASS, DKIM PASS
(d=send.sandala.site), DMARC FAIL. Cause: no DMARC record was published. The
owner added `_dmarc.sandala.site` TXT `v=DMARC1; p=none;
rua=mailto:abesandala@gmail.com`; confirmed on 8.8.8.8 and 1.1.1.1. A retest
(DMARC should read PASS) and a second mailbox are outstanding.
Item 4, abuse paths on the deployed Worker: honeypot 200 with nothing sent; a
40 KB body 413; wrong content type 415. Rate limit: a burst of 8 requests gave
200 x6, 429, 200, because the in-app limiter is per isolate. This is the
expected weakness; the WAF rule is the real limit and needs a custom hostname,
so it is not yet proven.
Item 5, failure honesty: a bogus token and Cloudflare's dummy token against the
real secret both return 400 `turnstile` and send nothing. A bad Resend key was
verified locally under workerd (502, never success), not on staging.
Not done: item 6 (device and accessibility pass on staging, needs the owner's
human check for the form states) and item 7 (go-live results).
