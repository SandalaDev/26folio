---
id: EPIC-001-SLICE-1
title: App bootstrap — Next.js 15 skeleton
epic: EPIC-001
status: ready
phase: 1
tasks: [TASK-001]
---

# SLICE-1 — App bootstrap

> First runnable skeleton. After this slice, `npm run dev` serves every route as a
> placeholder and `npm run build` emits static output. Nothing styled, nothing
> written — just a correct, static Next.js 15 App Router shell the rest of EPIC-001
> hardens (Tailwind/shadcn in SLICE-2, tooling in SLICE-3).

## Outcome
- Next.js 15 (App Router) + React 19 + TypeScript **strict** installed into the
  existing root `package.json` (no app subdirectory — see [EPIC-001](../../backlog/epics/EPIC-001-project-scaffold.md) decision 1).
- Route-group skeleton `src/app/(site)/` with placeholder pages for the five
  canonical routes + the project detail route, a root layout, and a `501` contact
  API stub.
- Pages are **static by default** ([07-architecture-principles.md](../../project-spine/07-architecture-principles.md) §1).

## Boundaries (what this slice does NOT touch)
- No Tailwind / PostCSS (SLICE-2 / TASK-002).
- No ESLint / Prettier config (SLICE-3 / TASK-004) — scaffold with these flags **off**.
- No shadcn (TASK-003), no brand tokens, no copy, no real `lib/*` clients.

## Task
| Task | Title | Risk | Proof |
|---|---|---|---|
| [TASK-001](../../backlog/tasks/TASK-001.md) | Scaffold Next.js 15 + route skeleton | medium | typecheck (`tsc --noEmit`) + manual `npm run build` static smoke |

## Done when
- `npm run dev` renders `/`, `/about`, `/capabilities`, `/work`, `/work/[slug]`, `/contact`.
- `npm run build` succeeds; build log shows every page as static (`○`/`●`), none `ƒ` (dynamic).
- `npm run typecheck` is clean under strict mode.
- The OS `*.mjs` scripts still run (root `package.json` merge didn't break them).
