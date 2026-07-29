---
id: TASK-001
title: Scaffold Next.js 15 (App Router, TS strict) + route skeleton
status: done                 # ready -> in-progress -> done (file lives in backlog/done/)
priority: P1
risk_level: medium
preferred_executor: claude-code
epic: EPIC-001
epic_ref: backlog/epics/EPIC-001-project-scaffold.md
slice: EPIC-001-SLICE-1
skill_refs: [nextjs-app-router]
verification_required: [typecheck, build-static-smoke]
# verify-task.sh reads these booleans for risk-matched proof:
typecheck: true
lint: false                  # ESLint config is TASK-004; do not add it here
unit: false
integration: false
e2e: false
accessibility: false
public_text: false           # placeholder pages carry no shippable copy
handoff_required: false
files_allowed:
  - package.json
  - package-lock.json
  - next.config.ts
  - tsconfig.json
  - next-env.d.ts
  - .gitignore
  - src/
  - public/
progress_weight: 1
---

# TASK-001 — Scaffold Next.js 15 + route skeleton

Stand up a correct, **static** Next.js 15 App Router shell in the existing repo root.
Empty placeholders only — no styling, no copy, no tooling beyond what runs the build.

## Constraints
- **Merge into the existing root `package.json`** — do not create an app subdirectory
  and do not clobber the OS spine (`name: 26folio`, `type: commonjs`, dep `yaml`, and
  the `*.mjs`/`*.sh` scripts must keep working). `next.config.ts` + strict `tsconfig`
  coexist with the spine; explicit `.mjs` extensions are unaffected by the `type` field.
- **TypeScript strict** (`"strict": true`), no `any` ([07-architecture-principles.md](../../project-spine/07-architecture-principles.md) §7).
- **Static by default** (§1): every page `export const dynamic = 'force-static'`. No SSR,
  no `force-dynamic`, no data fetching.
- **Routes use the canonical names** from [11-content-strategy.md](../../project-spine/11-content-strategy.md) §3:
  `/`, `/about`, `/capabilities`, `/work`, `/work/[slug]`, `/contact` — **not** `services`.
- Scaffold with **Tailwind and ESLint OFF** — those are TASK-002 and TASK-004. Adding
  them here is a scope escape.

## Implementation checklist
1. **Generate into a throwaway dir** (the repo root is non-empty, so `create-next-app`
   would refuse it). Disable the parts later tasks own:
   ```
   npx create-next-app@latest .scaffold-tmp \
     --ts --app --src-dir --no-tailwind --no-eslint \
     --import-alias "@/*" --use-npm --no-turbopack
   ```
2. **Merge manifest:** copy `next`, `react`, `react-dom`, `typescript`, `@types/*`
   versions from `.scaffold-tmp/package.json` into the root `package.json`
   `dependencies`/`devDependencies`. Keep the root `name`, `type: commonjs`, `yaml`,
   and existing scripts. Add scripts:
   ```json
   "dev": "next dev",
   "build": "next build",
   "start": "next start",
   "typecheck": "tsc --noEmit"
   ```
   (`lint`/`format` are deliberately left for TASK-004 so the gate's typecheck proof
   already works from this task.)
3. Copy `next.config.ts`, `tsconfig.json`, `next-env.d.ts` from `.scaffold-tmp`.
   Confirm `tsconfig` has `"strict": true` and the `@/*` path alias to `src/*`.
4. Merge `.gitignore` (add `.next/`, `/out/`, `next-env.d.ts` if not already ignored
   elsewhere — keep the existing OS ignores).
5. **Replace the generated app** with the route skeleton under `src/`:
   ```
   src/app/
     layout.tsx                      # root <html><body>, lang, <main> landmark
     (site)/
       page.tsx                      # Home placeholder
       about/page.tsx
       capabilities/page.tsx
       work/page.tsx
       work/[slug]/page.tsx          # generateStaticParams -> [] for now
       contact/page.tsx
     api/contact/route.ts            # POST stub -> 501 Not Implemented (EPIC-008)
   ```
   - Each page: minimal semantic placeholder (e.g. `<h1>` with the route name), and
     `export const dynamic = 'force-static'`.
   - `work/[slug]/page.tsx`: `export function generateStaticParams() { return [] }`.
   - `api/contact/route.ts`: `export async function POST() { return new Response(null, { status: 501 }) }`.
6. **Delete `.scaffold-tmp`** and any generated `README.md`/`app/` leftovers so the diff
   stays within `files_allowed`.
7. `npm install` then verify (see below).

## Verification
- `npm run typecheck` → clean (gate runs this).
- `npm run build` → succeeds; **every route prints as static** in the build table
  (`○`/`●`), none as `ƒ` (dynamic). The `api/contact` route may be dynamic — that is
  allowed (it's an API handler, not a page).
- `npm run dev` → all six routes render their placeholder.
- Sanity: `node scripts/render-state.mjs --check` still passes (root manifest merge
  didn't break the OS scripts).

## Out of scope (later tasks)
Tailwind (TASK-002), shadcn (TASK-003), ESLint/Prettier + `scripts/test/*.sh`
(TASK-004), deps + env (TASK-005), CI (TASK-006). Brand tokens/fonts → EPIC-002.
