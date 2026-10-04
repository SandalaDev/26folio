## Daily work

Say “Resume the project and continue the next ready task.” The agent should read the saved state and intent before selecting work. You can inspect the same sequence below.

### 1. Open the session

```bash
cd /c/_git/my-project
bash scripts/os.sh start
bash scripts/os.sh next
bash scripts/os.sh status
```

`start` writes a journal with the current branch, identity and task, then regenerates views. It refuses a fresh existing session lock to protect another agent. Use [handoff or recovery](#25-agents) instead of deleting the lock. The next action may be an interview rather than implementation.

### 2. Select a branch and task

When the integration base exists, the repository's branch helper creates or resumes `feature/EPIC-001`:

```bash
bash scripts/branch.sh start EPIC-001
bash scripts/os.sh context TASK-001 --budget 4000
bash scripts/os.sh skills for-task TASK-001
bash scripts/os.sh claim TASK-001
```

The helper uses the project's configured base: `main` by default, `dev` in the optional trunk-dev flow. A manually created `codex/...` feature branch is also usable. Save existing unrelated changes before switching branches. During first-project setup, the already-created setup branch can carry the initial planning work.

Claiming validates that the task exists and its interviews permit implementation, then records task, branch, agent and start time. Claiming establishes usage attribution; unclaimed work is not assigned to a guessed task. Read and satisfy task dependencies as well as the gate result.

### 3. Work and checkpoint

The agent reads the resolved skills and relevant files, implements within the task's focus, and records useful decisions. Before a risky edit or an interruption:

```bash
bash scripts/os.sh checkpoint "Next: verify the empty-state behavior in the preview"
```

A checkpoint updates the recovery journal and attempts supported usage capture. A useful note names the next operation and the evidence or files needed to resume. “Continue working” is too vague. Checkpoints do not create Git commits or backups of source files.

For durable rationale:

```bash
bash scripts/os.sh decide \
  --title "Keep the first release local" \
  --context "The agreed first-release scope has one operator" \
  --decision "Defer collaboration until a later epic" \
  --alternatives "Hosted collaboration adds work outside the agreed scope"
```

Use actual accepted decisions. This appends to `project-state/decisions.md`; it does not complete a required interview or update every affected contract for you.

### 4. Verify and finish the task

```bash
bash scripts/os.sh verify-task TASK-001
bash scripts/os.sh done TASK-001
bash scripts/os.sh next
```

Verification runs the explicit task commands and saves evidence. Inspect the returned status; no commands means `not-run`, not passed. Resolve relevant failures and demonstrate the acceptance behavior before marking work done.

`done` stamps completion, moves the task into `backlog/done/` and clears its claim. If it was the epic's last open task, the OS starts closeout. Task completion is distinct from your acceptance of the epic and the release.

### 5. Close the session

```bash
bash scripts/os.sh checkpoint "Next: demonstrate the epic and resolve closeout"
bash scripts/os.sh end
```

Ending captures available usage, records the session ledger and log, runs advisory sanity checks, clears the journal and normally releases the claim. It does not commit, push, merge or mark an unfinished task done. A task can remain open across many sessions. If another agent will continue it immediately, use `switch` to preserve the claim and write a handoff.

`os release` only clears the current claim; despite its name, it does not publish a software release. Use it when abandoning a claim, then select another task. Do not confuse `release`, `done` and `end`.

### Commit and publish work

Review `git diff` and `git status --short`, stage the intended files and commit on a feature branch. Push the feature branch, then open the PR:

```bash
git push -u origin HEAD
bash scripts/os.sh pr "Describe the delivered behavior" --draft
```

This requires a configured remote and authenticated GitHub CLI. It does not create commits or push them for you. The PR should explain the problem, resulting behavior, verification and material risks. See [Review and merging](#40-quality-release) before running `os sync`.
