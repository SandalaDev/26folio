---
name: ds-test-planner
description: Assess what could break and recommend proportionate testing as normal backlog work. Use after shaping an epic or task to choose none with rationale, coverage within the task, or a dedicated test task.
metadata:
  layer: core
  risk: low
---
# Skill: Testing as planned work (non-blocking)

## When to use
After planning an epic or task — when filling its `## Testing` section. Testing
in this system is NEVER a gate: nothing blocks a push, and no change *requires*
a test. Instead, the planning agent assesses risk and RECOMMENDS testing work;
the human accepts or declines by prioritizing the backlog.

## The principle — recommend, don't require
Tests exist to prove risk-bearing behaviour, not to satisfy a policy. Most
changes need no dedicated test. Your job is the honest assessment: what could
break, what harm it causes, and the smallest testing effort (possibly none)
that buys real confidence.

## Risk → default recommendation
| Risk | Default recommendation |
|---|---|
| Low | `none` — say why in the rationale (e.g. "cosmetic; caught at a glance"). |
| Medium | `with-task` — cover the happy path inside the implementing task itself. |
| High | `dedicated` — recommend a separate test task (create it, human prioritizes it). |
| Critical | `dedicated` + suggest a manual QA checklist in the task body. |

These are defaults, not rules. Override them with judgment and say why.

## Procedure
1. Read the epic/task's acceptance criteria.
2. For each, identify risk-bearing behaviour (what, if wrong, causes real harm).
3. Choose the recommendation (`none` | `with-task` | `dedicated: TASK-XXX`) and
   write it, with rationale, into the `## Testing` section the scaffold provides.
4. If `dedicated`: create the test task now —
   `bash scripts/new-task.sh task TASK-XXX "tests: <area>" EPIC-YYY low` —
   scope it to the specific behaviours, and reference it. It's a normal backlog
   item; the human decides when (or whether) it runs.
5. State non-goals: what is explicitly not tested, and why.

## Anti-patterns
- Coverage theatre: weak tests added to look thorough.
- Recommending `dedicated` for everything — it devalues the recommendation.
- Skipping the rationale on `none` — "none, because X" is the whole product.
- Treating a red test run as a blocker — it's information for the human's
  manual PR review, nothing more.
