---
id: TASK-010
title: "Base shadcn primitives — Button, Card, Input, Textarea, Label"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-002
slice: EPIC-002-SLICE-3
depends_on: [TASK-007]
design_refs: [10-design-system.md]
skill_refs: [design-taste-frontend, impeccable, shadcn-ui-builder]

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
handoff_file: handoffs/review/HANDOFF-REVIEW-TASK-010.md
protected_paths_touched: []
files_allowed:
  - src/components/ui/
  - package.json
  - package-lock.json
  - src/app/globals.css
---

# Task: Base shadcn primitives

> **Boundary vs the existing reference.** [`10-design-system.html`](../../project-spine/10-design-system.html)
> already demos the *elaborate §7 signature* button/card (magnetic pull, cursor-origin
> fill sweep, 3D tilt). Those are **out of scope here** — the design doc itself splits
> §7 "signature interactions = custom, per page" from §8 "primitives = shadcn." This
> task ships only the **plain base primitives** (§8), styled to the TASK-007 tokens.
> The later page epics port the §7 choreography on top of these + `motion.ts`. Reuse
> the reference's *token usage* (rose accent, hard corners, rose focus ring), not its
> demo JS.

## Scope
Vendor the base primitives from [10-design-system.md](../../project-spine/10-design-system.md)
§8 — `Button`, `Card`, `Input`, `Textarea`, `Label` — from the known shadcn source
(MIT), restyled to the TASK-007 tokens: hard corners (`rounded-none`), rose focus
ring, accent fills. No page usage; substrate only.

## Acceptance criteria
- [ ] `class-variance-authority` and `@radix-ui/react-slot` added to dependencies.
- [ ] `src/components/ui/button.tsx`: `cva` variants — `default` (`bg-rose
  text-background`), `secondary` (`bg-caramel text-background`), `outline`
  (`border-border text-ink`), `ghost`; sizes sm/default/lg; `asChild` via Radix Slot;
  `rounded-none`; focus `outline-2 outline-rose outline-offset-2`.
- [ ] `card.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx` present, token-styled,
  **no rounded corners**, using `bg-surface`/`border-border`/`text-ink`/`text-muted`.
- [ ] Every primitive uses `cn()` from `@/lib/utils` and forwards refs/props per the
  shadcn pattern; inputs carry the rose focus ring; icon-only usage supports
  `aria-label` (§10).
- [ ] No rounded corners anywhere (§3); no magenta; accents are fills, text on them is
  `background`.
- [ ] Components are RSC-safe: only `input`/`textarea`/`button`(asChild) mark
  `"use client"` if they need it; no `force-dynamic`.
- [ ] `npm run lint` and `npm run typecheck` pass; `npm run build` green + static.

## Notes
Medium risk: shared API surface every page composes; review via the review handoff.
Authoring from source (not `npx add`) keeps the diff inside `files_allowed` and the
rounding/token edits intentional.
