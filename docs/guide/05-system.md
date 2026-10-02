## How the OS works

The OS is a set of repository files and local commands. It gives agents a common working contract across harnesses. It is not a hosted project manager, an agent runtime, a billing account connection or an application scaffold.

### Who does what

<table><thead><tr><th>Participant</th><th>Responsibility</th></tr></thead><tbody><tr><td>You</td><td>Explain intent, answer tradeoffs, approve consequential decisions, inspect demonstrations and review PRs.</td></tr><tr><td>Coding agent</td><td>Research facts, conduct interviews, write plans and code, operate commands, collect evidence and maintain handoffs.</td></tr><tr><td>OS commands</td><td>Record state, check ownership and interview readiness, normalize evidence and generate views.</td></tr><tr><td>Harness and provider</td><td>Run model calls, expose their own permissions and usage data, and handle their own account billing.</td></tr></tbody></table>

### Where information belongs

<table><thead><tr><th>Path</th><th>Purpose and ownership</th></tr></thead><tbody><tr><td><code>AGENTS.md</code>, <code>OPERATING_MANUAL.md</code></td><td>Portable operating rules and the compact agent reference.</td></tr><tr><td><code>project-spine/01-charter.md</code></td><td>Purpose, users, constraints, scope and success.</td></tr><tr><td><code>project-spine/02-decisions.md</code></td><td>Index into durable decisions and interview evidence.</td></tr><tr><td><code>project-spine/03-roadmap.md</code></td><td>Roadmap, release scope, estimates, targets and release contract.</td></tr><tr><td><code>planning/interviews/</code></td><td>Questions, actual answers, dependencies and confirmation receipts.</td></tr><tr><td><code>backlog/epics/</code>, <code>backlog/tasks/</code>, <code>backlog/done/</code></td><td>Work contracts and completed task records.</td></tr><tr><td><code>project-state/state.json</code></td><td>Mutable runtime snapshot: current claim, identity, distribution and configured capabilities. Use the shared writer.</td></tr><tr><td><code>project-state/decisions.md</code></td><td>Append-only decision rationale.</td></tr><tr><td><code>project-state/*.jsonl</code></td><td>Append-only session, command, usage, verification, review and worker evidence as those features are used.</td></tr><tr><td><code>handoffs/</code>, <code>memory/</code></td><td>Continuity notes and reusable project knowledge.</td></tr><tr><td><code>.agent-os-cache/</code></td><td>Regenerable maps and artifact receipts.</td></tr><tr><td><code>dashboard.html</code>, <code>guide.html</code>, <code>project-state/current-state.md</code>, <code>project-state/metrics.md</code></td><td>Generated views. Fix their source records or renderers, then refresh.</td></tr></tbody></table>

### How a conversation becomes durable work

You describe a need. The agent researches repository facts and asks for missing intent. Confirmed answers become the basis for the charter and roadmap. Roadmap items connect to epics; epics connect to bounded tasks. A task names the files and acceptance behavior it owns. The agent claims it, implements it and records checks. You inspect the delivered behavior at closeout. Release evidence then assesses the approved scope as a whole.

Changing the chat summary alone does not update the product contract. The agent must update the relevant source files and reopen affected interviews when the decision changed. A dashboard refresh derives its display from those records; it does not infer acceptance from a cheerful final message.

### What is enforced

Project-wide pending interviews block implementation through claims, task completion and worker dispatch across the project. An epic-scoped interview blocks the affected epic. Research, interview capture, diagnostics and recovery remain available.

Portable CLI checks do not intercept every editor or arbitrary shell write. Agents must follow `AGENTS.md`; an installed and tested harness hook can add tool-level coverage. The displayed default assurance is command enforcement. Do not infer universal enforcement from a hook fixture or a configuration label.

State integrity checks and model reviews are advisory. Tests remain planned work. Git's local pre-push hook protects direct pushes to a trunk; it does not run quality checks. Human PR review and release decisions are separate. Dependency installation has its own explicit approved-plan precondition.

### What refresh means

```bash
bash scripts/os.sh refresh
```

Refresh attempts capture from the current supported usage source, syncs configured imports, regenerates state and all views, and writes an artifact receipt under `.agent-os-cache/`. It can report partial usage coverage even when rendering succeeded. `os render` regenerates views through the normal command lifecycle but does not provide the same explicit usage-sync and refresh receipt operation.

Reload the HTML after refresh. The browser does not watch the repository or poll a running OS service. The dashboard's next action comes from the same decision logic as `bash scripts/os.sh next`.
