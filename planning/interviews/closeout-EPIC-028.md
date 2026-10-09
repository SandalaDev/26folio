---
id: closeout-EPIC-028
kind: closeout
scope: EPIC-028
status: complete
revision: 4
created: 2026-10-09T16:43:04.157Z
depends_on: {}
questions:
  demonstration:
    text: Here is what the epic does. Does this match your understanding?
    required: true
    after: []
  departures:
    text: Which departures or remaining risks do you accept?
    required: true
    after: []
  acceptance:
    text: Is the epic accepted, or what remains?
    required: true
    after: []
answers:
  demonstration: "Confirmed: a working contact form on the Cloudflare site.
    Turnstile human check, server-side validation, inquiries emailed to the
    owner through Resend, an auto-reply to the visitor, honest failure states.
    Staging is live at sandala-dev-staging.sandala-r2.workers.dev and a real
    submission was sent (outcome=sent). Owner chose 'Yes, matches' in chat on
    2026-10-09."
  departures: "Accepted, all to be run before going live: first test email landed
    in Gmail Spam with DMARC FAIL (record now published, not retested, no second
    mailbox tried); Cloudflare rate-limit rule not set up or proven; bad Resend
    key tested locally only; mobile, keyboard, screen reader and reduced-motion
    pass not done on staging; production setup untouched; TASK-126 social links
    deferred (placeholder # buttons remain); two npm audit findings in dev
    tooling (wrangler, miniflare). Owner chose 'Accept all of them' on
    2026-10-09."
  acceptance: Accepted and closed. Owner chose 'Accept and close' in chat on
    2026-10-09 and said the gaps will be revisited before going live.
confirmation:
  digest: bf857e18fc49c67d53a74ecdd87a24f504ffc76246cfd73a09a2598c39ffc889
  evidence: "Owner answered the three closeout questions in chat on 2026-10-09
    after the agent read each one back: 'Yes, matches', 'Accept all of them',
    'Accept and close'."
  at: 2026-10-09T16:44:57.654Z
  assurance: human-answer-recorded-by-agent
---
# closeout: EPIC-028

Demonstrate delivered behavior and reconcile it with your understanding.

## demonstration
Here is what the epic does. Does this match your understanding?

Confirmed: a working contact form on the Cloudflare site. Turnstile human check, server-side validation, inquiries emailed to the owner through Resend, an auto-reply to the visitor, honest failure states. Staging is live at sandala-dev-staging.sandala-r2.workers.dev and a real submission was sent (outcome=sent). Owner chose 'Yes, matches' in chat on 2026-10-09.

## departures
Which departures or remaining risks do you accept?

Accepted, all to be run before going live: first test email landed in Gmail Spam with DMARC FAIL (record now published, not retested, no second mailbox tried); Cloudflare rate-limit rule not set up or proven; bad Resend key tested locally only; mobile, keyboard, screen reader and reduced-motion pass not done on staging; production setup untouched; TASK-126 social links deferred (placeholder # buttons remain); two npm audit findings in dev tooling (wrangler, miniflare). Owner chose 'Accept all of them' on 2026-10-09.

## acceptance
Is the epic accepted, or what remains?

Accepted and closed. Owner chose 'Accept and close' in chat on 2026-10-09 and said the gaps will be revisited before going live.
