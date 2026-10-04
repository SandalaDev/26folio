## Diagnose and recover

Start with the observed failure and preserve the evidence. Say: “Diagnose this state. Explain the cause, show the safe recovery action and verify the result.” Do not remove journals or rewrite history just to silence a warning.

### Basic diagnosis

```bash
git status --short
bash scripts/os.sh doctor
bash scripts/os.sh check
bash scripts/os.sh next
```

Doctor checks environment and OS wiring. Check examines state consistency. Next explains pending work or decisions. None of these is proof that your application tests passed. If the OS cannot start at all, inspect the exact Node/Bash error before attempting a refresh.

### Setup fails after cloning

Confirm you are in the product root and running Git Bash on Windows. Verify Node and npm exist in that shell. The OpenSrc baseline preflight needs network access; retain its error and retry after fixing connectivity. A missing `yaml` runtime needs the prescribed dependency set installed successfully. Do not approve a different package set merely to bypass a preflight.

If the exporter fails while making its initial commit, inspect the destination's files and Git status. It may already contain an initialized repository, so a rerun can correctly refuse it. Configure Git author identity and complete or recover that reviewed destination deliberately; do not force-overwrite it.

### The OS says another session is active

Find out whether the other agent is running. Have it use `os switch` or `os end`. If it has stopped and you authorize handover, use `os onboard --takeover`; the old journal is preserved. Do not have every new sub-agent onboard. A stale lock can trigger crash recovery, so inspect the checkpoint and uncommitted files for unfinished operations.

### Claim or completion is blocked by an interview

```bash
bash scripts/os.sh interview gate TASK-001
bash scripts/os.sh interview status
```

Read the named interview packet. Finish unanswered topics or revisit stale downstream decisions after confirming the changed upstream interview. A project-wide blocker affects all implementation; an epic blocker affects that epic. Keep doing research and recovery if the human is unavailable. Do not mark an answer confirmed merely to unblock a claim.

### Dashboard or guide looks stale

```bash
bash scripts/os.sh refresh
```

Then reload the browser. If refresh fails, fix the named source or renderer error. Do not edit `dashboard.html`, `guide.html`, `current-state.md` or `metrics.md` directly. A page left on disk from a previous successful render can still look valid; inspect the command result and refresh receipt.

The guide's search filters whole chapters. Clear it to restore all chapters. Copy buttons need browser clipboard support; if it is unavailable for a local file, select the text and copy manually. All reading and navigation remain available offline.

### Usage is zero, unknown or surprising

Check the active task/session binding, source path, adapter name, event count and coverage. Unknown is not zero. If a source has no supported records, obtain a compatible export instead of assigning a cost estimate by intuition. Two OpenCode subscriptions require account labels; missing labels can leave observations outside the intended allocation.

Do not sum a parent total with child usage already included in it. Check inclusive scope and stable event IDs if totals look duplicated. Ensure timestamps match the billed interval and that rate cards match the reported provider and model. A partial-known total needs its coverage explanation.

### Review or worker integration fails

A stale review requires a fresh packet and findings tied to that snapshot. An unavailable reviewer needs a configured, authorized wrapper; preparation alone is still available. If a reviewer changed code, inspect and recover the change before treating its result as read-only.

For a worker conflict, inspect `git status`, resolve the cherry-pick or abort it, and preserve the worker's commits. Commit or save coordinator changes before retrying. A rejected ownership contract is a reason to reconcile the task scope, not to copy files around validation.

### Updates or migrations fail

Read the per-file update actions or migration plan and compare the product against its pre-update commit. Customized files are deliberately retained and may need manual integration. A YAML compatibility error happens before update writes. A disk error can happen during writes and leave a partial update.

For malformed JSON or Markdown frontmatter, restore the correct structure using the exact reported file and Git history while preserving valid project data. Review migrations before applying them again. Do not manufacture historical completions, dates or approvals to make a dashboard green.

### Git push or merge fails

The local hook refuses pushes from or to a protected trunk. Switch to a feature branch and use a PR. It does not guarantee that every feature push succeeds: authentication, network access and host rules can still reject it. `os sync` is a merge operation, so do not use it to diagnose connectivity or refresh the dashboard. Save unrelated changes before branch switches or merge recovery.
