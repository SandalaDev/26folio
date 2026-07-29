## Project start (once per project)

Before any code is written, the project's *intent* gets captured — so every future session, on any tool, starts from the same understanding instead of re-asking you. This is a short ladder: **brief → interview → ready → hydrate → shape work**. Only the first two rungs need your words; the rest is the agent working and you reviewing.

### Step 1 — write the brief — YOU

Tell the agent: *"scaffold the project brief"* — or run it yourself:

```
bash scripts/intake.sh brief
```

**What happens:** a template appears at `project-spine/00-brief.md` with sections for what you're building, for whom, constraints, and non-negotiables.

**What you do:** open the file and fill in **every** section in your own words. Writing "none" in a section is allowed — leaving it as placeholder text is not. When you're done, change the `status:` line at the top to `ready`.

**Why you and not the agent:** this file is the one place the project's intent comes from a human. Everything downstream is derived from it. Five honest sentences beat five generated paragraphs.

### Step 2 — the gap interview — AGENT asks, YOU answer

Tell the agent: *"run the intake interview — read my brief and ask what's missing."*

**What the agent does:** runs `bash scripts/intake.sh interview` (scaffolds `project-spine/00-interview.md`), reads your brief, and writes into that file the specific questions your brief left open — target users, data, constraints, priorities.

**What you do:** open `00-interview.md` and answer each question inline, under the question. Short answers are fine. Then set its `status:` to `answered`.

### Step 3 — the readiness check — YOU or AGENT

```
bash scripts/intake.sh ready
```

**You should see:** `READY`. This is the one fail-closed check in the whole system (it protects intent capture, not code): it does a real parse of both files and refuses if any section is still a placeholder. If it refuses, it names exactly which section to fix — fix it and re-run.

### Step 4 — hydrate the lean context — AGENT writes, YOU review

Tell the agent: *"intake is READY — hydrate the lean context."*

**What the agent does:** drafts three files in `project-spine/`, strictly from your brief + interview answers (elaborating decisions you already made — never inventing new ones), in this order:

1. `01-charter.md` — scope, stakeholders, constraints, and **the one job** this project does. Its first section becomes the "north star" that opens every future session briefing.
2. `02-decisions.md` — the durable decisions and their rationale. The highest-value long-term memory; it's appended to over time, never rewritten.
3. `03-roadmap.md` — the P1/P2/P3 sequence: what ships first and why.

**What you do:** read all three files and fix anything that's wrong. **This is the highest-leverage review you will do on the entire project** — every future session of every agent is briefed from these files, so an error here propagates everywhere. Ten minutes, once.

### Step 5 — shape the work — AGENT proposes, YOU approve

Before any framework scaffold or application package install, follow the
Dependencies chapter: create an `initial` OpenSrc evidence plan for the exact
candidate versions, complete the cross-package review, run `os deps check`,
obtain human approval, then run `os deps install`.

Tell the agent: *"shape the first epic from the roadmap and slice it into tasks."*

**What the agent does:**

- Scaffolds an epic: `bash scripts/new-task.sh epic EPIC-001 "title"` → `backlog/epics/EPIC-001.md`, then fills its Outcome and Scope from the roadmap.
- Slices it into bounded tasks: `bash scripts/new-task.sh task TASK-001 "title" EPIC-001 <risk>` → `backlog/tasks/TASK-001.md` each, filling Scope and Acceptance Criteria. A good task fits in one working session.
- Fills the `## Testing` section of the epic and each task with a **testing recommendation** — `none` (with a reason), `with-task`, or a dedicated test task it creates alongside. See the Testing chapter; nothing about these recommendations is enforced.

**What you do:** read the backlog. Check that the tasks match what you actually want built, that priorities make sense, and decide the fate of any recommended test tasks (keep, reprioritize, or delete — your call). Then pick the first task and move to the daily loop.

### Frontend projects only (L4)

If this project has a UI, run the design elicitation **before** UI tasks: the agent runs `bash pack-frontend/elicit-phase.sh design questionnaire`, you answer taste/reference questions, the agent generates a design system doc, and you approve it. Content and UI phases follow the same questionnaire → generate → approve shape, each gated on the previous. Non-frontend projects skip all of this.
