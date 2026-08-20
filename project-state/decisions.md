# Decisions

An append-only ADR-lite log. New entries are added with `os decide`.

## 2026-06-28 — Keep the portfolio static and separate from the magazine

context: sandala.dev and Scrumtrulescent share an owner and brand ecosystem but
serve different jobs.

decision: sandala.dev remains static by default with no database or CMS.
Scrumtrulescent remains a separate codebase; portfolio integration is read-only
and failure tolerant.

alternatives: A shared Payload CMS or local blog was rejected because it couples
launches and adds operating complexity to the portfolio.

## 2026-06-28 — Use a strict, accessible Next.js application foundation

context: The site itself is the primary proof of engineering and design quality.

decision: Use Next.js App Router, strict TypeScript, Tailwind CSS, accessible
component composition, purposeful motion, reduced-motion support, and
environment variables for secrets.

alternatives: Unstructured inline styling, decorative animation, and duplicated
page patterns were rejected because they weaken consistency and maintainability.

## 2026-07-29 — Preserve the trunk-dev delivery model

context: 26folio already integrates epic branches through `dev` before release
to `main`.

decision: Set `state.flow` to `trunk-dev`; one feature branch carries one epic.

alternatives: Switching the active project to direct GitHub Flow during an OS
migration was rejected because it changes delivery behavior without product
benefit.

## 2026-07-29 — Replace the legacy Agent OS and preserve its evidence

context: The old OS used duplicate uppercase runtime state, blocking gates, and
heavy context that had become unreliable, but its backlog and spine contain
valuable project history.

decision: Replace runtime machinery with Agent OS v1, convert current context to
the lean schema, retain detailed legacy artifacts by path, and remove obsolete
generated views and gates.

alternatives: Keeping the broken runtime was rejected. Deleting all historical
artifacts was rejected because it would discard product intent and implementation
rationale.

## 2026-07-29 — Pin the OS YAML runtime exactly

context: The existing lockfile already resolved YAML 2.9.0, while the manifest
allowed later 2.x releases.

decision: Pin `yaml@2.9.0`, backed by
`planning/dependencies/DEP-20260729-205420-add.md`.

alternatives: A caret range was rejected because unattended installs could
silently change the OS parser.
## 2026-08-19 — Client operations accepts card and mobile money at first release
context: EPIC-025 TASK-106 asked the owner which payment methods a real client deposit must support. The answer selects the payment provider more than any other requirement.
decision: The first release accepts card payments and mobile money. Bank transfer is not required for the pilot. TASK-107 must evaluate providers against both methods together, and deposit state still depends on a verified, idempotent provider event rather than a browser redirect.
alternatives: Card only was rejected as a poor fit for regional corporate clients. Bank transfer was rejected for the first release because it makes deposit paid depend on manual reconciliation. Deferring the choice to TASK-107 was rejected because provider selection cannot start without it.

## 2026-08-19 — No data residency constraint on client operations data
context: EPIC-025 TASK-106 needed to know whether client documents and engagement data must stay in a named region before TASK-107 selects hosting and storage.
decision: There is no data residency constraint. Any reputable hosting region is acceptable, so TASK-107 may choose providers on merit rather than on region pinning. Counsel review may still impose one later, so region remains a configuration value and not an assumption baked into code.
alternatives: Pinning to one named region was rejected as unnecessary today. Treating residency as unknown until counsel confirms was rejected because it would narrow the provider list before any evidence justified it.

## 2026-08-19 — Third-party model provider may process client operations data under no-training terms
context: EPIC-025 TASK-106 asked whether the AI assistance described in the epic may send client documents and engagement data to a commercial model provider.
decision: A third-party model provider may process client documents and engagement data under commercial terms that exclude training on that data. Provider selection and the terms themselves belong to TASK-107. Every AI output that could reach a client or change the engagement still requires Abe's approval, and client credentials are never collected, stored, or processed.
alternatives: Restricting AI to owner-approved text was rejected as too weak for the extraction work the epic describes. Self-hosted or no model was rejected because it defers TASK-117 and raises the hosting requirements without a matching benefit.

## 2026-08-19 — Rehearse the client operations pilot before running a real client
context: EPIC-025 TASK-106 needed to know whether the first pilot is a named real client or a rehearsal.
decision: Run the synthetic engagement in planning/client-ops/pilot-journey.md end to end first, then one named real client. TASK-119 validates against the rehearsal before any real engagement is exposed to the system.
alternatives: Going straight to a real client was rejected because a first failure would happen in front of a paying client. Synthetic only was rejected because it produces no evidence about real client effort or confidence.

## 2026-08-19 — Mobile money is offered to local clients only, and the interface says so
context: EPIC-025 TASK-106 asked which currency the pilot settles in, after the owner approved card and mobile money. The owner answered that mobile money applies to local clients only.
decision: Payment method availability follows the client organisation country recorded on the engagement. Local clients are offered mobile money, international clients are offered card, and the deposit request states which methods apply to that client rather than showing methods they cannot use. The settlement currency for card deposits is decided in TASK-107 with provider coverage evidence attached.
alternatives: Offering both methods to every client was rejected because mobile money coverage is country specific and showing an unusable method invites a failed payment. Picking a single global settlement currency now was rejected because the provider evidence that would justify it does not exist yet.

## 2026-08-19 — Client operations lives in a separate private repository
context: EPIC-025 TASK-107 had to choose between a new repository and an apps/client-ops directory inside 26folio. The product needs database, payment, storage, and model credentials that the repository building the public portfolio should not carry.
decision: Application code lives in a new private repository, sandala-client-ops, checked out beside 26folio. It gets its own secrets, CI, deployment, and Agent OS instance. 26folio keeps EPIC-025, TASK-106..119, and the planning record as the decision memory, and the new repository carries a copy of the approved packet plus an AGENTS.md pointing back to this epic. Downstream task focus paths now read ../sandala-client-ops/...
alternatives: A monorepo application inside 26folio was rejected because it would put production secrets and a server-side security posture into the repository that builds the static public site, and would couple two unrelated release cadences.

## 2026-08-19 — Approve the client operations foundation and its dependency plan
context: EPIC-025 TASK-107 produced version-matched evidence for eighteen exact packages, a cross-package compatibility matrix, resolver output, and post-install probes in planning/dependencies/DEP-20260819-223803-architecture.md.
decision: The owner approved the plan as written on 2026-08-19: Next 16.3.1, React 19.2.8, TypeScript 5.9.3, Tailwind 4.3.3 with @tailwindcss/postcss pinned to match, Drizzle 0.45.2 with drizzle-kit 0.31.10 over postgres.js 3.4.9 on PostgreSQL 17, Better Auth 1.7.1 for the operator only, pg-boss 12.27.0 for durable jobs, AWS SDK v3 S3 client and presigner against Cloudflare R2, Postmark 5.1.0, React PDF 4.6.1, Anthropic SDK 0.120.0 with claude-opus-5 and claude-haiku-4-5, Zod 4.4.3, pino 10.3.1, Sentry 10.70.0. Deployment is Fly.io running web and worker process groups from one image in a single European region, with client links on clients.sandala.dev and the operator view on ops.sandala.dev. Payments go through an adapter whose first implementation is Lenco, with Flutterwave as the documented fallback and Stripe unavailable while the invoicing entity is Zambian.
alternatives: Stripe was ruled out by its own published country list, which does not include Zambia. A serverless-only deployment was rejected because pg-boss requires a long-lived worker. Prisma and a Redis-backed queue were rejected for adding a query engine and a second datastore to back up. TypeScript 7.0.2 was rejected as too new for a system carrying payment and contract evidence.

## 2026-08-20 — Self-host client operations on a Johannesburg VPS through Dokploy
context: TASK-107 selected Fly.io with managed PostgreSQL. The owner replaced that on 2026-08-20 with self-hosting on a VPS running Dokploy, and PostgreSQL as a container the project operates in every environment. Development stays local for now.
decision: One VPS in a Johannesburg datacentre runs Dokploy, which builds from the repository Dockerfile and runs the web and worker services, holds environment secrets, and terminates TLS through Traefik. PostgreSQL runs as a pinned postgres:17 container on the same host with a persistent volume. This removes the compromise the managed plan forced: Fly has no managed Postgres in Johannesburg, so app and database had to sit in Europe; on our own host both sit in Johannesburg, close to local clients. The obligations it creates are real and are collected in TASK-120: WAL archiving and nightly dumps written off the host, a restore that has actually been performed, host hardening, and treating the Dokploy dashboard as the most valuable credential in the system.
alternatives: Fly.io with Fly Managed Postgres or Neon was rejected by the owner on cost and control grounds. A second host for redundancy is out of scope for the first release; the compensating control for one failure domain is a proven restore rather than a standby.

## 2026-08-20 — Groq free tier is the model provider for client operations
context: The owner required a free model provider on 2026-08-20, while the 2026-08-19 condition that no provider may train on client data still stands. Most free tiers fail the second requirement.
decision: Use Groq's free tier through its OpenAI-compatible chat completions endpoint. Its Services Agreement covers fee-free usage in section 5.1 and states in section 4.2 that Groq is not permitted to use Inputs or Outputs for training or fine-tuning without the customer's permission, with zero data retention available self-serve. No SDK is added: the endpoint is one JSON POST called with fetch and validated with zod, which removes @anthropic-ai/sdk from the approved dependency set rather than swapping it. Model calls run in the worker behind a queue, so a free-tier rate limit is a retry rather than a failed client action.
alternatives: Google's free Gemini tier was rejected because its API terms state that on the unpaid service Google uses submitted content and generated responses to improve and develop its products, which is exactly what the owner ruled out. OpenRouter free routes were rejected because their data policy depends on which underlying provider answered. A paid provider was rejected by the owner on price. Deferring the AI work entirely remains the fallback if the free tier proves inadequate.

## 2026-08-20 — Test phase uses Google's free Gemini tier; Groq remains the provider for real client data
context: On 2026-08-20 the owner relaxed the model provider requirements for the test phase, ranking model quality above data handling while price stays at zero. The no-training condition from 2026-08-19 still governs real client data.
decision: Two providers behind one interface. The test phase uses Google AI Studio's free tier through the OpenAI-compatible endpoint at https://generativelanguage.googleapis.com/v1beta/openai/, with a Gemini Flash model for reasoning work and a Flash-Lite for classification: the strongest models available free, a million tokens of context, multimodal input, and JSON-schema structured output. Google's free tier trains on submitted content, which is acceptable only while every document in the system is synthetic. That boundary is enforced in code rather than by memory: MODEL_PROVIDER_TRAINS_ON_DATA is a required environment value and the application refuses to boot when it is true and APP_ENV is production. Groq's free tier stays the selected provider for real client data, and switching is a base URL, a key, and that flag.
alternatives: OpenRouter free routes were rejected twice over: their data policy depends on which backend answered, and the free catalogue no longer carries a strong general reasoning model. GitHub Models would have offered frontier models free but GitHub retired the catalogue, inference API, and BYOK on 2026-07-30. A paid tier is the only way to get frontier quality and no training together, and remains available if the test phase shows Groq's open models are not good enough for real client work.

