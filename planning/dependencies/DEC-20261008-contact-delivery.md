---
id: DEC-20261008-contact-delivery
kind: dependency-decision
epic: EPIC-028
task: TASK-122
plan: none
status: decided
human_approval: not-required
created: 2026-10-08
---
# Contact delivery: Resend over fetch, Turnstile, Cloudflare rate limit

## Decision

- **No new package.** Call the Resend REST API with `fetch` from a small typed
  wrapper in the repository. `plan: none`; `package.json` does not change.
- **Verify Turnstile tokens** with a server-side `fetch` to Siteverify. Load
  the widget with a script tag and explicit render. No wrapper package.
- **Real rate limit** is a Cloudflare WAF rate-limiting rule on
  `POST /api/contact`, configured in TASK-129 and checked in TASK-128. The
  in-app limiter behind an interface is best effort only.

## Evidence

Sources read on 2026-10-08: Resend API reference (send email, errors),
Cloudflare Turnstile docs (client rendering, server validation, testing),
Cloudflare Workers rate limiting binding, Cloudflare WAF rate limiting rules,
and `resend@6.32.1` source fetched through OpenSrc
(`os deps path resend`).

### Resend: fetch versus the SDK

| | `fetch` wrapper | `resend@6.32.1` |
|---|---|---|
| New dependency | none | the SDK plus `postal-mime@2.7.6` and `standardwebhooks@1.1.1`, optional peer `@react-email/render` |
| Engines | n/a | node >=20 (repo runs 22.19) |
| Workers fit | web standard only | its request path is plain `fetch`; it also reads `process.env` guarded by `typeof process` |
| Retries | ours to write | none in the client; the caller handles errors |
| Idempotency | set the `Idempotency-Key` header | same, through `idempotencyKey` option |
| Surface we use | one endpoint, two messages | whole API: contacts, domains, webhooks, broadcasts |

The SDK's send path is `fetch` plus error mapping. For two transactional
messages it adds supply-chain surface and bundle weight without behaviour we
need. Rejected: the SDK. Tradeoff accepted: we own the error mapping, which is
about thirty lines and is covered by TASK-127.

Request shape: `POST https://api.resend.com/emails`, headers
`Authorization: Bearer <key>`, `Content-Type: application/json` and an
optional `Idempotency-Key` (unique per request, at most 256 characters,
expires after 24 hours). Body fields used: `from`, `to`, `subject`, `text`,
`reply_to`, `headers`. Success returns `{ "id": "..." }`.

Error handling, from Resend's errors reference. The retryable column is our
reading of each suggested action.

| Status | Name | Our handling |
|---|---|---|
| 400, 422 | `validation_error`, `invalid_parameter`, `missing_required_field` | not retryable; a bug on our side, log code only, show the fallback |
| 401, 403 | key, permission, domain or quota problems | not retryable; show the fallback, log code only |
| 409 | `concurrent_idempotent_requests`, `resource_locked` | retry once after a short delay with the same key |
| 429 | `rate_limit_exceeded` | retry once after a short delay |
| 429 | `daily_quota_exceeded`, `monthly_quota_exceeded` | not retryable; show the fallback |
| 500, 503 | `application_error`, `service_unavailable` | retry once with the same key |
| network error or timeout | | retry once with the same key |

Retries are limited to one, with a request timeout of 8 seconds, so a Worker
request cannot hang. Every send generates a UUID idempotency key before the
first attempt and reuses it on the retry, so a retry cannot double-deliver.

### Environment variables

Values stay empty in `env.example`. Real values live only in the Cloudflare
environment and the gitignored `.env.local`.

| Variable | Kind | Purpose |
|---|---|---|
| `RESEND_API_KEY` | secret | Resend sending key |
| `RESEND_FROM_EMAIL` | setting | full from header, display name included |
| `CONTACT_TO_EMAIL` | secret | where inquiries are delivered; never committed |
| `TURNSTILE_SECRET_KEY` | secret | Siteverify secret |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | public | widget site key, inlined at build |

### Sender

Domain: `send.sandala.site` (owner decision, 2026-10-08). Recommended value:
`Abe Sandala <contact@send.sandala.site>`. The domain part is decided. The
local part and display name are a recommendation awaiting owner confirmation,
and changing them is a one-line change to `RESEND_FROM_EMAIL` with no code
edit. Inquiries set `reply_to` to the visitor so a reply from the inbox goes
to them. The auto-reply sets no `reply_to` override; it replies to the owner's
real address once the owner chooses one (open owner decision).

### Turnstile

**Loading.** A client component appends the script
`https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=<name>`
once, with `defer`, and calls `turnstile.render(container, options)` in the
onload callback. Options: `sitekey`, `action: "contact"`, `theme: "auto"`,
`size: "flexible"`, plus `callback`, `error-callback` and `expired-callback`
that store or clear the token in component state. The component calls
`turnstile.reset(widgetId)` after any failed submit, because a token is
single use, and `turnstile.remove(widgetId)` on unmount. The docs do not say
that explicit widgets add a hidden `cf-turnstile-response` input, so the token
is read from the callback and sent in the JSON body as `turnstileToken`.
The `action` and `expired-callback` options are documented for implicit
rendering; confirm them against the widget configuration page when TASK-125
builds the component.

**Verification.** `POST https://challenges.cloudflare.com/turnstile/v0/siteverify`
with `application/x-www-form-urlencoded` fields `secret`, `response`,
`remoteip` (from `cf-connecting-ip`) and `idempotency_key` (a UUID, reused on
the retry). The response carries `success`, `error-codes`, `challenge_ts`,
`hostname`, `action` and `cdata`.

Checks, in order: `success` is true; `action` equals `contact`; `hostname`
equals the request host; `challenge_ts` is under 4 minutes old. Tokens expire
after 300 seconds and verify once, so a replay returns `timeout-or-duplicate`.
The hostname check is skipped when the secret is one of Cloudflare's test
secrets (it starts with `1x0000`, `2x0000` or `3x0000`), because test
responses do not return the real hostname.

**Failure behaviour.** Fail closed. A missing token or a failed check returns
400 with a generic message and sends nothing. A timeout (5 seconds), a network
error or `internal-error` from Siteverify gets one retry with the same
idempotency key, then returns 502 with the "try again or use the direct
channels" message. Mail is never sent unverified. Only the outcome and a
coarse code are logged, never the token, the secret or any message content.

**Local development.** Cloudflare's published test keys:

| Purpose | Value |
|---|---|
| Site key, always passes, visible | `1x00000000000000000000AA` |
| Site key, always fails | `2x00000000000000000000AB` |
| Site key, always passes, invisible | `1x00000000000000000000BB` |
| Site key, forces interaction | `3x00000000000000000000FF` |
| Secret, always passes | `1x0000000000000000000000000000000AA` |
| Secret, always fails | `2x0000000000000000000000000000000AA` |
| Secret, duplicate-token error | `3x0000000000000000000000000000000AA` |
| Dummy token | `XXXX.DUMMY.TOKEN.XXXX` |

Test secrets accept only the dummy token; production secrets reject it.

### Cloudflare fit and rate limit

**Workers compatibility.** The chosen approach uses only `fetch`, `Request`,
`Response`, `crypto.randomUUID` and `URLSearchParams`. No Node-only package is
involved, so the logic runs on Workers. Whether the Next.js route needs the
`nodejs_compat` flag is an adapter question for TASK-129.

**Mechanism chosen: WAF rate-limiting rule, configuration only.** Compared:

| | WAF rate-limiting rule | Workers rate-limiting binding |
|---|---|---|
| Code change | none | binding in wrangler config and a call in the route |
| Free plan | 1 rule, 10 second period, IP only, 10 second mitigation | availability not stated in the docs read |
| Counting | zone-wide | per Cloudflare location, eventually consistent |
| Key | client IP | any string; docs advise against IP keys |
| Visibility | dashboard security events | Workers Logs or Analytics Engine only |

The WAF rule is the real limit because it needs no code and counts at the
edge before the Worker runs. Its Free-plan shape (10 second period, IP key) is
a burst brake, not a daily quota. The Turnstile check, the honeypot and server
validation carry the rest of the abuse load. The binding is held back as an
optional second layer and is not built in this epic.

The docs read do not say whether WAF rules apply to a `workers.dev` hostname.
Treat the staging hostname as unprotected by the rule until TASK-128 proves
otherwise on a custom hostname.

**In-app limiter.** TASK-123 defines a `RateLimiter` interface with an
in-memory implementation for development. A Worker isolate's memory is not a
shared counter, so it is best effort and never the claimed protection.

## Consequences for later tasks

- TASK-123: build the wrapper and verifier as pure modules that avoid the `@/`
  alias, so `node --test` can run them (see TASK-127).
- TASK-125: read the token from the widget callback; reset the widget after
  each failed submit.
- TASK-129: configure the WAF rule for `POST /api/contact`; settle
  `nodejs_compat`; set staging and production secrets.
- TASK-128: verify the rule fires on a custom hostname; verify a real send.
- Owner: confirm the from-address local part and display name.
