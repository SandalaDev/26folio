# AGENTS.md

The canonical agent law. `OPERATING_MANUAL.md` is the full reference. Both are
project-agnostic: this is the OS distribution, not a Next.js scaffold.

## Operating law
- The repository is the source of truth. Chat is a scratchpad you can throw away.
- State is written in exactly one place: `project-state/state.json`.
- Never hand-edit generated files (`current-state.md`, `metrics.md`, `dashboard.html`, `guide.html`).
- Make durable decisions reflect in Markdown or code, or don't make them.
- **The OS is non-blocking.** It manages memory, state, and context — it never
  gates quality. Pushes always succeed (except direct pushes to a trunk).
  Quality is caught by tests (planned backlog work) and by the human's manual
  review of every PR, both outside the system.

## The four layers
```
L0  Memory Core     state.json · ledger.jsonl · decisions.md · handoffs/ · session.lock
L1  Views           current-state.md · dashboard.html · guide.html  (generated; never edited)
L2  Sanity          verify.sh (advisory) in CI               (state integrity only — never blocks)
L3  Workflow        os start|end|check|checkpoint|status|context|deps|pr|sync|claim|release|decide|doctor  (one entry point)
─── (optional, default-on for web projects) ───
L4  Frontend Pack   pack-frontend/                           (design phase · skills · lanes)
```
A non-frontend project skips L4 and still gets memory, handover, and the
dashboard. L4 is a layer you *add*, not one the core *depends on*.

## Session lifecycle (every session, every agent)
- Start:   `bash scripts/os.sh start`  — reads state, renders views, detects a stale
  lock (crash recovery), writes the session journal.
- Work:    stay within the task's `files_allowed` focus list (advisory — discipline,
  not enforcement). Periodically run `bash scripts/os.sh checkpoint "next step"`
  so an interrupted session is recoverable.
- End:     `bash scripts/os.sh end [task]` — advisory sanity check, ONE state update,
  renders views, appends the log + a ledger line, creates declared handoffs, clears the lock.

## Testing (planned work, never a gate)
No change *requires* a test and nothing blocks a push. After planning an epic or
task, fill its `## Testing` section: assess what could break and recommend
`none` (with a reason) | `with-task` (cover it inside the task) | `dedicated`
(create a test task — normal backlog work the human prioritizes). Risk guides
the default: low → none, medium → with-task, high/critical → dedicated. See the
`ds-test-planner` skill.

## Reviews (outside the system)
Reviews are done manually by the human after the PR is opened. The system has
no visibility into them and enforces nothing about them. If you see pushed
code, assume its tests and review already passed — do not re-litigate merged
work. Your one duty to review: make risky changes (schema, auth, billing,
secrets, infrastructure, compliance copy) loud and obvious in the PR description.

## Project start (once)
Light intake, not a heavy spine: `bash scripts/intake.sh brief` (you write the
brief) → `interview` (agent asks gaps, you answer) → `ready` (fail-closed gate) →
agent hydrates the 3-file lean context. Shape work with `new-task.sh task|epic`.
See `OPERATING_MANUAL.md` → Launch checklist.

## Dependencies and far-reaching technical choices
- Before initial application packages are downloaded, use
  `bash scripts/os.sh deps plan initial "<purpose>" <exact-package@version>...`.
- Before adding or upgrading packages, use the same workflow with mode `add`.
- For frameworks, auth, data access, state, build, deployment, observability, or
  other system-wide choices, use mode `architecture` before deciding.
- Apply the `opensrc-research` skill: read every candidate's version-matched
  source and relevant docs, then cross-reference engines, peers, migrations,
  runtime assumptions, overlapping responsibilities, and best practices.
- OpenSrc is evidence access, not a dependency solver. An approved plan also
  requires package-manager dry-run resolution and post-install project checks.
- Plans live under `planning/dependencies/`. Only a human changes both
  `status` and `human_approval` to `approved`; `os deps install` accepts only
  exact npm versions from such a plan. This scopes the precondition to the
  install command and never gates commits or pushes.

## Git workflow
`state.flow` selects the model — **github** (default): feature branches cut off
`main`, PR back to `main`; or **trunk-dev** (opt-in): feature → `dev` → `main`.
- Branch: `bash scripts/branch.sh start EPIC-XXX` (one branch per epic).
- PR: `bash scripts/os.sh pr` · post-merge: `bash scripts/os.sh sync`.
Never commit directly to a trunk (`main`, or `dev` when active) — the pre-push
hook's only job is to stop that. It runs no quality checks.

## Handoffs (continuity, not review)
Knowledge transfers through **files referenced by path**, never copied content.
Handoffs exist to resume a session or chain task A into task B. Fill the prose
blocks with real content — a `(fill in)` stub transfers nothing (discipline,
not a gate).

## Progress and writing
- Progress traces `task → epic → roadmap → business goal`. Completed task weight
  estimates delivery toward intent; it never proves a business outcome. Humans
  approve goals, success signals, roadmap links, and weights. See `guide.html`.
- For meaningful prose, apply project/domain constraints, then the core
  `writing-style` skill, then frontend `stop-slop` when present. The scorer is
  advisory. Human approval remains mandatory for sensitive or public claims.

## Skills (portable resolution)
- `skill_refs` contains skill names, never harness-specific paths.
- Resolve each name first at `.agents/skills/<name>/SKILL.md`, then at
  `pack-frontend/skills/<name>/SKILL.md`. Read the selected file completely
  before acting; do not load unrelated skills.
- Skill frontmatter must contain portable `name` and `description` fields.
  Harness-specific fields may be added only when they do not change the core
  procedure. `bash scripts/skills.sh validate` checks this contract.
- `writing-style` is trigger-based even without an explicit task reference when
  prose quality matters. `stop-slop` remains optional when the frontend pack is
  absent.
- `opensrc-research` is trigger-based for dependency selection, package changes,
  dependency internals, and far-reaching technical design.

## Identity (optional)
`os start` auto-detects the harness. Optionally export `HARNESS_NAME` /
`MODEL_NAME` / `AGENT_ROLE` for cleaner dashboard attribution. Absent data is
recorded as `unknown`, never invented.

## Reference
The full manual is `OPERATING_MANUAL.md`. The live dashboard is `dashboard.html`
and the standalone usage guide is `guide.html`; both regenerate via
`bash scripts/os.sh render`. Runtime state comes from `project-state/state.json`;
intent and work metadata come from the spine and backlog.
