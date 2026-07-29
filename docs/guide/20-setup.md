## Setup (once)

Everything here happens once per project (and the prerequisites once per machine). This part is **yours** — the agent isn't involved yet.

### Prerequisites (once per machine) — YOU

- **Git** — you almost certainly have it.
- **Node.js 18+** — the render/validate scripts are Node. Check: `node -v`.
- **On Windows: Git Bash** — every command in this guide is a bash command. They run fine in the Git Bash terminal (installed with Git for Windows). If you work through an agent (Claude Code, Cursor, etc.), the agent's shell handles this and you don't need to open Git Bash yourself.
- **Optional: the GitHub CLI (`gh`)** — only needed for the `os pr` / `os sync` conveniences. Without it you open and merge PRs in the browser, which works exactly as well.

### Step 1 — create your project from the template — YOU

Either use GitHub's **"Use this template"** button on the template repo (this creates a fresh repo with no shared history — recommended), or do it by hand:

```
git clone <template-url> my-project
cd my-project
rm -rf .git && git init -b main     # start fresh history
git add -A && git commit -m "init from agent-os template"
```

**You should see:** a folder containing `AGENTS.md`, `OPERATING_MANUAL.md`, `scripts/`, `project-state/`, and this guide under `docs/guide/`.

### Step 2 — run setup — YOU

```
bash setup.sh
```

**What it does:** points git at the repo's hooks (`core.hooksPath=.githooks` —
this is local config that does NOT travel with a clone), bootstraps the pinned
OpenSrc CLI through `npx`, fetches and verifies the exact reviewed `yaml@2.9.0`
source before npm installation, runs npm's no-payload resolver, installs that OS
dependency, checks state, and renders `dashboard.html` plus `guide.html`.

**You should see:**

```
=== agent-os setup ===
[setup] core.hooksPath = .githooks
[setup] OpenSrc dependency evidence preflight:
[deps] OpenSrc evidence ready: yaml@2.9.0
[deps] reviewed baseline: docs/dependencies/os-runtime.md
[setup] node + yaml: ok
[setup] health check:
  state: consistent
=== setup complete ===
Dashboard: /path/to/my-project/dashboard.html
Usage guide: /path/to/my-project/guide.html
```

If any line differs, see Troubleshooting. Don't continue until setup is clean — every later step assumes it.

### Step 3 — put it on GitHub — YOU

With the `gh` CLI:

```
gh repo create my-project --private --source . --push
```

Or in the browser: GitHub → New repository → create it empty (no README) → then:

```
git remote add origin https://github.com/<you>/<my-project>.git
git push -u origin main
```

**You should see:** the repo on GitHub with `main` pushed. On a paid plan or public repo, also enable branch protection on `main` (Settings → Branches) — the local pre-push hook already refuses direct trunk pushes, but server-side protection is a stronger backstop.

### Step 4 — confirm the OS works — YOU

Open `guide.html` in a browser and use the green **VERIFY** callouts throughout this guide. Then open `dashboard.html` and confirm its next action matches the project stage. Two minutes now saves confusion later.

### Step 5 (optional) — identity for the dashboard — YOU

The system auto-detects which coding tool (harness) is running. If you also want the model name attributed on the dashboard, export it in the shell the agent uses:

```
export HARNESS_NAME=claude-code MODEL_NAME=claude-opus-4-8
```

Entirely optional. Unset values are recorded honestly as `unknown`, never invented, and nothing ever nags you about it.
