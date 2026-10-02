## Update an existing project

Use this workflow for a product repository that already contains Agent OS. The updater delivers OS machinery from a selected template revision while preserving project records. It does not merge the template's development history into your product.

### 1. Prepare the source and destination

Choose a reviewed template tag or full commit hash. It must exist in the source's committed history. A local source checkout's uncommitted changes are excluded, just as they are during scaffolding.

Keep the product's existing work committed or otherwise safely saved so the update diff can be reviewed and reverted separately. End other active agent sessions before replacing their runtime scripts. From the **product directory**:

```bash
cd /c/_git/existing-project
git status --short
git switch -c codex/update-agent-os
```

Use the updater from the **new template checkout**, especially on the first upgrade of an old product. The old product's own updater may still implement the earlier overwrite behavior.

### 2. Preview the update

```bash
bash ../projectStart/scripts/update-from-template.sh \
  --from ../projectStart --ref YOUR_RELEASE_TAG --dry-run
```

The working directory is the target product. `--from` points to the source template; it can be a local Git checkout or Git URL. The command clones that source into temporary storage, resolves the requested commit and prints per-file actions. A remote source requires network access. `--dry-run` writes no product files and installs no packages.

<table><thead><tr><th>Action</th><th>Meaning</th></tr></thead><tbody><tr><td><code>unchanged</code></td><td>The file already matches the incoming template.</td></tr><tr><td><code>add</code></td><td>The incoming machinery file is missing locally and will be added.</td></tr><tr><td><code>update</code></td><td>The local file still matches its recorded template baseline and can be replaced.</td></tr><tr><td><code>retire</code></td><td>The file was owned by the previous template, remains unmodified and no longer ships.</td></tr><tr><td><code>preserve-customized</code></td><td>The local file differs or its ownership baseline is unknown; it is left for reconciliation.</td></tr></tbody></table>

### 3. Resolve prerequisites and customized files

The current updater requires `dependencies.yaml` to be exactly `2.9.0` in the product package manifest before any writes. If that check fails, use the dependency compatibility workflow to align it deliberately. The updater does not merge or install `package.json` or its lockfile, and also leaves `.gitignore` and `.gitattributes` alone. Review any relevant upstream changes to those files yourself.

State, spine, planning, backlog, memory and handoffs are preserved. Modified README, guide or skill files are also preserved. **Preserved does not mean compatible:** the agent must compare affected custom machinery against the selected source and integrate required changes. Do not blindly replace your project rules to make the dry run shorter.

The updater uses the latest distribution receipt, or a recoverable previous template revision, as its baseline. Older manually cloned projects may have neither. They conservatively preserve differing files and often require one deliberate reconciliation pass. The tool does not guess that old content is safe to delete just because it looks obsolete.

### 4. Apply and inspect

Use the same source and immutable ref, without `--dry-run`:

```bash
bash ../projectStart/scripts/update-from-template.sh \
  --from ../projectStart --ref YOUR_RELEASE_TAG

git diff --stat
git diff
git status --short
```

The updater rechecks files before writing, applies safe replacements and retirements, and appends a receipt to `project-state/distribution-receipts.jsonl`. It retains the core/frontend profile from prior distribution evidence. It is not a profile-switch command or an application dependency updater.

Reconcile preserved custom files with the selected source. Do not manually alter ownership hashes to force a later overwrite. Files that continue to differ may continue to be reported as customized; the receipt cannot decide whether your manual merge is semantically correct.

### 5. Refresh, verify and commit

After reconciliation, start the updated OS session if needed and run:

```bash
bash scripts/os.sh refresh
bash scripts/os.sh doctor
bash scripts/skills.sh validate
bash scripts/os.sh check
```

Run the product's relevant tests, inspect the dashboard and guide, then commit the update on the feature branch and open a PR. Refresh regenerates views; it does not silently repair incompatible custom code. Review both tracked and newly added files, since `git diff` alone omits untracked file contents.

If a filesystem write fails midway, the update may be partial. Keep the error, inspect Git status and reconcile or restore only the affected files from the saved pre-update revision. Do not reset unrelated work. A distribution receipt is provenance, not a backup.

### 6. Migrate project records separately when needed

An OS machinery update does not automatically migrate old project records. Inspect the available migrations:

```bash
bash scripts/os.sh migrate inspect
bash scripts/os.sh migrate plan --write
```

Review the printed plan path, declared transforms, unresolved human decisions and rollback notes. If no module matches, there is nothing to apply. If the plan is appropriate, use its actual filename:

```bash
bash scripts/os.sh migrate apply planning/migrations/ACTUAL_PLAN.json
bash scripts/os.sh migrate verify
bash scripts/os.sh refresh
```

Migrations record receipts and verify their transforms. They do not invent missing intent, dates, weights or approval. Optional task-history materialization requires `migrate plan --materialize-history --write`; it is not a mandatory cleanup step. Inspect the plan before opting into additional historical files.

### Enable the new interview workflow in an older project

Starting discovery enables workflow version 2. Have the agent research and import the project's real prior decisions into that conversation, confirm the readback, then complete delivery and capabilities. Existing charter and roadmap files are preserved and need reconciliation, not replacement with guessed defaults. Do not change the workflow version by hand to suggest interviews occurred.

### Adopt the OS in a repository that has never used it

The updater expects an existing `project-state/state.json` and compatible package manifest. It is not an automatic adoption tool for arbitrary repositories. Ask the agent to prepare an adoption branch: export a clean seed into a separate empty directory, compare files, integrate the required machinery and initial records, reconcile package compatibility, then run discovery against the existing product. Do not use scaffolding with `--force` over an existing Git repository.
