## The daily loop (every task)

This is the rhythm you'll repeat for every task. The agent does steps 1–6; you do steps 7–9. In practice your side is one sentence to start ("work TASK-007") and one review at the end.

```
YOU     "work TASK-007"
AGENT    branch.sh start EPIC-XXX      cut/resume the epic's feature branch
AGENT    os claim TASK-007             attribute the work to the task
AGENT    os start                      open the session (crash journal begins)
AGENT    os context                    read the 3 KB intent briefing
AGENT    ...writes code, checkpoints, records decisions...
AGENT    os end backlog/tasks/TASK-007.md    close the session
AGENT    git push && os pr             push (always succeeds) + open the PR
YOU      review the PR manually        your process — system has no visibility
YOU      merge (squash)
AGENT    os sync                       pull the merge, clean up the branch
```

### Step 1 — kick off — YOU

Tell the agent: *"work TASK-007"* (or "start the next task"). That's your whole job at this stage. If you're starting the agent in a fresh chat, it reads `CLAUDE.md`/`AGENTS.md` automatically and knows the drill.

### Step 2 — branch — AGENT

```
bash scripts/branch.sh start EPIC-002
```

One feature branch per **epic** (not per task) — tasks within an epic hand off to each other on the same branch. If the branch already exists, this resumes it; otherwise it cuts a fresh one off the up-to-date integration base (`main` by default).

**You should see (in the agent's output):** `[branch] created feature/EPIC-002 off main (flow: github)` or `[branch] resumed existing feature/EPIC-002`.

### Step 3 — claim, open the session, read the briefing — AGENT

```
bash scripts/os.sh claim TASK-007     # records TASK-007 as the active task
bash scripts/os.sh start              # opens the session
bash scripts/os.sh context            # prints the intent briefing
```

**What each does:** `claim` points `state.current.task` at the task so the ledger, views, and this dashboard attribute the work correctly. `start` renders fresh views and writes the **session lock** — a small journal that makes a crash recoverable. `context` prints a bounded (~3 KB) briefing that always leads with the charter's north star, then the current task/branch, any pending handoff, the last session's outcome, and a reminder to flag risky changes in the PR — so the project's intent re-enters every session instead of drifting.

### Step 4 — the work itself — AGENT

The agent implements the task's Scope and Acceptance Criteria. While working, it:

- **Stays inside `files_allowed`** — the task's advisory focus list. Nothing enforces it; it exists to keep the agent from wandering.
- **Researches dependency changes before installation:** if the task adds,
  upgrades, or replaces a package, it invokes `opensrc-research` and creates an
  `os deps plan add` artifact before changing the package manifest.
- **Checkpoints before risky edits:** `bash scripts/os.sh checkpoint "about to refactor auth"` — saves in-flight state (branch, task, next step, touched files) into the session journal, so a crash mid-refactor is recoverable to the checkpoint, not to zero.
- **Records durable decisions:** `bash scripts/os.sh decide --title "..." --context "..." --decision "..."` — appends to `decisions.md` so the *why* survives the chat window.
- **Runs whatever tests the task's `## Testing` section called for** (see the Testing chapter). Results inform your review; they block nothing.

### Step 5 — close the session — AGENT

```
bash scripts/os.sh end backlog/tasks/TASK-007.md
```

**What it does:** runs the *advisory* sanity check (task frontmatter parses; `state.json` consistent — reported, never blocking), writes the one state update, re-renders all views including this dashboard, appends a ledger row (who/what/how long), creates any declared continuity handoff, clears the session lock, and releases the task claim.

**You should see:** `[os] session ended as <harness>/<model> (executor). state.json canonical; views regenerated; ledger appended.`

### Step 6 — push and open the PR — AGENT

```
git push -u origin feature/EPIC-002
bash scripts/os.sh pr "TASK-007: short title" --body "..."
```

The push **always succeeds** from a feature branch — no checks run at push time. The only push ever refused is one aimed directly at a trunk branch. In the PR body, the agent must summarize what changed, state the Testing recommendation and any test results, and **loudly flag any risky areas touched** — schema, auth, billing, secrets, infrastructure, compliance copy. That flag is the agent's entire duty to review; everything after is yours. (No `gh` CLI? The agent pushes and you open the PR in the browser — same thing.)

### Step 7 — review the PR — YOU (manually, outside the system)

This is where quality is actually decided, and it's deliberately yours alone — the system doesn't watch, record, or enforce any of it. A workable pass:

1. Read the PR description first — did the agent flag risky areas? Do the flags match the diff?
2. Read the diff. Check it against the task's Acceptance Criteria (`backlog/tasks/TASK-007.md`).
3. Look at the task's `## Testing` recommendation — was it followed? If it said `none`, do you agree with the stated reason?
4. If CI shows a red "sanity" run, that means a state file drifted (fix: have the agent run `os render` and commit) — it is **not** a verdict on the code.

### Step 8 — request changes (if needed) — YOU, then AGENT

Comment on the PR or just tell the agent in chat what to fix. The agent works on the **same branch** (new session: `os start` → fix → `os end` → push) and the PR updates automatically. Repeat until you're satisfied.

### Step 9 — merge and sync — YOU, then AGENT

Merge the PR (squash-merge keeps history clean; the agent's WIP commits collapse into one). Then tell the agent to run:

```
bash scripts/os.sh sync
```

which switches back to the base branch, pulls the merge, and deletes the merged feature branch. The loop is closed — pick the next task.

### Working across multiple days

Sessions are the unit of work, not tasks. If a task takes Tuesday and Thursday, that's **two** sessions — two `os start` / `os end` pairs. To carry context across the gap, the agent can declare a continuity handoff on the task (`handoff_required: true`), and `os end` scaffolds a note (what's done, what's next, known risks) that Thursday's session reads first.
