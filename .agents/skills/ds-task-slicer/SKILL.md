---
name: ds-task-slicer
description: Decompose an approved epic into bounded, independently understandable tasks with scope, acceptance criteria, dependencies, and intent traceability. Use when shaping roadmap work into an executable backlog.
metadata:
  layer: core
  risk: low
---
# Skill: Slice an epic into bounded tasks

## When to use
When shaping work: an epic arrives, decompose it into bounded tasks. Tasks
within an epic hand off to each other on the same feature branch — one branch
per epic.

## The principle
Agents implement bounded tasks, not vague ideas. A good task is small enough to
complete in one session, with a clear scope and acceptance criteria the human
can check at PR review.

## Procedure
1. Read the epic + relevant spine (charter, decisions, roadmap).
2. Identify the outcome each slice of work advances. State it.
3. Map the task chain: each task's output feeds the next.
4. For each task, set:
   - `risk_level` — drives the Testing recommendation (see ds-test-planner).
   - `files_allowed` — an advisory focus list that keeps the executor scoped
     (not enforced; discipline, not a gate).
5. Fill each task's `## Testing` section (or invoke ds-test-planner): recommend
   `none | with-task | dedicated` with a rationale. If `dedicated`, create the
   test task alongside — it's normal backlog work the human prioritizes.
6. Fill the epic's `## Testing` section with the epic-level recommendation.

## Non-goals (state what the slice does NOT do)
Forcing the planner to name what is out of scope prevents scope creep.

## Anti-patterns
- Per-task branches (forces a merge between every handoff — one branch per epic).
- Vague task titles ("improve the UI") instead of bounded work.
- Skipping the Testing recommendation — "none, because X" is still a decision
  the human should get to see.
