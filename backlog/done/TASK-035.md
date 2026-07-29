---
id: TASK-035
title: "Repo cleanup + vendor gsap / framer-motion / lottie skills"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-009
epic_ref: backlog/epics/EPIC-009-hero-redesign.md
slice: EPIC-009-SLICE-1
depends_on: []
design_refs: [10-design-system.md]
skill_refs: [design-taste-frontend]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: false
handoff_required: false
handoff_type: []
handoff_file: ""
protected_paths_touched: []
files_allowed:
  - .gitignore
  - .obsidian/workspace.json
  - .agents/skills/gsap/
  - .agents/skills/framer-motion/
  - .agents/skills/lottie/
  - .agents/skills/registry.md
  - .agents/skills/lock.json
  - "meeting on techlife.md"
  - "ui plans/Inspiration Sites.md"
  - planning/slices/EPIC-009-SLICE-1.md
  - planning/slices/EPIC-009-SLICE-2.md
  - backlog/tasks/TASK-035.md
  - backlog/tasks/TASK-036.md
  - backlog/tasks/TASK-037.md
progress_weight: 1
---

# Task: Repo cleanup + vendor animation skills

## Scope
- **Cleanup:** gitignore `.obsidian/workspace.json` (volatile per-machine Obsidian UI
  state that keeps re-appearing as modified) and `git rm --cached` it (the working file
  is kept). Keep the loose planning notes (`meeting on techlife.md`, modified
  `ui plans/Inspiration Sites.md`) — they are committed as-is.
- **Skills:** vendor the three animation capability packages named by the design
  system's motion lanes ([10-design-system.md](../../project-spine/10-design-system.md) §6),
  each as a folder under `.agents/skills/` with a root `SKILL.md` entry point + a
  `SOURCE.md` provenance file, and record method/src/pinned-commit in `lock.json` with
  `vendored` rows in `registry.md`:
  - `gsap` ← OFFICIAL `greensock/gsap-skills` (core, ScrollTrigger, timeline, React…).
  - `framer-motion` ← `C-Jeril/framer-motion-skills` (core, variants, gestures, scroll…).
  - `lottie` ← OFFICIAL `lottiefiles/motion-design-skill` (motion-design principles).

## Acceptance criteria
- [x] `.obsidian/workspace.json` is gitignored and untracked; the file still exists on disk.
- [x] `meeting on techlife.md` and `ui plans/Inspiration Sites.md` are committed (kept).
- [x] `.agents/skills/{gsap,framer-motion,lottie}/SKILL.md` exist and are non-empty;
      `bash scripts/skills.sh validate` passes (new skills present, only pre-existing
      stubs warn).
- [x] `registry.md` lists the three as `vendored`; `lock.json` pins each source + commit.
- [x] `npm run lint` and `npm run typecheck` pass.

## Notes
Low risk: no runtime code ships in this task. The vendored skill trees are read-only
reference for agents; `files_allowed` lists the three skill dirs as prefixes (the scope
gate prefix-matches), plus the slice/task planning files authored on this branch.
