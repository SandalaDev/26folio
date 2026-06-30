---
id: TASK-007
title: "Colour + base design tokens & global foundation"
status: ready
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-002
slice: EPIC-002-SLICE-1
depends_on: []
design_refs: [10-design-system.md]
skill_refs: [design-taste-frontend, impeccable]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: false
handoff_required: true
handoff_type:
  - review
handoff_file: handoffs/review/HANDOFF-REVIEW-TASK-007.md
protected_paths_touched: []
files_allowed:
  - src/app/globals.css
  - tailwind.config.ts
  - src/app/layout.tsx
---

# Task: Colour + base design tokens & global foundation

> **Port, don't re-derive.** Every token value already exists in
> [`10-design-system.html`](../../project-spine/10-design-system.html) `:root` (the
> `--background … --danger` vars) and its base rules (body bg/ink, `:focus-visible`
> ring, hard corners, eyebrow). This task only translates those CSS vars into the
> Tailwind v4 `@theme`. Values must match the reference exactly — a divergence is a bug.

## Scope
Encode the approved palette and global guardrails from
[10-design-system.md](../../project-spine/10-design-system.md) §2, §3, §10 as the
canonical Tailwind v4 token layer. Tokens live in a `@theme` block in `globals.css`
(epic decision 1); `tailwind.config.ts` stays a thin documented companion. Add the
global base layer in `@layer base`. No fonts, no components, no copy.

## Acceptance criteria
- [ ] `@theme` in `globals.css` defines every §2 token under stable names:
  - base: `background #1a1411`, `surface #241c18`, `surface-2 #2e2420`,
    `border #3a2e28`, `border-2 #4a3a32`
  - text: `ink #f8dfe7`, `muted #c9a6b0`, `soft #e9c8d3`
  - accents: `rose #ec8ca0`, `caramel #c99368`, `peach #f0a98a`
  - functional: `success #7fb89a`, `amber #e3b34e`, `danger #d65a4f`
- [ ] Utilities resolve in build: `bg-background`, `text-ink`, `text-muted`,
  `text-rose`, `bg-rose`, `border-border`, `bg-surface`.
- [ ] `@layer base`: `body` is `bg-background text-ink`; default `--radius: 0` /
  `border-radius: 0` on elements (§3 — no rounded corners); `::selection` uses a warm
  rose/peach wash, not browser blue.
- [ ] Focus ring: `:focus-visible` → `outline-2 outline-rose outline-offset-2` (§10).
- [ ] `tailwind.config.ts` documents that the v4 `@theme` block is canonical (decision
  1) and contains no conflicting hardcoded palette.
- [ ] No magenta, no harsh linear gradient, no pure black / cold navy (§3).
- [ ] `npm run lint` and `npm run typecheck` pass; `npm run build` is green + static.

## Notes
Medium risk because every later epic depends on these names being stable contracts
(§12). Cross-model review delivered via the review handoff (solo dev → reviewer: human).
