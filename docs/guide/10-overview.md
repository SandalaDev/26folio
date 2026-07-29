## What this is

**agent-os** is a lean, harness-agnostic operating system for agentic coding. You clone this template to start every project. It gives you three things that raw chat-based coding lacks: **durable memory** across sessions and agents, **crash recovery and handover**, and a dashboard that traces delivery back to project intent.

The core idea: **artifacts are permanent, agents are temporary.** Every durable fact lives in a repo file. Chat is a scratchpad you can throw away mid-thought.

And one design rule above all: **the OS is non-blocking.** It manages memory, state, and context — it never gates quality. A push always succeeds (the only thing ever refused is a direct push to a trunk branch, so changes arrive via PR). Quality is caught by two things that live *outside* the system: **tests**, which are planned backlog work the agent recommends and you prioritize, and **your manual review of every PR**.

## Who does what

<table class="kv" style="margin:10px 0">
  <tr><td><strong>You (the human)</strong></td><td>Write the brief. Answer the interview. Review the hydrated context. Approve the backlog. Review every PR manually (your process — the system has no visibility into it). Merge. Decide which recommended test tasks actually run.</td></tr>
  <tr><td><strong>The agent</strong></td><td>Everything else: runs every command in this guide, interviews you, drafts the context files, shapes epics/tasks, recommends testing, writes the code, opens sessions, checkpoints, ends sessions, pushes, opens the PR with risky changes flagged.</td></tr>
  <tr><td><strong>The system</strong></td><td>Remembers. It records who did what and where things stand (state, ledger, decisions, handoffs), recovers crashed sessions, briefs each new session with the project's intent, and renders this dashboard. Nothing more.</td></tr>
</table>

You almost never type a command yourself — you *tell the agent* what to do in chat, and it runs the commands. Every step in this guide is labeled **YOU** (something only you can do or decide) or **AGENT** (something you ask the agent to do). Where a step says "you type", you can equally paste the same instruction to the agent.

## The four layers

- **L0 Memory** — `project-state/state.json` (canonical), `ledger.jsonl` (session log), `decisions.md` (decision log), `handoffs/` (continuity notes), the session lock (crash journal).
- **L1 Views** — `dashboard.html`, `guide.html`, and `current-state.md`. Generated, never hand-edited.
- **L2 Sanity** — `verify.sh`, a small *advisory* check that state files aren't corrupted. Runs in CI as information; never blocks anything.
- **L3 Workflow** — one entry point: `bash scripts/os.sh <command>`.

<p class="muted">L4 (Frontend Pack) is an optional, default-on layer for web projects — design/content/UI elicitation phases plus frontend skills. A non-frontend project skips it entirely.</p>

## How to read this guide

The next chapters are in the order you'll live them: **Setup** (once per machine/project) → **Project start** (once per project) → **The daily loop** (every task) → **Testing** (how quality actually works here) → **Under the hood** (what the system records) → **Troubleshooting**.
