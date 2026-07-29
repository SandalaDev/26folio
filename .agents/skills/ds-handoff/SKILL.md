---
name: ds-handoff
description: Create concise, path-based continuity handoffs that let another session or agent resume work without relying on chat. Use when work pauses, changes agents, crosses tasks, or leaves material risks and next steps.
metadata:
  layer: core
  risk: low
---
# Skill: Handoff (the judgement layer)

## When to use
At session end (`os end`), when a task declares `handoff_required: true`.
`create-handoff.mjs` writes the skeleton + registers the queue entry; THIS skill
is the judgement that fills it with real prose. The skeleton is a *stub* — the
next agent resumes from this file — a body still reading `(fill in)` transfers
nothing (discipline, not a gate: nothing blocks, but the context is simply lost).

## The principle
Knowledge transfers through **files referenced by path**, never copied content.
Agents are temporary; the handoff artifact is permanent. A handoff exists so a
cold-resuming agent (possibly a different harness) can pick up the work without
re-reading your chat history.

## Procedure
1. Run `os end <task>` first — it creates the handoff file at the declared path.
2. Open the file. Replace every `(fill in)` block with real content.
3. **Reference artifacts by path only.** Never paste task content, diff content,
   or code into a handoff. Use `Task: backlog/tasks/TASK-XXX.md`, `Diff: ...`.
4. State current status concisely (what layer is done: DB / API / UI / tests).
5. Name remaining work explicitly. Name known risks with where to check mitigations.

## Section contract (what each must contain)
- **Purpose** — what the next agent is expected to accomplish (≥ one real sentence).
- **Current State** — what exists now, per layer. Reference the task/slice by path.
- **Remaining** — concrete outstanding work, not "see task".
- **Risks** — what a reviewer or next agent should scrutinise first.

## Anti-patterns
- Pasting artifact content (code, the full task, a diff) into the handoff body.
- Leaving any `(fill in)` — a stub transfers nothing to the next session.
- A "conversation summary" instead of a status artifact.
- Skipping the file because the work "seems simple" — if `handoff_required: true`, the task risk justifies it.
