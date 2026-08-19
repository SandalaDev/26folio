---
id: TASK-108
title: "Bootstrap the separate client-operations application"
status: ready
priority: P2
risk_level: high
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 1
files_allowed:
  - planning/client-ops/
  - planning/dependencies/
  - ../sandala-client-ops/
skill_refs: [opensrc-research]
---

# Task: Bootstrap the separate client-operations application

## Purpose

Create the approved application boundary and prove that its selected
foundations work together before feature work begins. Establish a reproducible
base; do not build a portal screen or business flow.

## Desired outcome

A fresh executor can clone the chosen repository, install exact approved
dependencies, run local development, apply a baseline migration, execute all
checks, and deploy a non-production health endpoint without hidden manual steps.

## Preconditions

- TASK-107 is complete and its architecture plan is owner-approved.
- The exact application root has replaced the placeholder in `files_allowed`.
- Every dependency to install appears with an exact version in the plan.

Stop if any condition is false. Do not use `latest`, caret ranges, or an
unapproved scaffold preset.

## Scope and instructions

### Establish the boundary

- Initialize the repository/application location chosen in TASK-107.
- If it is a new repository, include its own canonical agent instructions,
  state/memory entry point, branch model, README, and path back to EPIC-025.
- If it is a monorepo application, isolate its build, environment, database,
  routes, and deployment from `sandala.dev`; the portfolio remains static.
- Start one EPIC-025 feature branch. Never reuse `feature/EPIC-026`.

### Install only the approved foundation

- Use the approved installation workflow and exact direct versions.
- Record post-install resolution, install-script review, audit findings, and
  deviations. Do not run an automatic audit fix that changes the graph.
- Generate and retain the chosen lockfile.

### Create the baseline

Implement only enough to prove the foundation:

- Application shell and neutral authenticated/unauthenticated route groups.
- Typed environment parsing and `env.example`; no real secret values.
- Database connection, migration command, and baseline migration.
- Typed interfaces/adapters for storage, email, jobs, payments, and models, but
  no real business operation.
- Structured logging, error capture, request correlation, and a health/readiness
  endpoint that reveals no secrets.
- Local configuration for approved emulators or sandbox services.
- Scripts for format, lint, typecheck, unit tests, migration validation, and
  production build.
- A minimal non-production deployment using the approved topology.

### Document operation

Update the application README with exact commands for installation,
environment setup, migration, local run, checks, build, and non-production
deployment. Add `planning/client-ops/application-map.md` in this source-of-truth
repository with paths and commands rather than copied configuration.

## Acceptance criteria

- [ ] The application uses the exact boundary approved in TASK-107 and does not
      add auth, a database, or client routes to the static portfolio.
- [ ] A clean checkout installs from the lockfile using documented commands.
- [ ] Only approved dependencies were added; deviations were re-approved.
- [ ] Environment validation fails clearly when values are absent and no secret
      is committed.
- [ ] The baseline migration applies to an empty development database.
- [ ] Local development, lint, strict typecheck, unit command, and production
      build run successfully.
- [ ] Health/readiness is observable without disclosing configuration.
- [ ] A non-production deployment starts and reaches approved dependencies.
- [ ] README and `application-map.md` let another model resume without chat.

## Non-goals

- No engagement schema beyond connectivity proof.
- No client auth ceremony, proposal, acceptance, payment, onboarding, document
  room, dashboard, AI workflow, or production launch.
- No brand-heavy UI; a plain accessible shell is enough.

## Dependencies and handoff

- Depends on: TASK-107 and owner-approved architecture/dependencies.
- Blocks: TASK-109 through TASK-119.
- Handoff evidence: application path, lockfile, migration, README, successful
  checks, non-production URL, and `application-map.md`.

## Testing

- recommendation: with-task
- rationale: Run clean-install, environment-validation, empty-database
  migration, lint, strict typecheck, unit-command, production-build, health, and
  non-production smoke checks here. Cross-client and business-flow risks belong
  to TASK-119.

## Execution guardrail

If the scaffold conflicts with the approved plan, stop and update the plan
through the dependency workflow. Never silently accept newer scaffold defaults.
