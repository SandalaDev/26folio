# Operating Manual — agent-os

The full reference. `AGENTS.md` is the short law; this is the detail: the layered
architecture, the session lifecycle, the non-blocking quality model, crash recovery, the
handoff protocol, the skills layer, file templates, and the launch checklist.

For the **live dashboard and standalone guide**, run:
```bash
node scripts/render-state.mjs
bash scripts/os.sh render              # via the OS entry point (also renders the markdown views)
```
`dashboard.html` is a generated project view; `guide.html` is the generated,
searchable operator guide. Both are gitignored. Runtime state comes from
`project-state/state.json`; the progress estimate also reads canonical intent and
work metadata from the charter, roadmap, epics, tasks, and done work.

---

## The layered architecture

agent-os is a lean core plus an optional frontend opinionation. Only the bottom
three layers are load-bearing; L4 is a layer you add, not one the core depends on.

```
L0  Memory Core     state.json · ledger.jsonl · decisions.md · handoffs/ · session.lock
L1  Views           current-state.md · dashboard.html · guide.html  (generated; never edited)
L2  Sanity          verify.sh (advisory) in CI               (state integrity only — never blocks)
L3  Workflow        os start|end|check|checkpoint|status|context|deps|pr|sync|claim|release|decide|doctor  (one entry point)
─────────────────────────────────────────────────────────
L4  Frontend Pack   pack-frontend/                           (design phase · skills · lanes)
```

A non-frontend project skips L4 and still gets memory, handover, and the
dashboard. That is what makes this a reusable template rather than a Next.js scaffold.

### The mental model — three sentences
- **Artifacts are permanent. Agents are temporary.** Every durable fact lives in a repo file.
- **One source of truth, everything else generated.** `state.json` is the only place state is written.
- **The OS is non-blocking.** It manages memory and context, never quality —
  quality is caught by tests (planned backlog work) and the human's manual PR review.

---

## Repository map

```
agent-os/
├── AGENTS.md                          ← canonical agent law (source)
├── OPERATING_MANUAL.md                ← this file
├── dashboard.html                     ← GENERATED (gitignored)
├── guide.html                         ← GENERATED (gitignored)
├── project-state/
│   ├── state.json                     ← CANONICAL single source of truth
│   ├── ledger.jsonl                   ← append-only: one line per session (tokens/cost/status)
│   ├── decisions.md                   ← append-only ADR-lite
│   ├── current-state.md               ← generated
│   ├── metrics.md                     ← generated: performance + cost
│   ├── AGENT_LOG.md                   ← append-only audit trail (rotated monthly)
│   └── session.lock                   ← crash journal (present only mid-session)
├── handoffs/{session,task,archive}/
├── backlog/{epics,tasks,done}/
├── planning/
├── memory/
├── .agents/skills/                    ← core skills (always present)
├── scripts/                           ← the engine
├── .githooks/{pre-push,pre-commit}
├── .github/workflows/quality.yml      ← re-runs verify.sh in CI
└── pack-frontend/                     ← L4 (optional, default-on)
    ├── elicit-phase.sh
    └── skills/                        ← frontend design lanes + stop-slop
```

---

## Session lifecycle (every session, every agent)

- **Start:** `bash scripts/os.sh start` — reads state, renders views, detects a stale
  lock (crash recovery), writes the session journal.
- **Work:** stay within the task's `files_allowed` focus list (advisory). Periodically run
  `bash scripts/os.sh checkpoint "next step"` so an interrupted session is recoverable.
- **End:** `bash scripts/os.sh end [task]` — advisory sanity check, writes ONE state update,
  renders views, appends the log + a ledger line, creates declared handoffs, clears the lock.

### Sessions: when to run `os start` / `os end`
Work happens in **sessions** — one contiguous stretch of work on a task. `os start`
opens a session (clocks you in); `os end` closes it (clocks you out). State updates,
ledger rows, sanity checks, and dashboard refreshes all happen at these two boundaries.

- **`os start`** — run once, at the start of a work session. Reads state, renders
  views, captures identity, writes the session journal (the crash-recovery artifact).
- **`os checkpoint "next step"`** — mid-session, before risky edits. Saves in-flight
  state so a crash is recoverable.
- **`os end [task]`** — run once when you finish. Advisory sanity check, one state
  update + ledger row, creates handoffs, clears the lock.

If you work on a task Tuesday for an hour, then again Thursday — that's two sessions,
two `os start`s and two `os end`s. It is not something you run once per project or
leave running in the background. Skip `os start` and no session journal exists, so a
crash loses everything since the last `os end`.

### Identity (optional)
`os start` auto-detects the harness from its environment. For cleaner dashboard
attribution you can optionally export `HARNESS_NAME` (tool), `MODEL_NAME`
(model id), and `AGENT_ROLE` (`executor` default | `planner`). Unset values are
recorded honestly (`unknown`), never invented — attribution is a nice-to-have,
not a chore on the critical path.

### Context: lead every session with the project's intent
`os context` prints a bounded (~3 KB) briefing that always leads with the
charter's north star (the one job, from `project-spine/01-charter.md`), then
layers in current task/branch/agent, the top pending handoff, the
last ledger row, and the caution note (risky areas to flag in PRs). It refuses to print until the spine is
hydrated (run `intake ready`, then hydrate). Agents should read it at session
start so intent re-enters every loop instead of drifting.

### Flow: GitHub Flow by default, `dev` opt-in
`state.flow` selects the branch model:
- **`github`** (default) — feature branches cut off `main` and PR back to `main`.
- **`trunk-dev`** — the three-branch model: feature → `dev` → `main` (promote).

`branch.sh`, `os pr`, and `os sync` all read `state.flow` so the integration base
stays correct without you remembering which model is active.

- **`os pr ["title"] [--body "..."] [--draft]`** — open a PR into the flow's base.
- **`os sync`** — squash-merge the current branch's PR via `gh`, switch to base,
  pull, and clean up the branch. One command for the whole post-merge flow.

### Claiming tasks & recording decisions
- **`os claim <TASK-XXX>`** — set `state.current.task` so sessions and views
  attribute the work. `os release` clears it; `os end` clears it when the task closes.
- **`os decide --title <t> --context <c> --decision <d> [--alternatives <a>]`** —
  append an ADR entry to `project-state/decisions.md` (its sanctioned writer).

### OpenSrc dependency evidence

`os deps` is the pre-install dependency and architecture research workflow:

- `deps plan initial "<purpose>" <exact-spec>...` before the initial stack.
- `deps plan add "<purpose>" <exact-spec>...` before an addition or upgrade.
- `deps plan architecture "<decision>" <exact-spec-or-pinned-repo>...` before
  far-reaching choices.
- `deps check <plan>` validates completed research and exact versions, then
  reruns npm's no-payload dry-run resolution before human review.
- `deps install <plan>` installs an approved exact npm set.

OpenSrc fetches version-matched docs and source; it does not solve or certify
compatibility. The agent applies `opensrc-research`, completes the pairwise
evidence under `planning/dependencies/`, and names post-install checks. A human
approves the plan. This precondition belongs to the wrapper's install command;
it never gates commits or pushes.

### The dashboard is generated, never hand-written
`dashboard.html` and `guide.html` regenerate automatically at every `os start`
and `os end`. To force a refresh anytime (after editing canonical sources, or to
see fresh metrics), run
`bash scripts/os.sh render`, then open the file. It's a snapshot of the last render,
not a live view.

## Crash recovery (the bulletproof part)

A stale `session.lock` means the previous session never reached `os end`. On the next
`os start`, the OS:
1. **Preserves** the stale lock — moves it to `session.lock.crashed-<ts>` (never overwrites).
2. **Surfaces** its full contents (identity, branch, task, next_step, files touched).
3. **Logs a crashed ledger row** with `status:crashed` and the duration it *did* run.

Crashes become data: the dashboard shows a "crashed" badge and a per-combo crashed
column. Nothing is silently lost.

The crash journal is updated by `os checkpoint`, which captures in-flight state
(next_step, files touched) so an interrupted session is genuinely recoverable. Run a
checkpoint before any risky edit.

---

## Quality: non-blocking by design

The OS never gates quality. A push always succeeds (except a direct push to a
trunk, which the pre-push hook refuses so changes arrive via PR). Quality is
caught by two mechanisms, both outside the system:

1. **Tests — planned work, never a gate.** No change *requires* a test. After
   planning an epic or task, the agent fills its `## Testing` section with an
   honest recommendation:
   - `none` — with a reason ("cosmetic; caught at a glance"). A valid answer.
   - `with-task` — cover the happy path inside the implementing task itself.
   - `dedicated: TASK-XXX` — create a separate test task
     (`new-task.sh task TASK-XXX "tests: <area>" EPIC-YYY low`); it's a normal
     backlog item the human prioritizes, defers, or declines.
   Risk guides the default (low → none, medium → with-task, high/critical →
   dedicated), judgment overrides it. Test runs are information for the PR
   review — a red run never blocks anything. See the `ds-test-planner` skill.

2. **Reviews — manual, after the PR.** The human reviews every PR by their own
   process. The system has no visibility into reviews and enforces nothing
   about them. Agents assume pushed code already passed its tests and review.
   The agent's one duty: make risky changes (schema, auth, billing, secrets,
   infrastructure, compliance copy) loud and obvious in the PR description so
   the human's attention lands where it matters.

### The sanity check (what verify.sh still does)
`scripts/verify.sh` is a small ADVISORY check of the OS's own memory integrity —
the things that, when broken, corrupt every future session:

| Check | Mechanism | Flags when |
|---|---|---|
| Task metadata | `validate-task.mjs` (real YAML parse) | Frontmatter unparsable or missing id/title/status (state views would break). |
| State consistency | `render-state.mjs --check-structural` | Task pointer disagrees with the task file's frontmatter. |

It runs at `os end` (reported, never blocking) and in CI (informational). Treat
a red CI run as "state needs a re-render", not "the code is bad".

---

## Handoff protocol (continuity, not review)

Knowledge transfers through **files referenced by path**, never copied content.
Handoffs must NEVER contain: conversation summaries, chat logs, large copied artifacts,
duplicate content. Handoffs MUST: reference files by path, state status concisely, name
remaining work, name known risks.

When a task declares `handoff_required: true` (optional), `os end` creates the file
via `create-handoff.mjs`; the agent then fills the prose blocks (guided by the
`ds-handoff` skill). Two types:
- **session** — resume later (context exhaustion, end of day, model switch).
- **task** — task A complete → task B begins.

Filling them is discipline, not a gate: nothing blocks on a stub, but a `(fill in)`
placeholder transfers nothing to the next session — the context is simply lost.

Lifecycle: consumed handoffs move to `handoffs/archive/`. Never delete — audit history.

---

## Skills layer

A skill is a governed capability package (`SKILL.md` + optional scripts/references).
Load only the `skill_refs` a task declares; never all skills.

- **Core (`.agents/skills/`)** — always present, stack-agnostic:
  `opensrc-research`, `writing-style`, `ds-handoff`, `ds-task-slicer`,
  `ds-test-planner`.
- **Frontend (`pack-frontend/skills/`)** — default-on, detachable: `impeccable` (active
  lane), `design-taste-frontend`, `shadcn-ui-builder`, `21st-dev-components`, `stop-slop`.

`skills.sh validate` fails-closed on missing files and invalid portable metadata;
`skills.sh audit` (release-facing) additionally fails on thin stubs. For writing,
project/domain rules lead, `writing-style` owns drafting and revision, and
`stop-slop` is the advisory final scan. The `stop-slop` scorer reads its
rules from externalized data (`tells.json`) — extend by editing data, not code.

---

## Git workflow (three branches)

```
main   ●─────────●─────────●        (protected; tagged releases)
        \         ↑          ↑
dev      ●──●────●──────●────●        (integration; you merge here)
          \   \    \
feature/   ●───●────●                 (one per epic; agents work here)
```

- `bash scripts/branch.sh start EPIC-XXX` — syncs the base, cuts the feature branch.
- `bash scripts/branch.sh base` — resolves the integration base (per `state.flow`).
- `bash scripts/branch.sh cleanup feature/EPIC-XXX` — after merge (refuses unless merged).
- `bash scripts/branch.sh promote` — prints the dev→main checklist (trunk-dev flow).

Agents never commit directly to a trunk. Protect it on your Git host if your plan allows.

### Trunk protection
The `pre-push` hook refuses pushes that target a trunk (by current branch AND by
refspec) — its ONLY job; it runs no quality checks. It's bypassable with
`git push --no-verify` (a conscious decision, not an accident). On a paid plan or
public repo, add GitHub's server-side branch protection on top.

---

## File templates

### Task template (the one file the agent authors)
```yaml
---
id: TASK-042
title: [Task title]
status: ready          # ready | in-progress | blocked | done
priority: P1
risk_level: low | medium | high | critical
epic_ref: backlog/epics/EPIC-001.md
files_allowed: []             # advisory focus list — keeps the agent scoped; not enforced
skill_refs: [ds-test-planner]
---
# Task: [Title]
## Scope
## Acceptance Criteria
## Testing
- recommendation: (none | with-task | dedicated: TASK-XXX)
- rationale:
```
The frontmatter is deliberately minimal — just what state derivation and planning
need. The `## Testing` section is where the planning agent records its testing
recommendation (see "Quality: non-blocking by design"). Optional extras:
`handoff_required: true` + `handoff_type: [session|task]` for continuity handoffs.

### state.json (canonical — agent-os.state.v1)
See `project-state/state.json`. One writable state file; every view is generated.

---

## Launch checklist

### First hour
1. `bash setup.sh` — wires hooks; uses pinned OpenSrc to verify the reviewed
   `yaml@2.9.0` source and npm graph before installing it; renders views.
2. `bash scripts/os.sh start` — open the first session, write the lock.
3. (Optional) set identity env (`HARNESS_NAME`, `MODEL_NAME`, `AGENT_ROLE`) for
   cleaner dashboard attribution — auto-derived otherwise.
4. Branches: `main` exists; with the default github flow that's all you need.
   (Opt into trunk-dev via `state.flow` if you want an integration branch.)
5. Open `guide.html`, follow its VERIFY callouts, then confirm `dashboard.html`
   shows the correct next action.

### Project start — light intake (replaces the heavy spine)
1. `bash scripts/intake.sh brief` — scaffold `project-spine/00-brief.md`; fill every
   section (or "none"); set `status: ready`.
2. `bash scripts/intake.sh interview` — scaffold the gap interview; a planning agent
   fills the questions; you answer each inline; set `status: answered`.
3. `bash scripts/intake.sh ready` — must print READY (fail-closed: real frontmatter
   parse, structural placeholder check). Only then does an agent hydrate the 3-file
   lean context (`01-charter`, `02-decisions`, `03-roadmap`) from brief + interview.
4. Before a scaffold or application dependency download, run
   `bash scripts/os.sh deps plan initial "<purpose>" <exact-package@version>...`;
   complete its OpenSrc docs/source and cross-package evidence, run `deps check`,
   obtain human approval, then run `deps install`.
5. Shape work: `bash scripts/new-task.sh epic EPIC-001 "title"`, then
   `bash scripts/new-task.sh task TASK-001 "title" EPIC-001 <risk>`. The scaffolder
   writes valid frontmatter; you fill scope + criteria + the Testing recommendation.

Why three context files, not ten: the legacy spine tried to capture domain/data/
technical/risk models upfront. Most solo projects under-specify those and they drift.
Here, schema/risk are captured as they become real (in tasks and decisions) rather
than guessed at intake.

### Hydrate the lean context (after `intake ready`)
This is an agent step, gated on `intake ready` printing READY. A planning agent
drafts the three files in `project-spine/` straight from the brief + interview —
it elaborates decisions already made, it does not invent new ones. Order matters:
charter first (it scopes the other two), then decisions, then roadmap.

1. `01-charter.md` — scope, stakeholders, constraints, the one job this does,
   plus human-approved goal IDs, weights, success signals, and outcome status.
   Pulled from brief §1/§3/§4. An elaboration of what's decided, not new decisions.
2. `02-decisions.md` — the durable decisions and their rationale, in
   context / decision / alternatives form. Seeds from the interview answers and
   brief §4 non-negotiables. This is the highest-value long-term memory; append
   over time, never rewrite history.
3. `03-roadmap.md` — P1 / P2 / P3 sequence and rationale, with stable roadmap
   IDs, goal references, weights, and status. Drives Epic shaping (step 4 above).

The dashboard traces completed task weight through epic and roadmap references
to these goals. It reports linkage confidence and never equates delivery with
validated business outcomes. See the Progress chapter in `guide.html`.

Boundary: do not invent design, content, or UI during hydration. Those come from
the L4 elicitation phases (design → content → UI), not from intent hydration.
Schema and risk are likewise captured later, as they become real — not guessed here.

### First day (frontend project — L4)
1. Design phase: `elicit-phase.sh design questionnaire` → answer + references →
   `ready` → agent generates `10-design-system.{md,html}` → `preview` → inspect → approve.
2. Content phase (gated on design): questionnaire → ready → generate → approve.
3. UI phase (gated on content): questionnaire → ready → generate → approve.

### Daily loop
| Step | Command | Who |
|---|---|---|
| Branch | `branch.sh start EPIC-XXX` | Agent |
| Open session | `os.sh start` | Agent |
| Checkpoint | `os.sh checkpoint "next"` | Agent |
| Close session | `os.sh end <task>` | Agent |
| Push + PR | `git push` → `os.sh pr` (risky changes flagged in the body) | Agent |
| Review | manual, on the PR — your process, outside the system | You |
| Test work | planned test tasks run as normal backlog items | Agent |
| Status | `os.sh check` | You |
| Merge | merge the PR → `os.sh sync` | You + Agent |

You mostly review PRs and merge. Pushes always succeed (except direct-to-trunk);
feedback travels through the PR, not through the system.
