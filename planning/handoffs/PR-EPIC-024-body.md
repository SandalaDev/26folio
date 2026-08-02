## EPIC-024 — Upgrade agentic system (OS machinery) from the upstream template without losing project memory

This PR pulls the current Agent OS machinery from `SandalaDev/agenticOS@main` into `26folio` using the built-in selective upgrader. Project memory is untouched; the portfolio application, the 23 historical epics, the 85 completed task records, and the spine files remain recoverable.

**Flow:** `feature/EPIC-024` → `dev` (trunk-dev).

**Diff size:** 31 files, +1206 / −215. The single upgrade commit is `ca7f8c9 chore: update OS machinery from template` (24 files, +776 / −196). The other 5 commits are planning artifacts (epic, four task files, closeout bookkeeping) and an end-of-session ledger line.

---

## Risk callouts (loud and obvious, per AGENTS.md caution list)

This PR touches OS machinery broadly. Reviewers should look at the four callouts below first.

### 1. Schema — `state.json` is rebuilt, not hand-edited

The render pass at TASK-092 self-healed two minor drift items (counts and the derived `current.epic`) that surfaced because bookkeeping between renders had drifted. This is the documented self-heal path. **Project memory files** (`state.json` aside from the render's own rewrite, `ledger.jsonl`, `decisions.md`, `backlog/`, `handoffs/`, `planning/`, `project-spine/`, `memory/`) are **NOT in the change set**. The selective upgrader's `MACHINERY=` allow-list explicitly excludes them.

### 2. Hooks — `core.hooksPath` re-wired, `pre-push` content unchanged

`git config core.hooksPath` is `.githooks` before, during, and after the upgrade. The `pre-push` hook content was not flagged in the dry-run diff (template's and project's are identical), so the hook's runtime behavior is unchanged. The pre-push hook's only job per AGENTS.md is to stop direct pushes to a trunk; it runs no quality checks.

### 3. Dependency pin — `yaml@2.9.0` preserved exactly

`package.json` was unchanged by the upgrade (the script's package.json merge is reviewed-merge only: it adds `yaml@2.9.0` if missing and refuses to overwrite a non-matching pin). The pin is in the lockfile too. The script's re-verify after the copy confirmed both `node scripts/deps.mjs baseline` (up to date) and `node -e "require('yaml')"` (yaml@2.9.0 installed).

### 4. New finding — self-overwrite wart in the upstream upgrader

The `scripts/update-from-template.sh` script overwrote itself mid-execution when its own `cp -r` for the `scripts/` directory landed on the running script. The shell then re-read from a buffer offset that no longer lined up with the new file, and aborted with `syntax error near unexpected token '('` at line 134. **All 5 directories and 5 file machinery paths had already been copied successfully** before the abort. The post-copy steps (hook re-wire, `deps.mjs baseline`, conditional `npm install`) were idempotent or already satisfied, so the abort caused no data loss. They were re-verified manually and all passed.

The fix is upstream: copy `scripts/update-from-template.sh` last, or re-`exec` a temp copy for the post-copy section. This is recorded as a remaining item in `project-state/completion.md` for filing against the template.

---

## The three caveats from the upgrading thread

The thread attached to this epic called out three caveats. Each is addressed below.

1. **No state migration needed.** Old ledger rows keep their token/cost fields; the new readers ignore them. The old `state.json` metrics block self-heals via the first render — confirmed in TASK-092's self-healing bookkeeping observation.
2. **`.gitignore` is deliberately not clobbered.** The script printed the expected note. The project version (55 lines, includes Next.js, debug, env, etc.) is preserved; the template's leaner version (25 lines, more Agent-OS-focused) was not merged. **Recommendation: keep the project's version.** No project-specific lines need to be carried over from the template at a glance.
3. **`docs/` is classified as machinery.** The only file that differed in the project under `docs/` was `docs/guide/60-under-the-hood.md` (template's content is an improvement). The project's `docs/dependencies/os-runtime.md` exists in both the project and the template and is byte-identical, so the overwriting copy is a no-op for content.

---

## What changed (high level)

**5 machinery directories (modified):** `scripts/`, `.githooks/`, `.agents/skills/`, `docs/`, `pack-frontend/`.

**5 machinery files (modified):** `AGENTS.md`, `OPERATING_MANUAL.md`, `README.md`, `setup.sh`, `.gitattributes`.

**3 new template files (added):** `scripts/effort.mjs`, `scripts/test/dashboard-wiring.test.mjs`, `scripts/test/effort.test.mjs`.

**Project-only files preserved by the script's `cp -r` (additive + overwriting, never deleting):** `scripts/spotify-authorize.mjs`, `scripts/read-usage.mjs`, `scripts/test/lint.sh`, `scripts/test/typecheck.sh`, `.agents/skills/framer-motion/`, `.agents/skills/gsap/`, `.agents/skills/lottie/`. All present post-upgrade.

**Planning artifacts (this PR only, not in the upgrade commit):** `backlog/epics/EPIC-024.md` (open → done), `backlog/done/TASK-089.md` through `TASK-092.md` (dry-run preview, apply, commit, validate), `planning/handoffs/TASK-089-dry-run.log` and `TASK-090-apply.log`, plus session bookkeeping in `project-state/{state.json,AGENT_LOG.md,ledger.jsonl}` and `project-state/completion.md`.

**Config files:** `package.json` unchanged (yaml@2.9.0 already pinned). `.gitignore` preserved (project version).

---

## Validation (TASK-092)

All green on `feature/EPIC-024`:

| Check | Result |
|---|---|
| `bash scripts/os.sh doctor` | `[doctor] ✓ healthy.` (all 11 subcommands, state.epics ↔ backlog/epics 23 epics, state.completion ↔ completion.md) |
| `bash scripts/os.sh check` | `state: consistent` |
| `bash scripts/os.sh render` | dashboard/guide/current-state/metrics regenerated |
| `node scripts/test/dashboard-wiring.test.mjs` | pass |
| `node scripts/test/effort.test.mjs` | pass |
| `node scripts/test/progress.test.mjs` | pass |
| `node scripts/test/rendered-artifacts.test.mjs` | pass |
| `npm run lint` | exit 0, no warnings |
| `npm run typecheck` | exit 0, strict TypeScript clean |
| `npm run build` | 13 static pages, bundle sizes unchanged from EPIC-023 baseline |

---

## How to roll back

Non-destructive by design. The branch has 6 commits on top of `origin/dev`. To roll back:

- `git reset --hard origin/dev` — discards the 6 commits and the working tree.
- `git revert <merge-commit>` after merge — preserves history.

Either way, no project memory is at risk; the upgrader's allow-list guarantee is verifiable from the diff: the only project-state/ change outside the session-bookkeeping entries is `state.json` being re-rendered to drop legacy token/cost metrics.
