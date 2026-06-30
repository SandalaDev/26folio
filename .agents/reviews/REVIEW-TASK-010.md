---
id: REVIEW-TASK-010
type: review
status: consumed
reviewed_task: TASK-010 (EPIC-002 SLICE-3 — Base shadcn primitives: Button, Card, Input, Textarea, Label)
decision: approve-with-nits
reviewer:
  harness: zcode
  model: GLM-5.2
  role: reviewer
executor:
  harness: claude-code
  model: claude-opus-4-8
  role: executor
diff_base: dev (commit 593abec)
review_date: 2026-06-30
review_focus:
  - architecture conformance to the slice plan and 07-architecture-principles.md
  - correctness of risk-bearing behaviour (shared component API surface)
  - scope: every changed file is inside files_allowed
review_notes_path: .agents/reviews/REVIEW-TASK-010.md
---

# REVIEW — TASK-010 (Base shadcn primitives)

> Cross-model review per `.agents/skills/ds-reviewer` and Phase C of
> `OPERATING_MANUAL.md`. Reviewer family (GLM-5.2) differs from the executor
> family (claude-opus-4-8). The reviewer advises; the human merges.

## Verdict: **approve-with-nits**

Every acceptance criterion is met and verifiable. All five primitives are
token-styled, hard-cornered, ref-forwarding, RSC-safe, and compile into a fully
static build. Two non-blocking nits (one handoff-completeness, one shared with
TASK-007 about runtime verification). Safe to merge.

## Verified (re-run this session, not taken on trust)

| Proof | Command | Result |
|---|---|---|
| typecheck | `npx tsc --noEmit` | **pass** (exit 0) |
| lint | `npx eslint . --max-warnings 0` | **pass** (exit 0) |
| build-static-smoke | `npx next build` | **pass** — all page routes `○ Static`; only `/api/contact` `ƒ` (allowed) |

### Dependencies (acceptance criterion)

- `class-variance-authority: ^0.7.1` ✓ present
- `@radix-ui/react-slot: ^1.3.0` ✓ present
- `Label` deliberately uses a plain `<label>` (no `@radix-ui/react-label`) to
  stay at the two declared deps — documented inline, sound decision.

### Component conformance (read each source)

| Primitive | Token-styled | Hard corners | Ref forward | RSC-safe | Notes |
|---|---|---|---|---|---|
| `button.tsx` | ✓ `bg-rose text-background` etc. | `rounded-none` ✓ | ✓ `forwardRef` | ✓ (no `"use client"`; `asChild` via Slot) | cva variants match spec + bonus `link`/`icon` |
| `card.tsx` | ✓ `bg-surface border-border text-ink` | `rounded-none` ✓ | ✓ all 6 sub-parts | ✓ | uses `font-display` (TASK-008) — resolves |
| `input.tsx` | ✓ `bg-surface border-border text-ink` | `rounded-none` ✓ | ✓ | ✓ | global rose focus ring preserved (no `outline-none`) |
| `textarea.tsx` | ✓ matches input | `rounded-none` ✓ | ✓ | ✓ | mirrors input |
| `label.tsx` | ✓ `text-ink` + peer-disabled | n/a (label) | ✓ | ✓ | plain `<label>`, no extra dep |

Button variants vs acceptance criterion: `default (bg-rose text-background)`,
`secondary (bg-caramel text-background)`, `outline (border ... text-ink)`,
`ghost` — all present and correct, plus a harmless extra `link` variant. Sizes
sm/default/lg/icon — the `icon` size satisfies the "icon-only usage supports
aria-label" criterion (callers supply `aria-label`; the size exists).

### §3 / §10 guardrails (read against `07-architecture-principles.md`)

- **No rounded corners (§3):** every visual primitive has `rounded-none`, and the
  global `*,:after,:before{border-radius:0}` from TASK-007 is the backstop. No
  `rounded-*` utility appears in any primitive. ✓
- **Rose focus ring (§10):** no component sets `outline-none`, so the global
  `:focus-visible { outline: 2px solid var(--color-rose) }` applies to button and
  inputs. ✓
- **Accessibility (§10):** interactive elements are native `<button>`/`<input>`/
  `<textarea>`/`<label>` (accessible by default); `asChild` preserves the child's
  semantics; `icon` size + caller-supplied `aria-label` covers icon-only use. ✓
- **Tailwind only, no `style={{}}` (§5):** all styling via `cn()` + utility
  classes; zero inline styles. ✓

### Scope check (files_allowed)

The diff (commit `593abec`) touches exactly 7 files, all inside `files_allowed`
(`src/components/ui/`, `package.json`, `package-lock.json`):

- `src/components/ui/{button,card,input,textarea,label}.tsx` ✓
- `package.json` + `package-lock.json` (the two deps) ✓
- `src/app/globals.css` is in `files_allowed` but **not modified** — correct:
  primitives consume TASK-007's `@theme` tokens, no new tokens needed.

No scope escape. No page usage introduced (correctly deferred — "substrate only"
per slice non-goals).

## Findings

### [nit] F-1 — Handoff `verification:` block is empty (same as TASK-007)
- **Where:** `handoffs/review/HANDOFF-REVIEW-TASK-010.md:10-11`
- **Evidence:** reads `verification: (none declared)` despite the task requiring
  `lint + typecheck` (build smoke also run). This is the same `create-handoff.mjs`
  gap noted in REVIEW-TASK-007 F-1.
- **Concrete fix:** populate the `verification:` block when materialising review
  handoffs. No code change to TASK-010.
- **Severity:** process nit. I re-ran the proofs.

### [nit] F-2 — Primitives are unused, so the build proves compilation, not rendering
- **Where:** `src/components/ui/*` — no page imports them yet.
- **Evidence:** the build smoke is green + static, but since nothing imports the
  primitives, tree-shaking means they may not be exercised at runtime by this
  build. This is **expected and correct** for a "substrate only" task (slice
  non-goals: "no page usage"), so it is not a defect — just an honest statement
  of what the gate proves.
- **Concrete fix:** none required now. The first page epic (EPIC-003+) that
  composes these is where rendering/interaction gets proven. Worth a
  review-checklist item there: confirm focus ring, hover states, and `asChild`
  behaviour render as intended once a real consumer exists.
- **Severity:** nit. Inherent to the task's scope.

## What I verified vs. took on trust

**Verified directly:** typecheck, lint, full static build; both dependencies
present; every primitive's source against the acceptance criteria (variants,
sizes, tokens, hard corners, ref forwarding, RSC safety); §3/§5/§10
conformance; the diff against `files_allowed`.

**Took on trust:** runtime rendering/interaction behaviour (F-2 — no consumer
exists yet); the contrast of `text-background` on rose/caramel fills (the hexes
come from the approved TASK-007 tokens, whose contrast was the design phase's
responsibility).

## Next steps for the human

1. Clean foundation. Safe to merge TASK-010 into `dev` with TASK-007 — no rework
   loop needed.
2. Close F-1 as the same `create-handoff.mjs` process improvement noted in
   REVIEW-TASK-007.
3. When EPIC-003 composes these primitives, treat focus-ring/hover/`asChild`
   rendering as a real review item (F-2) — the substrate compiles, but its
   behaviour is first exercised by a page.
