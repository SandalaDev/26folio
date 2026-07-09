---
id: EPIC-009-SLICE-1
title: Foundations — repo cleanup + animation skills
epic: EPIC-009
status: ready
phase: 4
risk_level: low
design_refs: [10-design-system.md]
skill_refs: [design-taste-frontend]
tasks: [TASK-035]
---

# SLICE-1 — Foundations

> Prepares the ground for the hero work: tidy the working tree so the epic diff is
> clean, and vendor the three animation skills the design system's motion system
> (§6) leans on — so later tasks can list them in `skill_refs` and the gate resolves
> them on disk.

## Intent
Advance EPIC-009 by removing repo noise and installing the vendored capability packages
for GSAP, Framer Motion, and Lottie — the "one library per job" set named in
[10-design-system.md](../../project-spine/10-design-system.md) §6.

## Scope / Non-goals
- **In:** gitignore `.obsidian/workspace.json` (volatile per-machine UI state) and
  untrack it; keep the loose planning notes (`meeting on techlife.md`, `ui plans/
  Inspiration Sites.md`); vendor `gsap`, `framer-motion`, `lottie` under
  `.agents/skills/` with `registry.md` + `lock.json` entries.
- **Out:** any hero/UI code (SLICE-2); authoring the pre-existing stub skills.

## Content and design
No public text, no visual output. Design lane: **design-taste-frontend** (nominal).

## Technical approach
- `.gitignore` += `.obsidian/workspace.json`; `git rm --cached` it (working file kept).
- Vendor skills by copying the official/dedicated upstream skill trees onto disk
  (`greensock/gsap-skills`, `C-Jeril/framer-motion-skills`,
  `lottiefiles/motion-design-skill`); each folder gets a root `SKILL.md` entry point
  and a `SOURCE.md` provenance file. Record method/src/commit in `lock.json`; add
  `vendored` rows to `registry.md`.

## Task map
| Task | Purpose | Risk | Required proof |
|---|---|---|---|
| [TASK-035](../../backlog/tasks/TASK-035.md) | Cleanup + vendor 3 animation skills | low | lint + typecheck |

## Gates
- [x] Spine references valid ([10](../../project-spine/10-design-system.md) approved).
- [x] Skills selected (design-taste-frontend; the vendored trio is the deliverable).
- [x] Test plan: lint/typecheck (no runtime code shipped in this slice).
- [x] Protected paths declared (none — `.gitignore`, `.agents/skills/`, notes).
