---
id: TASK-018
title: "Shared pointer primitive — usePointer() + FlashlightCursor"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-004
epic_ref: backlog/epics/EPIC-004-about-page.md
slice: EPIC-004-SLICE-1
depends_on: []
design_refs: [12-ui-element-map.md, 10-design-system.md]
skill_refs: [design-taste-frontend, impeccable]

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
protected_paths_touched: []
files_allowed:
  - src/components/site/flashlight-cursor.tsx
  - src/lib/use-pointer.ts
  - backlog/tasks/TASK-018.md
progress_weight: 1
---

# Task: Shared pointer primitive

> **First consumer, generic hook.** [12-ui-element-map.md](../../project-spine/12-ui-element-map.md)
> §1 specs `usePointer()` as a single `mousemove` source shared by `Cursor` *and*
> `FlashlightCursor`. Only `FlashlightCursor` has a consumer yet (About's hybrid
> intro); the hook itself must stay generic so a later `Cursor` component can
> subscribe to the same source without changing this file.

## Scope
- `src/lib/use-pointer.ts`: `usePointer()` hook — one `mousemove` listener, returns
  `{ x, y }` (or `null` before first move / on non-fine pointers), SSR-safe (no
  `window` access at module scope), cleans up the listener on unmount.
- `src/components/site/flashlight-cursor.tsx`: `FlashlightCursor` — a fixed-position,
  pointer-events-none radial gradient (low-opacity rose/peach blend, per §3 accent
  rules) that follows `usePointer()`'s coordinates. Renders nothing on coarse
  pointers (`matchMedia('(pointer: coarse)')`) or under `prefers-reduced-motion`.

## Acceptance criteria
- [ ] `usePointer()` never touches `window` outside an effect; returns `null` until
  mounted/first move.
- [ ] `FlashlightCursor` never sets `outline: none` anywhere — it draws purely
  decoratively behind content (`pointer-events-none`, low `z-index` or `mix-blend`
  treatment that doesn't obscure text contrast).
- [ ] Disabled (renders `null`) on coarse pointers and reduced motion — checked once
  on mount, not re-evaluated per pixel move.
- [ ] No magenta; gradient uses only `--color-rose`/`--color-peach` at low opacity.
- [ ] `npm run lint` and `npm run typecheck` pass.

## Notes
Low risk: a decorative, disableable visual layer with no interactive surface of its
own. Reused later by `Cursor` once a page needs a general hover cursor — not built
preemptively here.
