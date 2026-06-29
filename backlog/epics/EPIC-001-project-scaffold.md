---
id: EPIC-001
title: Project scaffold — Next.js 15, TypeScript, Tailwind v4, tooling
status: ready            # ready -> in-progress -> done
phase: 1
priority: P1
risk_level: medium
roadmap_ref: 09-roadmap.md#p1
depends_on: []
blocks: [EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, EPIC-009, EPIC-010]
references:
  - 06-project-technical-plan.md
  - 07-architecture-principles.md
related:
  - 09-roadmap.md
  - 10-design-system.md
  - 12-ui-element-map.md
---

# EPIC-001 — Project scaffold (Next.js 15 + tooling)

> Stand up the Next.js 15 application and every piece of build/quality tooling the
> rest of Phase 1 depends on — **without** inventing anything the later epics own.
> This epic produces an empty-but-correct skeleton: routes resolve, the build is
> static, the lint/typecheck gates run, and `shadcn add` works. No design tokens,
> no copy, no sections. EPIC-002 fills the design system; EPIC-003+ fill pages.

## Goal & non-goals

**Goal:** a developer can clone, `npm install`, `npm run dev`, and see all five
routes render; `npm run build` produces a fully static site; `npm run lint` and
`npm run typecheck` pass clean; the verify-task gate is green.

**Non-goals (owned elsewhere — do not do them here):**
- Design tokens / palette / fonts → **EPIC-002** ([10-design-system.md](../../project-spine/10-design-system.md) §2,4). This epic ships a *placeholder* Tailwind config only.
- Any page content, sections, or components beyond placeholders → EPIC-003–006.
- `lib/magazine.ts`, `lib/resend.ts`, `lib/r2.ts` real implementations → EPIC-007/008.
- Dockerfile / Dokploy / deploy → **EPIC-009** (and these are protected paths — see Risks).

## Architecture constraints this epic must honour

From [07-architecture-principles.md](../../project-spine/07-architecture-principles.md):
- **Static by default** (§1): pages default to `force-static`; no SSR, no `force-dynamic`.
- **No database** (§2): no `src/db/`, no ORM, no DB env var.
- **Tailwind only** (§5): tokens live in `tailwind.config.ts`, not scattered.
- **TS strict, no `any`** (§7): `tsconfig` strict; ESLint forbids `any`/`ts-ignore`.
- **Env for all config** (§8): secrets via env vars, documented schema, `.env.local` gitignored.

## Slices & tasks

> Each task below becomes a file in `backlog/tasks/TASK-0NN.md` with the frontmatter
> schema enforced by `scripts/validate-task.mjs` (required: `id, title, status,
> priority, risk_level, preferred_executor`; plus `files_allowed`, risk-proof
> booleans, `skill_refs`). The verify gate rejects any diff that escapes `files_allowed`.

### SLICE-1 — App bootstrap
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-001** | Scaffold Next.js 15 (App Router, TS strict, `src/`) at repo root; create the route-group skeleton `src/app/(site)/` with placeholder pages for `/`, `/about`, `/capabilities`, `/work`, `/work/[slug]`, `/contact`, a root `layout.tsx`, and an `api/contact/route.ts` stub returning `501`. `force-static` defaults. | `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `next-env.d.ts`, `.gitignore`, `src/`, `public/` | medium | typecheck |

### SLICE-2 — Styling & component infrastructure
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-002** | Install & wire **Tailwind CSS v4** (PostCSS, `globals.css` with `@import "tailwindcss"`, **placeholder** `tailwind.config.ts` — no brand token values). Prove Tailwind compiles. | `package.json`, `package-lock.json`, `postcss.config.mjs`, `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx` | low | typecheck + build smoke |
| **TASK-003** | **shadcn/ui init** only: `components.json`, `src/lib/utils.ts` (`cn`), path aliases. Add **no** components yet (EPIC-002 adds `Button` etc.). | `components.json`, `src/lib/utils.ts`, `tsconfig.json`, `package.json`, `package-lock.json`, `src/app/globals.css` | low | typecheck |

### SLICE-3 — Tooling, scripts & quality gates
| Task | Title | files_allowed (scope) | risk | proof |
|---|---|---|---|---|
| **TASK-004** | **ESLint** (`next/core-web-vitals` + `@typescript-eslint` strict, `no-explicit-any`) + **Prettier** + `prettier-plugin-tailwindcss`. Add npm scripts `dev/build/start/lint/typecheck/format`. Add `scripts/test/lint.sh` and `scripts/test/typecheck.sh` so `verify-task.sh proof()` runs them (it prefers `scripts/test/*.sh` over `npm run`). | `eslint.config.mjs`, `.prettierrc`, `.prettierignore`, `package.json`, `package-lock.json`, `scripts/test/lint.sh`, `scripts/test/typecheck.sh` | medium | lint + typecheck |
| **TASK-005** | Install Phase-1 runtime/motion deps (`framer-motion`, `gsap`, `lottie-react`) and document the env schema as **`env.example`** (deliberately no leading dot — see Risks). Optional typed `src/lib/env.ts` reader. | `package.json`, `package-lock.json`, `env.example`, `src/lib/env.ts` | low | typecheck |

### SLICE-4 — CI smoke (deferred / human-signed)
| Task | Title | scope | risk | note |
|---|---|---|---|---|
| **TASK-006** *(optional)* | CI workflow `.github/workflows/ci.yml`: install → lint → typecheck → build on PR to `dev`. | `.github/workflows/ci.yml` | medium | **PROTECTED PATH** — requires a human-signed CODEOWNER commit (`check-protected-files.sh`). Defer to **EPIC-009** unless the owner wants gating now and will sign. |

## Key decisions & risks

1. **One package.json at the repo root.** The Solo Dev OS spine already owns
   `package.json` (dep `yaml`, `type: commonjs`) and `node_modules`. Next.js merges
   into this same root manifest — **no app subdirectory**, matching the technical
   plan's `src/`-at-root structure. The OS `*.mjs` scripts keep working (explicit
   `.mjs` overrides `type`); `next.config.ts` and the strict `tsconfig` coexist.
2. **Route naming = `/capabilities`, not `/services`.** [11-content-strategy.md](../../project-spine/11-content-strategy.md) §3 is canonical; the `services/` path in
   [06-project-technical-plan.md](../../project-spine/06-project-technical-plan.md) §structure is stale. Reconcile the tech plan at the next spine pass.
3. **Package manager = npm.** A `package-lock.json` already exists and the verify
   gate falls back to `npm run`. The tech-plan's `pnpm` mention (§environments) is
   stale — flag it, don't follow it, unless the owner migrates the lockfile first.
4. **Protected paths are NOT agent-mergeable.** `check-protected-files.sh` blocks any
   diff touching `.github/workflows/`, `Dockerfile`, `docker-compose`, `.env*`,
   `src/db/`, `src/auth/`, `drizzle/` unless a **human CODEOWNER signs** the commit.
   - This is why CI (TASK-006) is split out and deferred.
   - The env doc file is named **`env.example`** (no leading dot) on purpose: the
     gate matches the substring `.env`, so `.env.example` would trip it. The real
     `.env.local` stays gitignored and human-managed.
5. **Tailwind v4 is config-light** (CSS-first `@theme`). This epic must not author
   brand token values — it ships a placeholder so the pipeline compiles; **EPIC-002**
   populates `@theme`/`tailwind.config.ts` from [10-design-system.md](../../project-spine/10-design-system.md) §2.
6. **React 19 / Tailwind v4 / shadcn compatibility.** Use the shadcn CLI version that
   supports Tailwind v4 + RSC; pin versions in TASK-003 and record them in the task.

## Definition of done (epic)

- [ ] All five routes + `/work/[slug]` render placeholders via `npm run dev`.
- [ ] `npm run build` succeeds and emits **static** output for every route (no SSR).
- [ ] `npm run lint` and `npm run typecheck` pass clean; `any`/`ts-ignore` rejected.
- [ ] `npx shadcn@latest add button` succeeds against the initialised config (smoke).
- [ ] `scripts/test/lint.sh` + `scripts/test/typecheck.sh` exist and the verify gate
      runs them for lint/typecheck-flagged tasks.
- [ ] No brand tokens, fonts, copy, or real `lib/*` clients introduced (deferred).
- [ ] `bash scripts/os.sh end backlog/tasks/TASK-00N.md` is green for every task.
