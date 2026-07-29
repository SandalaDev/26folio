## Testing: planned work, never a gate

No change in this system *requires* a test, and nothing ever blocks a push. Instead, **testing is a planning decision**: when the agent shapes an epic or task, it assesses what could break and writes a recommendation into the item's `## Testing` section. You then decide — by prioritizing, deferring, or deleting the recommended work — whether that testing actually happens. Quality stays your call; the agent's job is to make the call informed.

### What a recommendation looks like

Every scaffolded epic and task has this section, which the planning agent fills:

```
## Testing
- recommendation: dedicated: TASK-012
- rationale: auth token refresh is high-risk; happy-path unit tests
  plus an integration test against the mock IdP. TASK-012 created.
```

The three possible recommendations:

<table class="kv" style="margin:10px 0">
  <tr><td><code>none</code></td><td>No testing work warranted — **with the reason stated**. "none, because it's a copy change caught at a glance" is a complete, valid answer. An empty rationale is not.</td></tr>
  <tr><td><code>with-task</code></td><td>The implementing task itself covers the happy path (e.g. a unit test written alongside the code). No separate backlog item.</td></tr>
  <tr><td><code>dedicated: TASK-XXX</code></td><td>Risk justifies its own test task. The agent **creates it immediately** (`new-task.sh task TASK-XXX "tests: <area>" EPIC-YYY low`) so it exists in the backlog for you to prioritize — or consciously decline.</td></tr>
</table>

### How the agent picks (defaults, not rules)

<table class="kv" style="margin:10px 0">
  <tr><td>Low risk</td><td><code>none</code> — usually. Say why.</td></tr>
  <tr><td>Medium risk</td><td><code>with-task</code> — happy-path coverage inside the task.</td></tr>
  <tr><td>High risk</td><td><code>dedicated</code> — a separate test task.</td></tr>
  <tr><td>Critical risk</td><td><code>dedicated</code> + a manual QA checklist in the task body.</td></tr>
</table>

Judgment overrides the table in both directions — a low-risk change to money-handling code deserves more than its label; a high-risk-labeled rename may deserve nothing. The rationale line is where that judgment shows.

### What YOU do with recommendations

1. **When reviewing the backlog** (project start, or whenever epics are sliced): scan the `## Testing` sections. Promote, defer, or delete the dedicated test tasks — they're ordinary backlog items with no special status.
2. **When reviewing a PR:** check the task's recommendation was honored. If it said `none`, ask yourself if you agree with the reason. This 30-second check is the entire "test policy" of the system.

### Running tests

Test tasks run like any other task — the agent works them through the normal daily loop. Ad-hoc runs (`npm test`, etc.) can happen any time the agent or you want a signal. **A red test run blocks nothing** — it's information that flows into your PR review, where you decide what it means.
