# Operating Manual — Solo Dev OS v6.1

This is the agent-readable operating manual. `AGENTS.md` is the short law; this
file is the full reference: the six-phase project start, the day-to-day loop,
the handoff protocol, the skills layer, the fail-closed gate, file templates,
and the launch checklist.

For the **live Build Dashboard**, generate `dashboard.html`:

```
node scripts/render-dashboard.mjs      # standalone
bash scripts/os.sh render              # via the OS entry point (also writes the Markdown views)
```

`dashboard.html` is a generated view (gitignored). The script has no template
dependency — the HTML/CSS/JS are in code inside it, so it runs given a
`project-state/STATE.json` in the working directory.

Script sources are **not** duplicated here. Every script lives in `scripts/`;
read it there for the authoritative behavior. This manual describes what each
script *is for* and when to run it.

---

## Starting a New Project

This repository **is** the Solo Dev OS distribution — the OS travels inside it
as a set of scripts and skills, not as a generated artifact. A brand-new project
is created by **cloning this repo as a template, stripping the previous app,
and running bootstrap**. There is no separate "generate the scripts" step: the
scripts are the source of truth and live in `scripts/`.

`bootstrap-solo-dev-os.sh` does **not** create the OS scripts. It writes only
three small helper files (`.githooks/pre-push`, `.githooks/pre-commit`,
`scripts/active-task.mjs`) via heredocs and then *calls* the scripts that must
already be on disk. Run bootstrap in an empty repo and it will fail — the scripts
have to come from the template repo first.

### Greenfield flow

```bash
# 1. Clone this repo as the starting point for the new project.
git clone <this-repo> my-new-project && cd my-new-project

# 2. Remove the previous project's application + its intent.
#    KEEP: the OS scaffolding (scripts/, .agents/, .githooks/, .github/,
#          AGENTS.md, OPERATING_MANUAL.md, CODEOWNERS, .gitignore).
#    STRIP: the app itself, and the previous project's spine/backlog/state.
rm -rf src node_modules .next package.json package-lock.json \
       next.config.ts tsconfig.json components.json postcss.config.mjs \
       tailwind.config.ts eslint.config.mjs .prettierrc .prettierignore env.example
rm -rf project-spine backlog planning memory project-state

# 3. Seed the OS into the empty project: folders, STATE.json, CODEOWNERS,
#    git hooks, the first dashboard.html.
bash scripts/bootstrap-solo-dev-os.sh

# 4. Install the one Node dependency the render/validate scripts need.
npm install yaml        # or vendor it; no app dependency is assumed

# 5. Reset git history (optional) and commit the fresh skeleton.
rm -rf .git && git init && git add -A && git commit -m "chore: Solo Dev OS skeleton"

# 6. Begin the six-phase project start (see User Guide → Project Start):
#    intake.sh brief → interview → ready → hydrate the spine.
```

### What bootstrap writes vs. what it expects

- **Writes (via heredoc):** the directory skeleton, `project-state/STATE.json`,
  `CODEOWNERS`, `.githooks/{pre-push,pre-commit}`, `scripts/active-task.mjs`,
  and the first `dashboard.html`.
- **Expects already present:** every other `scripts/*.sh` and `scripts/*.mjs`,
  `.agents/skills/` (it runs `skills.sh install-defaults`), and the intake/design/
  content/ui scripts. These come from the template repo in step 1 — they are not
  generated.

### Keeping the OS up to date in an existing project

The OS is vendored into each project (it is not a runtime dependency). To pull in
OS fixes later, re-clone the template and copy the changed `scripts/`,
`.agents/skills/`, `AGENTS.md`, and `OPERATING_MANUAL.md` over your project's
copies, leaving your `project-state/`, `project-spine/`, and `backlog/` intact.
State and intent are always project-owned; the OS machinery is repo-vendored.

---

---

## User Guide

### Who Does What

Three actors. The system is designed so you never babysit the agent — you read
generated files and let the Git gate reject anything that skipped a step.

- **Human (you)** — owns intent and the irreversible decisions: the Project
  Spine, schema/auth/billing/infra/secrets approvals, the final merge. You do
  not write state files by hand; you *read* the generated ones and trust the
  gate to stop bad work.
- **Agent** — any harness (Claude Code, Codex, OpenCode, Cursor, Warp, Gemini
  CLI). Implements one bounded task, writes **one** canonical state update,
  creates handoffs by path. Temporary; nothing important lives only in its chat.
- **Scripts + Git** — the enforcement layer. `verify-task.sh` runs in a
  pre-push hook and in CI. It recomputes scope, slop scores, handoff presence,
  and protected-path approval, and **fails the push** if any are wrong.

The single biggest change in v6.1: the rules that mattered are now checks in
Git. A clean `git push` means the gate passed; a rejected push tells you exactly
which rule was skipped.

### The Mental Model

Three sentences hold the system together:

- **Artifacts are permanent. Agents are temporary.** Every durable fact lives
  in a repo file. Chat is a scratchpad you can throw away mid-thought.
- **One source of truth, everything else generated.** `STATE.json` is the only
  place state is written. `CURRENT_STATE.md` and `dashboard.html` are *rendered*
  from it — you never edit them, so they can never disagree with it.
- **Rules fail closed.** If a rule matters, it is a check that blocks the merge.
  If it is only prose, treat it as advice.

### Project Start

Project start is a **six-phase gated pipeline**. The first three capture durable
*intent*; the last three *elicit* the things that cannot be guessed from intent
— your design taste, your content structure, and the exact UI. Each phase is
fail-closed: the next cannot start until the current is complete and, where it
produces an artifact, approved by you.

Why split intent from elicitation: the manifesto, charter, PRD, and the rest
are *elaborations of decisions you already made* — an agent can draft them
faithfully from the brief. A design system, a content structure, and a UI map
are *not* in the brief; if an agent drafts them from intent it is guessing at
your taste. So those three are driven by dedicated questionnaires and by your
own screenshots and reference links — never hydrated.

- **P1 — Write the brief (you, by hand).** `bash scripts/intake.sh brief`
  scaffolds `project-spine/00-original-intent.md`; fill every section (or an
  explicit "none"), set `status: ready`. This is the one purely-human artifact
  — never agent-rewritten.
- **P2 — The hydration interview (agent asks, you answer).**
  `bash scripts/intake.sh interview`, then instruct a planning agent to fill
  `INTAKE-INTERVIEW.md` with the gaps it needs resolved before drafting the
  spine. You answer each inline; set `status: answered`.
- **P3 — Hydrate the spine (agent drafts, you review).** Only once
  `bash scripts/intake.sh ready` prints **READY**, the agent drafts the ten
  intent files `00-manifesto` … `09-roadmap` from the brief + interview. No
  design tokens, content sitemap, or component choices invented at this stage.
- **P4 — Generate the design system (you answer + show; agent generates).**
  `bash scripts/design.sh questionnaire` scaffolds `10-design-system.QUESTIONNAIRE.md`
  and `project-spine/references/design/`. Drop screenshots you love into
  `references/design/`, paste annotated links into the questionnaire. Then
  `design.sh ready` gates it; the agent generates `10-design-system.md` **plus a
  rendered visual reference `10-design-system.html`** built from those tokens.
  `bash scripts/design.sh preview` (refuses until both exist), then **open the
  HTML in a browser and actually look at it**. Iterate until it is right; only
  then set `status: approved`.
- **P5 — Content strategy & structure (gated on design approved).**
  `bash scripts/content.sh questionnaire` (scaffolds `11-content-strategy.QUESTIONNAIRE.md`
  + `references/content/`). `content.sh ready` gates it; the agent generates
  `11-content-strategy.md` which must explicitly prescribe the **sitemap, a
  page-by-page content outline, and a content inventory**. Approve.
- **P6 — UI element map (gated on content approved).** `bash scripts/ui.sh questionnaire`
  (scaffolds `12-ui-element-map.QUESTIONNAIRE.md` + `references/ui/`). Walking
  the approved sitemap, specify how each content block is presented; the agent
  generates `12-ui-element-map.md` mapping every content block → an exact UI
  element (shadcn/ui primitive, 21st.dev element, or custom), its source, the
  reference that inspired it, and its motion treatment. Approve.

The shape of all three elicitation phases is identical: a questionnaire you
answer + references you supply → a fail-closed `ready` gate → an agent that
*generates* the artifact from your evidence → your `status: approved` that
unlocks the next phase. The agent *advises*; you *commit*.

### A Day In The Loop

Nothing is a background daemon. "AGENT" steps still require you to have a
session open and tell it what to do. The two steps entirely on you are
**launching the cross-model review** and **triggering rework** — most likely to
get skipped.

| Phase | Who | What happens |
|---|---|---|
| A — Start | Agent | `branch.sh start EPIC-XXX` cuts a feature branch off `dev`; `os.sh start` reads STATE, renders views, loads handoffs, writes the session lock; agent identifies Epic → Slice → Task and writes an implementation checklist. |
| B — Implement & close | Agent | Agent edits inside `files_allowed` only; `os.sh end` runs the gate, writes one STATE update, renders, logs, creates handoffs; `git push` runs `verify-task.sh` against `dev`. |
| C — Review | **You** | *Not automatic.* Open a different model family, point it at `handoffs/review/HANDOFF-REVIEW-TASK-XXX.md`; it writes `.agents/reviews/REVIEW-TASK-XXX.md` with a decision. |
| D — Rework (if not satisfied) | **You** | `rework.sh open TASK-XXX "issue"` per issue; agent resolves each (`rework.sh resolve`); the gate stays red while any item is open; you `rework.sh close` once satisfied. |
| E — Merge & clean up | **You** | Confirm the PR check is green; merge into `dev`; `branch.sh cleanup feature/EPIC-XXX`; periodically `branch.sh promote` for `dev → main`. |

On a clean task your manual actions are: tell the agent to start, open the PR,
launch the review in a second model, read it, merge, clean up.

### Git Workflow

Three branches. Agents never commit to a shared trunk.

- **`main`** — protected production. Only moves via a reviewed, fully-verified
  `dev → main` promotion. Tagged releases live here. No agent ever pushes to it.
- **`dev`** — integration branch. Feature branches merge here after the gate
  passes and a cross-model review is in. This is where you do most of your
  merging.
- **`feature/EPIC-XXX`** (or `feature/EPIC-XXX-SLICE-Y`) — agent workspace for
  one epic. Agents branch off `dev` and run the task → handoff chain here.

Why epic-level, not per-task: a slice owns the test plan, handoff chain, and
review; tasks within a slice hand off to each other on the same branch.
Per-task branches would force a merge between every handoff — the exact
ceremony the OS removes.

The gate adapts its comparison base automatically: `dev` for feature branches,
`main` when promoting. `branch.sh base` resolves it; you never set it by hand.

```
main      ●────────────────●─────────────●        (protected; tagged releases)
           \              ↑               ↑
dev         ●──●────●─────●───────●───────●        (integration; you merge here)
             \   \    \         ↑
feature/      ●───●────●────────●                  (one per epic; agents work here)
EPIC-021      t1  t2   t3   handoffs+review
```

### Verify & Recover

- **State continuity:** `bash scripts/os.sh check` prints `state: consistent`.
  If it prints `state: DRIFT`, `STATE.json` disagrees with a task's frontmatter
  status — the gate blocks on this; never override it manually.
- **Quality gates:** if `git push` succeeded, scope / risk-matched proof / slop
  score / protected-path / handoff presence all passed. You only investigate on
  rejection — never `--no-verify`.
- **Cross-model review:** a `REVIEW-TASK-XXX.md` exists, written by a reviewer
  whose family differs from the executor. Solo dev degrades to
  `reviewer: human`; the review file is still required — review is reassigned,
  never skipped.
- **Push rejected:** read the FAIL line — it names the rule. Fix that one thing
  and push again.
- **State files disagree:** someone hand-edited a generated file. Run
  `os.sh render` to rebuild from `STATE.json`, then `os.sh check`.
- **Session crashed:** a stale `ACTIVE_SESSION.lock` with no matching state
  triggers a recover/discard prompt on the next `os.sh start`. The lock is your
  crash journal.
- **The log is enormous:** it rotates monthly into `memory/agent-log/YYYY-MM.md`.
  If it hasn't, run `os.sh rotate-log`. Old entries are archived, never deleted.

### Your Core Commands

Everything routes through one shell entry point so it works in any harness or a
bare terminal. You mostly only ever type `check` and merge yourself; the agent
runs the rest.

| Command | Who | What it does |
|---|---|---|
| `bash scripts/branch.sh start EPIC-XXX` | Agent | Creates/switches the epic's feature branch off `dev`. Run before `os.sh start`. |
| `bash scripts/os.sh start` | Agent | Reads `STATE.json`, renders views, loads handoffs, writes the session lock tagged with harness/model/role. |
| `bash scripts/os.sh end` | Agent | Runs the gate, writes the single `STATE.json` update, renders views, appends the log + ledger, creates handoffs, clears the lock. |
| `bash scripts/os.sh render` | Agent | Regenerates `CURRENT_STATE.md`, `HANDOFF_QUEUE.md`, `METRICS.md`, and `dashboard.html` from `STATE.json`. |
| `bash scripts/verify-task.sh <task>` | Agent + Git hook | The fail-closed gate. Diffs against `dev` (or `main` when promoting). |
| `bash scripts/os.sh check` | **You** | Your status probe. Prints whether the state layer is consistent and fresh. |
| `bash scripts/branch.sh promote` | **You** | Prints the `dev → main` promotion checklist (full suite, signed merge, tag). |
| `bash scripts/rework.sh open <task> "..."` | **You** | Flag review feedback as a tracked rework item; blocks task closure until resolved. |
| `bash scripts/rework.sh close <task>` | **You** | Accept rework once every item is resolved (refuses otherwise). |
| `git push` / merge PR | **You** | Push the feature branch; the hook runs the gate. You merge the PR into `dev`. |

---

## Operating Manual

### Core Operating Law

The OS has one job: stop agentic coding from becoming prompt chaos. Every
durable project decision lives in the repo. Agents explore in chat; the source
of truth is Markdown, code, tests, scripts, and Git history. v6 made continuity
a first-class primitive. **v6.1 makes enforcement a first-class primitive**: the
rules that matter are checks that fail closed in Git, not prose the agent is
asked to honor.

Non-negotiables:

- Project facts live in repository files.
- State is written in exactly one place — `STATE.json`. Every other view is
  generated.
- Every session starts and ends through `os.sh start` / `os.sh end`.
- Agents implement bounded tasks, not vague ideas.
- Skills are vendored capability packages on disk, not ad-hoc prompts.
- Testing proves risk-bearing behavior, not vanity coverage.
- Humans approve schema, auth, billing, infra, secrets, compliance — verified
  via CODEOWNERS + signed commit, not a boolean.
- No task merges until `verify-task.sh` passes in the pre-push hook.

### OS Layer Map

v6.1 keeps Project State at the top of the stack but makes the Build Dashboard a
*generated view* of it, and inserts an Enforcement Layer that wraps Verification
and Review.

```
00  Project State Layer — STATE.json (canonical)
01  Build Dashboard — generated view of STATE.json
02  Product Map / Project Spine
03  Skills Layer — vendored SKILL.md on disk
04  Handoff Layer
05  Planning System (Epics → Slices → Tasks)
06  Task Execution
07  Enforcement Layer — verify-task.sh in hook + CI
08  Review Workflow
09  Automation & Scripts (os.sh)
```

- **Project State Layer** — one canonical `STATE.json` plus generated
  `CURRENT_STATE.md`, `HANDOFF_QUEUE.md`, `dashboard.html`, and the append-only
  `AGENT_LOG.md`. Session crash journal: `ACTIVE_SESSION.lock`.
- **Enforcement Layer** — `verify-task.sh` recomputes scope, risk-matched
  proof, slop scores, protected-path approval, and handoff presence. Runs in
  `.githooks/pre-push` and `.github/workflows/quality.yml`. Fails closed.
- **All other layers** — Spine drives intent, Skills govern capability, Planning
  decomposes work, Execution implements, Review gates.

### Canonical Repository Map

```
project-root/
├── AGENTS.md                          ← canonical agent instructions (source)
├── OPERATING_MANUAL.md                ← this file: the full OS manual
├── CLAUDE.md  CODEX.md  GEMINI.md     ← GENERATED from AGENTS.md (sync-agent-files.sh)
├── dashboard.html                     ← GENERATED live dashboard (gitignored)
│
├── project-state/                     ← OS home screen
│   ├── STATE.json                     ← CANONICAL single source of truth
│   ├── CURRENT_STATE.md               ← generated (do not edit)
│   ├── HANDOFF_QUEUE.md               ← generated (do not edit)
│   ├── METRICS.md                     ← generated: harness/model performance
│   ├── SESSION_LEDGER.jsonl           ← append-only: one line per session (actor + gate)
│   ├── AGENT_LOG.md                   ← append-only, auto-rotated
│   └── ACTIVE_SESSION.lock            ← crash journal (present only mid-session)
│
├── handoffs/{review,session,task,rework}/
│
├── project-spine/
│   ├── 00-original-intent.md          ← human-authored seed (never agent-rewritten)
│   ├── INTAKE-INTERVIEW.md            ← gap interview, gates hydration
│   │   ── hydrated intent (00–09): agent drafts from brief + interview ──
│   ├── 00-manifesto.md  01-project-charter.md  02-business-outcomes-map.md
│   ├── 03-project-prd.md  04-domain-model.md
│   ├── 05-data-model.md               ← protected
│   ├── 06-project-technical-plan.md  07-architecture-principles.md
│   ├── 08-risk-register.md  09-roadmap.md
│   │   ── elicited artifacts (10–12): generated from questionnaire + refs ──
│   ├── 10-design-system.QUESTIONNAIRE.md   → 10-design-system.md  (+ 10-design-system.html)
│   ├── 11-content-strategy.QUESTIONNAIRE.md → 11-content-strategy.md
│   ├── 12-ui-element-map.QUESTIONNAIRE.md   → 12-ui-element-map.md
│   └── references/{design,content,ui}/      ← your visual intent (screenshots)
│
├── planning/slices/                   ← slice plans (created per epic as needed)
│
├── backlog/{epics,tasks,done}/
│
├── memory/{decisions.md,progress-log.md,agent-log/}
│
├── .agents/
│   ├── skills/{registry.md,lock.json,<skill>/SKILL.md,local/}
│   └── reviews/
│
├── CODEOWNERS                         ← drives protected-path human approval
├── scripts/                           ← the authoritative script sources
├── .githooks/{pre-push,pre-commit}
└── .github/workflows/quality.yml      ← runs verify-task.sh in CI
```

### Project State Layer

The home screen of the OS. In v6.1 it has exactly one writable artifact —
`STATE.json` — and everything else is either generated from it or appended to it.

| Artifact | Role | Writable? |
|---|---|---|
| `STATE.json` | Canonical state: current pointers, completion, counts, verification, epics, handoff queue. | Yes — the only writable state file. |
| `CURRENT_STATE.md` | Human-readable snapshot of current work. | No — generated by render. |
| `HANDOFF_QUEUE.md` | Human-readable queue view. | No — generated by render. |
| `dashboard.html` | Live status board (this manual's dashboard view). | No — generated by `render-dashboard.mjs`. |
| `AGENT_LOG.md` | Append-only audit trail of sessions. | Append only; rotated monthly. |
| `ACTIVE_SESSION.lock` | Crash journal — present only while a session is open. | Written at start, cleared at end. |

Generated files carry a `<!-- generated — do not edit; source: STATE.json -->`
banner. The pre-commit hook warns if a generated file is staged with manual edits.

### Project Spine

The durable foundation. It splits into two groups by *how each file comes to
exist*. Files **00–09 are hydrated intent** — drafted by a planning agent from
the brief + interview, because they elaborate decisions you already made. Files
**10–12 are elicited artifacts** — generated from questionnaires plus your own
screenshots/links, because design taste, content structure, and UI choices
cannot be guessed from intent.

**Hydrated intent — drafted from brief + interview (Phase 3):**

| # | File | Holds |
|---|---|---|
| 00 | Manifesto | Why the project exists. |
| 01 | Project Charter | Scope, stakeholders, constraints. |
| 02 | Business Outcomes Map | Outcomes work must advance. |
| 03 | Project PRD | Global product requirements. |
| 04 | Domain Model | Entities, relationships, language. |
| 05 | Data Model | Tables, indexes, retention, migration policy. **protected** |
| 06 | Technical Plan | Stack, deployment, environments, integration patterns. |
| 07 | Architecture Principles | Local rules agents must not violate. |
| 08 | Risk Register | Known risks, mitigations, human gates. |
| 09 | Roadmap | P1/P2/P3 sequence and rationale. |

**Elicited artifacts — generated from questionnaire + references (Phases 4–6):**

| # | File | Generated by | Holds |
|---|---|---|---|
| 10 | Design System | `design.sh` | Tokens, type scale, spacing, component direction, motion, accessibility. *elicited* |
| 11 | Content Strategy | `content.sh` | Audience, voice, SEO — **plus the prescribed sitemap, per-page content outline, and content inventory**. *elicited* |
| 12 | UI Element Map | `ui.sh` | Every content block → exact UI element (shadcn / 21st.dev / custom), source, reference, motion. *elicited* |

Each elicited file is paired with a `<n>-*.QUESTIONNAIRE.md` input and draws on
`project-spine/references/<design|content|ui>/`. The phases are sequential and
fail-closed: design must be `approved` before content; content before UI.

Rule: user-facing tasks that change layout, messaging, claims, forms,
onboarding, dashboards, or client workflows must reference `10-design-system.md`,
`11-content-strategy.md`, and (for build-out) `12-ui-element-map.md`, or
explicitly mark them not required in the task frontmatter (the gate checks for
one or the other).

### End-to-End Workflow

```
PROJECT START (once) — six gated phases
  intake.sh brief        → fill 00-original-intent.md (human seed)
  intake.sh interview    → planning agent asks gaps; human answers
  intake.sh ready        → fail-closed gate; unblocks hydration
  hydrate spine          → agent drafts 00–09 (intent) FROM brief + interview
    ↓
  design.sh questionnaire→ you answer + drop screenshots/links in references/design/
  design.sh ready        → gate; agent GENERATES 10-design-system.md + 10-design-system.html
  design.sh preview      → gate; you inspect the HTML in a browser, iterate, THEN approve
    ↓
  content.sh questionnaire→ you answer + references/content/  (gated on design approved)
  content.sh ready       → gate; agent GENERATES 11-content-strategy.md
                           (sitemap + per-page content + inventory) → you approve
    ↓
  ui.sh questionnaire    → you answer + references/ui/  (gated on content approved)
  ui.sh ready            → gate; agent GENERATES 12-ui-element-map.md
                           (every content block → exact UI element) → you approve
    ↓
Session Start  →  os.sh start
    (read STATE.json · render views · load handoffs · write lock)
    ↓
Identify Epic → Slice → Task
    ↓
Read task, slice, spine sections, skill_refs · write implementation checklist
    ↓
Implementation (inside files_allowed only)
    ↓
Session End  →  os.sh end
    (verify-task.sh · one STATE.json write · render · append log · create handoffs · clear lock)
    ↓
git push  →  .githooks/pre-push  →  verify-task.sh   ← FAILS CLOSED
    ↓
(if review required) HANDOFF-REVIEW created
    ↓
Different model family reads handoff · writes REVIEW-TASK-XXX.md
    ↓
Human reads rendered state + review · merges
```

### Git Workflow (mechanics)

The branch model is not cosmetic — the gate's scope, slop, and protected-path
checks all compute `BASE...HEAD`, so *where* work happens determines whether
those checks have anything to inspect.

| Branch | Role | Who moves it | Gate base |
|---|---|---|---|
| `main` | Protected production; tagged releases. | Human, via reviewed `dev → main` promotion only. | — |
| `dev` | Integration; accumulates reviewed feature work. | Human merges feature PRs after gate + review. | `main` |
| `feature/EPIC-XXX` / `feature/EPIC-XXX-SLICE-Y` | Agent workspace for one epic (or one slice). | Agent branches off `dev`; pushes the branch. | `dev` |

Enforcement:

- `scripts/branch.sh start EPIC-XXX [SLICE-Y]` syncs `dev` (refuse-if-dirty →
  fetch → fast-forward-if-behind), then cuts the feature branch off the
  up-to-date base. Diverged `dev` stops it for manual resolution.
- `scripts/branch.sh base` resolves the gate's comparison base automatically:
  `dev` for feature branches, `main` when promoting `dev`.
- `scripts/branch.sh guard` runs in `os.sh start` and the pre-push hook; it
  **refuses** to operate on `main`/`dev` so the diff base can never be empty.
- `scripts/branch.sh cleanup feature/EPIC-XXX` deletes a feature branch after
  merge — local + remote — but refuses unless it's merged into `dev`.
- `scripts/branch.sh promote` prints the `dev → main` checklist: full suite
  (not just risk-matched proof), CODEOWNER-signed merge, release tag.

Protect `main` and `dev` on your Git host (no direct pushes, require PR + CI).
The pre-push hook is the local fast-fail; CI re-runs the identical gate on the
PR so a bypassed hook still cannot reach a protected branch.

### Agent Routing Matrix

| Work type | Primary surface | Guardrail |
|---|---|---|
| State updates | Any agent, via `os.sh end` | One STATE.json write. The lock proves it ran. |
| Project Spine edits | Human + planning agent | No autonomous rewrite without human confirmation. |
| Epic shaping / slicing | Planning model | Must map to outcomes, domain, data, content/design where relevant. |
| UI concept exploration | frontend-design lane | Exploration or explicit fallback only. |
| UI implementation / polish | Impeccable + shadcn-ui-builder + 21st-dev-components | Default design lane. Check free/public 21st.dev before hand-building. |
| Implementation | Claude Code, Codex, OpenCode, Cursor, Warp | Must run `os.sh start` first and `os.sh end` last. Diff stays in `files_allowed` (gated). |
| Review | Different model family | Executor may not self-approve non-trivial work. Solo dev degrades to `reviewer: human`; review file still required. |
| High-risk changes | Human gate | Schema, auth, billing, infra, secrets, compliance — approval via CODEOWNERS + signed commit. |

### Risk Gates

| Area | Risk | Gate (enforced by verify-task.sh) |
|---|---|---|
| Static copy or CSS polish | Low | lint, typecheck; design/content review if user-facing; slop score if public text. |
| Business logic or API behavior | Medium | unit tests, scope check, cross-model review. |
| Database writes, tenant access, auth | High | integration tests, protected-path declaration, human review. |
| Schema, billing, secrets, infrastructure | Critical | CODEOWNERS-approved signed commit, rollback plan, full verification before merge. |

### Anti-Patterns Registry

| Anti-pattern | Failure mode | Better action (v6.1) |
|---|---|---|
| Duplicated state | Epic/Slice/Task pointer lives in three files that drift. | One canonical STATE.json; all views generated. `os.sh check` fails on drift. |
| Honor-system gates | Agent self-grades slop or self-sets `human_approved: true`. | Slop score recomputed by `stop-slop/score.mjs`; approval derived from CODEOWNERS + signed commit. |
| Prose-only rules | Important rules exist only as text the agent may ignore. | Rules that matter are checks in `verify-task.sh`, run by a Git hook. Fail closed. |
| Package-manager coupling | `pnpm os:verify-task` breaks for npm/bun/Codex users. | All entry points are `scripts/*.sh`. No package manager assumed. |
| Handoff by conversation summary | A long "what we did" passed as the handoff. | Reference files by path. Never copy artifact content. |
| Skipping State Commit | Session ends without writing state. | `os.sh end` is the single commit step; the open lock flags a session that never ended cleanly. |
| Scope creep | Diff edits files the task never declared. | Gate diffs changes against `files_allowed` and fails on escapes. |
| Skill dumping | Agent loads every skill and loses focus. | Load only `skill_refs` from the task. |
| Shipping AI slop | Public copy goes out full of AI tells. | stop-slop recomputed gate → ds-content-review → human gate. |
| Dual design authority | frontend-design and Impeccable fight over vocabulary. | One active lane per task. |
| Coverage theatre | Weak tests added to satisfy a metric. | Test risk-bearing behavior and acceptance criteria only. |
| Feedback in PR threads only | "Fix this" lives in GitHub comments — invisible to a cold agent, lost on platform change. | Materialize feedback into `handoffs/rework/REWORK-TASK-XXX.md` via `rework.sh`; the artifact blocks closure (fail-closed). |
| Per-harness file drift | CLAUDE.md / CODEX.md / GEMINI.md hand-maintained and diverge. | Generate them from one canonical AGENTS.md via `sync-agent-files.sh`. |

---

## Handoff Layer

The Handoff Layer is an agent-agnostic protocol inside Solo Dev OS. The same
handoff artifacts work identically across Claude Code, OpenCode, Codex, Warp,
Cursor, Gemini CLI, or any future harness.

The fundamental principle:

```
Agents are temporary.
Artifacts are permanent.
Never transfer knowledge via conversation history.
Always transfer knowledge via handoff artifacts.
```

Handoffs must **never** contain: conversation summaries, chat logs or prompt
history, large copied artifacts, duplicate content already in the repo.
Handoffs must **always**: reference files by path, state current status
concisely, name remaining work explicitly, name known risks.

Agent-agnostic rule: never rely on an agent automatically reading a handoff at
startup. `os.sh start` loads the assigned handoffs listed in `STATE.json`, so
the handoff is read regardless of which harness picks up the session. In v6.1,
`verify-task.sh` also fails closed if a required handoff is missing.

Correct vs wrong:

```
✓ Correct                        ✗ Wrong
Artifacts:                       # Artifacts
  Epic:  backlog/epics/EPIC-021    [full epic content pasted]
  Slice: planning/slices/SLICE-21  [full slice content pasted]
  Task:  backlog/tasks/TASK-04     [full task content pasted]
  Diff:  .agents/reviews/REV-04    [diff content pasted]
```

### Four Official Handoff Types

- **`review` — HANDOFF-REVIEW.** Implementation → Review Agent. Triggered after
  task completion when cross-model review is required. (Claude Code implements →
  HANDOFF-REVIEW → OpenCode reviews → Human merges.)
- **`session` — HANDOFF-SESSION.** Resume work later. Used when the context
  window exhausts, end of day, machine reboot, or model switch.
- **`task` — HANDOFF-TASK.** Task A complete → Task B begins. Prevents re-reading
  huge amounts of project context.
- **`rework` — REWORK.** Human review feedback → executor. Created by
  `rework.sh open`; blocks task closure until every item is resolved.

### The Rework Loop

Cross-model review catches architectural and correctness problems before merge,
but it doesn't capture *your* judgement — "this works, but I'm not satisfied."
The rework loop is how your feedback on a PR becomes a tracked, fail-closed
obligation rather than a comment that scrolls away.

**The feedback is a repo artifact, not a PR thread.** Rework items live in
`handoffs/rework/REWORK-TASK-XXX.md`, committed to the repo. A PR comment is
transient, platform-locked, invisible to a cold-resuming agent, and absent from
the diff. By materializing feedback into an artifact, the OS's core law holds —
knowledge transfers through files, not through a vendor's comment surface.

```
You review the PR  →  rework.sh open TASK-XXX "what's wrong"
    ↓  (writes handoffs/rework/REWORK-TASK-XXX.md, item status: open)
    ↓  (flips task -> rework in STATE.json, queues a rework handoff)
Agent's next os.sh start surfaces the open rework
    ↓  agent fixes each item
    ↓  rework.sh resolve TASK-XXX 001 "what I did"
verify-task.sh  →  FAILS while any item is open  (fail-closed)
    ↓  all items resolved
You accept  →  rework.sh close TASK-XXX  (refuses unless all resolved)
```

Direct command (source of truth):

```
bash scripts/rework.sh open TASK-021A-04 \
  "Export button has no loading state; add a spinner and disable during fetch"
```

Optional GitHub adapter (scrapes PR comments into the same artifact):

```
bash scripts/rework.sh from-github 142 TASK-021A-04
```

The direct command is host-agnostic and needs no auth, webhook, or API. The
GitHub adapter is a convenience for inline-diff ergonomics. Swap GitHub for any
host by writing one more adapter; nothing else changes.

### Universal Handoff Template

`create-handoff.mjs` scaffolds it; the queue entry is written into `STATE.json`
and surfaced in the generated `HANDOFF_QUEUE.md`.

```yaml
---
handoff_type: review | session | task
id: HANDOFF-[TYPE]-[REF]
created: YYYY-MM-DDThh:mm:ssZ
created_by: [agent name]
task_ref: backlog/tasks/TASK-XXX.md
slice_ref: planning/slices/SLICE-XXX.md
epic_ref: backlog/epics/EPIC-XXX.md
---
# Handoff: [ID]
## Purpose
What the next agent is expected to accomplish.
## Current State
What exists now. Status of each layer (DB, API, UI, tests).
## Completed
What work is done.
## Remaining
What work is outstanding.
## Risks
Known concerns and where to check mitigations.
## Artifacts
Provide paths only. Never paste content.
  Task:  backlog/tasks/TASK-XXX.md
  Slice: planning/slices/SLICE-XXX.md
  Epic:  backlog/epics/EPIC-XXX.md
  Diff:  .agents/reviews/REVIEW-XXX.md   (if review handoff)
## Suggested Skills
- [skill name]
```

### Task Frontmatter: Handoff Fields

Tasks declare whether a handoff is required, what type, and where the file
lives. `verify-task.sh` reads these and **fails closed** if a required handoff
file is absent.

```yaml
handoff_required: true
handoff_type:
  - review
handoff_file: handoffs/review/HANDOFF-REVIEW-TASK-021A-04.md
```

For high-risk tasks requiring both review and a session save:

```yaml
handoff_required: true
handoff_type:
  - review
  - session
handoff_files:
  review:  handoffs/review/HANDOFF-REVIEW-TASK-XXX.md
  session: handoffs/session/HANDOFF-SESSION-YYYY-MM-DD.md
```

### Handoff Folder Structure

```
handoffs/
├── review/   └── HANDOFF-REVIEW-TASK-021A-04.md
├── session/  ├── HANDOFF-SESSION-2026-08-21.md
│             └── HANDOFF-SESSION-2026-08-22.md
├── task/     └── HANDOFF-TASK-021-022.md
└── archive/      ← consumed handoffs moved here (audit history; never delete)
```

Lifecycle rule: when a handoff is consumed, move the file to `handoffs/archive/`
and set its status to `consumed` in `STATE.json`. Never delete handoffs — they
are audit history.

---

## Skills Layer

A skill is a governed, reusable capability package — a `SKILL.md` folder with
optional scripts and references. It is not a task, not a slice plan, not a shell
shortcut, and not a replacement for the Project Spine.

v6.1 change: third-party skills are **vendored onto disk**, not installed at
bootstrap. `stop-slop` and `design-taste-frontend` are committed into
`.agents/skills/` with their source and commit recorded in `lock.json`. This
removes the two network installers as bootstrap failure points and guarantees
the skill is present in restricted-egress environments.

`scripts/skills.sh` is the installer, validator, vendor wrapper, and registry
tool. The skills themselves carry no runtime dependency, so they load the same
in any harness.

### Canonical Skill Layout

```
.agents/skills/
├── registry.md
├── lock.json
├── frontend-design/          SKILL.md
├── design-taste-frontend/    SKILL.md          ← VENDORED on disk
├── impeccable/               SKILL.md
├── stop-slop/                SKILL.md
│                             references/{phrases,structures,examples}.md
│                             score.mjs          ← recomputes the slop score for the gate
├── shadcn-ui-builder/        SKILL.md
├── 21st-dev-components/      SKILL.md
├── ds-task-slicer/           SKILL.md
├── ds-test-planner/          SKILL.md
├── ds-reviewer/              SKILL.md
├── ds-handoff/               SKILL.md
└── local/
    └── candidate-skill/      SKILL.md  README.md
```

### Seek, Install, Create, or Skip

```
Task arrives
  ↓ Is this one-off?            → yes: handle in task only
  ↓ no
  Is a matching skill installed? → yes: reference skill_refs
  ↓ no
  Available via skills.sh?       → yes: vendor + register
  ↓ no
  Can existing skills compose it?→ yes: document composition in task
  ↓ no
  Repeatable or high-risk?       → yes: draft local candidate
  ↓
  Use in 2+ real tasks before promotion
```

- **Use an existing skill when** the operation is repeatable; the task risk
  benefits from a standard procedure; a predefined skill exists in the registry;
  the skill reduces context, not increases it.
- **Do not create a skill when** the instruction is one-off; the process is not
  stable yet; it would duplicate a spine rule; it would hide important decisions
  from the task.

### Design Defaults and Active Lane Policy

Every serious frontend project installs Impeccable, frontend-design,
design-taste-frontend, shadcn-ui-builder, and 21st-dev-components. Impeccable is
the active design authority; design-taste-frontend feeds it brief-inference and
anti-templated direction; shadcn governs primitives; 21st governs free/public
reuse.

| Skill | Role | Status |
|---|---|---|
| Impeccable | Active design lane: implementation, polish, visual QA, anti-generic detection. | active default |
| frontend-design | Fallback / exploration lane for first-pass concepts. | installed |
| design-taste-frontend | Taste / brief inference; tunes variance, motion, density. Direction input only. | active default |
| shadcn-ui-builder | shadcn/ui setup, CLI, primitive composition, accessible owned components. | active default |
| 21st-dev-components | Find/adapt free/public 21st.dev marketing blocks before hand-building. | active default |

Hard rule: do not run Impeccable and frontend-design as active design
authorities on the same UI pass. Taste, shadcn, and 21st support the active lane
but never replace it.

### Public-Text Gate (stop-slop)

No public-facing or client-facing text ships without passing stop-slop. This
covers landing copy, marketing blocks, UX microcopy, READMEs, release notes,
proposals, emails, and any string a human outside the team will read.

v6.1 enforcement: the slop score is no longer self-reported. `score.mjs` writes
a `.slop/<file>.score.json` artifact, and `verify-task.sh` *recomputes the score
independently* and fails the push if the artifact is missing or the number
disagrees. A bare "42/50" written into a task no longer counts as a pass.

Order of operations: Draft → stop-slop (de-slop + scored artifact) →
ds-content-review (voice / accuracy / brand) → human gate → publish.

### Default and Conditional Skill Catalog

| Skill | Status | Use |
|---|---|---|
| impeccable | Default | Active design lane for UI implementation, polish, and audit. |
| frontend-design | Installed fallback | Early concepting or explicit fallback. |
| design-taste-frontend | Default (vendored) | Taste / brief inference for landing pages, portfolios, redesigns. |
| stop-slop | Default (vendored) | Mandatory prose gate; score recomputed by the verify gate. |
| shadcn-ui-builder | Default | shadcn/ui setup, CLI, primitive composition. |
| 21st-dev-components | Default | Search, select, adapt free/public 21st.dev components. |
| ds-task-slicer | Default | Turns epics into slice plans and bounded tasks. |
| ds-test-planner | Default | Maps acceptance criteria and risk to minimal verification. |
| ds-reviewer | Default | Cross-model diff review against task, spine, skills, tests. |
| ds-handoff | Default | Creates session, task, and review handoffs at session end. |
| ds-content-review | Conditional | Required for public/client-facing copy and UX writing. |
| tenant-isolation-review | Stack conditional | Required for auth, permissions, tenancy, data access. |
| api-route-contract | Stack conditional | Required for route handlers, webhooks, public API contracts. |
| drizzle-migration | Stack conditional | Required before schema or migration work. |
| mobile-money-webhook-review | Domain conditional | Required for payment callback / idempotency work. |

### Skill Lifecycle

| Stage | Location | Approval |
|---|---|---|
| Candidate | `.agents/skills/local/<name>/SKILL.md` | Human or planning agent may draft. |
| In use | Referenced by task `skill_refs` | Usable locally if reviewed. |
| Promoted | `.agents/skills/<name>/SKILL.md` | Human promotes after 2+ successful uses. |
| Pinned | `.agents/skills/lock.json` | Record source, commit, installer, scope. |
| Deprecated | `registry.md` + retained folder | Do not delete if old tasks reference it. |

### Registry and Lockfile

`registry.md` is the human-readable index; `lock.json` pins vendored skills to a
source and commit so the on-disk copy is reproducible.

```json
{
  "schema": "solo-dev-os.skills-lock.v1",
  "skills": {
    "stop-slop": {
      "source": "https://github.com/hardikpandya/stop-slop.git",
      "method": "git", "commit": "<pinned-sha>", "vendored": true, "scope": "project"
    },
    "design-taste-frontend": {
      "source": "https://github.com/leonxlnx/taste-skill",
      "method": "npx-skills", "commit": "<pinned-sha>", "vendored": true, "scope": "project"
    }
  }
}
```

---

## Testing & Verification

Testing proves risk-bearing behavior, not vanity coverage. A task declares
`verification_required` levels matched to its `risk_level`; the gate runs exactly
those and records the result in `STATE.json`. Skips must be declared, never silent.

- **Prove, don't pad** — tests exist to prove acceptance criteria and
  risk-bearing behavior. Snapshots, mocks, and fixtures must justify their existence.
- **Match the risk** — low-risk CSS gets lint + typecheck. High-risk tenancy
  gets integration tests and a human gate. The level is chosen by risk, not habit.
- **Declare the gaps** — the test plan's `non_goals` field forces the agent to
  state what it did *not* test and why.

### The Fail-Closed Gate

v6.1's central change. `scripts/verify-task.sh` is a pure-shell gate wired into
`.githooks/pre-push` and CI. It does not trust the agent — it independently
recomputes the things that matter and **rejects the push** if any fail. It works
identically in every harness because it runs in Git, not in an agent's startup
routine.

The operator's golden rule: a clean `git push` means every gate passed. A
rejected push names the one rule that failed. You investigate only on rejection
— never `--no-verify`.

### Risk → Required Test Levels

| Risk | Required proof | Human gate? |
|---|---|---|
| Low | lint, typecheck; slop score if public text | No |
| Medium | + unit tests, scope check, cross-model review | No |
| High | + integration tests, protected-path declaration | Yes |
| Critical | + full verification, rollback plan, signed approval | Yes (CODEOWNERS) |

### What the Gate Checks

| Check | Mechanism | Fails when |
|---|---|---|
| Task metadata | `validate-task.mjs` (real YAML parse) | Required frontmatter fields are missing or malformed. |
| Scope | `git diff` vs `files_allowed` | Any changed file is not declared in the task. |
| Risk-matched proof | Runs only declared `verification_required` levels | A required level fails. Skips are echoed, not hidden. |
| Slop score | `stop-slop/score.mjs` recomputed | Public-text changed and score < 35/50, or score artifact missing. |
| Protected path | CODEOWNERS + signed-commit check | Protected file changed without a human-signed approving commit. |
| Handoff presence | Existence of `handoff_file` + queue entry | `handoff_required: true` but file or queue entry absent. |
| Open rework | `rework.mjs status` on the task | Any rework item is still `open` — task cannot close until resolved. |
| Skill registry | `skills.sh validate` | A referenced skill's `SKILL.md` is missing on disk. |
| State consistency | `os.sh check` | STATE.json disagrees with task frontmatter (drift). |

### Git Hooks & CI

Bootstrap sets `git config core.hooksPath .githooks` so the hooks travel with
the repo and run in every harness. CI re-runs the same gate so a bypassed local
hook still cannot merge.

```bash
# .githooks/pre-push
#!/usr/bin/env bash
set -euo pipefail
TASK="$(node scripts/active-task.mjs 2>/dev/null || true)"
if [[ -n "${TASK:-}" ]]; then
  bash scripts/verify-task.sh "$TASK"
else
  bash scripts/os.sh check     # at minimum, state must be consistent
fi
```

### Degraded Modes

- **Single model family** — set `reviewer: human`. The gate still requires a
  review file to exist; the human fills the scope/skills/tests checklist. Review
  is reassigned, never skipped.
- **No Node available** — the gate's spine is shell. Node-dependent checks
  (validate-task, score) degrade to a declared `skip (no node)` rather than a
  silent pass, and CI — which has Node — still enforces them.
- **Restricted egress** — vendored skills are already on disk, so the gate's
  skill check passes offline. Network installers are bootstrap-only and fail
  soft with a stub + SOURCE note.
- **Hook bypassed (`--no-verify`)** — CI runs the identical gate on the PR. A
  bypassed local hook cannot reach a protected branch.

---

## File Templates

### AGENTS.md (canonical source)

`CLAUDE.md`, `CODEX.md`, and `GEMINI.md` are **generated** from this file by
`scripts/sync-agent-files.sh`. Edit only this one; run the sync to update the
rest. See `AGENTS.md` at the repo root for the live version.

### CURRENT_STATE.md (generated — do not edit)

Rendered from `STATE.json`. Its shape is shown for reference; agents and humans
read it but never write it.

```markdown
<!-- generated — do not edit; source: project-state/STATE.json -->
---
updated: YYYY-MM-DDThh:mm:ssZ
updated_by: [agent | human]
---
# Current State
## Active work
Epic: [EPIC-XXX]   Slice: [SLICE-XXX]   Task: [TASK-XXX]   Agent: [name]
## Completion status
[layer]: [complete | X% | pending | blocked]
## What is done
- [from STATE.json.completion.done]
## What remains
- [from STATE.json.completion.remaining]
## Blocked
[from STATE.json.completion.blocked]
## Assigned handoffs
[from STATE.json.handoff_queue where status = pending]
```

### Task Template

The one file the agent still authors by hand. `files_allowed` is load-bearing —
the gate diffs against it.

```yaml
---
id: TASK-042
title: [Task title]
status: ready          # ready | in-progress | rework | done
priority: P1
risk_level: low | medium | high | critical
preferred_executor: claude-code
reviewer: codex | opencode | human
outcome_refs: []
roadmap_epic: EPIC-XXX
epic_ref: backlog/epics/EPIC-XXX.md
slice_plan: planning/slices/SLICE-XXX.md
content_refs: []
design_refs: []
skill_refs: [ds-test-planner, ds-handoff]
verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false
  visual: false
  design_detect: false
public_text: false            # set true to trigger the recomputed slop gate
test_strategy:
  new_tests_required: false
  test_plan_ref: planning/tests/TESTPLAN-XXX.md
  reason: [why these test levels were chosen]
  non_goals:
    - [what is explicitly not tested and why]
handoff_required: false
handoff_type: []
handoff_file: handoffs/[type]/HANDOFF-[TYPE]-TASK-XXX.md
protected_paths_touched: []   # if non-empty, gate requires CODEOWNERS-signed approval
files_allowed:                # load-bearing: the gate diffs against this list
  - [file path]
---
# Task: [Title]
## Scope
[What this task implements]
## Acceptance Criteria
- [ ] [criterion]
```

Changed in v6.1: `human_approved` is removed from the task — approval is no
longer an agent-editable field. It is derived at gate time from CODEOWNERS plus a
human-signed commit. `files_allowed` and `public_text` are now read by the gate.

### Test Plan Template

```markdown
---
id: TESTPLAN-XXX
slice_ref: planning/slices/SLICE-XXX.md
risk_level: medium
status: approved
---
# Test Plan: [Name]
## Purpose
[What behavior this plan proves]
## Risk areas
- Data integrity / Tenant isolation / Auth / Finance / UI-content / Integrations: yes|no
## Required test levels
| Level | Required? | Reason |
|---|---:|---|
| Unit | yes | [reason] |
| Integration | no | [reason] |
| E2E | no | [reason] |
## Test cases
| ID | Type | Scenario | File |
|---|---|---|---|
| TC-001 | unit | [scenario] | [file] |
## Non-goals
[What is not tested and why]
```

### Slice Plan Template

```markdown
---
id: SLICE-XXX
title: [Feature slice]
status: draft
epic_ref: backlog/epics/EPIC-XXX.md
outcome_refs: []
risk_level: low | medium | high | critical
content_refs: []
design_refs: []
skill_refs: []
test_plan_ref: planning/tests/TESTPLAN-XXX.md
---
# Slice Plan: [Name]
## Intent
What outcome does this slice advance?
## Scope / Non-goals
## Content and design
Which copy, UX states, interface blueprint, and design lane apply?
## Technical approach
Files, modules, data, APIs, integration points.
## API contract (if applicable)
## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
## Gates
- [ ] Spine references valid.
- [ ] Skills selected.
- [ ] Test plan approved for risk level.
- [ ] Protected paths declared.
```

### Cross-Model Review Template

```markdown
---
id: REVIEW-TASK-XXX
task_ref: backlog/tasks/TASK-XXX.md
handoff_ref: handoffs/review/HANDOFF-REVIEW-TASK-XXX.md
reviewer: codex | opencode | human
reviewer_family: [must differ from preferred_executor unless human]
status: pass | pass-with-notes | changes-requested | blocked
---
# Review: TASK-XXX
## Scope check
- [ ] Diff stays inside files_allowed.
- [ ] No unplanned architecture changes.
## Skill check
- [ ] Required skills installed and followed.
- [ ] Design lane policy respected (one active lane).
## Test check
- [ ] Verification level matches risk.
- [ ] Required tests/checks pass.
- [ ] No low-value test bloat added.
## Content/design check
- [ ] Copy refs respected; slop score artifact present.
- [ ] Tokens/components respected.
## Handoff check
- [ ] HANDOFF-REVIEW read before review.
- [ ] Review notes written to this file.
- [ ] Queue entry marked consumed in STATE.json.
## Decision
Pass / changes requested / blocked.
## Rework (human)
If the work passes review but you're not satisfied, open tracked rework instead
of merging: `bash scripts/rework.sh open TASK-XXX "specific feedback"`. The task
cannot close until every rework item is resolved and you run `rework.sh close`.
```

---

## Launch Checklist

### First Hour — Stand Up the OS

This assumes you have the OS scripts on disk already. If starting truly
greenfield, follow **Starting a New Project** above first — clone the template
repo, strip the previous app, then bootstrap. Bootstrap does not generate the
OS scripts; they come from the template.

- Run `bash scripts/bootstrap-solo-dev-os.sh` — creates the skeleton, seeds
  `STATE.json` and `CODEOWNERS`, installs Git hooks, generates the first
  `dashboard.html`.
- Install the one Node dependency: the `yaml` package (or vendor it).
- Set real owners in `CODEOWNERS` (replace `@owner`).
- Confirm hooks are active: `git config core.hooksPath` returns `.githooks`.
- Establish branches: ensure `main` exists, create `dev` off it (bootstrap does
  this), and protect both on your Git host (no direct pushes, require PR + CI).
- Set each harness's identity env: `HARNESS_NAME`, `MODEL_NAME`, `AGENT_ROLE` —
  so the performance dashboard can attribute sessions.
- Write `AGENTS.md`, then run `bash scripts/sync-agent-files.sh` to generate
  CLAUDE/CODEX/GEMINI.md.

### First Day — Intake, Hydrate & Elicit

Project start is a six-phase gated pipeline. Do these in order; each gate
refuses to pass until the prior phase is genuinely complete (and, for Phases
4–6, approved by you).

**Phases 1–3 · Intent (`intake.sh`):**

- **P1 — Write the brief (you):** `bash scripts/intake.sh brief` scaffolds
  `00-original-intent.md`; fill every section, set `status: ready`.
- **P2 — Run the interview (agent asks, you answer):** `bash scripts/intake.sh interview`,
  then have a planning agent populate `INTAKE-INTERVIEW.md` with genuine gaps;
  answer each inline; set `status: answered`.
- **P3 — Confirm ready & hydrate:** `bash scripts/intake.sh ready` must print
  `READY`; the agent then drafts the *intent* files `00-manifesto … 09-roadmap`
  only — no design, content, or UI invented here.

**Phases 4–6 · Elicited (questionnaire + your references):**

- **P4 — Design system:** `bash scripts/design.sh questionnaire`; answer it and
  drop screenshots/links into `references/design/`; `design.sh ready`; the agent
  generates `10-design-system.md` **and** a rendered visual reference
  `10-design-system.html`; run `design.sh preview`, then **open the HTML in a
  browser, inspect it, and iterate on the tokens with feedback until it is
  right** — only then set `status: approved`. The system may not be approved unseen.
- **P5 — Content strategy & structure:** `bash scripts/content.sh questionnaire`
  (gated on design approved); agent generates `11-content-strategy.md` with the
  *sitemap, per-page content, and inventory*; you set `status: approved`.
- **P6 — UI element map:** `bash scripts/ui.sh questionnaire` (gated on content
  approved); drop element references into `references/ui/`; agent generates
  `12-ui-element-map.md` mapping every block to an exact element; you set
  `status: approved`.

**Then — first work:**

- Vendor and pin default skills: `bash scripts/skills.sh install-defaults`, then
  record commits in `lock.json`.
- Shape the first Epic → Slice → Tasks. Each task declares `files_allowed`,
  `risk_level`, and `verification_required`.
- Fill `STATE.json` `current` + `completion`, then `bash scripts/os.sh render`;
  confirm `os.sh check` prints `state: consistent`.

### Daily Loop

| Step | Command / Action | Who |
|---|---|---|
| Branch | `bash scripts/branch.sh start EPIC-XXX` (off `dev`) | Agent |
| Open session | `bash scripts/os.sh start` | Agent |
| Locate work | Identify Epic → Slice → Task from rendered state | Agent |
| Plan | Read task, slice, spine, `skill_refs`; write implementation checklist | Agent |
| Implement | Edit only files in `files_allowed` | Agent |
| Close session | `bash scripts/os.sh end` (gate → STATE → render → log → ledger → handoffs) | Agent |
| Push | `git push` the feature branch → pre-push guards branch + runs `verify-task.sh` vs `dev` | Agent + Git |
| Review | PR `feature → dev`; different model family writes `REVIEW-TASK-XXX.md` | Reviewer |
| Rework (if needed) | `bash scripts/rework.sh open TASK-XXX "..."` → agent resolves → `rework.sh close` | **You** + Agent |
| Status probe | `bash scripts/os.sh check` | **You** |
| Merge | Read rendered state + review, then merge the PR into `dev` | **You** |
| Cleanup | `bash scripts/branch.sh cleanup feature/EPIC-XXX` after the PR merges | **You** |

Operator's day: you mostly run `os.sh check` and merge. A clean push means the
gate passed; a rejected push names the failed rule.

### Weekly Maintenance

- Archive consumed handoffs to `handoffs/archive/` and confirm queue statuses in
  `STATE.json`.
- Confirm `AGENT_LOG.md` rotated into `memory/agent-log/YYYY-MM.md` (or run
  `os.sh rotate-log`).
- Audit the skills registry: `bash scripts/skills.sh validate`; re-pin any
  updated skill in `lock.json`.
- Promote proven local skill candidates after 2+ successful uses.
- Review the risk register and roadmap against what actually shipped.
- Check the Harness Performance panel: any combo clearly weak on gate pass rate
  or scope? Adjust routing. Treat low-n rows as directional only.
- When `dev` holds a coherent, reviewed chunk, promote:
  `bash scripts/branch.sh promote` → full suite → CODEOWNER-signed merge → tag
  the release on `main`.

Principle, preserved from v6: the OS should reduce ceremony, not add it. If a
step feels like admin theatre, delete it — but never delete the gate, the single
state file, or the handoff trail. Those are what make any agent resumable.

### Migrating an Existing v6 Project

- Run `bash scripts/os.sh migrate-v61` — renames `BUILD_DASHBOARD.json` → `STATE.json`.
- Add the `completion` block to `STATE.json` (summary / done / remaining / blocked).
- Delete hand-maintained `CURRENT_STATE.md` / `HANDOFF_QUEUE.md` content; let
  `os.sh render` regenerate them.
- Replace `pnpm os:verify-task` references with `bash scripts/verify-task.sh`.
- Add `files_allowed` and `public_text` to existing tasks; remove `human_approved` booleans.
- Vendor `stop-slop` and `design-taste-frontend` onto disk; add `score.mjs`.
- Add `CODEOWNERS`, install `.githooks/`, and collapse CLAUDE/CODEX/GEMINI.md
  into generated views of `AGENTS.md`.
- Create the `dev` branch off `main`; protect both; move in-flight work onto
  `feature/EPIC-*` branches.
- Add `branch.sh` + `render-metrics.mjs`; create an empty `SESSION_LEDGER.jsonl`;
  set each harness's `HARNESS_NAME`/`MODEL_NAME`/`AGENT_ROLE`.
- Add `actor` and `metrics` blocks (and `current.branch`) to `STATE.json`.
