---
id: REVIEW-TASK-007
type: review
status: consumed
reviewed_task: TASK-007 (EPIC-002 SLICE-1 — Colour + base design tokens & global foundation)
decision: approve-with-nits
reviewer:
  harness: zcode
  model: GLM-5.2
  role: reviewer
executor:
  harness: claude-code
  model: claude-opus-4-8
  role: executor
diff_base: dev (commit 561d042)
review_date: 2026-06-30
review_focus:
  - architecture conformance to the slice plan and 07-architecture-principles.md
  - correctness of risk-bearing behaviour (token values as stable contracts)
  - scope: every changed file is inside files_allowed
review_notes_path: .agents/reviews/REVIEW-TASK-007.md
---

# REVIEW — TASK-007 (Colour + base design tokens & global foundation)

> Cross-model review per `.agents/skills/ds-reviewer` and Phase C of
> `OPERATING_MANUAL.md`. Reviewer family (GLM-5.2) differs from the executor
> family (claude-opus-4-8). The reviewer advises; the human merges.

## Verdict: **approve-with-nits**

Every acceptance criterion is met and verifiable. The load-bearing claim — token
values matching `10-design-system.html` `:root` exactly — holds field-for-field.
All declared proofs re-run green. One handoff-completeness nit; one optional
fidelity observation. Neither blocks merge.

## Verified (re-run this session, not taken on trust)

| Proof | Command | Result |
|---|---|---|
| typecheck | `npx tsc --noEmit` | **pass** (exit 0) |
| lint | `npx eslint . --max-warnings 0` | **pass** (exit 0, after the eslint ignore fix) |
| build-static-smoke | `npx next build` | **pass** — all page routes `○ Static`; only `/api/contact` `ƒ` (allowed) |

### Token fidelity — the risk-bearing claim (§12 / task header)

The task states "values must match the reference exactly — a divergence is a
bug." I diffed every `@theme` token in `src/app/globals.css` against the `:root`
block of `project-spine/10-design-system.html:24-45`. **All 13 colour tokens are
identical**, character for character:

| Token | `@theme` (globals.css) | Reference (`:root`) | Match |
|---|---|---|---|
| background | `#1a1411` | `#1a1411` | ✓ |
| surface | `#241c18` | `#241c18` | ✓ |
| surface-2 | `#2e2420` | `#2e2420` | ✓ |
| border | `#3a2e28` | `#3a2e28` | ✓ |
| border-2 | `#4a3a32` | `#4a3a32` | ✓ |
| ink | `#f8dfe7` | `#f8dfe7` | ✓ |
| muted | `#c9a6b0` | `#c9a6b0` | ✓ |
| soft | `#e9c8d3` | `#e9c8d3` | ✓ |
| rose | `#ec8ca0` | `#ec8ca0` | ✓ |
| caramel | `#c99368` | `#c99368` | ✓ |
| peach | `#f0a98a` | `#f0a98a` | ✓ |
| success | `#7fb89a` | `#7fb89a` | ✓ |
| amber | `#e3b34e` | `#e3b34e` | ✓ |
| danger | `#d65a4f` | `#d65a4f` | ✓ |

### Utilities + base rules actually ship in the built CSS

I inspected `.next/static/css/f43876e6548cd52a.css` (not just the source) to
confirm the utilities generate and the §3/§10 base rules survive the build:

- `--color-background:#1a1411` (and the other 12) emitted as CSS custom properties ✓
- `.bg-background { background-color: var(--color-background) }` ✓
- `.text-ink { color: var(--color-ink) }` ✓
- `body { background-color: var(--color-background); color: var(--color-ink) }` (§3 base) ✓
- `*,:after,:before { border-radius: 0 }` (§3 — no rounded corners default) ✓
- `:focus-visible { outline: 2px solid var(--color-rose); outline-offset: 2px }` (§10) ✓
- `::selection { background-color: #ec8ca047 }` — rose at 28% alpha (`0x47` ≈ 28%), warm wash not browser blue (§3) ✓
- `--radius: 0px` token emitted; the only non-zero `border-radius` is
  `border-radius: var(--radius)` on `.rounded-*` utilities, which therefore also
  default to 0 unless overridden. Guardrail is correctly in effect.

### Scope check (files_allowed)

The diff (commit `561d042`) touches exactly 5 files, all inside `files_allowed`:

- `src/app/globals.css` ✓ (`@theme` + `@layer base`)
- `tailwind.config.ts` ✓ (documented as thin companion — declares no palette)
- `src/app/layout.tsx` ✓ (body wired to `bg-background text-ink`)
- `eslint.config.mjs` ✓ (the lint-ignore fix — see nit F-2)
- `backlog/tasks/TASK-007.md` → `backlog/done/TASK-007.md` (task close, not in
  `files_allowed` but task closure moves are managed by `os.sh end`, not the
  gate's scope check)

No scope escape. No fonts, components, or copy introduced (correctly deferred —
SLICE-2/3).

## Findings

### [nit] F-1 — Handoff `verification:` block is empty
- **Where:** `handoffs/review/HANDOFF-REVIEW-TASK-007.md:10-11`
- **Evidence:** the block reads `verification: (none declared)`, yet the task
  frontmatter requires `lint: true, typecheck: true` and the commit message
  asserts both pass plus a green static build. The reviewer is meant to
  spot-check declared verification against reality (which I did — they pass),
  but the handoff gave nothing to reconcile against.
- **Concrete fix:** when creating review handoffs (`os.sh end` →
  `create-handoff.mjs`), populate the `verification:` block from the task's
  `verification_required` + the actual proof results, mirroring the older
  `HANDOFF-REVIEW` examples in `OPERATING_MANUAL.md` (Handoff Layer). No code
  change to TASK-007 itself.
- **Severity:** process nit. Doesn't affect this merge — I re-ran the proofs.

### [nit] F-2 — ESLint ignore expansion: justified, document the precedent
- **Where:** `eslint.config.mjs:11-13` (commit `561d042`)
- **Evidence:** the `ignores` array gained `.next/`, `out/`, `build/`, `dist/`,
  `node_modules/`, `next-env.d.ts`. The task header documents this as a
  "Discovered fix (in scope as foundation)" — `next/core-web-vitals` flat config
  does not inherit the legacy ignore list, so lint errored on build output and
  the gate could only pass via `--no-verify`. The fix is correct and the
  reasoning is sound; flat-config genuinely needs these declared.
- **Concrete fix:** none required. Worth noting only because it is a TASK-004
  (EPIC-001) tooling gap being patched inside a design-system task. It is in
  `files_allowed`, so it is not a scope escape — but the same ignore list should
  be back-ported awareness for any future EPIC-001 tooling audit.
- **Severity:** nit. The change itself is right.

## Architecture-principle conformance (`07-architecture-principles.md`)

| § | Principle | Result |
|---|---|---|
| 5 | Tailwind only — no arbitrary inline styles | ✓ tokens in `@theme`; `layout.tsx` uses utility classes, no `style={{}}` |
| 7 | TS strict, no `any` | ✓ n/a for CSS, but no `ts-ignore` introduced; lint clean |
| 10 | Accessibility non-negotiable | ✓ `:focus-visible` ring (2px rose, offset 2) on every interactive element per §10 |

(§1 static, §2 no DB, §3 animation, etc. not exercised by a pure-token task.)

## What I verified vs. took on trust

**Verified directly:** typecheck, lint, full static build; every token value
against the `:root` reference; the emitted built CSS for utilities + base rules
+ radius guardrail + focus ring + selection wash; the full diff against
`files_allowed`; the slice/epic conformance.

**Took on trust:** the WCAG contrast claims in the token comments (e.g. "ink
~13:1 AAA on background") — I did not recompute ratios, but the hex values match
the approved design system, whose contrast was the design phase's
responsibility, not this porting task's.

## Next steps for the human

1. This is a clean foundation. Safe to merge `feature/EPIC-002` TASK-007 into
   `dev` once you're satisfied — no rework loop needed.
2. Close F-1 as a process improvement for `create-handoff.mjs` (populate the
   `verification:` block), not a TASK-007 fix.
3. The tokens are now stable contracts (§12). Later epics (TASK-008 type scale,
   SLICE-3 components) must reference `bg-background` / `text-ink` / `text-rose`
   etc., never hex literals — the gate doesn't enforce that yet, so it's a
   review-checklist item going forward.
