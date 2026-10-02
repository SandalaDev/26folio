# Agent OS 2.0.0 upgrade

Updated the OS machinery in 26folio to `SandalaDev/agenticOS` commit
`82dea43000eefd147099a4b298483e424f1ea1c1` (upstream `main`, checked on
2026-09-25 Africa/Lusaka). Upstream identifies this distribution as 2.0.0.
The application's own package version and dependency versions are unchanged.

## Scope and preservation

The previous installation matched upstream
`784feaa7913041271a3dc9aeeb4c66fe3e5c9736`: 69 inherited files matched after
normalizing CRLF to LF. The customized `.github/workflows/quality.yml` did not
match and was preserved. Those comparisons supplied the v2 updater's baseline;
the original v1 updater was not used because it overwrites its running script.

The reviewed plan added 46 machinery files, updated 28, kept 22 unchanged,
preserved the customized CI workflow, and retired 19 unchanged upstream files.
Retirements comprise superseded guide chapters and template development tests,
which the v2 distribution manifest excludes from product projects.
`project-state/distribution-receipts.jsonl` records the per-file hashes and actions
for future updates. The normal v2 updater now recognizes this installation.

Project-only scripts, animation skills, application files, backlog, handoffs,
spine, decisions, completion narrative and lockfile were preserved. A SHA-256
comparison verified 631 protected files. Session recovery preserved the old
August journal; session logs and generated runtime projections changed normally.
Cleared the stale claim for the already-completed TASK-114. The first refresh
attributed this maintenance session's usage to that old claim; those newly
created observations were moved to ignored scratch storage before closing the
session, so they do not become task evidence.
The existing `trunk-dev` Git flow remains in force. Its updated pre-push hook
still rejects direct pushes to both `main` and `dev`.

Added v2 cache and temporary-file exclusions to `.gitignore`. Replaced the old
`test:os` references to retired tests with a project integration check: OS doctor,
actual dashboard and guide rendering, Markdown code preservation, unique HTML
IDs, internal anchor targets, and migration verification. The rendering checks
come from this pinned upstream's rendered-artifact test, with its template-name
assertion adapted to the real project's identity.

## Migration

Reviewed and applied `PLAN-2026-09-24T23-07-40-707Z.json` through
`node scripts/migrate.mjs apply`, supplying the pinned template commit.
Only `MIG-001-add-distribution-compat` was required. A deep comparison immediately
after migration proved that every pre-existing state field was preserved.
The migration receipt verifies successfully. No task dates were materialized,
release scope approved, estimates invented, or release baseline replaced.

V2 conversational tools are installed. Existing projects activate their v2
interview workflow by starting discovery and importing actual prior decisions;
this machinery upgrade does not manufacture those conversations or approvals.

## Testing

- Recommendation: with-task. Update preservation, migration, session lifecycle
  and rendered views are the main risks; use existing upstream regressions plus
  checks against the real project. No new dependency installation is needed.
- Upstream regression checkout: all 20 test files and the derived-state suite
  passed. Four suites initially lacked the checkout-local `node_modules`
  directory; after copying the already-installed `yaml@2.9.0` there, all four
  passed. The derived-state suite passed 20 assertions.
- Real project: `npm run test:os` passed, including OS doctor, actual rendered
  artifacts and migration verification. The refreshed dashboard and guide
  contain the project's existing data and 14 guide chapters.
- Preservation: 631 protected file hashes match; every installed upstream
  machinery file matches the pinned revision.
- Repeat updater dry-run: 96 unchanged files and the one preserved CI
  customization; no additions, replacements or retirements remain.
- Application build and browser behavior are outside this check: application
  code, dependency versions and the package lock were not changed.

The scratch checkout and detailed test logs live under ignored `tmp/`.
The repeatable project command is `npm run test:os`.

## Skills and execution

Used `writing-style` to keep this maintenance record factual and concise, and
`ds-test-planner` to select preservation and integration checks. No agents were
delegated: the update and migration share one working tree and require ordered
changes. No packages were added or upgraded, so no dependency install plan was
required. The update is left in the working tree for review; no commit or push
was performed.
