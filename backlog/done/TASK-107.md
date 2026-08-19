---
id: TASK-107
title: "Research and approve the client-operations architecture"
status: done
priority: P2
risk_level: high
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 1
files_allowed:
  - planning/client-ops/
  - planning/dependencies/
  - project-state/decisions.md
  - backlog/tasks/TASK-108.md
  - backlog/tasks/TASK-109.md
  - backlog/tasks/TASK-110.md
  - backlog/tasks/TASK-111.md
  - backlog/tasks/TASK-112.md
  - backlog/tasks/TASK-113.md
  - backlog/tasks/TASK-114.md
  - backlog/tasks/TASK-115.md
  - backlog/tasks/TASK-116.md
  - backlog/tasks/TASK-117.md
  - backlog/tasks/TASK-118.md
  - backlog/tasks/TASK-119.md
skill_refs: [opensrc-research, writing-style]
---

# Task: Research and approve the client-operations architecture

## Purpose

Choose a coherent, supportable foundation for a separate product that handles
authentication, confidential client data, payments, authoritative documents,
and model-assisted processing. This task prevents an executor from assembling
fashionable packages with overlapping responsibilities or installing
dependencies before their compatibility is understood.

## Desired outcome

An owner-approved architecture and dependency plan names the application
boundary, exact package/provider candidates, responsibility of every component,
security assumptions, deployment shape, operational cost, backup/export path,
and compatibility evidence. `TASK-108` can bootstrap the product mechanically
from that plan without reopening architecture.

## Preconditions

- `TASK-106` is complete.
- `planning/client-ops/product-contract.md`, `pilot-journey.md`, and
  `legal-and-commercial-review-brief.md` exist.
- Decisions that materially affect architecture are owner-approved or recorded
  as configurable constraints.

If these conditions are not met, stop. Do not research a generic SaaS stack.

## Required skill and evidence workflow

Read `.agents/skills/opensrc-research/SKILL.md` completely before acting. Use
OpenSrc for every package candidate and official documentation for hosted
services. Research exact versions, not unversioned product names.

Create the required architecture plan with:

```text
bash scripts/os.sh deps plan architecture "EPIC-025 client operations foundation" <exact-package@version>...
```

Follow the generated plan format. Only the owner may set both `status` and
`human_approval` to `approved`. Do not install anything in this task.

## Decisions this task must make

### Product and repository boundary

- Separate repository, monorepo application, or another explicitly isolated
  boundary.
- Canonical location of EPIC-025 implementation memory and how this planning
  epic hands off if application code lives elsewhere.
- Branch, deployment, environments, domain/subdomain, and ownership model.
- The exact application root that later tasks must place in `files_allowed`.

### Runtime foundation

- Web framework and supported runtime.
- Package manager and exact runtime/toolchain versions.
- Relational database and data-access/migration layer.
- Authentication/session mechanism for Abe and low-friction client access.
- Background jobs for email, document generation, webhook retry, AI work, and
  delayed reminders.
- Object storage for client files.
- Transactional email delivery.
- PDF/document rendering for an immutable acceptance copy.
- Payment abstraction and first provider(s), including currencies and webhook
  verification.
- Model API and retrieval approach with a hard client-isolation boundary.
- Logging, error reporting, metrics, secret management, backup, and recovery.

### Responsibility map

For every selected component, state exactly what it owns and does not own. Pay
particular attention to:

- Framework sessions versus auth-provider sessions.
- Database authorization versus application authorization.
- Database rows versus object-storage blobs.
- Payment checkout versus authoritative payment state.
- Queue delivery versus idempotent business operations.
- Search/vector storage versus the authoritative engagement record.
- Model output versus human-approved facts.

Reject overlapping choices unless the plan explains the boundary.

## Research checklist

For each package or service candidate, record:

- Exact version or dated service API version.
- License and self-hosting implications.
- Node/runtime/engine requirements and peer dependency ranges.
- Migration state and known breaking changes.
- Official security and webhook-verification guidance.
- Multi-tenant or row-level authorization assumptions.
- Local development and production deployment requirements.
- Data residency, export, backup, retention, and deletion capabilities.
- Pricing assumptions labelled as current estimates, not durable facts.
- Failure mode and exit path if the provider becomes unavailable.

Use package-manager dry-run resolution after the candidate set is complete.
Record the result; OpenSrc is evidence access, not a dependency solver.

## Required artifacts

1. An architecture dependency plan under `planning/dependencies/`.
2. `planning/client-ops/architecture.md` containing constraints, a
   component/responsibility diagram, trust boundaries, data flows, environment
   topology, failure/retry/recovery model, repository decision, alternatives,
   and the implementation sequence.
3. `planning/client-ops/security-baseline.md` covering identity, client
   isolation, secret handling, uploads, audit evidence, encryption, webhooks,
   backups, retention, and incident recovery.
4. Updated advisory application paths in TASK-108 through TASK-119 once the
   owner approves the repository boundary.

## Acceptance criteria

- [x] Every foundation category above has one selected owner or an explicit
      safe first-release fallback.
- [x] Exact package versions and official service API versions are recorded.
- [x] Engines, peers, migrations, licenses, and runtime assumptions have been
      cross-checked from source and official docs.
- [x] The plan explains authentication, client isolation, authoritative payment
      events, immutable agreement evidence, document storage, background jobs,
      and AI context isolation end to end.
- [x] Backup, restore, export, retention, and provider-exit paths are explicit.
- [x] Dry-run dependency resolution succeeds or conflicts are documented.
- [x] No package has been installed and no application has been scaffolded.
- [x] The owner has changed the dependency plan to the repository's approved
      state after review.
- [x] TASK-108 through TASK-119 contain usable application-root focus paths,
      not unresolved placeholders.

## Non-goals

- No feature code, schema migration, deployment, account creation, or package
  installation.
- No provider choice based only on popularity, memory, or a marketing page.
- No commitment to building signature cryptography or self-hosting Documenso.

## Dependencies and handoff

- Depends on: TASK-106 and its owner decisions.
- Blocks: TASK-108 through TASK-119.
- Handoff evidence: approved dependency plan, `architecture.md`,
  `security-baseline.md`, dry-run output, and updated task focus paths.

## Testing

- recommendation: with-task
- rationale: There is no runtime to test yet. The proportionate checks are
  version-matched source review, package-manager dry-run resolution, a complete
  responsibility map, and owner review. TASK-108 performs first post-install
  checks; TASK-119 validates the security-sensitive system behaviour.

## Execution guardrail

If the preferred stack conflicts with an engine, peer range, supported payment
currency, deployment constraint, or product requirement, record the conflict
and compare alternatives. Do not install first and rationalize later.
