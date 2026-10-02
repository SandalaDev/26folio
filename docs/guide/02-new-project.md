## Create a new project

Use this workflow for a new product with an empty destination. Keep a reusable template checkout beside your product repositories. Each exported product gets its own history and remote.

### 1. Check the tools

You need Git, Bash, Node.js and npm. Setup uses network access for the reviewed dependency-source preflight and any required package installation. A coding harness is needed for the conversational workflow. GitHub CLI is optional until you use `os pr` or `os sync`.

```bash
git --version
node --version
npm --version
git config user.name
git config user.email
```

If Git has no author identity, configure your actual name and email before exporting; the exporter creates an initial commit. Follow `docs/dependencies/os-runtime.md` for the checked-in runtime dependency contract. Setup does not install Node, Git, your coding agent or an application framework.

### 2. Clone the template as a source checkout

```bash
cd /c/_git
git clone YOUR_TEMPLATE_URL projectStart
cd projectStart
git log -1 --oneline
git tag --list
```

If you already have this checkout, use it. For a clean template checkout, fetch available revisions with `git fetch origin --tags`. Select a reviewed tag or full commit hash containing the version you want. Fetching does not replace a local working tree or automatically select a release.

:::system Committed revisions only
The exporter reads Git history, not uncommitted edits. Commit template changes before exporting them; push them before expecting a remote clone to contain them. `--ref HEAD` selects the checkout's current commit, which may differ from the files you can see in an edited working tree.
:::

### 3. Export into a sibling directory

Run this from the **template checkout**:

```bash
bash scripts/scaffold-project.sh ../my-project \
  --ref YOUR_RELEASE_TAG --profile frontend
```

Choose `frontend` for the core OS plus design skills and frontend workflows. Choose `core` for the OS without `pack-frontend/`. Both profiles include memory, interviews, planning, usage accounting, handoffs and generated views. Neither profile creates a Next.js application or chooses your product stack.

The destination should be nonexistent or empty, and its parent must exist. It must sit outside the template tree and cannot contain the template. An existing Git repository is refused. `--force` allows an existing nonempty directory without Git; it can overwrite matching files, so an empty destination is the normal workflow.

The exporter copies the selected distribution, resets project records, initializes Git and makes an initial commit. It excludes template development epics, completed tasks, probes, regression fixtures and history. It records the source revision for later updates. There is no inherited template remote.

### 4. Enter the product and run setup

```bash
cd ../my-project
bash setup.sh
git remote -v
git status --short
bash scripts/os.sh doctor
```

Setup configures `.githooks`, checks the reviewed OS dependency source, installs the reviewed dependency set when needed, checks skills and renders the pages. Follow any reported failures before treating setup as complete. An empty `git remote -v` result is expected for a new export.

Open `guide.html` and `dashboard.html` from this product folder. They should describe a fresh project without the template's completed work. Some delivery information will be unknown until you agree the project scope. Generated HTML is recreated locally and should not be edited.

### 5. Start the agent and the first conversation

Open the **product folder** in your coding agent. Say: “Read AGENTS.md, start this project, and conduct discovery here. Research what you can; ask me for the decisions you need.” The agent starts a session and an interview:

```bash
bash scripts/os.sh start
bash scripts/os.sh interview start discovery
```

If a session is already running, do not start a second one. The interview command returns questions for the agent; it does not launch an interactive terminal form. Answer in chat. The agent saves your answers and asks you to confirm or correct its readback.

Discovery confirmation creates missing charter, decision-index and draft-roadmap files. Delivery and capabilities follow. The agent then proposes epics and task estimates, agrees the relevant epic kickoff and proceeds to implementation. See [Interviews](#10-interviews) and [Planning](#15-planning) for the full sequence.

### 6. Connect your own remote

Create an empty product repository in your Git host. From the product folder, inspect the initial branch and use `main` as the base for the default flow:

```bash
git branch --show-current
git branch -M main
git remote add origin YOUR_PRODUCT_URL
git switch -c codex/project-setup
```

Commit setup and planning changes on the feature branch after inspecting them. To publish the initial base when the remote is empty, upload the already-created scaffold commit through a feature-named remote branch, then rename that remote branch to `main` in your Git host. This avoids fighting the local trunk-push guard. For GitHub, rename the initial branch in the repository's branch settings before opening the setup PR.

```bash
git push origin main:refs/heads/codex/scaffold-base
```

After renaming the remote base to `main`, inspect the setup and planning changes on `codex/project-setup`. In this fresh product repository, stage the intended changes, inspect the staged diff and commit them before publishing the branch:

```bash
git status --short
git add -A
git diff --cached
git commit -m "Set up project and record initial decisions"
git push -u origin codex/project-setup
bash scripts/os.sh pr "Set up project and record initial decisions" --draft
```

If the remote already has an initial commit, reconcile its history deliberately before pushing. Do not force-push to replace it. Publishing can also wait until discovery is complete; the local OS works without a remote.

### Cloning an existing product is different

When another machine or collaborator clones a product that already contains the OS, run `bash setup.sh` in that clone, then ask the agent to resume its existing decisions and backlog. Do not scaffold over it or restart discovery merely because the checkout is new. Use [handoff and recovery](#25-agents) if a session journal travelled with the clone.
