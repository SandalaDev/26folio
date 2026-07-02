# Operating Manual — Solo Dev OS

This is the full agent-readable reference. `AGENTS.md` is the short law; this file
is the detail: the day-to-day loop, the handoff protocol, the skills layer, the
fail-closed gate, file templates, and the launch checklist.

Every durable fact lives in a repo file. `project-state/STATE.json` is the single
writable state file; every other view is generated from it. Rules that matter are
checks in `scripts/verify-task.sh`, run by a Git hook — not prose an agent may
ignore. A clean `git push` means the gate passed; a rejected push names the one
rule that failed.

Script sources are **not** duplicated here. Every script lives in `scripts/`; read
it there for authoritative behavior. This manual says what each script is *for*.

---

## Human views

```
bash scripts/os.sh render      # regenerate CURRENT_STATE.md + HANDOFF_QUEUE.md from STATE.json
bash scripts/os.sh check       # print `state: consistent` or `state: DRIFT`
```

`CURRENT_STATE.md` and `HANDOFF_QUEUE.md` carry a
`<!-- generated — do not edit; source: STATE.json -->` banner. Never hand-edit
them; the pre-commit hook warns if a generated file is staged with manual edits.

---

## Starting a New Project

This repository **is** the Solo Dev OS distribution — the OS travels inside it as
scripts and skills, not as a generated artifact. A new project is created by
cloning this repo as a template, stripping the previous app, and running bootstrap.
The scripts are the source of truth and live in `scripts/`.

`bootstrap-solo-dev-os.sh` does **not** create the OS scripts. It writes the
directory skeleton, `STATE.json`, `CODEOWNERS`, the git hooks, and the
`active-task.mjs` helper, then *calls* scripts that must already be on disk. Run
bootstrap in an empty repo and it will fail — the scripts come from the template.

### Greenfield flow

```bash
# 1. Clone this repo as the starting point.
git clone <this-repo> my-new-project && cd my-new-project

# 2. Remove the previous project's app + intent.
#    KEEP the OS scaffolding: scripts/, .agents/, .githooks/, .github/,
#         AGENTS.md, OPERATING_MANUAL.md, CODEOWNERS, .gitignore.
rm -rf src node_modules .next package.json package-lock.json \
       next.config.ts tsconfig.json components.json postcss.config.mjs \
       tailwind.config.ts eslint.config.mjs .prettierrc .prettierignore env.example
rm -rf project-spine backlog planning memory project-state

# 3. Seed the OS: folders, STATE.json, CODEOWNERS, git hooks.
bash scripts/bootstrap-solo-dev-os.sh

# 4. Install the one Node dependency the render/validate scripts need.
npm install yaml

# 5. Reset git history (optional) and commit the skeleton.
rm -rf .git && git init && git add -A && git commit -m "chore: Solo Dev OS skeleton"

# 6. Author the Project Spine, then shape the first Epic → Slice → Tasks.
```

### Keeping the OS up to date in an existing project

The OS is vendored into each project (not a runtime dependency). To pull in OS
fixes later, re-clone the template and copy the changed `scripts/`,
`.agents/skills/`, `AGENTS.md`, and `OPERATING_MANUAL.md` over your project's
copies, leaving `project-state/`, `project-spine/`, and `backlog/` intact. State
and intent are project-owned; the OS machinery is repo-vendored.

---

## User Guide

### Who Does What

Three actors. You read generated files and let the Git gate reject anything that
skipped a step.

- **Human (you)** — owns intent and the irreversible decisions: the Project Spine,
  schema/auth/billing/infra/secrets approvals, the final merge. You read the
  generated state files; you do not hand-write them.
- **Agent** — any harness (Claude Code is the one wired up here). Implements one
  bounded task, writes **one** canonical state update, creates handoffs by path.
  Temporary; nothing important lives only in its chat.
- **Scripts + Git** — the enforcement layer. `verify-task.sh` runs in a pre-push
  hook and in CI. It recomputes scope, proof, slop score, handoff presence, and
  protected-path approval, and **fails the push** if any are wrong.

### The Mental Model

- **Artifacts are permanent. Agents are temporary.** Every durable fact lives in a
  repo file. Chat is a scratchpad.
- **One source of truth, everything else generated.** `STATE.json` is the only
  place state is written; `CURRENT_STATE.md` and `HANDOFF_QUEUE.md` are rendered
  from it, so they cannot disagree with it.
- **Rules fail closed.** If a rule matters, it is a check that blocks the push. If
  it is only prose, treat it as advice.

### Project Start

Author the durable foundation before writing feature code. The **Project Spine**
(`project-spine/00-…` through `12-…`) captures intent, design, content, and UI.
Files 00–09 are *intent* — a planning agent can draft them from your brief. Files
10–12 are *design system*, *content strategy*, and *UI element map* — these encode
your taste and cannot be guessed, so you supply references (drop screenshots into
`project-spine/references/{design,content,ui}/`) and review each draft before
approving it. There is no dedicated per-phase script; author the files directly
(by hand or with a planning agent) and set each one's `status:` when you approve it.

### A Day In The Loop

Nothing is a background daemon. Every "Agent" step still needs you to have a
session open and tell it what to do. The two steps entirely on you — launching the
cross-model review and triggering rework — are the ones most likely to get skipped.

| Phase | Who | What happens |
|---|---|---|
| A — Start | Agent | `branch.sh start EPIC-XXX` cuts a feature branch off `dev`; `os.sh start` reads STATE, renders views, loads handoffs, writes the session lock; agent identifies Epic → Slice → Task and writes an implementation checklist. |
| B — Implement & close | Agent | Agent edits inside `files_allowed` only; `os.sh end` runs the gate, renders views, creates handoffs, clears the lock; `git push` runs `verify-task.sh` against `dev`. |
| C — Review | **You** | *Not automatic.* Open a different model family, point it at `handoffs/review/HANDOFF-REVIEW-TASK-XXX.md`; it writes `.agents/reviews/REVIEW-TASK-XXX.md` with a decision. |
| D — Rework (if not satisfied) | **You** | `rework.sh open TASK-XXX "issue"` per issue; agent resolves each (`rework.sh resolve`); the gate stays red while any item is open; you `rework.sh close` once satisfied. |
| E — Merge & clean up | **You** | Confirm the PR check is green; merge into `dev`; `branch.sh cleanup feature/EPIC-XXX`; periodically `branch.sh promote` for `dev → main`. |

### Git Workflow

Three branches. Agents never commit to a shared trunk.

- **`main`** — protected production. Only moves via a reviewed, fully-verified
  `dev → main` promotion. Tagged releases live here. No agent ever pushes to it.
- **`dev`** — integration branch. Feature branches merge here after the gate passes
  and a cross-model review is in.
- **`feature/EPIC-XXX`** (or `feature/EPIC-XXX-SLICE-Y`) — agent workspace for one
  epic. Agents branch off `dev` and run the task → handoff chain here.

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

- **State continuity:** `os.sh check` prints `state: consistent`. If it prints
  `state: DRIFT`, `STATE.json` disagrees with a task's frontmatter or its counts —
  the gate blocks on this; run `os.sh render` to rebuild, then re-check.
- **Quality gates:** if `git push` succeeded, scope / risk-matched proof / slop
  score / protected-path / handoff presence all passed. Investigate only on
  rejection — never `--no-verify`.
- **Cross-model review:** a `REVIEW-TASK-XXX.md` exists, written by a reviewer
  whose family differs from the executor. Solo dev degrades to `reviewer: human`;
  the review file is still required — review is reassigned, never skipped.
- **Push rejected:** read the FAIL line — it names the rule. Fix that one thing and
  push again.
- **Session crashed:** a stale `ACTIVE_SESSION.lock` with no matching state triggers
  a recover/discard prompt on the next `os.sh start`. The lock is your crash journal.

### Your Core Commands

Everything routes through one shell entry point so it works in any harness or a
bare terminal. You mostly type `check` and merge; the agent runs the rest.

| Command | Who | What it does |
|---|---|---|
| `bash scripts/branch.sh start EPIC-XXX` | Agent | Creates/switches the epic's feature branch off `dev`. Run before `os.sh start`. |
| `bash scripts/os.sh start` | Agent | Reads `STATE.json`, renders views, loads handoffs, writes the session lock. |
| `bash scripts/os.sh end` | Agent | Runs the gate, renders views, creates handoffs, clears the lock. |
| `bash scripts/os.sh render` | Agent | Regenerates `CURRENT_STATE.md` and `HANDOFF_QUEUE.md` from `STATE.json`. |
| `bash scripts/verify-task.sh <task>` | Agent + Git hook | The fail-closed gate. Diffs against `dev` (or `main` when promoting). |
| `bash scripts/os.sh check` | **You** | Status probe: is the state layer consistent? |
| `bash scripts/branch.sh promote` | **You** | Prints the `dev → main` promotion checklist (full suite, signed merge, tag). |
| `bash scripts/rework.sh open <task> "..."` | **You** | Flag review feedback as a tracked rework item; blocks task closure until resolved. |
| `bash scripts/rework.sh close <task>` | **You** | Accept rework once every item is resolved (refuses otherwise). |
| `git push` / merge PR | **You** | Push the feature branch; the hook runs the gate. You merge the PR into `dev`. |

---

## Operating Manual

### Core Operating Law

The OS has one job: stop agentic coding from becoming prompt chaos. Every durable
project decision lives in the repo. Agents explore in chat; the source of truth is
Markdown, code, tests, scripts, and Git history. Enforcement is a first-class
primitive: the rules that matter are checks that fail closed in Git.

Non-negotiables:

- Project facts live in repository files.
- State is written in exactly one place — `STATE.json`. Every other view is
  generated.
- Every session starts and ends through `os.sh start` / `os.sh end`.
- Agents implement bounded tasks, not vague ideas.
- Skills are vendored capability packages on disk, not ad-hoc prompts.
- Testing proves risk-bearing behavior, not vanity coverage.
- Humans approve schema, auth, billing, infra, secrets, compliance — verified via
  CODEOWNERS + signed commit, not a boolean.
- No task merges until `verify-task.sh` passes in the pre-push hook.

### OS Layer Map

```
00  Project State Layer — STATE.json (canonical) + generated views
01  Product Map / Project Spine
02  Skills Layer — vendored SKILL.md on disk
03  Handoff Layer
04  Planning System (Epics → Slices → Tasks)
05  Task Execution
06  Enforcement Layer — verify-task.sh in hook + CI
07  Review Workflow
08  Automation & Scripts (os.sh)
```

### Canonical Repository Map

```
project-root/
├── AGENTS.md                          ← canonical agent instructions (source)
├── CLAUDE.md                          ← GENERATED from AGENTS.md (sync-agent-files.sh)
├── OPERATING_MANUAL.md                ← this file: the full OS manual
│
├── project-state/                     ← OS home screen
│   ├── STATE.json                     ← CANONICAL single source of truth
│   ├── CURRENT_STATE.md               ← generated (do not edit)
│   ├── HANDOFF_QUEUE.md               ← generated (do not edit)
│   ├── AGENT_LOG.md                   ← append-only, auto-rotated
│   └── ACTIVE_SESSION.lock            ← crash journal (present only mid-session)
│
├── handoffs/{review,session,task,rework,archive}/
│
├── project-spine/
│   ├── 00-manifesto.md … 09-roadmap.md        ← intent (drafted from the brief)
│   ├── 05-data-model.md                        ← protected
│   ├── 10-design-system.md (+ .html)           ← design system + visual reference
│   ├── 11-content-strategy.md                  ← sitemap, per-page content, inventory
│   ├── 12-ui-element-map.md                    ← every content block → exact UI element
│   └── references/{design,content,ui}/         ← your visual intent (screenshots)
│
├── planning/slices/                   ← slice plans (created per epic as needed)
├── backlog/{epics,tasks,done}/
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

Exactly one writable artifact — `STATE.json` — and everything else generated from
it or appended to it.

| Artifact | Role | Writable? |
|---|---|---|
| `STATE.json` | Canonical state: current pointers, completion, counts, verification, handoff queue. | Yes — the only writable state file. |
| `CURRENT_STATE.md` | Human-readable snapshot of current work. | No — generated by render. |
| `HANDOFF_QUEUE.md` | Human-readable queue view. | No — generated by render. |
| `AGENT_LOG.md` | Append-only audit trail. | Append only; rotated when it exceeds ~2000 lines. |
| `ACTIVE_SESSION.lock` | Crash journal — present only while a session is open. | Written at start, cleared at end. |

### Project Spine

The durable foundation. Files **00–09 are intent** — drafted by a planning agent
from the brief. Files **10–12 encode taste** — a design system, a content
structure, and a UI map, authored from your references because they cannot be
guessed from intent.

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
| 10 | Design System | Tokens, type scale, spacing, component direction, motion, a11y. |
| 11 | Content Strategy | Audience, voice, SEO — plus sitemap, per-page content, inventory. |
| 12 | UI Element Map | Every content block → exact UI element, source, reference, motion. |

Rule: user-facing tasks that change layout, messaging, claims, forms, onboarding,
dashboards, or client workflows must reference `10-design-system.md`,
`11-content-strategy.md`, and (for build-out) `12-ui-element-map.md`, or explicitly
mark them not required in the task frontmatter.

### End-to-End Workflow

```
PROJECT START (once)
  Author project-spine/00–12 (planning agent drafts intent; you approve design/content/UI).
    ↓
Session Start  →  os.sh start   (read STATE · render views · load handoffs · write lock)
    ↓
Identify Epic → Slice → Task
    ↓
Read task, slice, spine sections, skill_refs · write implementation checklist
    ↓
Implementation (inside files_allowed only)
    ↓
Session End  →  os.sh end   (verify-task.sh · render · create handoffs · clear lock)
    ↓
git push  →  .githooks/pre-push  →  verify-task.sh   ← FAILS CLOSED
    ↓
(if review required) HANDOFF-REVIEW created → different model writes REVIEW-TASK-XXX.md
    ↓
Human reads rendered state + review · merges into dev
```

### Agent Routing Matrix

| Work type | Primary surface | Guardrail |
|---|---|---|
| State updates | Any agent, via `os.sh end` | One STATE.json write. The lock proves it ran. |
| Project Spine edits | Human + planning agent | No autonomous rewrite without human confirmation. |
| Epic shaping / slicing | Planning model | Must map to outcomes, domain, data, content/design where relevant. |
| UI implementation / polish | design-taste-frontend lane + shadcn/ui | State the one-line design read, then implement. Check free/public 21st.dev before hand-building. |
| Implementation | Claude Code (or any harness) | Must run `os.sh start` first and `os.sh end` last. Diff stays in `files_allowed` (gated). |
| Review | Different model family | Executor may not self-approve non-trivial work. Solo dev degrades to `reviewer: human`; review file still required. |
| High-risk changes | Human gate | Schema, auth, billing, infra, secrets, compliance — approval via CODEOWNERS + signed commit. |

### Risk Gates

| Area | Risk | Gate (enforced by verify-task.sh) |
|---|---|---|
| Static copy or CSS polish | Low | lint, typecheck; slop score if public text. |
| Business logic or API behavior | Medium | unit tests, scope check, cross-model review. |
| Database writes, tenant access, auth | High | integration tests, protected-path declaration, human review. |
| Schema, billing, secrets, infrastructure | Critical | CODEOWNERS-approved signed commit, rollback plan, full verification before merge. |

### Anti-Patterns Registry

| Anti-pattern | Failure mode | Better action |
|---|---|---|
| Duplicated state | Epic/Slice/Task pointer lives in files that drift. | One canonical STATE.json; all views generated. `os.sh check` fails on drift. |
| Honor-system gates | Agent self-grades slop or self-sets approval. | Slop score recomputed by `stop-slop/score.mjs`; approval derived from CODEOWNERS + signed commit. |
| Prose-only rules | Important rules exist only as text the agent may ignore. | Rules that matter are checks in `verify-task.sh`, run by a Git hook. Fail closed. |
| Package-manager coupling | `pnpm os:verify-task` breaks for npm/bun/Codex users. | All entry points are `scripts/*.sh`. No package manager assumed. |
| Handoff by conversation summary | A long "what we did" passed as the handoff. | Reference files by path. Never copy artifact content. |
| Skipping state commit | Session ends without writing state. | `os.sh end` is the single commit step; the open lock flags a session that never ended cleanly. |
| Scope creep | Diff edits files the task never declared. | Gate diffs changes against `files_allowed` and fails on escapes. |
| Skill dumping | Agent loads every skill and loses focus. | Load only `skill_refs` from the task. |
| Shipping AI slop | Public copy goes out full of AI tells. | stop-slop recomputed gate → human gate. |
| Coverage theatre | Weak tests added to satisfy a metric. | Test risk-bearing behavior and acceptance criteria only. |
| Feedback in PR threads only | "Fix this" lives in GitHub comments — lost to a cold agent. | Materialize feedback into `handoffs/rework/REWORK-TASK-XXX.md` via `rework.sh`; the artifact blocks closure. |

---

## Handoff Layer

An agent-agnostic protocol. The same handoff artifacts work identically across any
harness.

```
Agents are temporary. Artifacts are permanent.
Never transfer knowledge via conversation history.
Always transfer knowledge via handoff artifacts.
```

Handoffs must **never** contain: conversation summaries, chat logs, large copied
artifacts, or duplicate content already in the repo. Handoffs must **always**:
reference files by path, state current status concisely, name remaining work, name
known risks.

`os.sh start` loads the assigned handoffs listed in `STATE.json`, so the handoff is
read regardless of which harness picks up the session. `verify-task.sh` also fails
closed if a required handoff is missing.

Correct vs wrong:

```
✓ Correct                        ✗ Wrong
Artifacts:                       # Artifacts
  Epic:  backlog/epics/EPIC-021    [full epic content pasted]
  Slice: planning/slices/SLICE-21  [full slice content pasted]
  Task:  backlog/tasks/TASK-04     [full task content pasted]
```

### Four Official Handoff Types

- **`review` — HANDOFF-REVIEW.** Implementation → Review Agent. Triggered after task
  completion when cross-model review is required.
- **`session` — HANDOFF-SESSION.** Resume work later (context exhausted, end of day,
  reboot, model switch).
- **`task` — HANDOFF-TASK.** Task A complete → Task B begins.
- **`rework` — REWORK.** Human review feedback → executor. Created by `rework.sh open`;
  blocks task closure until every item is resolved.

### The Rework Loop

Cross-model review catches correctness problems; the rework loop captures *your*
judgement — "this works, but I'm not satisfied." Rework items live in
`handoffs/rework/REWORK-TASK-XXX.md`, committed to the repo — not in a PR thread
that scrolls away and is invisible to a cold agent.

```
You review the PR  →  rework.sh open TASK-XXX "what's wrong"
    ↓  (writes the rework artifact, item status: open; flips task → rework in STATE.json)
Agent's next os.sh start surfaces the open rework  →  agent fixes each item
    ↓  rework.sh resolve TASK-XXX 001 "what I did"
verify-task.sh  →  FAILS while any item is open  (fail-closed)
    ↓  all items resolved
You accept  →  rework.sh close TASK-XXX  (refuses unless all resolved)
```

### Universal Handoff Template

`create-handoff.mjs` scaffolds it; the queue entry is written into `STATE.json` and
surfaced in `HANDOFF_QUEUE.md`.

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
## Completed / Remaining / Risks
## Artifacts
Provide paths only. Never paste content.
## Suggested Skills
- [skill name]
```

### Handoff Folder Structure

```
handoffs/
├── review/   └── HANDOFF-REVIEW-TASK-021A-04.md
├── session/  └── HANDOFF-SESSION-2026-08-21.md
├── task/     └── HANDOFF-TASK-021-022.md
├── rework/   └── REWORK-TASK-021A-04.md
└── archive/      ← consumed handoffs moved here (audit history; never delete)
```

When a handoff is consumed, move the file to `handoffs/archive/` and set its status
to `consumed` in `STATE.json`. Never delete handoffs — they are audit history.

---

## Skills Layer

A skill is a governed, reusable capability package — a `SKILL.md` folder with
optional scripts and references. Third-party skills are **vendored onto disk** (not
installed at runtime), so they load the same in any harness and in restricted-egress
environments. `scripts/skills.sh` is the installer, validator, and registry tool.

### Catalog

The catalog is `.agents/skills/registry.md`; vendoring method and pinned commit per
skill are in `lock.json`. Only authored/vendored skills exist — no empty stubs are
pre-created.

| Skill | Status | Use |
|---|---|---|
| design-taste-frontend | vendored | Active design lane: brief inference + anti-templated direction for landing pages, portfolios, redesigns. |
| stop-slop | vendored | Mandatory public-text gate; score recomputed by the verify gate. |
| ds-handoff | authored | Creates session/task/review handoffs at session end. |
| ds-reviewer | authored | Cross-model diff review against task, spine, skills, tests. |

Add a skill with `skills.sh add <name>` (candidate under `local/`) and author its
`SKILL.md` before any task references it — `validate-task.mjs` fails a task whose
`skill_refs` point at a missing skill. Build UI with shadcn/ui primitives; check
free/public 21st.dev components before hand-rolling.

### Public-Text Gate (stop-slop)

No public-facing or client-facing text ships without passing stop-slop: landing
copy, marketing blocks, UX microcopy, READMEs, release notes, proposals, emails —
any string a human outside the team reads. `score.mjs` writes a
`planning/content/.slop/<file>.score.json` artifact, and `verify-task.sh`
*recomputes the score independently* and fails the push if the artifact is missing
or the number disagrees. It scans Markdown/HTML **and** component files
(`.tsx/.ts/.jsx/.js`), so copy rendered from React is covered.

Order of operations: Draft → stop-slop (de-slop + scored artifact) → human gate →
publish.

---

## Testing & Verification

Testing proves risk-bearing behavior, not vanity coverage. A task declares
`verification_required` levels matched to its `risk_level`; the gate runs exactly
those and records the result. Skips must be declared, never silent.

### The Fail-Closed Gate

`scripts/verify-task.sh` is a pure-shell gate wired into `.githooks/pre-push` and
CI. It does not trust the agent — it independently recomputes what matters and
rejects the push if any check fails. It works identically in every harness because
it runs in Git, not in an agent's startup routine.

Golden rule: a clean `git push` means every gate passed. A rejected push names the
one rule that failed. Investigate only on rejection — never `--no-verify`.

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
| Task metadata | `validate-task.mjs` (real YAML parse) | Required frontmatter fields missing or malformed. |
| Skill registry | `skills.sh validate` | A referenced skill's `SKILL.md` is missing on disk. |
| Scope | `git diff` vs the union of `files_allowed` across the branch's tasks | A changed non-OS-managed file is not declared by any task on the branch. |
| Risk-matched proof | Runs only declared `verification_required.<level>` | A required level fails. Skips are echoed, not hidden. |
| Slop score | `stop-slop/score.mjs` recomputed | Public text changed and score < 35/50, or the score artifact is missing. |
| Protected path | CODEOWNERS + signed-commit check | Protected file changed without a human-signed approving commit. |
| Handoff presence | Existence of `handoff_file` + queue entry | `handoff_required: true` but file or queue entry absent. |
| Open rework | `rework.mjs status` on the task | Any rework item is still `open`. |
| State consistency | `render-state.mjs --check` | STATE.json disagrees with task frontmatter or recomputed counts (drift). |

The scope check reads proof levels by dot-path (`verification_required.lint`), so
declared checks actually run. Its allowed set is the **union** of `files_allowed`
across the current task plus every task referenced in the branch's commit messages,
and OS-managed paths (`project-state/`, `handoffs/`, `memory/`, `backlog/done/`,
`backlog/epics/`, generated `CLAUDE.md`) are excluded — so multi-task epic branches
don't false-flag.

### Git Hooks & CI

Bootstrap sets `git config core.hooksPath .githooks` so the hooks travel with the
repo and run in every harness. CI re-runs the same gate so a bypassed local hook
still cannot merge.

```bash
# .githooks/pre-push
#!/usr/bin/env bash
set -euo pipefail
bash scripts/branch.sh guard                    # never push from main/dev directly
TASK="$(node scripts/active-task.mjs 2>/dev/null || true)"
if [[ -n "${TASK:-}" ]]; then
  bash scripts/verify-task.sh "$TASK"
else
  bash scripts/os.sh check     # at minimum, state must be consistent
fi
```

### Degraded Modes

- **Single model family** — set `reviewer: human`. The gate still requires a review
  file to exist; review is reassigned, never skipped.
- **No Node available** — the gate's spine is shell. Node-dependent checks degrade
  to a declared `skip (no node)` rather than a silent pass; CI (which has Node) still
  enforces them.
- **Restricted egress** — vendored skills are already on disk, so the skill check
  passes offline.
- **Hook bypassed (`--no-verify`)** — CI runs the identical gate on the PR.

---

## File Templates

### Task Template

The one file the agent authors by hand. `files_allowed` is load-bearing — the gate
diffs against it.

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
skill_refs: [ds-handoff]
verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false
public_text: false            # set true to trigger the recomputed slop gate
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

Approval is not an agent-editable field — it is derived at gate time from CODEOWNERS
plus a human-signed commit. `files_allowed` and `public_text` are read by the gate.

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
---
# Slice Plan: [Name]
## Intent
What outcome does this slice advance?
## Scope / Non-goals
## Content and design
Which copy, UX states, interface blueprint, and design lane apply?
## Technical approach
Files, modules, data, APIs, integration points.
## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
## Gates
- [ ] Spine references valid.
- [ ] Skills selected.
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
## Skill / Test / Content checks
- [ ] Required skills followed; design lane respected.
- [ ] Verification level matches risk; required checks pass; no test bloat.
- [ ] Copy refs respected; slop score artifact present.
## Decision
Pass / changes requested / blocked.
## Rework (human)
If the work passes review but you're not satisfied, open tracked rework instead of
merging: `bash scripts/rework.sh open TASK-XXX "specific feedback"`.
```

---

## Launch Checklist

### First Hour — Stand Up the OS

- Run `bash scripts/bootstrap-solo-dev-os.sh` — creates the skeleton, seeds
  `STATE.json` and `CODEOWNERS`, installs Git hooks.
- Install the one Node dependency: the `yaml` package (or vendor it).
- Set real owners in `CODEOWNERS` (replace `@owner`).
- Confirm hooks are active: `git config core.hooksPath` returns `.githooks`.
- Ensure `main` exists, create `dev` off it, and protect both on your Git host (no
  direct pushes, require PR + CI).
- Write `AGENTS.md`, then run `bash scripts/sync-agent-files.sh` to generate
  `CLAUDE.md`.

### First Day — Author the Spine

- Draft the intent files `00-manifesto … 09-roadmap` (a planning agent can draft
  from your brief).
- Author `10-design-system.md` (+ `10-design-system.html` visual reference),
  `11-content-strategy.md` (sitemap + per-page content + inventory), and
  `12-ui-element-map.md` (every block → exact element), supplying your references
  under `project-spine/references/`.
- Vendor the third-party skills: `bash scripts/skills.sh install-defaults`, then
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
| Close session | `bash scripts/os.sh end` | Agent |
| Push | `git push` the feature branch → pre-push guards branch + runs `verify-task.sh` vs `dev` | Agent + Git |
| Review | PR `feature → dev`; different model family writes `REVIEW-TASK-XXX.md` | Reviewer |
| Rework (if needed) | `rework.sh open TASK-XXX "..."` → agent resolves → `rework.sh close` | **You** + Agent |
| Merge | Read rendered state + review, then merge the PR into `dev` | **You** |
| Cleanup | `bash scripts/branch.sh cleanup feature/EPIC-XXX` after the PR merges | **You** |

### Weekly Maintenance

- Archive consumed handoffs to `handoffs/archive/` and confirm queue statuses in
  `STATE.json`.
- Confirm `AGENT_LOG.md` rotated into `memory/agent-log/YYYY-MM.md` (or run
  `os.sh rotate-log`).
- Audit the skills registry: `bash scripts/skills.sh validate`; re-pin any updated
  skill in `lock.json`.
- Review the risk register and roadmap against what actually shipped.
- When `dev` holds a coherent, reviewed chunk, promote:
  `bash scripts/branch.sh promote` → full suite → CODEOWNER-signed merge → tag the
  release on `main`.

Principle: the OS should reduce ceremony, not add it. If a step feels like admin
theatre, delete it — but never delete the gate, the single state file, or the
handoff trail. Those are what make any agent resumable.
