## Switching agents mid-work

Rate limit hit mid-task. A weaker model stuck in a loop. A stronger model you want on the next task. All three are the same move: **hand the work to a new agent without losing context.** The rule underneath never changes — knowledge moves through files in the repo, never through your copy-paste.

### The one line

Your entire job when switching is to give the new agent this:

```
bash scripts/os.sh onboard
```

That one command starts its session and prints the **onboarding packet**: the project's north star, the active task with its acceptance criteria, pending handoffs, the git state it's inheriting, and the single next action. No "read these six files" ritual.

### Scenario 1 — graceful switch (planned, or "I'm about to hit my limit")

The outgoing agent can still run commands. Tell it: *"switch, you're at your limit"* — it runs:

```
AGENT   bash scripts/os.sh switch "finished the parser, next is CRLF handling, watch the Windows paths"
```

`switch` checkpoints the journal, writes a **real handoff note** (never a stub) under `handoffs/session/`, and ends the session — **keeping the task claimed**, because the task continues with the next agent. Then:

```
YOU     open the new agent (any harness, any model) and paste:
        bash scripts/os.sh onboard
```

The note the old agent wrote appears in the packet under *Pending handoffs*.

### Scenario 2 — hard death (rate-limit wall, crash, closed tab)

The old agent left without ending its session. The **session lock** it leaves behind is the recovery artifact — the new agent's `os onboard` handles it for you:

- **Lock is old** (no activity for 2+ hours): treated as a crash — the journal is preserved, printed, and logged, and the new agent resumes from `next_step` and `files_touched`.
- **Lock is fresh** (< 2 hours): `onboard` **refuses**, because a fresh lock might be a genuinely running session (a second tab, a sub-agent). You get:

```
[os] REFUSED: a session lock 12 min old is probably live (fresh < 120 min).
[os] If the previous session is over (rate limit, stuck agent, closed tab):
[os]   bash scripts/os.sh onboard --takeover
```

Confirm the old session is really dead, then run the takeover line. The journal is still preserved as a crash artifact — nothing is overwritten. (Tune the 2-hour window with `OS_LOCK_TTL_MIN`.)

### Scenario 3 — next task, better model

Nothing is stuck; you just want a stronger model on the next task of the epic. The old agent ends normally (`os end <task>` — this clears the claim), and the new agent runs `os onboard`. The packet's *Next action* names the next ready task — cheapest first, thanks to the effort tracking — so "claim it" is one sentence.

### What the packet contains (and where it comes from)

| Section | Source | Why it's there |
|---|---|---|
| Briefing | `os context` — charter north star + current facts | intent re-enters every session |
| Active task | `state.current.task` + the task file | what to do, with acceptance criteria |
| Pending handoffs | `handoffs/` (paths, never copies) | what the previous agent left for you |
| Git sync state | branch, uncommitted files, unpushed commits | the tree you're inheriting |
| Next action | the dashboard's decision ladder | the one thing to do to stay in sync |

:::agent
After reading a handoff, move it to `handoffs/archive/` — that's how the queue knows it's consumed.
:::

### Rules that keep switching safe

- **One session owner per working tree.** The fresh-lock refusal protects a live session from a second agent — including sub-agents, which never onboard (they're workers inside the parent's session).
- **Claims survive switches, not completions.** `os switch` keeps the task claimed; `os end` clears it.
- **Everything lands in the ledger per harness/model.** Which agent did what — and where one got stuck — becomes data on the dashboard, not folklore.
- **Crashes are preserved, never overwritten.** A takeover moves the old journal to `session.lock.crashed-<ts>` and logs it.
