---
name: ds-handoff
description: Creates the correct handoff artifact (review, session, or task) at
  session end. Reads task frontmatter to determine required types, populates the
  template by referencing artifact paths (never copying), updates the handoff_queue
  in STATE.json, and is run as part of os.sh end.
version: 1.1.0
owner: Solo Dev OS
risk: low
allowed_tools: [read_files, write_markdown]
forbidden_tools: [edit_production_code, run_deployment_commands]
---
# Skill: DS Handoff

## When to use
At every session end when task frontmatter has `handoff_required: true`.
Also proactively for session handoffs when the context window approaches limits.

## Procedure
1. Read the task file and check `handoff_type` (review | session | task; may be a list).
2. Read `project-state/STATE.json` (completion + current).
3. Select the correct template (review, session, or task) — see Templates below.
4. Populate current_state, completed, remaining, risks, and artifact paths.
5. Do **not** copy artifact content — reference by path only.
6. Write the handoff to `handoffs/<type>/HANDOFF-<TYPE>-<REF>.md`.
7. Add the queue entry to `STATE.json.handoff_queue[]`.

The mechanical steps 6–7 are performed by `scripts/create-handoff.mjs`, which
`os.sh end` invokes automatically when `handoff_required: true`. This skill is the
*judgement* layer: it decides the type(s), writes the prose blocks (Purpose,
Current State, Remaining, Risks, review_focus), and confirms the queue entry.
Run the script, then review and enrich the generated file — never hand-sync the
queue table (`HANDOFF_QUEUE.md` is generated from `STATE.json`).

## Output
A minimal, path-referenced handoff that gives the next agent exactly the context
needed — no more, no less.

## Templates

### review  →  `handoffs/review/HANDOFF-REVIEW-<TASK>.md`
Created when a task requires cross-model review (risk_level medium and above).
The reviewer must be a different model family than `preferred_executor`.
Frontmatter carries `verification:` (the actual gate results) and `review_focus:`
(the 2–4 things the reviewer must scrutinise: architecture conformance to the
slice, risk-bearing logic, edge cases, spine-principle adherence). Body lists
what is done and what remains *for the reviewer*. Names `review_notes_path`
where the reviewer writes `REVIEW-<TASK>.md`.

### session  →  `handoffs/session/HANDOFF-SESSION-<YYYY-MM-DD>.md`
Resume-later handoff. Records current %, the exact next step, and the open files.

### task  →  `handoffs/task/HANDOFF-TASK-<FROM>-<TO>.md`
Task A complete → Task B begins. Carries forward only the context B needs so B
does not re-read the whole spine.

## Anti-patterns (these defeat the OS's purpose)
- Pasting code, full task text, or "everything we did" narrative into the handoff.
  Reference paths; the body is purpose + state + remaining + risks, nothing more.
- Setting `handoff_required: true` but never producing the file. `verify-task.sh`
  fails closed on this — the gate will reject the push.
- Hand-editing `HANDOFF_QUEUE.md`. It is generated; edit `STATE.json.handoff_queue[]`.
