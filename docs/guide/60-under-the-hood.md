## Under the hood: what the system records

You don't need this chapter to use the system — it explains what's happening beneath the commands, so nothing feels like magic.

### Sessions

Work happens in **sessions** — one contiguous stretch of work. `os start` clocks in; `os end` clocks out. Every durable effect (state update, ledger row, view render, handoff creation) happens at those two boundaries, not continuously. A task worked Tuesday and Thursday is two sessions. `os start` is never left "running" — it just writes the journal and returns.

<table class="kv" style="margin:10px 0">
  <tr><td><code>os start</code></td><td>Once, at the beginning of a work session. Reads state, renders views, writes the session lock (the crash journal).</td></tr>
  <tr><td><code>os checkpoint "next step"</code></td><td>Mid-session, before risky edits. Updates the journal with the current branch, task, next step, and touched files.</td></tr>
  <tr><td><code>os end [task]</code></td><td>Once, when finishing. Advisory sanity check, one state update + ledger row, declared handoffs created, lock cleared, claim released.</td></tr>
</table>

### Crash recovery

If a session dies without `os end` (crash, closed terminal, exhausted context window), the lock file remains. The **next** `os start` notices, preserves the journal as `session.lock.crashed-<timestamp>` (never overwrites), prints its full contents — branch, task, next step, files touched — and logs a `crashed` ledger row with the time the session did run. The new session resumes from the journal's `next_step`. Nothing is silently lost; crashes become data (the dashboard shows a crashed count).

### The state model

`project-state/state.json` is the **single source of truth**, and most of it is *derived*: epics from `backlog/epics/`, the handoff queue from `handoffs/`, completion from `completion.md`. `os render` (run automatically at start/end) rebuilds it, plus `current-state.md` and this dashboard. Two rules keep it trustworthy: **never hand-edit generated files**, and **write state only through the commands** (`claim`, `release`, `decide`, `end`). `os check` tells you at any moment whether reality and state agree.

### The decision log

`bash scripts/os.sh decide --title <t> --context <why> --decision <what> [--alternatives <rejected>]` appends an entry to `project-state/decisions.md`. This is the project's long-term memory of *why* — the thing chat loses first. Agents record decisions as they make them; you can too.

### Dependency evidence

Dependency plans under `planning/dependencies/` are durable research artifacts.
OpenSrc caches version-matched upstream source outside the repository, while the
plan records reproducible package specs, source commands, documentation
findings, pairwise compatibility reasoning, resolver results, verification
plans, and human approval. Architecture decisions reference these artifacts by
path through `os decide`.

### Handoffs (continuity notes)

When a task declares `handoff_required: true`, `os end` scaffolds a note under `handoffs/session/` or `handoffs/task/` — purpose, current state, remaining work, risks — that the next session (or the next task's agent) reads first. They reference files by path, never copy content. Consumed handoffs move to `handoffs/archive/`. There is no review handoff type — reviews live entirely outside the system.

### The ledger and the dashboard's numbers

Every `os end` (and every detected crash) appends one JSON line to `project-state/ledger.jsonl`: who (harness/model/role), what (task, branch), outcome (sanity check ok/warn, completed/crashed), and duration. The dashboard's session counts, per-combo table, and sparklines are all views of this file.

### Identity and cost (both optional)

The harness is auto-detected (Claude Code, Cursor, Codex, …). Exporting `HARNESS_NAME` / `MODEL_NAME` / `AGENT_ROLE` refines the attribution; leaving them unset records `unknown` — honest, silent, and completely fine. Cost tracking is likewise opt-in: if a `.session-usage.json` file (`{"tokens_in":N,"tokens_out":N,"cost_usd":N}`) exists at `os end`, its numbers fold into the ledger and the file is removed; if not, the ledger says `unknown`. The system never invents numbers and never nags.

### The doctor

`bash scripts/os.sh doctor` is the self-check: dependencies, hooks wired, sanity machinery present, spine status, and **self-drift** — it verifies the OS's own docs against its own code (every advertised command exists; the pre-push hook stays trunk-guard-only and hasn't quietly grown checks back). Run it whenever something feels off.
