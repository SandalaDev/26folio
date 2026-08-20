---
id: client-ops-security-baseline
title: "Client operations — security baseline"
epic_ref: ../../backlog/epics/EPIC-025.md
task_ref: ../../backlog/tasks/TASK-107.md
status: awaiting-owner-approval
owner_review: pending
created: 2026-08-19
---

# Security baseline

> Implemented since 2026-08-20 (TASK-110): link grants stored as SHA-256
> digests with purpose, expiry, and revocation; one deny-by-default policy in
> `src/auth/policy.ts`; row-level security on a non-owning `app_client` role
> keyed to a per-transaction engagement scope; and an append-only audit table
> with a redaction pass. Operator sign-in is Better Auth with public sign-up
> disabled. What follows is the standard; the code is where it is met.

The rules every EPIC-025 implementation task inherits. They exist because this
product holds contract acceptance evidence, payment state, confidential client
material, and model-derived context for more than one client at a time.

This is a baseline, not a certification. It states what the system must do and
what it deliberately does not do in the first release. Read it with
[architecture.md](architecture.md), which names the components each rule binds.

## Identity

**Operator.** One internal user. Better Auth on `ops.sandala.dev`, email plus a
second factor, session cookie marked `HttpOnly`, `Secure`, `SameSite=Lax`, and
scoped to the ops host so it is never transmitted to a client-facing page.
Session lifetime is short enough that a stolen laptop is not a standing breach,
and sign-out revokes server-side.

**Client and stakeholder.** No accounts, no passwords. Access is an opaque
token of at least 32 bytes from a cryptographic random source, delivered by a
private link to a recorded email address. The token is stored only as a SHA-256
hash; the plaintext exists in the email and the client's browser. Each token
carries an engagement, a role, an optional single request identifier, an issue
time, and an expiry.

**Expiry and reissue.** An expired link grants nothing. Re-entry is a one-time
six-digit code emailed to the address already on the engagement, rate-limited
per link and per address, valid for minutes rather than hours. Issue, use,
expiry, and reissue are all recorded events.

**Rotation.** The signer's link is rotated after acceptance so the acceptance
surface cannot be replayed. A stakeholder link expires when its one request is
satisfied.

## Client isolation

The epic's criterion is that one client cannot access another client's records,
links, files, or derived AI context. Three layers enforce it, and the deepest
one holds even when application code is wrong.

1. **Scope resolution.** Every client request resolves an engagement scope from
   the verified token before anything else runs. There is no code path that
   reads client data without a scope.
2. **Service layer.** Repository functions take the scope as a required
   argument. A query that could run without one does not compile in review.
3. **Row-level security.** Client traffic uses a PostgreSQL role with RLS
   enforced, and the connection sets the engagement for the transaction.
   Policies live in migrations next to the tables they protect. The operator
   role bypasses RLS by design, which is why operator access is logged.

Object storage keys are prefixed by engagement, and every download is a
short-lived signed URL issued after the same scope check. Bucket contents are
never public.

AI context obeys the same rule: retrieval takes an engagement scope, prompts
carry only that engagement's approved material, and there is no cross-engagement
index to leak from.

## Secret handling

- Secrets live in the platform secret store, one set per environment. None in
  the repository, none in the image, none in a developer's shell history.
- Production secrets do not exist on developer machines. Local development uses
  provider test credentials and a local database.
- Rotation happens when anyone with access changes, when a provider key is
  exposed, and on a schedule the owner sets. Rotation is a documented runbook,
  not a memory.
- Staging never holds production client data.

**Client credentials are different, and the product refuses to hold them.**
Passwords, API keys, and recovery codes are never requested in a form, a
message, or a document upload. The engagement records that access is required,
who owns it, and its status. Access is granted inside the client's own system
where possible. When a secret genuinely has to move, it moves through a managed
secret-sharing channel outside this product, and the engagement records only
that the handoff happened, by whom, and when.

## Uploads

- Presigned PUT with content type and maximum size constrained at signing time.
- Server-side verification after upload: object metadata, declared type against
  actual type, size, and a SHA-256 hash recorded against the onboarding request.
  A file is not "supplied" until it passes.
- An allowlist of document, image, and archive types. Executables, scripts, and
  anything the product cannot describe to Abe are rejected with a reason.
- Downloads are signed, short-lived, and served as attachments with
  `Content-Disposition` and a non-sniffing content type, so a stored file cannot
  execute in a client's browser session.
- **Not in the first release:** antivirus or content scanning. This is recorded
  as an accepted gap, not an oversight. Revisit before any engagement where
  clients upload files from outside their own organisation.

## Audit evidence

The event history is append-only. Rows are never updated or deleted in normal
operation, and the application role has no delete grant on it.

Every event records what happened, who acted, the UTC time, and the evidence
that authorised it. The acceptance event additionally carries the signer's
supplied identity, the exact wording displayed, the agreement version, the
document hash, and proportionate technical evidence of the session.

Two rules protect the record's meaning:

- **A redirect is never evidence.** Payment state changes only after a verified
  provider event and an independent status requery.
- **Derived data is labelled.** Anything a model produced is stored as a draft
  with a null approver until a person approves it, and the approval is its own
  event.

Operator reads of client data are logged. One internal user today does not make
that pointless; it makes the log useful the first time there is a second.

## Encryption

- TLS everywhere, HSTS on both hostnames, no mixed content. Traefik under
  Dokploy issues and renews the certificates; renewal failure is an alert, not
  something discovered by a client.
- Encryption at rest is ours now, not a platform's. The database volume and the
  backup destination are both encrypted, and `TASK-120` states which mechanism
  provides it rather than assuming the VPS disk is enough.
- Hashing where verification beats retrieval: link tokens (SHA-256), documents
  (SHA-256 over the stored bytes), one-time codes.
- No home-grown cryptography, no self-hosted signature service, and no attempt
  to build an advanced electronic signature. Agreements needing one go to a
  managed provider outside this workflow.

## Webhooks

1. Read the raw body. Verify the provider's signature over those exact bytes
   before parsing. Lenco sends `X-Lenco-Signature`, an HMAC-SHA512 of the body
   under a key derived from the API token.
2. Compare signatures in constant time. Reject anything that fails, and log the
   rejection without echoing the payload.
3. Enqueue and return 2xx quickly. A slow endpoint gets retried, and Lenco
   retries hourly for 24 hours until acknowledged.
4. The worker requeries the provider's status endpoint. Only the provider's own
   answer writes payment state.
5. Idempotency is a unique index on the provider event identifier. A duplicate
   is a recorded no-op.
6. Scheduled reconciliation catches events that never arrived at all.

## Host and control plane

New with the move to a self-hosted VPS. None of it existed when a managed
platform owned the machine.

- **The Dokploy dashboard is the most valuable credential in the system.** It
  holds every environment secret and can deploy arbitrary code. It gets a strong
  unique password, a second factor where supported, and it is not exposed to the
  open internet on a guessable hostname without at least IP restriction. Treat a
  compromise of it as a compromise of everything.
- **SSH by key only.** No password authentication, no root login, and the key
  lives on one machine.
- **The firewall closes everything except 80, 443, and SSH.** Postgres is
  reachable only over the Docker network; it never gets a published port on the
  host, because a published Postgres port is how a self-hosted database becomes
  a public one.
- **Unattended security updates on**, with a scheduled window for anything that
  needs a reboot.
- **One host, one purpose.** Nothing unrelated to this product runs on it.
- **Container images are pinned**, including `postgres:17`. A floating tag turns
  a redeploy into an unplanned upgrade.

## Backups and recovery

Self-hosting moved this section from "configure a managed feature" to "build and
prove a mechanism". It is the largest single obligation the VPS decision
created, and `TASK-120` owns it.

- Continuous WAL archiving plus a nightly logical dump, both written off the
  host to object storage. The backup credentials can write and cannot delete, so
  one compromised key cannot destroy the database and its history together.
- The backup destination is a different provider from the host. A backup on the
  same machine is a copy, not a backup.
- Backups are monitored. A backup job that silently stopped three weeks ago is
  the normal way this fails.
- Object storage versioning on, with lifecycle rules that keep authoritative
  documents beyond the retention floor counsel confirms.
- A restore drill into a scratch database before the first real client, then
  quarterly. An untested backup is a belief, not a backup. Until one has passed,
  the system holds no real client data.
- Per-engagement export produces structured JSON plus the original documents.
  It is both the client's export right and the product's exit path.

## Retention and deletion

Retention periods are configuration, not constants in code, because counsel has
not answered them yet (`L6` in the legal brief). The defaults the system ships
with keep engagement records and documents for the life of the engagement plus
a period the owner sets.

Deletion is explicit, logged, and never silent. Deleting a document removes the
bytes and keeps the record that it existed, who deleted it, and when, because
the audit history is what makes the rest of the system trustworthy.

## Incident recovery

A runbook lives in the application repository and covers, at minimum:

- **Leaked link.** Revoke the token, reissue, notify the engagement contact,
  and record both events.
- **Leaked provider or model key.** Rotate at the provider, redeploy, review
  the access log for the exposure window.
- **Suspected isolation failure.** Take the client surface offline first,
  reproduce against the audit log, then fix. Availability is worth less than
  the isolation guarantee.
- **Bad payment state.** Reconcile from the provider's records, never from our
  own assumption, and record the correction as an event.
- **Data loss.** Restore from the archived WAL and the latest dump, verify
  against the event history, and report what was lost to the affected client.
- **Host compromise.** Assume every secret on the machine is gone. Rebuild the
  host from scratch rather than cleaning it, rotate every credential the
  environment held, restore data from backup, and only then reopen the client
  surface.

Client notification wording is human-approved copy. It is drafted in advance,
not written during an incident.

## What this baseline does not claim

- It is not a legal opinion about the acceptance ceremony's validity anywhere.
- It is not a penetration test, and no external review has happened.
- It does not cover file content scanning, which is deferred with the owner's
  visibility.
- It assumes one operator. A second internal user changes the authorization
  model and requires this document to be revised first.
- It assumes one host, which is one failure domain. Self-hosting trades a
  managed platform's redundancy for control, and the compensating control is a
  proven restore rather than a second machine.
