## Start here: the whole system in five minutes

This repository is a project operating system, not an application scaffold. Copy it into a new project, capture the project's intent, shape that intent into traceable work, and let any compatible coding agent operate through the same files and commands.

:::human Your irreducible responsibilities

You supply intent, answer factual questions, approve the charter/roadmap/backlog, decide priorities, review every pull request, and approve sensitive or public writing. The system cannot make those judgments true by automating them.
:::

:::agent What to delegate

Tell the agent what outcome you want. The agent should run setup/workflow commands, read the bounded context, shape tasks, implement, test as planned, checkpoint, maintain durable decisions, and prepare the pull request.
:::

:::system What happens automatically

The scripts derive current state, dashboard, guide, metrics, task counts, progress estimates, and handoff queues from repository files. Generated HTML and Markdown views are disposable.
:::

### The shortest safe path

1. Create a repository from this template and run `bash setup.sh`.
2. Tell the agent to scaffold the brief; write the intent yourself.
3. Let the agent interview gaps; answer the questions yourself.
4. Let the agent hydrate charter, decisions, and roadmap; review and approve all three.
5. Let the agent shape an epic and tasks; confirm the links back to roadmap and goals.
6. Tell the agent to work a task. Review the resulting pull request and merge only when satisfied.

:::check You know the system is ready when

`bash scripts/os.sh doctor` reports healthy, `dashboard.html` names one sensible next action, and `guide.html` opens as this standalone guide. If the progress estimate says low confidence, follow the Progress chapter rather than trusting the number.
:::

### Never do these

- Do not treat chat as durable memory.
- Do not hand-edit `dashboard.html`, `guide.html`, `current-state.md`, or `metrics.md`.
- Do not mistake task completion for evidence that customers or the business received the intended outcome.
- Do not let an agent silently invent product intent, success measures, legal claims, pricing, or brand promises.
- Do not delete a stale session journal before reading its next step and touched files.
