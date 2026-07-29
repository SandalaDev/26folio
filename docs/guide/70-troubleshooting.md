## Troubleshooting

Each symptom below names its one fix. If you're ever unsure where to start: `bash scripts/os.sh doctor` — it checks everything and names the fix for whatever it finds.

### "REFUSED: push targets trunk" / "REFUSED: on 'main'"

The only push the system ever refuses: one aimed directly at a trunk branch (`main`, or `dev` in trunk-dev flow). This is workflow protection, not a quality check. Fix: cut a feature branch and PR instead — `bash scripts/branch.sh start EPIC-XXX`, then push. (Bypassable with `git push --no-verify` if you truly mean it — that's a decision, not an accident.)

### CI "sanity" run is red

Not a code problem. It means a state file drifted — usually `state.json` is stale relative to the backlog/handoffs, or a task file's frontmatter got malformed by a hand edit. Fix: `bash scripts/os.sh render`, commit the result, push. If it stays red, `bash scripts/os.sh check` locally shows exactly which field disagrees.

### "PREVIOUS SESSION DID NOT END CLEANLY"

Not an error — this is crash recovery working. The dead session's journal was preserved (`session.lock.crashed-<ts>`) and printed; a `crashed` ledger row was logged. Read the journal's `next_step` and `files_touched`, resume from there (or start fresh), and delete nothing.

### "state: DRIFT" from `os check`

Someone hand-edited a generated file, or counts are stale after manual backlog edits. Fix: `bash scripts/os.sh render` then re-run `bash scripts/os.sh check`. Rule going forward: state is written through commands, never by editing `state.json` directly.

### "missing project-state/state.json"

You're not in the repo root, or the template didn't copy fully. Run commands from the folder that contains `project-state/`.

### `os pr` / `os sync` says "needs the gh CLI"

Install the GitHub CLI (`https://cli.github.com`) — or skip these conveniences entirely: push with `git push`, open/merge the PR in the browser, then `git switch main && git pull` and delete the branch. Identical outcome.

### OpenSrc preflight cannot fetch a package

Confirm Node, Git, registry access, and repository authentication. Retry the
exact command printed in the dependency plan with
`bash scripts/os.sh deps path <exact-spec>`. OpenSrc uses its global cache after
the first successful fetch. Do not bypass the evidence step by silently
installing `latest`; record the outage or source-mapping problem and resolve it.

### `os deps check` refuses a plan

Read the named reason. Required research may still contain `TODO(REQUIRED)`, a
candidate may not be pinned, or human approval may be pending. If npm's dry-run
resolver reports peer conflicts, revise the candidate set and repeat the
OpenSrc cross-reference rather than forcing the install.

### The dashboard looks stale

It's a snapshot, not a live view — it regenerates at every `os start`/`os end`. Force it anytime: `bash scripts/os.sh render`, then refresh the browser.

### The standalone guide is missing or empty

`guide.html` renders from `docs/guide/*.md`. Run `bash scripts/os.sh render`. If the source chapters are missing, restore them or run `bash scripts/update-from-template.sh` from a template checkout.

### Windows: "bash: command not found" / commands fail in PowerShell

Every command in this guide is bash. Run them in **Git Bash** (comes with Git for Windows), or let the agent run them — agent harnesses invoke bash correctly on Windows. From PowerShell you can also run any single command via: `& "C:\Program Files\Git\bin\bash.exe" -lc "bash scripts/os.sh check"`.

### `intake ready` refuses

That's it doing its job (the one fail-closed check — it protects intent capture). It prints the exact section that's still a placeholder; fill that section with real words (or "none") and re-run.

### Something else is off

`bash scripts/os.sh doctor` — dependencies, hooks, sanity machinery, spine status, self-drift. Every failure it reports comes with its one-line fix.
