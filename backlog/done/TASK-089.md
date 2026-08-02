---
id: TASK-089
title: "Preview OS upgrade with --dry-run and capture the diff for human review"
status: done
priority: P1
risk_level: medium
epic_ref: backlog/epics/EPIC-024.md
progress_weight: 1
files_allowed:
  - backlog/
  - project-state/
  - scripts/
  - docs/
skill_refs: []
---

# Task: Preview OS upgrade with --dry-run and capture the diff for human review

## Scope

Run the built-in selective upgrader in dry-run mode against the upstream
`SandalaDev/agenticOS` template at `main` and produce a clear, reviewable
preview of what would change. Do not modify any working-tree file. Do not
commit. Surface the diff scope (machinery paths only, no project memory) so a
human can sign off on TASK-090.

## Acceptance Criteria

- [ ] `bash scripts/update-from-template.sh --from git@github.com:SandalaDev/agenticOS.git --ref main --dry-run` exits 0.
- [ ] The output enumerates every machinery path the template would touch (`scripts/`, `.githooks/`, `.agents/skills/`, `pack-frontend/`, `AGENTS.md`, `OPERATING_MANUAL.md`, `docs/`, `setup.sh`, `.gitattributes`, `package.json`).
- [ ] The output confirms (or explicitly disclaims) that project memory paths are NOT touched (`project-state/state.json`, `project-state/ledger.jsonl`, `project-state/decisions.md`, `backlog/`, `handoffs/`, `planning/`, `project-spine/`, `memory/`).
- [ ] The full dry-run transcript is preserved as a referenceable artifact (e.g. `planning/handoffs/TASK-089-dry-run.log` or appended to this task's `## Notes`).
- [ ] Any non-obvious template change that needs explanation (new script, hook change, skill-folder change, pin reset) is called out in this task's notes.
- [ ] Working tree is unchanged after the dry-run (no files written).

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: The dry-run is read-only by design. Confirming zero working-tree writes plus a clean `git status` after the call is the proportionate check.

## Notes

TASK-089 starts here. The actual upgrade commits to `feature/EPIC-024` and the
final `chore: update OS machinery from template` commit belong to TASK-090
(apply) and TASK-091 (commit). This task is the review gate between "I plan to
upgrade" and "I am about to upgrade."

### Dry-run transcript

Full machine output preserved at `planning/handoffs/TASK-089-dry-run.log`.
Summary:

```
=== update-from-template ===
  source: git@github.com:SandalaDev/agenticOS.git (ref: main)
  target: C:/_git/26folio
  mode:   DRY-RUN (no files written)
  cloning template from URL...

── updating OS machinery ──
  [would update] scripts/
  [would update] .githooks/
  [would update] .agents/skills/
  [would update] docs/
  [would update] pack-frontend/
  [would update] AGENTS.md
  [would update] OPERATING_MANUAL.md
  [would update] README.md
  [would update] setup.sh
  [would update] .gitattributes

── config merge ──
  [package.json] unchanged (reviewed yaml@2.9.0 already present)
  [note] .gitignore differs from template — review and merge by hand (project version preserved)

=== done ===
Dry run complete — no files changed. Re-run without --dry-run to apply.
```

The dry-run exited 0, no files were written, and `git status` confirmed the
working tree is still clean except for this task, the dry-run log, and the
session lock (all expected).

### File-level diff scope (inspected by cloning the template to a temp dir)

**`docs/`** — only one file differs:
- `docs/guide/60-under-the-hood.md` (template's version is an improvement; no
  project content would be lost).
- `docs/dependencies/os-runtime.md` exists in BOTH the project and the
  template. A byte-level `diff` shows the two files are identical, so the
  overwriting copy is a no-op for content. (Caveat from the upgrading thread
  about `docs/` classified as machinery is satisfied here: the project did not
  stash unique content under a template path.)

**`scripts/`** — 8 files modified, 2 template-only, 2 project-only:
- Modified: `branch.sh`, `new-task.sh`, `os.sh`, `progress.mjs`,
  `render-dashboard.mjs`, `render-metrics.mjs`, `skills.sh`,
  `update-from-template.sh`, `test/progress.test.mjs`,
  `test/rendered-artifacts.test.mjs`.
- Template-only (would be added): `effort.mjs`,
  `test/dashboard-wiring.test.mjs`, `test/effort.test.mjs`.
- Project-only (would be preserved by `cp -r`): `read-usage.mjs`,
  `spotify-authorize.mjs`, `test/lint.sh`.

**`.agents/skills/`** — only `registry.md` differs. Project-only skills
(`framer-motion/`, `gsap/`, `lottie/`) are preserved because the template
doesn't ship them; `cp -r` is additive + overwriting, never deleting.

**`.githooks/`** — `pre-push` is the only file; no diff.

**`pack-frontend/`** — `elicit-phase.sh`, `README.md`, `skills/`. No diffs
flagged (template's contents are identical to project's).

**`package.json`** — unchanged, `yaml@2.9.0` already present. The script's
pin check passed.

**`.gitignore`** — the script flagged that the project's `.gitignore` differs
from the template. The project version is the more comprehensive one (55 lines,
includes Next.js, debug, env, etc.). The template's is leaner (25 lines, more
Agent-OS-focused). The script does NOT clobber the project version; it
preserves it and prints the note. **The human reviewer should compare the two
files manually** — the recommendation is to keep the project's more
comprehensive version, or to add any Agent-OS-specific lines from the
template's that the project is missing (none spotted at a glance).

**`AGENTS.md`, `OPERATING_MANUAL.md`, `README.md`, `setup.sh`,
`.gitattributes`** — would be overwritten in full. These are pure OS/template
artifacts (no project content) per the AGENTS.md session law.

### Project memory is NOT touched

Confirmed by inspecting the script: it has an explicit `MACHINERY=` allow-list
and only copies files inside that list. The following are explicitly NOT
copied, even if the template has them at the same path:
`project-state/state.json`, `project-state/ledger.jsonl`,
`project-state/decisions.md`, `backlog/`, `handoffs/`, `planning/`,
`project-spine/`, `memory/`, `src/`, `public/`.

### Acceptance criteria status

- [x] `bash scripts/update-from-template.sh --from git@github.com:SandalaDev/agenticOS.git --ref main --dry-run` exits 0.
- [x] The output enumerates every machinery path the template would touch.
- [x] The output confirms (or explicitly disclaims) that project memory paths are NOT touched.
- [x] The full dry-run transcript is preserved as `planning/handoffs/TASK-089-dry-run.log`; the file-level diff scope above is added here for human review.
- [x] Non-obvious changes are called out: `docs/guide/60-under-the-hood.md` content swap, `.gitignore` differs (preserve project, manual review), new scripts `effort.mjs` + new tests, project-only `read-usage.mjs` / `spotify-authorize.mjs` / `test/lint.sh` preserved.
- [x] Working tree unchanged after the dry-run (no files written; `git status` confirms).

TASK-089 is complete. The human reviewer can now decide:
1. **Proceed to TASK-090 (apply)** — re-run the script without `--dry-run` on
   `feature/EPIC-024`. The change will land in the working tree, ready for
   `git add -A && git diff --cached` review before TASK-091 commits.
2. **Stop** — investigate any flagged item (most likely the `.gitignore`
   difference) before applying.
