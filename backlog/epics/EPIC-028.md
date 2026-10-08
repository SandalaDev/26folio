---
id: EPIC-028
title: "Contact: working inquiry delivery and a launch-ready page"
status: ready
priority: P1
roadmap_refs: []
goal_refs: [GOAL-001]
progress_weight: 1
---
# Epic: Contact: working inquiry delivery and a launch-ready page

Scope decided by the owner in chat on 2026-10-07: make the existing page real,
keep its design, and include spam protection, an auto-reply and real contact
details. No booking link. The CLI kickoff interview (`os interview start epic
EPIC-028`) is unavailable because this project never imported its
workflow-v2 discovery and delivery interviews (`delivery-project` is
incomplete). The scope above is the recorded kickoff decision. The epic stays
`draft` until the owner approves this plan; the open owner inputs are listed
under "Owner actions".

## Outcome

A visitor to /contact can send an inquiry and Abe receives it, with a clear
confirmation for the visitor and a trustworthy fallback when something fails.
The page shows real ways to reach Abe instead of placeholders. This closes the
primary conversion path named in the charter: every CTA on the site ends here.

## Current state (verified 2026-10-07)

- `src/app/(site)/contact/page.tsx`, `src/components/site/contact-form.tsx` and
  the sidebar exist and are styled. The form validates name, email and message
  on the client and POSTs JSON to `/api/contact`.
- `src/app/api/contact/route.ts` is a 501 stub. The form maps any non-OK
  response to an "unavailable" notice that says delivery is not wired up.
- `SocialLinks` renders five buttons whose `href` is `#`. No email address is
  shown anywhere on the page.
- `resend` is not installed. `env.example` lists only `RESEND_API_KEY`; the
  technical plan also names `RESEND_FROM_EMAIL` and `CONTACT_TO_EMAIL`.
- The page is `force-static`, which is compatible with a runtime API route.
  No test suite exists (`npm test` exits 1).
- `src/lib/env.ts` already centralises environment reads and lists
  `RESEND_API_KEY`. The contact route will use it rather than reading
  `process.env` directly.
- Nine components use `next/image`. That matters at deployment prep, not for
  this feature (see TASK-129).

## Hosting constraint: Cloudflare

Owner decision of 2026-10-08, recorded in `project-state/decisions.md`: the
site will be hosted on Cloudflare. Deployment preparation is the last task,
but every feature before it must already be portable. The rules for TASK-122
to TASK-128:

- Web-standard APIs only in the request path: `fetch`, `Request`, `Response`,
  `crypto.subtle`. No filesystem access, no Node-only packages, no long-lived
  module state treated as shared.
- Delivery calls Resend over `fetch`. The Node SDK is not assumed to run.
- Secrets and settings come through `src/lib/env.ts` only, so the source of
  the values can change at deployment prep without touching feature code.
- Client IP is read from `cf-connecting-ip`, falling back to the first
  `x-forwarded-for` hop for local development.
- Rate limiting sits behind an interface. A Worker isolate's memory is not a
  shared counter, so an in-memory limiter is only a development and
  best-effort layer. The real limit is a Cloudflare rate-limiting rule or
  binding, chosen in TASK-122 and configured in TASK-129.
- The route declares its runtime explicitly if the adapter requires it.

## Scope

- Server-side delivery through Resend, with no stored submissions (charter
  constraint). The route re-validates every field on the server; the client
  validation stays as a convenience only.
- Abuse protection: Cloudflare Turnstile (owner decision, 2026-10-08) with
  the token verified server-side before anything is sent, plus a honeypot
  field, strict server-side validation and length limits,
  header-injection-safe use of visitor input in subject and reply-to, and a
  per-IP rate limit.
- Sending identity: mail goes out from the `send.sandala.site` subdomain
  (owner decision, 2026-10-08). The exact from-address local part is set in
  TASK-122.
- An auto-reply to the sender whose wording matches the on-page success state.
- Form states that tell the truth: success, validation errors from the server,
  rate limited, and a delivery failure that points to the direct channels.
  The "email delivery is not wired up yet" copy is removed.
- Real social URLs on the contact page and the footer, replacing every `#`
  placeholder. The inquiry destination (the owner's Gmail address, supplied in
  chat on 2026-10-08) lives only in the `CONTACT_TO_EMAIL` secret and is never
  committed. Showing an address on the page is an open owner decision.
- Cloudflare deployment preparation as the last build task (TASK-129).
- Verification on Cloudflare staging with a real send, and the DNS and
  environment checklist for go-live.

## Out of scope

- A booking or scheduling link (owner declined).
- Stored submissions, an inbox UI, analytics on the form, or any CRM link.
  EPIC-025 owns the future handoff of an approved enquiry into the private
  client system; this epic only delivers email.
- A redesign of the page layout, copy blocks or visual language.
- Showing an email address on the page. The owner has not set one up yet.

## Tasks

Size classes follow ds-epic-estimator (S=1, M=2, L=3). Total weight 15.

- [x] TASK-122 (S) — Decide the delivery integration and record the dependency plan
- [x] TASK-123 (L) — Implement the contact API route with Resend delivery and abuse protection
- [x] TASK-124 (M) — Send an auto-reply confirmation to the sender
- [x] TASK-125 (M) — Wire the form to the live route: honeypot, error states and honest copy
- [ ] TASK-126 (S) — Replace placeholder contact details and social links with real ones
- [x] TASK-127 (M) — tests: contact route validation, sanitising and rate limit
- [ ] TASK-129 (L) — Prepare the site for Cloudflare: adapter, config, images, rate limit and spine updates
- [ ] TASK-128 (M) — Verify end to end on Cloudflare staging and hand off the launch checklist

Order: 122 first. 123 follows 122. 124 and 125 follow 123 and are independent
of each other. 127 follows 123. 126 can run any time once the owner supplies
the social URLs. 129 follows 124, 125 and 127. 128 is last and needs 126, 129
and the owner's DNS work.

### Why TASK-123 is an L

It is an external integration (a third-party email API with credentials), a
new server surface exposed to the public internet, and the place where
validation, abuse control and privacy constraints meet.

### Estimate (ds-epic-estimator)

```yaml
estimated_weight: 15
risk_flags: [new-external-dependency, unfamiliar-domain, unmeasured-integration]
risk_multiplier: 2.0
```

- new-external-dependency: Resend, and the Cloudflare adapter for Next.js.
- unfamiliar-domain: this project has never been deployed to Cloudflare.
- unmeasured-integration: deliverability from a real sending domain.
- Not flagged: design or elicitation phase (the page design exists), vague
  acceptance (each task states observable criteria).

Moving to Cloudflare added TASK-129 (weight 3) and a third flag, which raised
the multiplier from 1.5 to 2.0. Weight 15 at multiplier 2.0 is an effective
30. No calendar date is promised
because this project has no established delivery rate for the rung that
converts weight into dates. The main schedule risk is not in the weight: the
owner inputs listed below gate TASK-126 and TASK-128.

## Owner actions (not agent work)

- Create or confirm the Resend account and verify the sending domain (SPF,
  DKIM, DMARC). This is the human gate in risk R02.
- Put `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL` and
  `TURNSTILE_SECRET_KEY` into the Cloudflare staging and production
  environments as secrets, and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` as a plain
  variable. Secrets are never pasted into chat or committed. Locally they go
  in the gitignored `.env.local`.
- Create the Turnstile widget in the Cloudflare dashboard and allow the real
  hostnames. Local development uses Cloudflare's published test keys.
- Add the Resend DNS records for `send.sandala.site` and a DMARC record.
- Supply the final social profile URLs (due later, per the owner).

## Dependency / Architecture Evidence

- plan: none, decided in TASK-122. Record:
  `planning/dependencies/DEC-20261008-contact-delivery.md`

TASK-122 compared the Resend REST API called with `fetch` (no new package)
against the `resend` SDK at an exact version, using OpenSrc evidence, and
records the choice. On Workers the `fetch` route is the expected winner.
TASK-129 produces a separate architecture plan for the Cloudflare adapter at
an exact version. A human approves any install plan before the manifest
changes.

## Risks

- Deliverability: mail lands in spam or fails silently (R02). Mitigated by
  domain verification, an honest failure state and the staging send in
  TASK-128.
- Abuse: the form is a public endpoint that sends email. Turnstile, the
  honeypot, limits and rate limit together cover most spam; none is a
  guarantee. Turnstile adds a client script from Cloudflare and a server call
  to its verification endpoint, so a Turnstile outage must fail closed with an
  honest message, never send unverified mail.
- On Cloudflare, an in-memory counter is per isolate and resets whenever the
  isolate recycles, so it cannot be the real rate limit. The honeypot, server
  validation and a Cloudflare rate-limiting rule or binding carry the load;
  the in-app limiter is best effort.
- The default `next/image` optimizer does not run on Workers. Image delivery
  needs a strategy at deployment prep, and the repo's accented-filename
  history makes that a real task, not a footnote.
- Privacy: no submission is stored or logged with its content. Server logs
  record only an outcome and a coarse error code.

## Testing

- recommendation: dedicated: TASK-127
- rationale: The route is new, public, sends email and holds the validation,
  sanitising and rate-limit logic. That is high risk by the planner's table,
  so the pure logic gets a dedicated test task. Node 22.19 runs TypeScript and
  the built-in `node:test` runner without a new package, provided the logic
  modules avoid the `@/` alias. TASK-123 must keep them in that shape. The
  rest is verified in the tasks that touch it (lint, typecheck, build,
  rendered-page checks) and by a real send on staging in TASK-128.
