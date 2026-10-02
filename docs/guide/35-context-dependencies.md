## Context, skills and dependencies

Use these workflows when the agent needs to find code, select specialist guidance or choose a dependency. Repository research comes before asking you for facts the agent can discover itself.

### Find relevant code without loading everything

```bash
bash scripts/os.sh map
bash scripts/os.sh locate session
bash scripts/os.sh context TASK-001 --budget 4000
```

`map` inventories paths, lexical imports and named functions/classes, with content hashes. `locate` searches paths and indexed symbols. It is not a full-text search; use `rg` for content. A task-specific context packet contains its contract and bounded file metadata selected from `files_allowed`. It references files for the agent to read, rather than copying the entire repository.

The budget is an estimate based on UTF-8 bytes divided by four, not the active model's tokenizer. The packet reports omitted entries. Large or unsupported syntax can be missed by the lexical map; it is not a semantic call graph. Graphify is an optional external experiment, not a bundled requirement. `os context` without a task prints the compact session briefing.

### Resolve and record a skill

```bash
bash scripts/os.sh skills for-task TASK-001
bash scripts/os.sh skills resolve writing-style
bash scripts/os.sh skills record writing-style \
  --task TASK-001 --reason "Write clear operator instructions"
bash scripts/skills.sh validate
```

Skills resolve first from `.agents/skills/NAME/SKILL.md`, then `pack-frontend/skills/NAME/SKILL.md`. Read the resolved file fully before applying it. A task reference or invocation receipt is not evidence that the skill's procedure actually ran; the agent must follow it and record relevant results.

For a new external skill, research its source, immutable revision, license and portable frontmatter before installation. Use the environment's approved skill installer. After it exists locally, `os skills pin NAME --source SOURCE_URL --revision IMMUTABLE_REF --license LICENSE_ID` records provenance; pinning itself downloads nothing.

### Plan a package or architecture choice

Ask: “Research compatible exact versions and show the tradeoffs before installing.” The agent applies `opensrc-research`, identifies exact candidate versions and creates a plan:

```bash
bash scripts/os.sh deps plan initial "Initial application stack" PACKAGE@EXACT_VERSION
bash scripts/os.sh deps plan add "Add the required capability" PACKAGE@EXACT_VERSION
bash scripts/os.sh deps plan architecture "Choose a data-access approach" PACKAGE@EXACT_VERSION
```

These are alternative examples: select the mode that matches the work. Replace package placeholders with real exact versions. The planning command fetches OpenSrc evidence and attempts package-manager dry-run resolution. It creates a file under `planning/dependencies/`; it does not approve or install the proposed product packages.

The agent reads the version-matched implementation and relevant official documentation, checks engines, peer ranges, migrations and runtime assumptions, and explains overlapping responsibilities. It completes the required plan sections and presents a concrete compatibility decision. Source access alone is not a dependency solver.

### Approve and install

Only the human approves the dependency plan's `status` and `human_approval` fields. The agent should explain this narrow requirement and show you the completed plan. It must not approve its own package choice.

```bash
bash scripts/os.sh deps check planning/dependencies/ACTUAL_PLAN.md
bash scripts/os.sh deps install planning/dependencies/ACTUAL_PLAN.md
```

The installer accepts approved exact npm sets and marks the plan installed. Architecture plans provide evidence but are not install plans. The agent then runs the product's relevant type, build and behavior checks and reports compatibility. The install precondition does not turn tests into a Git push gate.

`os deps baseline` checks the prescribed OS runtime evidence; setup already invokes it. `os deps path PACKAGE@EXACT_VERSION` locates fetched source. If network access or resolution fails, report the failure and retain the plan for correction rather than treating the package as reviewed.
