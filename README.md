# agent-os

A lean, harness-agnostic agent operating system. Clone this repo to start any
project — web app, CLI, backend service, or library.

- **Core (L0–L3)** is stack-agnostic: memory, recovery, advisory sanity checks,
  intent-traced progress, a standalone guide, and writing skills work in any
  harness (Claude Code, Codex, OpenCode, Cursor, ZCode, Gemini CLI) and any stack.
- **Frontend Pack (L4)** is default-on and detachable: design-system phase,
  shadcn/21st.dev lanes, content/UI guidance. Skip it for non-frontend work.

## Quick start
```bash
git clone <this-repo> my-project && cd my-project
bash setup.sh                     # OpenSrc preflight, reviewed OS dep, hooks
bash scripts/os.sh start          # begin
```

Open `guide.html` for the operator walkthrough and `dashboard.html` for the
current next action, delivery estimate, traceability confidence, roadmap, and
business-goal progress.

Before the initial application stack, a package addition/upgrade, or a
far-reaching technical choice, run `bash scripts/os.sh deps plan ...`. It uses
Vercel OpenSrc to fetch exact-version docs/source, creates a cross-package
evidence artifact, requires human approval, and runs the package manager's
no-payload resolver before its npm install wrapper is allowed to proceed.

> `setup.sh` is mandatory after every clone: git config and shell hooks don't
> travel with a repo, so without it trunk protection is
> inactive. See "Branch protection" below.

See `OPERATING_MANUAL.md` for the full reference.

## Branch protection on a free / private repo
GitHub branch protection is a paid feature (Pro/Team, or a public repo). On a free
private repo there's no server-side block on direct pushes to `main`/`dev` — so
agent-os enforces locally instead, in two layers:

The **`pre-push` hook** refuses pushes that target a trunk — its only job; no
quality checks run at push time (the OS is non-blocking by design). Bypassable
with `git push --no-verify` (a conscious decision, not an accident).

On a Pro/Team plan (or a public repo), add GitHub's server-side protection on top
of these for defense-in-depth.

## Updating an existing project from the template
When the template improves (guide fixes, new scripts), port those
changes into a project you already cloned — without losing the project's own state:

```bash
bash scripts/update-from-template.sh --from git@github.com:SandalaDev/agenticOS.git --dry-run
# review the dry-run, then:
bash scripts/update-from-template.sh --from git@github.com:SandalaDev/agenticOS.git
```

This updates **only OS machinery** (`scripts/`, `.githooks/`, `.agents/`,
`pack-frontend/`, `AGENTS.md`, `OPERATING_MANUAL.md`, `setup.sh`). It **never
touches project-owned files** — `state.json`, `ledger.jsonl`, `backlog/`,
`handoffs/`, `project-spine/` — so your project's memory is preserved. `.gitignore`
is flagged for manual merge if it differs. Always run with `--dry-run` first.
