## Plan epics and tasks

Use planning after discovery and delivery decisions, or when adding a meaningful capability. Ask: “Break this outcome into epics and bounded tasks. Show scope, dependencies, estimates, risks and the demonstration I will inspect.”

### Shape the work

1. The agent reads the charter and accepted interviews, then proposes roadmap items that belong in the first release.
2. It decomposes each epic into task skeletons before estimating. It records uncertainty and risks rather than assigning an arbitrary date.
3. You negotiate scope and targets. Unknown delivery capacity remains unknown.
4. The agent creates epic and task files, links them to the roadmap, and fills their contracts.
5. Before implementation, it conducts the epic kickoff and checks interview readiness.

```bash
bash scripts/new-task.sh epic EPIC-001 "First useful capability"
bash scripts/new-task.sh task TASK-001 "Deliver the first behavior" EPIC-001 medium
bash scripts/os.sh interview start epic EPIC-001
```

The scaffolding commands create skeletons. A skeleton is not an executable plan until the agent fills its purpose, scope, acceptance and evidence requirements. The creation command does not run the interview or approve the epic.

### What a task must communicate

- **Intent:** the user outcome and links to the epic and roadmap.
- **Scope:** included behavior, exclusions and a bounded `files_allowed` focus list.
- **Acceptance:** observable normal and failure scenarios, not “works well.”
- **Dependencies:** decisions or deliverables needed before this work starts.
- **Risk and testing:** what could break, the proportionate checks and their commands.
- **Skills:** portable `skill_refs` and why they help this task.
- **Parallel work:** whether it helps, file ownership, dependencies and the expected result.

Use `ds-task-slicer`, `ds-epic-estimator` and `ds-test-planner` for the corresponding planning work. The OS resolves skill names locally; it does not invent harness-specific paths or assume an absent skill is installed.

### Estimates, scope and dates

Task weights represent relative work. The estimate comes from decomposed task skeletons and explicit risk multipliers. They are not hours, token budgets or invoices. The delivery rate relates completed weight to calendar time; its source and confidence matter as much as the resulting date.

When filed work exceeds an epic estimate by 25 percent, revisit the estimate and negotiate scope versus date. Do not hide new work under an old weight. Changing a release baseline requires a deliberate human decision; finishing more tasks does not authorize a new baseline.

### Choose testing deliberately

The testing contract recommends `none` with a reason, `with-task`, or `dedicated`. A small copy correction may need inspection only. A state migration may warrant a dedicated test task and recovery evidence. Tests are normal work in the backlog; they do not become a universal push gate.

The agent records executable checks as argument arrays. For example, a project that already has the named test file can use:

```yaml
testing:
  recommendation: with-task
  reason: Verify the behavior affected by this task.
  commands:
    - ["node", "--test", "test/behavior.test.mjs"]
```

The verification runner does not interpret shell operators or derive commands from prose. Use a real test path and an executable available in the environment. See [Verification and review](#40-quality-release).

### Confirm the plan is usable

```bash
bash scripts/os.sh context TASK-001 --budget 4000
bash scripts/os.sh skills for-task TASK-001
bash scripts/os.sh work assess TASK-001
bash scripts/os.sh interview gate TASK-001
```

The resulting packet should explain the task without requiring someone to reconstruct the chat. Resolve missing decisions, unsupported skills and ambiguous acceptance before claiming implementation. Research and diagnostics can still proceed.
