---
id: TASK-123
title: "Implement the contact API route with Resend delivery and abuse protection"
status: ready
priority: P1
risk_level: high
epic_ref: backlog/epics/EPIC-028.md
progress_weight: 3
files_allowed:
  - src/app/api/contact/route.ts
  - src/lib/contact/
  - env.example
skill_refs: []
parallel:
  suitable: false
  reason: One public route and its logic modules; the later tasks all build on its contract.
  dependencies: [TASK-122]
  result: null
testing:
  recommendation: dedicated
  reason: Public endpoint that sends email and enforces validation and rate limits. Pure logic is covered by TASK-127; the route itself is verified here by lint, typecheck, build and local requests.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---
# Task: Implement the contact API route with Resend delivery and abuse protection

## Scope

Replace the 501 stub in `src/app/api/contact/route.ts`.

1. **Contract.** `POST /api/contact` with JSON `{ name, email, message,
   projectType?, website? }`. `website` is the honeypot. Responses:
   `200 {ok:true}`, `400 {ok:false, errors:{field:message}}`,
   `429 {ok:false}` with `Retry-After`, `502 {ok:false}` when delivery fails,
   `503 {ok:false}` when the server is not configured. Other methods get 405.
2. **Validation on the server.** Trim, require name, email and message, check
   the email shape, cap lengths (name 100, email 254, message 5000), restrict
   `projectType` to the four known values or omit it. Reject non-JSON and
   oversized bodies.
3. **Honeypot.** A non-empty `website` returns the same `200 {ok:true}` as a
   success and sends nothing, so a bot learns nothing.
3a. **Turnstile.** The body carries the widget token (`turnstileToken`). The
   route verifies it server-side against Cloudflare's siteverify endpoint with
   `TURNSTILE_SECRET_KEY` and the client IP, before any email is sent, and
   checks `success` and the expected hostname. Missing, invalid or expired
   tokens return `400 {ok:false, code:"turnstile"}`. If the verification
   service cannot be reached the route fails closed with `502` and sends
   nothing. The verifier is a pure function taking an injected `fetch`, so it
   can be tested.
4. **Rate limit.** Per client IP: `cf-connecting-ip`, falling back to the
   first `x-forwarded-for` hop for local development, in a small pure
   `clientIp(headers)` function. The limiter sits behind an interface
   (`check(key) -> allowed | retryAfter`) with an in-memory sliding-window
   implementation for development and best effort. Default 5 requests per 10
   minutes, constants in one place. The authoritative limit is the Cloudflare
   mechanism chosen in TASK-122 and configured in TASK-129; the code must not
   present the in-memory counter as sufficient protection.
5. **Delivery.** Send the inquiry to `CONTACT_TO_EMAIL` from
   `RESEND_FROM_EMAIL` with `reply-to` set to the visitor. Visitor input is
   stripped of CR and LF and length-limited before it touches the subject or
   any header. The body is plain text first; no HTML built from raw input.
6. **Privacy.** Nothing is stored. Logs contain an outcome and an error code,
   never the name, email or message.
7. **Structure for testing.** Keep validation, sanitising, `clientIp` and the
   rate limiter as pure modules in `src/lib/contact/` that import with
   relative paths only (no `@/` alias) so TASK-127 can run them with
   `node --test`.
8. **Cloudflare-portable.** Web-standard APIs only: `fetch` for Resend,
   `Request`/`Response`, no `fs`, no Node-only packages. Read settings through
   `src/lib/env.ts`. Follow the EPIC-028 hosting rules.

## Acceptance Criteria

- [ ] A valid request with the three variables set delivers one email to the
      configured address with the visitor as reply-to.
- [ ] Missing or malformed fields return 400 with per-field messages; the
      client can render them.
- [ ] A filled honeypot returns 200 and sends nothing.
- [ ] A missing, invalid or unverifiable Turnstile token sends nothing; with
      Cloudflare's test keys a valid token passes and an invalid one fails.
- [ ] The sixth request inside the window from one IP returns 429 with
      `Retry-After` (in-memory limiter, verified locally).
- [ ] `cf-connecting-ip` wins over `x-forwarded-for`; neither present yields a
      shared fallback key, never an error.
- [ ] The route imports no Node-only module.
- [ ] With any variable unset the route returns 503 and sends nothing.
- [ ] A name or message containing CR/LF cannot add or alter email headers.
- [ ] No submission content appears in logs or on disk.
- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Dependency Evidence

- plan: per TASK-122

## Testing

- recommendation: dedicated: TASK-127
- rationale: Highest-risk surface in the epic. See TASK-127 for the logic
  tests; a real send happens in TASK-128.

## Notes

Weight 3: external integration, public attack surface and privacy constraint
in one place. Decide the Resend call style from TASK-122 before starting.
