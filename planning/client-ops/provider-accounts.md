---
id: client-ops-provider-accounts
title: "Client operations — provider accounts the owner must create"
epic_ref: ../../backlog/epics/EPIC-025.md
task_ref: ../../backlog/tasks/TASK-108.md
status: owner-action
created: 2026-08-20
---

# Provider accounts

Every external account the client-operations product needs, what it does, and
what it puts into the environment. Agents cannot create accounts, accept terms,
or enter payment details, so every row here is owner work.

Pricing is deliberately absent. Each of these is usage-priced and small at pilot
volume, but a published price is a current estimate rather than a durable fact —
read it at signup.

## Needed before anything is deployed

| # | Provider | Role | Environment | Notes |
|---|---|---|---|---|
| 1 | **GitHub** | Remote for the private `sandala-client-ops` repository, and CI runner for the workflow already in the repo. | — | Account exists (`SandalaDev`). What is missing is the private repo and its remote. |
| 2 | **Fly.io** | Application hosting. One image, two process groups: `web` (Next.js) and `worker` (pg-boss). Health checks hit `/api/health`. | Secrets set on the app, not in a file | Needs a card on file. Region `fra`; see the region note in `architecture.md`. |
| 3 | **Managed PostgreSQL** — Fly Managed Postgres or Neon | The engagement record, the audit history, the auth tables, and the pg-boss queue all live here. One database, one backup, point-in-time recovery. | `DATABASE_URL` | Pick at deploy time. Fly MPG keeps it in one platform; Neon is the fallback if MPG is unavailable in the chosen region. |

Those three get a staging deployment running with a health endpoint. Nothing
client-facing works yet, which is the point of a staging deploy.

## Needed before the first real client

| # | Provider | Role | Environment | Notes |
|---|---|---|---|---|
| 4 | **Lenco (by BroadPay)** | Payments. Card, plus MTN Money, Airtel Money, and Zamtel in ZMW through one integration. Signs webhooks with HMAC-SHA512 and exposes a status requery endpoint, which is what lets "deposit paid" depend on verified evidence rather than a redirect. | `LENCO_API_TOKEN`, `LENCO_WEBHOOK_HASH_KEY` | The long-lead item. Expect business verification and a settlement account, so start this first even though it is needed last. |
| 5 | **Cloudflare R2** | Object storage for client uploads, agreement copies, receipts, and exports. S3-compatible, so the provider is a swap of endpoint and credentials. | `STORAGE_ENDPOINT`, `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY` | Needs a Cloudflare account. Turn on bucket versioning. |
| 6 | **Postmark** | Transactional email: agreement links, one-time re-entry codes, receipts, reminders, and delivery events. | `POSTMARK_SERVER_TOKEN`, `POSTMARK_FROM` | Requires a verified sending domain with SPF and DKIM records. Approval of the account is manual. |
| 7 | **DNS for `sandala.dev`** | Two records — `ops.sandala.dev` for the operator view and `clients.sandala.dev` for client links — plus the Postmark SPF and DKIM records. | `OPS_ORIGIN`, `CLIENT_ORIGIN` | Not a new account; wherever the domain's DNS is already managed. The static portfolio is untouched. |
| 8 | **Anthropic API** | Model access for drafting, extraction, classification, and comparison. Every output is a draft until a person approves it. | `ANTHROPIC_API_KEY` | A Console API key with its own billing — separate from any Claude subscription. Confirm the commercial terms exclude training on the data before real client documents reach it, since that was the condition of your 2026-08-19 approval. |

## Worth having, not blocking

| # | Provider | Role | Environment | Notes |
|---|---|---|---|---|
| 9 | **Sentry** | Error reporting, with client identifiers scrubbed before send. | `SENTRY_DSN` | Optional by design: without a DSN the app runs with no reporter rather than a broken one. |
| 10 | **A managed secret-sharing channel** — 1Password, Bitwarden Send, or similar | The rare case where a client secret genuinely has to move. It moves there, never through this product, and the engagement records only that the handoff happened. | — | You may already have one. If so, name it and it stops being an open item. |

## Conditional or later

| # | Provider | Role | Trigger |
|---|---|---|---|
| 11 | **Managed e-signature provider** | Agreements that click acceptance does not suit — assignments of IP, anything needing notarisation or witnessing. The epic explicitly routes these outside this workflow. | When counsel names an agreement type that needs it (`L3` in the legal brief). |
| 12 | **Flutterwave** | Documented fallback payment adapter: Zambian mobile money in ZMW with webhook plus independent verification. | If Lenco's onboarding, fees, or settlement terms do not suit. |
| 13 | **Stripe** | International card rail. | Only if the invoicing entity moves to a country Stripe supports. It does not support Zambian businesses, so this is a consequence of `L2`, not a choice. |

## Order to work through them

1. **Lenco** — start now, finish last. Business verification is the long pole.
2. **GitHub repo, Fly.io, managed PostgreSQL** — unblocks the staging deploy and
   closes the last open acceptance criterion on `TASK-108`.
3. **Cloudflare R2** — needed by `TASK-114` (uploads).
4. **Postmark and DNS together** — domain verification and the subdomain records
   are one sitting. Needed by `TASK-111` (agreement links).
5. **Anthropic API key** — needed by `TASK-117`, and useful earlier for drafting.
6. **Sentry** — any time.

## What agents will not do

Create accounts, accept provider terms, enter card or bank details, or handle
the credentials these accounts issue in plain text. Put each value into the Fly
secret store yourself; the application reads them from the environment and
`src/env.ts` fails at boot with a named list when one is missing.
