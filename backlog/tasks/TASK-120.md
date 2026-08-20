---
id: TASK-120
title: "Provision and harden the self-hosted VPS, with a proven restore"
status: ready
priority: P2
risk_level: high
epic_ref: backlog/epics/EPIC-025.md
progress_weight: 1
files_allowed:
  - planning/client-ops/
  - ../sandala-client-ops/deploy/
  - ../sandala-client-ops/docs/
  - ../sandala-client-ops/README.md
skill_refs: []
---

# Task: Provision and harden the self-hosted VPS, with a proven restore

## Purpose

The owner replaced a managed platform and a managed database with one VPS the
project operates itself. That trade bought a Johannesburg region and control,
and it moved point-in-time recovery, patching, and host security from someone
else's job to ours. This task does that job. It exists because the work is real,
not because a checklist demanded a row.

## Desired outcome

A Johannesburg VPS runs Dokploy, the two application services, and PostgreSQL.
Backups leave the host on a schedule, a restore has actually been performed into
a scratch database, and the host is closed to everything the product does not
need. Until this task passes, the system holds no real client data.

## Preconditions

- `TASK-108` is complete and the application runs locally.
- The owner has created the VPS and an object storage bucket.

Development continues locally without this task. It gates the first real client,
not the build.

## Scope and instructions

### Provision

- One VPS in a Johannesburg datacentre, sized for PostgreSQL plus two Node
  processes with headroom. Nothing unrelated to this product runs on it.
- Install Dokploy. Record the exact version.
- Deploy `web` and `worker` from the repository's Dockerfile, and a pinned
  `postgres:17` container with a persistent volume.
- Point `ops.sandala.dev` and `clients.sandala.dev` at the host and confirm
  Traefik issues and renews certificates for both.

### Harden

Every item here is in `planning/client-ops/security-baseline.md` under "Host and
control plane"; this task is where they become true rather than written.

- Dokploy's dashboard: strong unique password, second factor where supported,
  and not exposed on a guessable public hostname without IP restriction.
- SSH by key only. No password authentication, no root login.
- Firewall closed except 80, 443, and SSH.
- PostgreSQL reachable only over the Docker network. It never gets a published
  port on the host.
- Unattended security updates on, with a reboot window.
- Encryption at rest for the database volume and the backup destination. State
  which mechanism provides it rather than assuming the disk is enough.

### Back up, and prove it

- Continuous WAL archiving plus a nightly logical dump, both written off the
  host to object storage.
- Backup credentials can write and cannot delete.
- The backup destination is a different provider from the VPS.
- Monitoring that alerts when a backup job stops. A job that silently died three
  weeks ago is the normal failure.
- **Perform a restore.** Into a scratch database, from the archived WAL and the
  latest dump, then verify the restored data against the engagement event
  history. Record what the restore took, in wall-clock minutes.

### Document

Add a runbook under `docs/` in the application repository covering deploy,
rollback, restore, credential rotation, and the incident paths in the security
baseline. Update `planning/client-ops/application-map.md` with the deployment
section it currently marks as not existing.

## Acceptance criteria

- [ ] The application is reachable over TLS on both hostnames, and
      `/api/health` returns 200 from the deployed instance.
- [ ] The worker runs as its own service and creates its queues on the deployed
      database.
- [ ] PostgreSQL has no published port on the host, and the firewall allows only
      80, 443, and SSH.
- [ ] SSH accepts keys only; the Dokploy dashboard is not open to the world with
      a default credential.
- [ ] A backup exists in object storage, written by credentials that cannot
      delete, at a provider that is not the VPS host.
- [ ] A restore into a scratch database has been performed and verified, and its
      duration is recorded.
- [ ] Backup failure raises an alert that a human sees.
- [ ] The runbook lets another operator deploy, roll back, and restore without
      this chat.

## Non-goals

- No second host, no high availability, no orchestration beyond Dokploy. One
  host is the accepted failure domain for the first release.
- No feature work. This task changes operations, not the product.

## Dependencies and handoff

- Depends on: TASK-108, and owner-created VPS and storage accounts.
- Blocks: the first real client, and the deployment criterion left open in
  TASK-108.
- Handoff evidence: the deployed URL, the hardening checklist with each item
  confirmed, the backup location, and the recorded restore result.

## Testing

- recommendation: with-task
- rationale: The verification is the task. A restore that has been performed is
  the only evidence that matters here, and it cannot be automated into a unit
  test. Re-run the restore drill quarterly.

## Execution guardrail

If the restore fails or cannot be verified, stop and fix the backup mechanism
before anything else. A system that holds contract evidence and payment state
without a proven restore is not ready for a client, whatever else works.
