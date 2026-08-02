---
id: TASK-091
title: "Commit OS machinery upgrade as a single chore commit"
status: done
priority: P1
risk_level: medium
epic_ref: backlog/epics/EPIC-024.md
progress_weight: 1
files_allowed:
  - backlog/
  - project-state/
  - scripts/
  - .githooks/
  - .agents/skills/
  - docs/
  - pack-frontend/
  - AGENTS.md
  - OPERATING_MANUAL.md
  - README.md
  - setup.sh
  - .gitattributes
skill_refs: []
---

# Task: Commit OS machinery upgrade as a single chore commit

## Scope

Make the single `chore: update OS machinery from template` commit that
captures the staged changes from TASK-090 (the apply) and the planning
artifacts from TASK-089 (dry-run log) and TASK-090 itself. This is the one
commit the upgrading thread calls for: a single, reviewable unit of work
covering the entire OS refresh, scoped to the machinery allow-list and the
session bookkeeping.

## Acceptance Criteria

- [ ] One commit on `feature/EPIC-024` with the message `chore: update OS machinery from template`.
- [ ] The commit includes the staged machinery files (5 directories, 5 files, the new template scripts/tests) and the session bookkeeping (`project-state/state.json`, `project-state/AGENT_LOG.md`).
- [ ] The commit does NOT include `project-state/session.lock` (transient, untracked).
- [ ] The commit does NOT modify any project memory files (`ledger.jsonl`, `decisions.md`, `backlog/done/*`, `handoffs/`, `project-spine/`, `memory/`, `src/`, `public/`).
- [ ] `git log -1 --stat` shows the same file list as the TASK-090 staged diff.
- [ ] `bash scripts/os.sh check` and `bash scripts/os.sh doctor` still pass after the commit.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: The commit is local. The two `os` sanity checks already exercised in TASK-090 are sufficient to confirm state integrity is preserved by the commit. The heavier portfolio + test pass belongs to TASK-092.

## Notes

TASK-091 starts here. The single commit is the unit the PR will review. Per
the upgrading thread: the human reads the diff via `git show <hash>` (or the
GitHub PR view) AFTER the commit, not via `git diff --cached` BEFORE it. The
pre-commit `git diff --cached` is an agent-side guardrail; it has been
captured in `backlog/tasks/TASK-090.md` (the apply task) for reference.
