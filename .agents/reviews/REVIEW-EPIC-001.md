---
id: REVIEW-EPIC-001
type: review
status: consumed
reviewed_task: EPIC-001 (TASK-001..005)
decision: approve-with-nits
reviewer:
  harness: zcode
  model: GLM-5.2
  role: reviewer
executor:
  harness: claude-code
  model: claude-opus-4-8
  role: executor
diff_base: dev (commits d9837ce..f9899ab, merged via PR #1 and PR #2)
review_date: 2026-06-30
---

# REVIEW — EPIC-001 (Project scaffold: TASK-001..005)

> Cross-model diff review per `.agents/skills/ds-reviewer` and Phase C of
> `OPERATING_MANUAL.md` (§ Verify: Cross-Model Review). Reviewer family (GLM-5.2) differs
> from the executor family (claude-opus-4-8) — the cross-family requirement is
> satisfied. The reviewer advises; the human merges.

## Process note (read first)

No `handoffs/review/HANDOFF-REVIEW-TASK-XXX.md` existed in the queue at review
time (`STATE.handoff_queue: []`, `HANDOFF_QUEUE.md` empty). The ds-reviewer
precondition normally says "stop and report" when no review handoff exists.
This review was launched by direct human instruction naming the real task IDs
(TASK-001..005) against the merged `dev` diff, so `review_focus` was derived
from the task files themselves rather than a queued handoff. The degraded
"reviewer: human → agent-assisted" path in OPERATING_MANUAL.md (Verify: Review) is
explicitly allowed. **Gap to close for future tasks:** the executor's
`os.sh end` did not write a `HANDOFF-REVIEW` for EPIC-001, so Phase C had no
artefact to point at until the human improvised one. Not a code defect; a
workflow drift worth tracking.

## Verdict: **approve-with-nits**

Every acceptance criterion in all five task files is met and verifiable. All
declared proofs re-run green in this session (see Verified below). Two
comment-only nits in `env.example`; neither blocks merge.

## Verified (re-run this session, not taken on trust)

| Proof | Command | Result |
|---|---|---|
| typecheck | `npx tsc --noEmit` | **pass** (exit 0, no output) |
| lint | `npx eslint . --max-warnings 0` | **pass** (exit 0, no output) |
| build-static-smoke | `npx next build` | **pass** — see route table below |

### Build route table (the load-bearing proof for TASK-001)

```
┌ ○ /                            142 B   103 kB
├ ○ /_not-found                  993 B   103 kB
├ ○ /about                       142 B   103 kB
├ ƒ /api/contact                 142 B   103 kB   ← dynamic, allowed by task
├ ○ /capabilities                142 B   103 kB
├ ○ /contact                     142 B   103 kB
├ ○ /work                        142 B   103 kB
└ ○ /work/[slug]                 142 B   103 kB   ← static (○), not ƒ
```

Every page route is `○ (Static)` per `07-architecture-principles.md` §1. Only
`/api/contact` is `ƒ (Dynamic)`, which TASK-001 explicitly permits (it is an
API handler stub, not a page). `/work/[slug]` is correctly static via
`generateStaticParams → []` + `dynamicParams = false`.

## Findings

### [nit] F-1 — `env.example` cross-references wrong epics
- **Where:** `env.example:1` and `env.example:4`
- **Evidence:** line 1 says `# Resend … (EPIC-007)`, line 4 says
  `# Cloudflare R2 … (EPIC-008)`. The roadmap
  (`project-spine/09-roadmap.md` P1 table) maps **EPIC-007 = Magazine
  integration (`lib/magazine.ts`)** and **EPIC-008 = Contact: form + Resend
  integration**. So Resend belongs to EPIC-008, not EPIC-007. R2 is a
  Phase-1-wide media store ("media is R2", roadmap §Phase 1), not owned by
  EPIC-008.
- **Concrete fix:**
  ```
  # Resend — transactional email for the contact form (EPIC-008)
  ...
  # Cloudflare R2 — media/asset storage (Phase 1; referenced across EPIC-002/004/005)
  ```
- **Severity:** comment-only; no functional impact. Tracked because the review
  mandate is conformance to the spine, and a wrong epic tag will mislead the
  next agent that reads it.

### [nit] F-2 — `env.ts` returns empty string for missing secrets (intentional, document it)
- **Where:** `src/lib/env.ts:2-7`
- **Evidence:** each accessor is `process.env.X ?? ""`. TASK-005 acceptance
  says "plain accessors, **no throw**" — so silent empty-string is correct by
  spec. Flagging only because `07-architecture-principles.md` §8 implies
  secrets are real, and a future caller that trusts `env.RESEND_API_KEY` to be
  non-empty will fail confusingly in EPIC-008.
- **Concrete fix:** none required now (matches task spec). When EPIC-008
  consumes this, add a runtime guard at the call site (e.g. throw inside the
  Resend client constructor, not in `env.ts`). No action for this epic.

## Scope check (files_allowed)

Every source/config file touched by EPIC-001 is inside the union of the five
tasks' `files_allowed`. No scope escape detected:

- `src/app/**` (layout, route group, 6 pages, api stub) → TASK-001 ✓
- `next.config.ts`, `tsconfig.json`, `package.json`, `.gitignore` → TASK-001 ✓
- `postcss.config.mjs`, `tailwind.config.ts`, `src/app/globals.css`,
  `src/app/layout.tsx` → TASK-002 ✓
- `components.json`, `src/lib/utils.ts` → TASK-003 ✓
- `eslint.config.mjs`, `.prettierrc`, `.prettierignore`, `scripts/test/lint.sh`,
  `scripts/test/typecheck.sh` → TASK-004 ✓
- `env.example`, `src/lib/env.ts` → TASK-005 ✓

**Non-goals honoured** (TASK-001/002 explicitly forbid brand tokens, copy,
real lib clients):
- `tailwind.config.ts` ships `export default {} satisfies Config` — no tokens. ✓
- `globals.css` is exactly `@import "tailwindcss";` — no `@theme`, no brand. ✓
- `src/app/layout.tsx` carries no `next/font/google` (correctly deferred to
  EPIC-002 per the inline comment + design-system §4). ✓
- Pages render `<h1>` placeholders only — no shippable copy, so `public_text`
  / stop-slop does not apply this epic. ✓

## Architecture-principle conformance (`07-architecture-principles.md`)

| § | Principle | Result |
|---|---|---|
| 1 | Static by default | ✓ all pages `force-static`; build table confirms |
| 2 | No database | ✓ no `src/db/`, no ORM, no DB env var |
| 5 | Tailwind only | ✓ no inline styles; tokens centralised in (empty) config |
| 7 | TS strict, no `any` | ✓ `"strict": true`; `no-explicit-any: error`; lint clean |
| 8 | Env for all secrets | ✓ documented in `env.example`; no hardcoded keys |

(§3/4 animation, §6 composition, §9 perf, §10 a11y are not exercised by this
scaffold epic — they apply from EPIC-002/003 onward.)

## What I verified vs. took on trust

**Verified directly this session:** typecheck, lint, full static build + route
table, every source/config file's contents against its task acceptance
criteria, files_allowed scope, architecture-principle conformance, epic
mapping in the roadmap.

**Took on trust:** `npm install` cleanliness (lockfile present, not audited);
the OS spine scripts (`os.sh`, `verify-task.sh`, etc.) — out of scope for
EPIC-001's code review; `npx shadcn@latest add button` smoke (definition-of-
done item) was not re-run, but `components.json` + `cn` + path aliases are
correctly wired so it is expected to succeed.

## Next steps for the human

1. This epic is already merged to `dev` (PR #1 + #2). No rework loop needed —
   nits are non-blocking and can be folded into EPIC-002's first task or fixed
   standalone with a trivial `chore` commit (F-1 is a 2-line comment edit).
2. Close the workflow gap: ensure future `os.sh end` runs emit a
   `HANDOFF-REVIEW` so Phase C has its prescribed artefact.
3. TASK-006 (CI) remains deferred as a protected path awaiting a human
   CODEOWNER-signed commit — unchanged by this review.
