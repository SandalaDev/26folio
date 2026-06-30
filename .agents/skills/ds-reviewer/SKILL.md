---
name: ds-reviewer
description: Cross-model diff review against the task, slice plan, project spine,
  declared skills, and tests. Run by a model family DIFFERENT from the one that
  wrote the code. Reads a HANDOFF-REVIEW, reviews the branch diff, and writes a
  decision to the referenced REVIEW notes path. Advises; the human merges.
version: 1.0.0
owner: Solo Dev OS
risk: low
allowed_tools: [read_files, run_readonly_commands, write_markdown]
forbidden_tools: [edit_production_code, run_deployment_commands]
---
# Skill: DS Reviewer

## When to use
Phase C of the build loop — after a feature branch is pushed and a
`HANDOFF-REVIEW-<TASK>.md` exists in the queue. The reviewer family **must differ**
from `preferred_executor` (e.g. executor `claude-code` → reviewer `codex` or
`opencode`). A solo dev degrades to `reviewer: human`, but the review file is
still required. The executor may not self-approve non-trivial work.

## Preconditions (refuse the review if any fail)
- A `HANDOFF-REVIEW` file exists and names this task. If it does not, **stop** and
  report — do not invent findings against code that was never handed off. (This is
  the operating law: no durable decision that is not reflected in Markdown or code.)
- You can see the branch diff (`git diff <base>...HEAD`). Base is `dev` for feature
  branches; `scripts/branch.sh base` resolves it.

## Procedure
1. Read the handoff's `review_focus`, `task_ref`, `slice_ref`, `epic_ref`.
2. Read the task file (acceptance criteria, files_allowed, risk_level) and the
   referenced slice and epic — review against intent, not vibes.
3. Read the relevant `project-spine/` files the task touches (e.g.
   `07-architecture-principles.md`) and any `skill_refs`.
4. Review the diff for, in priority order:
   - **Correctness** of risk-bearing behaviour (the thing that can break in prod).
   - **Conformance** to the slice plan and architecture principles.
   - **Scope**: every changed file is inside `files_allowed`; no scope escape.
   - **Edge cases** the acceptance criteria imply but tests may miss.
   - Reuse / simplification only after the above.
5. Confirm declared verification actually ran (the handoff's `verification:` block
   should match reality; spot-check by re-running a cheap proof if in doubt).

## Output
Write `REVIEW-<TASK>.md` at the handoff's `review_notes_path` (default
`.agents/reviews/REVIEW-<TASK>.md`) with:
- `decision:` one of `approve | approve-with-nits | request-changes`
- Findings as a list, each tagged `[blocking]` or `[nit]`, each pointing to
  `path:line` and stating the concrete fix.
- An explicit statement of what you verified vs. took on trust.

If `request-changes`, the human opens a rework loop
(`bash scripts/rework.sh open <TASK> "…"`); the gate stays red until every item
is resolved. Re-review after substantial rework.

## Notes
You **advise**; you do not merge and you do not push. The human reads the decision
and either promotes (Phase E) or triggers rework (Phase D).
