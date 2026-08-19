---
id: client-ops-architecture
title: "Client operations — architecture and dependency plan"
epic_ref: ../../backlog/epics/EPIC-025.md
task_ref: ../../backlog/tasks/TASK-107.md
status: awaiting-owner-approval
owner_review: pending
created: 2026-08-19
---

# Client operations architecture

The foundation `TASK-108` bootstraps mechanically. Every choice here answers a
requirement in [product-contract.md](product-contract.md) or an owner decision
in `project-state/decisions.md`. Where evidence is missing, the gap is named
rather than filled with a guess.

Nothing here is approved until the owner marks the dependency plan
[DEP-20260819-223803-architecture.md](../dependencies/DEP-20260819-223803-architecture.md)
as approved. That plan carries the version-matched evidence for all eighteen
packages, a 153-row cross-package compatibility matrix, the resolver result,
and the post-install probes. No package has been installed and no application
has been scaffolded.

## Constraints this design starts from

| Source | Constraint |
|---|---|
| EPIC-025 | Separate private product. No database, auth, or client data added to `sandala.dev`. |
| Owner, 2026-08-19 | Card and mobile money. Mobile money offered to local clients only, and the interface says which methods apply. |
| Owner, 2026-08-19 | No data residency constraint. Region stays configurable. |
| Owner, 2026-08-19 | A third-party model provider may process client documents under terms that exclude training on the data. |
| product-contract.md | Link-only client access, expiring links, resumability, idempotent payment handling, append-only audit, export without lock-in, isolation at the data layer. |
| product-contract.md | Credentials are never collected, stored, or processed. |
| Repository | Node 22.19.0 is the current toolchain. The portfolio runs Next.js 15, React 19, Tailwind 4, TypeScript 5. |

## Repository and deployment boundary

**Recommendation: a separate private repository, `sandala-client-ops`.**

The portfolio repository stays a static Next.js site with no server secrets, no
database, and a public deployment. Client operations needs database
credentials, payment provider keys, a model API key, object storage
credentials, and a private deployment. Merging those into `26folio` would put
production secrets and a much larger dependency surface into the repository
that builds the public site, and would couple two release cadences that have
nothing to do with each other.

- **Application root:** the new repository's own root. Later tasks reference
  paths inside it as `<client-ops>/src/...`; they are advisory focus lists, and
  the OS state for application work lives in that repository.
- **Planning memory stays here.** EPIC-025, TASK-106 through TASK-119, the
  product packet, this document, and the security baseline remain in `26folio`
  as the decision record. The new repository carries a copy of the approved
  packet under its own `planning/client-ops/` and an `AGENTS.md` that points
  back to this epic by path.
- **Branching:** the new repository runs the same trunk-dev flow, one feature
  branch per task group.
- **Environments:** local, staging, production. Staging uses its own database,
  its own storage bucket, and provider test credentials. No production client
  data is ever copied into staging.
- **Hostnames:** `ops.sandala.dev` for Abe's operating view and
  `clients.sandala.dev` for every client-facing link. Two origins, one
  application. The operator session cookie is scoped to the ops host and is
  therefore never sent with a client request, which makes the isolation
  boundary structural rather than a code review promise. Both are DNS records;
  the static portfolio is untouched.

Alternative considered: `apps/client-ops/` inside `26folio`. Rejected for the
secret-surface and cadence reasons above. It stays viable if the owner would
rather run one repository, and the only structural cost is that the portfolio
repository inherits a server-side security posture.

## Runtime foundation

| Concern | Selection | Exact version | Why |
|---|---|---|---|
| Language and runtime | Node.js | 22.19.0 (already installed; `pg-boss@12` requires `>=22.12.0`) | Matches the existing toolchain and every candidate's engine range. |
| Framework | Next.js App Router | `next@16.3.1` | Same framework as the portfolio, so one person maintains both. Server actions and route handlers cover the operator UI, client link pages, and webhook endpoints. Engines `node >=20.9.0`. |
| UI | React, Tailwind | `react@19.2.8`, `react-dom@19.2.8`, `tailwindcss@4.3.3` | Matches `next@16.3.1` peer ranges (`react ^18.2 || ^19`). |
| Language tooling | TypeScript | `typescript@5.9.3` | Deliberately not `7.0.2`. TypeScript 7 is the native compiler rewrite and is one release old; a product handling payments and contract evidence should not adopt a new compiler in its first week. Re-evaluate after the pilot. |
| Package manager | npm | npm 10.9.3, exact versions, committed lockfile | Same as the portfolio. No second package manager to learn. |
| Database | PostgreSQL | 17 | Already installed locally. Row-level security, `jsonb`, full-text search, and advisory locks all carry weight in this design. |
| Data access and migrations | Drizzle | `drizzle-orm@0.45.2`, `drizzle-kit@0.31.10`, `postgres@3.4.9` | SQL-first, no engine binary, migrations are plain SQL files that can carry row-level security policies. `drizzle-orm@0.45.2` lists `postgres >=3` as a peer. |
| Operator authentication | Better Auth | `better-auth@1.7.1` | Peer ranges match this exact candidate set: `next ^14 \|\| ^15 \|\| ^16`, `react ^18 \|\| ^19`, `drizzle-orm ^0.45.2`, `drizzle-kit >=0.31.4`. |
| Background jobs | pg-boss | `pg-boss@12.27.0` | Durable queues inside the same PostgreSQL instance. No Redis, no second datastore to back up, and jobs commit in the same transaction as the state they follow. |
| Object storage | S3-compatible, Cloudflare R2 | `@aws-sdk/client-s3@3.1114.0`, `@aws-sdk/s3-request-presigner@3.1114.0` | Standard S3 API, presigned uploads and downloads, no egress fees. Any S3-compatible provider is a swap of endpoint and credentials. |
| Transactional email | Postmark | `postmark@5.1.0` | The product sends few, critical messages: agreement links, receipts, reminders. Deliverability matters more than templating breadth. Resend `6.20.0` is the alternative if the owner prefers its DX. |
| Document rendering | React PDF | `@react-pdf/renderer@4.6.1` | Produces the immutable acceptance copy in-process with no Chromium in the image. Peer range covers React 19. |
| Model API | Anthropic | `@anthropic-ai/sdk@0.120.0`, `claude-opus-5` for drafting and extraction, `claude-haiku-4-5` for cheap classification | Owner approved third-party processing under no-training terms. |
| Validation | Zod | `zod@4.4.3` | One schema layer for request bodies, webhook payloads, and AI structured output. |
| Logging | Pino | `pino@10.3.1` | Structured JSON logs with redaction paths for tokens and client data. |
| Error reporting | Sentry | `@sentry/nextjs@10.70.0` | Peer range `next ^16.0.0-0`. |
| Hosting | Fly.io, two process groups from one image | — | `web` runs Next.js, `worker` runs pg-boss. A serverless-only host cannot run a durable worker, and the worker is what makes payment reconciliation and reminders reliable. |
| Managed database | Fly Managed Postgres, or Neon | — | Confirm during `TASK-108`; see the region note below. |

### Region

Fly.io lists exactly one African region, Johannesburg (`jnb`), and Johannesburg
is one of the regions where Managed Postgres is **not** available. Running the
application close to Zambian clients would therefore split the app and its
database across regions, which is the wrong trade for a form-driven product.

**Recommendation: run app and database in one European region (`fra`) for the
first release.** The owner recorded no residency constraint, so this is legal;
the cost is round-trip latency for local clients on pages that are mostly form
submissions. Revisit only if the pilot shows it matters, and then with a
database story that matches the app region rather than by splitting them.

## Component responsibilities

Every component states what it does **not** own, because the overlaps are where
this kind of system rots.

| Component | Owns | Does not own |
|---|---|---|
| Next.js route handlers and server actions | Request handling, rendering, CSRF-protected form posts, webhook endpoints | Business state transitions. Handlers call a service; they never write engagement state directly. |
| Better Auth | Abe's identity, credentials, and operator session cookie on the ops host | Client access. Clients never get a Better Auth session. |
| Engagement link tokens | Client and stakeholder access: which engagement, which role, which single request, expiry | Identity in the legal sense. Authority is what the signer declares at acceptance, recorded as evidence. |
| PostgreSQL row-level security | The last line of isolation: a client-scoped connection cannot read rows outside its engagement | Business authorization. Application checks still run first; RLS exists so a bug cannot leak another client. |
| Application service layer | State transitions, invariants, evidence writes, idempotency | Presentation, and any decision the product contract reserves for Abe. |
| Object storage (R2) | File bytes, versioning, lifecycle | Whether a file satisfies a request. That lives in Postgres, keyed to the object and its hash. |
| Payment gateway | Checkout, collection, and the provider's own record | Our payment state. The engagement moves to `deposit paid` only after we verify a signed event **and** requery the provider. |
| pg-boss | Delivery, retry, scheduling | Idempotency. Every handler is safe to run twice, keyed on a business identifier. |
| Postgres full-text search | Finding approved engagement material | Truth. Retrieval results cite records; the record is the authority. |
| Anthropic model API | Draft text, extraction, classification, comparison | Facts. Every output is a draft with `approved_by` null until Abe approves it. |
| Postmark | Message delivery and delivery events | Whether a client acted. Only our recorded events say that. |

## Trust boundaries

```text
public internet
  │
  ├── clients.sandala.dev ── link token (opaque, hashed at rest, scoped, expiring)
  │      └── client-scoped DB role ── RLS enforced ── one engagement only
  │
  ├── ops.sandala.dev ── Better Auth session (single operator, second factor)
  │      └── operator DB role ── full access ── every read of client data logged
  │
  └── /webhooks/{provider} ── signature verified ── payload enqueued, never trusted
         └── worker ── requeries the provider API ── writes payment events
```

Three rules hold across all of them: a browser redirect never changes state; a
webhook payload is a hint until the provider's API confirms it; and no request
reaches client data without an engagement scope resolved from a verified token
or the operator session.

## Data flows that matter

**Acceptance.** The signer's submission is validated, the agreement version and
its stored hash are re-read, the acceptance row is written in one transaction
with the event history entry, and a `render-acceptance-pdf` job is enqueued in
the same transaction. The worker renders the PDF, hashes the bytes, stores the
object in a versioned bucket, and records the hash on the acceptance event. The
receipt email is a separate job with its own retry.

**Deposit.** The deposit request shows only the methods that client's country
supports. The gateway collection is created with our own reference as the
idempotency key. The provider calls the webhook; we verify the signature,
enqueue, and return 200. The worker requeries the provider's status endpoint,
and only a confirmed status writes a `payment_event` row, which carries a
unique index on the provider event identifier. A duplicate event is a no-op
that still records that a duplicate arrived. If the webhook never comes, a
scheduled requery job closes the gap.

**Uploads.** The client requests a presigned PUT constrained by content type
and size. After the upload the server reads the object's metadata, computes its
hash, and only then marks the onboarding request satisfied. A file that fails
the check is quarantined, not silently accepted.

**AI assistance.** Retrieval is a function of `engagementId`; there is no code
path that builds context without one. Prompts carry only approved material from
that engagement. Output is stored as a draft, and the approval step writes who
approved it and when.

## Failure, retry, and recovery

- **Provider webhook down or delayed:** scheduled requery reconciles. Lenco also
  retries hourly for 24 hours when the endpoint does not return 2xx.
- **Duplicate or out-of-order events:** unique constraint on the provider event
  identifier plus state transitions that are safe to re-apply.
- **Worker crash:** pg-boss jobs are durable; handlers are idempotent.
- **Email failure:** delivery events flow back from Postmark; a failed
  agreement link raises an operator alert rather than dying silently.
- **Interrupted client flow:** every multi-step form saves partial state against
  the engagement, keyed to the link, and resumes.
- **Database restore:** managed point-in-time recovery plus a nightly logical
  dump written to a separate bucket with separate credentials. A restore drill
  runs before the first real client and quarterly after that.
- **Provider exit:** payments sit behind an adapter interface; storage is the S3
  API; email is one module; documents are files plus hashes. The engagement
  export is JSON plus the original documents, which is the real exit path.

## Payments

Stripe does not support businesses in Zambia. Its own country list names 50-odd
countries with no Zambian entry, and its African coverage is Côte d'Ivoire plus
the Paystack extended network in Ghana, Kenya, Nigeria, and South Africa. If the
invoicing entity is Zambian, Stripe is not an option, and the choice is a
pan-African gateway.

**First adapter: Lenco (by BroadPay).** It covers exactly what the owner asked
for in one integration: Visa and Mastercard, plus MTN Mobile Money Zambia,
Airtel Money Zambia, and Zamtel, in ZMW. Its collection API returns a
`pay-offline` status while the customer authorises on their handset, and the
documented pattern is to listen for the webhook **or** requery the collection
status endpoint, which is the model this design already requires. Webhooks carry
an `X-Lenco-Signature` header, an HMAC-SHA512 of the raw body signed with a key
derived from the API token, and unacknowledged events are retried hourly for 24
hours.

**Second adapter, evaluated but not first: Flutterwave.** It supports Zambian
mobile money in ZMW with both a `charge.completed` webhook and an independent
verification endpoint, and its documentation states the feature is available to
Zambian merchants by default and by request for others. Worth keeping as the
fallback if Lenco's onboarding or settlement terms do not suit.

**Stripe stays in the plan only conditionally:** it becomes the international
card rail the moment the invoicing entity sits in a supported country. The
adapter interface exists so that is a configuration change and a new module,
not a rewrite.

The adapter interface is `createCollection`, `getStatus`, `verifyWebhook`, and
`listSupportedMethods(countryCode)`. That last method is what makes the product
contract's "show only methods this client can complete" rule structural.

No payment SDK is in the dependency plan. Both candidates are plain REST APIs
with HMAC webhook verification, and an unmaintained community SDK in the
payment path is a liability rather than a convenience.

## Retrieval and AI

`claude-opus-5` handles drafting, extraction, and comparison; `claude-haiku-4-5`
handles cheap classification. Both are called through `@anthropic-ai/sdk@0.120.0`
with adaptive thinking.

Retrieval in the first release is **PostgreSQL full-text search scoped by
engagement**, not a vector store. Two reasons: Anthropic publishes no embeddings
endpoint, so vectors would add a second model provider and a second processing
agreement for a corpus that is small per engagement; and full-text search over
an engagement's approved material is enough to cite sources. `pgvector` is the
documented upgrade path when a real corpus justifies it, and the isolation rule
does not change: retrieval takes an engagement scope or it does not run.

## Observability, secrets, and cost

- **Logs:** pino JSON with redaction paths covering link tokens, session
  cookies, provider signatures, and client contact details.
- **Errors:** Sentry, with client identifiers scrubbed before send.
- **Metrics:** the platform's own, plus the engagement event history, which
  answers the questions the pilot actually asks.
- **Secrets:** the platform secret store, one set per environment, rotated when
  anyone with access changes. No secret in the repository, no production secret
  on a developer machine.
- **Cost:** platform, database, storage, email, and model usage are all
  usage-priced and small at pilot volume. Treat every published price as a
  current estimate to confirm at `TASK-108`, not a durable fact.

## Implementation sequence

| Task | What it builds on this foundation |
|---|---|
| TASK-108 | Repository, toolchain, environments, CI, health check, first migration. |
| TASK-109 | Engagement schema, state machine, event history. |
| TASK-110 | Operator auth, link tokens, RLS policies, audit reads. |
| TASK-111 | Proposal and agreement issuance, immutable versions, hosted review. |
| TASK-112 | Acceptance ceremony, receipt PDF, evidence records. |
| TASK-113 | Payment adapter, Lenco integration, webhook plus requery, deposit gate. |
| TASK-114 | Onboarding checklist, delegation, presigned uploads, access tracking. |
| TASK-115 | Document and decision room, export. |
| TASK-116 | Operator queue and kickoff brief. |
| TASK-117 | Retrieval, drafting, approval workflow. |
| TASK-118 | Portfolio handoff and lifecycle notifications. |
| TASK-119 | End-to-end validation and pilot readiness. |

## Open items

- Confirm Fly Managed Postgres availability and pricing in the chosen region at
  `TASK-108`, or select Neon instead.
- Confirm Lenco merchant onboarding, settlement account, and fee structure with
  the provider. Nothing here asserts commercial terms.
- Card settlement currency for international clients, which follows the
  invoicing entity's country (`L2` in the legal brief).
- File scanning beyond type and size checks is deliberately out of the first
  release. Recorded so it is a decision rather than an oversight.
