# CLAUDE.md

Harness entry point for Claude Code. The canonical agent law lives in
**`AGENTS.md`** — read it first. This file exists only because Claude Code
auto-loads `CLAUDE.md` by name; it is deliberately a pointer, not a copy, so
there is exactly one source of law that can't drift.

## What to read, in order
1. **`AGENTS.md`** — the operating law (source of truth, four layers, session
   lifecycle, git workflow, stop conditions).
2. **`OPERATING_MANUAL.md`** — the full reference, including the launch
   checklist and the daily loop.
3. **`project-state/state.json`** — live project state (the single source of
   truth for what's happening right now). Generated views like
   `current-state.md` and `dashboard.html` are derived from it.

## Session lifecycle (every session)
- Start: `bash scripts/os.sh start`
- Work: stay within the task's `files_allowed` focus list (advisory);
  checkpoint with `bash scripts/os.sh checkpoint "next step"`.
- End: `bash scripts/os.sh end [task]`

If working a task, claim it first so state attributes the work:
`bash scripts/os.sh claim <TASK-XXX>`.

The OS is non-blocking: it manages memory and context, never quality. Tests are
planned backlog work (fill each epic/task's `## Testing` section with a
recommendation); reviews are done manually by the human after the PR — assume
pushed code already passed them.

See `AGENTS.md` and the standalone `guide.html` for the rest.
