---
id: client-ops-application-map
title: "Client operations — application map"
epic_ref: ../../backlog/epics/EPIC-025.md
task_ref: ../../backlog/done/TASK-108.md
status: current-as-of-TASK-108
created: 2026-08-19
---

# Application map

Where the client-operations application lives and how to run it, kept in this
repository so the decision record stays complete when the code is elsewhere.
Paths and commands only; configuration is not copied here, because a copy drifts.

## Location

| | |
|---|---|
| Repository | `sandala-client-ops`, private, checked out at `C:\_git\sandala-client-ops` (sibling of `26folio`) |
| Branch | `feature/EPIC-025`, off `main` |
| Remote | **none yet.** The repository is local; creating and pushing to a remote needs the owner. |
| Its own law | `../sandala-client-ops/AGENTS.md`, which points back to this epic |
| Its own README | `../sandala-client-ops/README.md` |

## Commands

Run from the application repository root.

| Purpose | Command |
|---|---|
| Install from the lockfile | `npm ci` |
| Local database (PostgreSQL 17, port 55433) | `npm run db:up` / `npm run db:down` |
| Apply migrations | `npm run db:migrate` |
| Generate a migration after a schema change | `npm run db:generate` |
| Development server | `npm run dev` |
| Worker process | `npm run worker` |
| All checks | `npm run check` (typecheck, tests, migration consistency, build) |
| Production build and serve | `npm run build` then `npm start` |
| Health | `GET /api/health` |

## Structure

| Path | Holds |
|---|---|
| `src/env.ts` | The only place `process.env` is read. Fails at boot with a list of missing names. |
| `src/app/(operator)/` | Operator routes. TASK-110 puts the session in front of this group. |
| `src/app/(client)/e/[token]/` | Client link routes. No cookie, no account. |
| `src/app/api/health/route.ts` | Liveness and readiness, disclosing nothing about configuration. |
| `src/db/` | Drizzle schema and the postgres.js connection. |
| `src/adapters/` | Interfaces for storage, email, payments, models, and jobs. |
| `src/lib/` | Logger with redaction paths, request correlation. |
| `src/worker/main.ts` | pg-boss process entry point. |
| `migrations/` | Generated SQL, reviewed by hand. RLS policies are written here. |
| `Dockerfile`, `fly.toml` | One image, `web` and `worker` process groups. |

## What TASK-108 proved on this machine

- `tsc --noEmit` clean under strict mode with `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, and `erasableSyntaxOnly`.
- Production build succeeds; the operator group, client link group, and health
  route all render.
- A generated baseline migration applies to an empty PostgreSQL 17 database.
- The worker starts, migrates pg-boss's own schema, and creates all four queues.
- `GET /api/health` returns 200 with a correlation id and no configuration.
- Environment validation fails with a readable list rather than a stack trace.
- Three unit tests pass on Node's built-in runner.

## Deployment

Self-hosted since 2026-08-20. `deploy/docker-compose.yml` in the application
repository is the Dokploy stack: `web`, `worker`, and a pinned `postgres:17`
with a persistent volume, behind Traefik for TLS, on one VPS in a Johannesburg
datacentre.

Nothing is provisioned yet, and development stays local until it is. `TASK-120`
provisions the host, hardens it, and — the part that decides whether this is
safe to run — builds backups and performs a restore.

## What it did not prove

No deployment exists. The VPS, object storage bucket, Postmark server, Lenco
credentials, and Groq key all require owner accounts, so the "non-production
deployment" acceptance criterion in `TASK-108` is open and now belongs to
`TASK-120`.

There is no linter or formatter, because neither was in the approved dependency
plan and adding one is a plan amendment rather than an install.

## Adapter contracts worth knowing before TASK-109

Two of the interfaces carry rules from the product contract in their types, so
a later task cannot quietly lose them:

- `PaymentAdapter.listSupportedMethods(countryCode)` exists because mobile money
  is offered to local clients only and a client must never see a method they
  cannot complete. `verifyWebhook` takes raw bytes, and `getStatus` exists
  because a webhook is a hint rather than evidence.
- `ModelAdapter.draft()` requires an `engagementId`, so an unscoped model call
  does not compile, and it returns `approvedBy: null`, so a draft is never
  mistaken for a fact.
