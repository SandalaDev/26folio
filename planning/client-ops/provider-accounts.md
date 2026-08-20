---
id: client-ops-provider-accounts
title: "Client operations — provider accounts the owner must create"
epic_ref: ../../backlog/epics/EPIC-025.md
task_ref: ../../backlog/tasks/TASK-120.md
status: owner-action
created: 2026-08-20
updated: 2026-08-20
---

# Provider accounts

Every external account the client-operations product needs, what it does, and
what it puts into the environment. Agents cannot create accounts, accept terms,
or enter payment details, so every row here is owner work.

Revised on 2026-08-20 after three owner decisions: self-host on a VPS through
Dokploy instead of Fly.io, run PostgreSQL as a container we operate instead of a
managed service, and use a free model provider. Two managed services left the
list and one VPS joined it.

Pricing is deliberately absent. A published price is a current estimate rather
than a durable fact — read it at signup.

## Needed before anything is deployed

| # | Provider | Role | Environment | Notes |
|---|---|---|---|---|
| 1 | **VPS with a Johannesburg datacentre** | The whole runtime: Dokploy, the `web` and `worker` containers, PostgreSQL, and Traefik. One machine, one failure domain, closest commonly available region to Zambian clients. | — | The only new fixed cost. Size it for Postgres plus two Node processes with headroom. Nothing else runs on it. |
| 2 | **GitHub** | Remote for the private `sandala-client-ops` repository and the CI runner for its workflow. Dokploy deploys from it. | — | Account exists (`SandalaDev`). What is missing is the private repo and its remote. |

**Dokploy is not an account.** It is open-source software installed on the VPS,
so there is nothing to sign up for. It does create a credential: its dashboard
holds every environment secret and can deploy code, which the security baseline
treats as the most valuable credential in the system.

**PostgreSQL is not an account either, any more.** It runs as a pinned
`postgres:17` container on the same host, which is the same image development
already uses. What was a managed feature is now `TASK-120`'s work: WAL
archiving, nightly dumps written off the host, and a restore that has actually
been performed.

## Needed before the first real client

| # | Provider | Role | Environment | Notes |
|---|---|---|---|---|
| 3 | **Lenco (by BroadPay)** | Payments. Card, plus MTN Money, Airtel Money, and Zamtel in ZMW through one integration. Signs webhooks with HMAC-SHA512 and exposes a status requery endpoint, which is what lets "deposit paid" rest on verified evidence rather than a redirect. | `LENCO_API_TOKEN`, `LENCO_WEBHOOK_HASH_KEY` | The long-lead item. Expect business verification and a settlement account, so start this first even though it is needed last. |
| 4 | **Cloudflare R2** | Two jobs now. Object storage for client uploads, agreement copies, receipts, and exports; and the off-host destination for database backups. Being a different provider from the VPS is the point — a backup on the same machine is a copy. | `STORAGE_ENDPOINT`, `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY` | S3-compatible, so swappable for Backblaze B2 or similar. Turn on versioning. Backups get their own write-only credentials, separate from the application's. |
| 5 | **Postmark** | Transactional email: agreement links, one-time re-entry codes, receipts, reminders, and delivery events. | `POSTMARK_SERVER_TOKEN`, `POSTMARK_FROM` | Requires a verified sending domain with SPF and DKIM records. Account approval is manual. |
| 6 | **DNS for `sandala.dev`** | `ops.sandala.dev` for the operator view and `clients.sandala.dev` for client links, both pointed at the VPS, plus the Postmark SPF and DKIM records. | `OPS_ORIGIN`, `CLIENT_ORIGIN` | Not a new account; wherever the domain's DNS already lives. The static portfolio is untouched. |
| 7 | **Groq** | Model provider on the free tier: drafting, extraction, classification, comparison. Every output is a draft until a person approves it. | `MODEL_API_BASE_URL`, `MODEL_API_KEY`, `MODEL_ID_REASONING`, `MODEL_ID_CLASSIFICATION` | Free, no card. Chosen because its Services Agreement covers fee-free usage and forbids training on inputs or outputs, which most free tiers do not. Enable zero data retention in the console's data controls while you are there, and read the actual rate limits rather than a third-party summary. |

## Worth having, not blocking

| # | Provider | Role | Environment | Notes |
|---|---|---|---|---|
| 8 | **Sentry** | Error reporting, with client identifiers scrubbed before send. | `SENTRY_DSN` | Optional by design: without a DSN the app runs with no reporter rather than a broken one. Self-hosting makes it more useful, since no platform is watching the process for you. |
| 9 | **A managed secret-sharing channel** — 1Password, Bitwarden Send, or similar | The rare case where a client secret genuinely has to move. It moves there, never through this product, and the engagement records only that the handoff happened. | — | You may already have one. If so, name it and it stops being an open item. |

## Conditional or later

| # | Provider | Role | Trigger |
|---|---|---|---|
| 10 | **Managed e-signature provider** | Agreements click acceptance does not suit — assignments of IP, anything needing notarisation or witnessing. The epic routes these outside this workflow. | When counsel names an agreement type that needs it (`L3` in the legal brief). |
| 11 | **Flutterwave** | Documented fallback payment adapter: Zambian mobile money in ZMW with webhook plus independent verification. | If Lenco's onboarding, fees, or settlement terms do not suit. |
| 12 | **Stripe** | International card rail. | Only if the invoicing entity moves to a country Stripe supports. It does not support Zambian businesses, so this follows `L2` rather than preference. |
| 13 | **A paid model provider** | Better drafting and extraction quality than a free tier delivers. | Only if the free tier proves inadequate in the pilot, or is withdrawn. `ModelAdapter` makes it a base URL change. |

## Order to work through them

1. **Lenco** — start now, finish last. Business verification is the long pole.
2. **Groq** — five minutes, free, no card. Do it while Lenco is pending.
3. **GitHub repo** — unblocks pushing the code that already exists locally.
4. **VPS, then Dokploy on it** — `TASK-120`. Development stays local until this
   exists, so nothing is blocked meanwhile.
5. **Cloudflare R2** — needed by `TASK-114` for uploads, and by `TASK-120` for
   backups, which is the earlier of the two.
6. **Postmark and DNS together** — domain verification and the subdomain records
   are one sitting. Needed by `TASK-111`.
7. **Sentry** — any time.

## What agents will not do

Create accounts, accept provider terms, enter card or bank details, or handle
the credentials these accounts issue in plain text. Put each value into
Dokploy's environment store yourself; the application reads them from the
environment and `src/env.ts` fails at boot with a named list when one is
missing.
