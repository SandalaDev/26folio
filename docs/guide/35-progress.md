## Progress: tasks traced to roadmap and business intent

The dashboard estimates **delivery toward intent**, not business success. It follows completed work upward through this chain:

```
business goal <- roadmap item <- epic <- task
```

A task contributes only where its references lead. Each task defaults to weight `1`; use `progress_weight` when two tasks differ materially in effort or delivered scope. Goal and roadmap weights default to `1`.

:::human Required: define and approve the intent

You must approve each goal's wording, relative weight, and `success_signal`. You must also approve the roadmap links. An agent may propose these values, but it cannot decide what matters to the business or declare an outcome achieved.
:::

### Charter metadata

Put structured goals in the frontmatter of `project-spine/01-charter.md`:

```
goals:
  - id: GOAL-001
    title: Reduce time from signup to first value
    weight: 2
    success_signal: Median activation time below 10 minutes
    outcome_status: unvalidated
```

`outcome_status` is deliberately separate from delivery progress. Change it only when real evidence supports a value such as `observed`, `validated`, or `missed`.

### Roadmap metadata

Put structured roadmap items in `project-spine/03-roadmap.md`:

```
roadmap:
  - id: ROAD-001
    title: Self-service activation
    goal_refs: [GOAL-001]
    weight: 2
    status: active
```

### Epic and task links

An epic normally carries the intent links for its tasks:

```
roadmap_refs: [ROAD-001]
goal_refs: [GOAL-001]
progress_weight: 1
```

Tasks inherit links from their epic. A task can override them with its own `roadmap_refs` and `goal_refs`. Put `progress_weight: 1` on tasks and change it only when there is a defensible reason.

:::agent Keep traceability intact

When shaping work, give every epic a roadmap link and every roadmap item a goal link. Before closing a task, check that its inherited or direct references resolve. Never increase a weight merely to make the percentage move.
:::

### How the estimate is calculated

- A task in `backlog/done/`, or with status `done`, contributes its full task weight.
- Roadmap progress is completed linked-task weight divided by total linked-task weight.
- Goal progress is the same calculation across tasks traced to that goal.
- Overall progress is the weighted average of goal progress. If goals are absent, it falls back to roadmap progress, then task-only progress.
- With no tasks, the result is **Not estimable**, not zero.

Confidence is high only when structured goals and roadmap items exist, every
goal and roadmap item has scoped tasks, and at least 90% of tasks trace through
both. Medium and low confidence expose missing scope or weaker links.

:::check Before using the percentage in a decision

Confirm the dashboard shows the expected goals, roadmap items, and task counts; inspect any “tasks weaken the estimate” warning; then compare delivery progress with each goal's real-world `success_signal`. The number is a planning aid, never a performance claim.
:::
