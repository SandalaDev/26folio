---
id: "DEP-20260819-223803-architecture"
mode: "architecture"
status: "approved"
human_approval: "approved"
purpose: "EPIC-025 client operations foundation"
opensrc_cli: "0.7.2"
created_at: "2026-08-19T22:38:03Z"
packages:
  - "next@16.3.1"
  - "react@19.2.8"
  - "react-dom@19.2.8"
  - "typescript@5.9.3"
  - "tailwindcss@4.3.3"
  - "drizzle-orm@0.45.2"
  - "drizzle-kit@0.31.10"
  - "postgres@3.4.9"
  - "better-auth@1.7.1"
  - "pg-boss@12.27.0"
  - "@aws-sdk/client-s3@3.1114.0"
  - "@aws-sdk/s3-request-presigner@3.1114.0"
  - "postmark@5.1.0"
  - "@react-pdf/renderer@4.6.1"
  - "@anthropic-ai/sdk@0.120.0"
  - "zod@4.4.3"
  - "pino@10.3.1"
  - "@sentry/nextjs@10.70.0"
---

# Dependency evidence: EPIC-025 client operations foundation

OpenSrc fetched the exact candidate sources before project packages were
installed. OpenSrc is evidence access, not proof of compatibility.

## Candidate evidence

### next@16.3.1

- OpenSrc command: `opensrc path next@16.3.1 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/vercel/next.js/16.3.1`
- Package manifest: `package.json`
- Engines: `{"node":">=20.9.0"}`
- Peer dependencies: `{}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{}`
- Documentation inventory: `.agents/skills/README.md`, `.conductor/README.md`, `.github/actions/next-stats-action/README.md`, `.github/actions/pr-auto-label/README.md`, `.github/actions/validate-docs-links/README.MD`, `apps/bundle-analyzer/README.md`, `bench/dev-validation/README.md`, `bench/fuzzponent/readme.md`, `bench/recursive-delete/README.md`, `bench/render-pipeline/README.md`, `bench/rendering/readme.md`, `bench/vercel/README.md`, `contributing/docs/adding-documentation.md`, `crates/next-build-test/README.md`, `crates/next-code-frame/README.md`, `crates/next-error-code-swc-plugin/README.md`, `crates/next-napi-bindings/npm/darwin-arm64/README.md`, `crates/next-napi-bindings/npm/darwin-x64/README.md`, `crates/next-napi-bindings/npm/linux-arm64-gnu/README.md`, `crates/next-napi-bindings/npm/linux-arm64-musl/README.md`, `crates/next-napi-bindings/npm/linux-x64-gnu/README.md`, `crates/next-napi-bindings/npm/linux-x64-musl/README.md`, `crates/next-napi-bindings/npm/win32-arm64-msvc/README.md`, `crates/next-napi-bindings/npm/win32-x64-msvc/README.md`, `crates/next-taskless/README.md`, `crates/wasm/README.md`, `docs/01-app/01-getting-started/01-installation.mdx`, `docs/01-app/01-getting-started/02-project-structure.mdx`, `docs/01-app/01-getting-started/03-layouts-and-pages.mdx`, `docs/01-app/01-getting-started/04-linking-and-navigating.mdx`, `docs/01-app/01-getting-started/05-server-and-client-components.mdx`, `docs/01-app/01-getting-started/06-fetching-data.mdx`, `docs/01-app/01-getting-started/07-mutating-data.mdx`, `docs/01-app/01-getting-started/08-caching.mdx`, `docs/01-app/01-getting-started/09-revalidating.mdx`, `docs/01-app/01-getting-started/10-error-handling.mdx`, `docs/01-app/01-getting-started/11-css.mdx`, `docs/01-app/01-getting-started/12-images.mdx`, `docs/01-app/01-getting-started/13-fonts.mdx`, `docs/01-app/01-getting-started/14-metadata-and-og-images.mdx`

#### Docs and source findings

Reviewed the version-matched manifest and the App Router documentation set in
the fetched source. The manifest records `engines.node >=20.9.0`. The cache
path resolves to the monorepo root, so the recorded peer map is empty; the
published package's registry metadata for this exact version lists
`react ^18.2.0 || ^19.0.0` and `react-dom` identically, plus optional peers for
sass, Playwright, and OpenTelemetry. Route handlers and server actions cover
the three surfaces this product needs: the operator UI, the client link pages,
and the payment webhook endpoints. Rendering stays server-first, which suits an
application where almost every page is a form bound to one engagement.

#### Project fit and risks

One framework across the portfolio and this product means one person maintains
one build system. The risk is the opposite of a version conflict: Next.js moves
quickly, and this repository is one major version behind (15.5.19). That is
acceptable because the two applications ship separately and share no code. The
real constraint Next places on the design is deployment shape — the App Router
alone cannot run a durable worker, which is why the deployment runs a second
process group rather than a serverless-only host.


### react@19.2.8

- OpenSrc command: `opensrc path react@19.2.8 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/react/react/19.2.8/packages/react`
- Package manifest: `package.json`
- Engines: `{"node":">=0.10.0"}`
- Peer dependencies: `{}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{".":{"react-server":"./react.react-server.js","default":"./index.js"},"./package.json":"./package.json","./jsx-runtime":{"react-server":"./jsx-runtime.react-server.js","default":"./jsx-runtime.js"},"./jsx-dev-runtime":{"react-server":"./jsx-dev-runtime.react-server.js","default":"./jsx-dev-runtime.js"},"./compiler-runtime":{"react-server":"./compiler-runtime.js","default":"./compiler-runtime.js"},"./src/*":"./src/*"}`
- Documentation inventory: `README.md`

#### Docs and source findings

Manifest reviewed from the version-matched `packages/react` source. Engines are
nominal (`node >=0.10.0`); the real constraint is the framework's. This is the
version `react-dom@19.2.8` pins exactly, and it sits inside `next@16.3.1`'s
published peer range.

#### Project fit and risks

No conflict. It sits inside `next@16.3.1`'s published peer range, matches the
exact version `react-dom@19.2.8` requires, and satisfies the React peers of both
`better-auth@1.7.1` and `@react-pdf/renderer@4.6.1`. It is the only version in
the set that satisfies all four at once.


### react-dom@19.2.8

- OpenSrc command: `opensrc path react-dom@19.2.8 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/react/react/19.2.8/packages/react-dom`
- Package manifest: `package.json`
- Engines: `{}`
- Peer dependencies: `{"react":"^19.2.8"}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{".":{"react-server":"./react-dom.react-server.js","default":"./index.js"},"./client":{"react-server":"./client.react-server.js","default":"./client.js"},"./server":{"react-server":"./server.react-server.js","workerd":"./server.edge.js","bun":"./server.bun.js","deno":"./server.browser.js","worker":"./server.browser.js","node":"./server.node.js","edge-light":"./server.edge.js","browser":"./server.browser.js","default":"./server.node.js"},"./server.browser":{"react-server":"./server.react-server.js","default":"./server.browser.js"},"./server.bun":{"react-server":"./server.react-server.js","default":"./server.bun.js"},"./server.edge":{"react-server":"./server.react-server.js","default":"./server.edge.js"},"./server.node":{"react-server":"./server.react-server.js","default":"./server.node.js"},"./static":{"react-server":"./static.react-server.js","workerd":"./static.edge.js","deno":"./static.browser.js","worker":"./static.browser.js","node":"./static.node.js","edge-light":"./static.edge.js","browser":"./static.browser.js","default":"./static.node.js"},"./static.browser":{"react-server":"./static.react-server.js","default":"./static.browser.js"},"./static.edge":{"react-server":"./static.react-server.js","default":"./static.edge.js"},"./static.node":{"react-server":"./static.react-server.js","default":"./static.node.js"},"./profiling":{"react-server":"./profiling.react-server.js","default":"./profiling.js"},"./test-utils":"./test-utils.js","./unstable_testing":{"react-server":"./unstable_testing.react-server.js","default":"./unstable_testing.js"},"./unstable_server-external-runtime":"./unstable_server-external-runtime.js","./src/*":"./src/*","./package.json":"./package.json"}`
- Documentation inventory: `README.md`

#### Docs and source findings

Manifest reviewed from the version-matched `packages/react-dom` source. It
declares a single peer, `react ^19.2.8`, which this candidate set satisfies
exactly rather than by range. No other candidate competes for the renderer.

#### Project fit and risks

Pinned to the exact version its peer demands. The only risk worth naming is
drift: bumping `react` without `react-dom` breaks the exact-version peer, so
they move together or not at all.


### typescript@5.9.3

- OpenSrc command: `opensrc path typescript@5.9.3 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/microsoft/TypeScript/5.9.3`
- Package manifest: `package.json`
- Engines: `{"node":">=14.17"}`
- Peer dependencies: `{}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{}`
- Documentation inventory: `README.md`, `SECURITY.md`, `src/lib/README.md`, `src/services/formatting/README.md`

#### Docs and source findings

Manifest reviewed from the version-matched source; `engines.node >=14.17`.
This is deliberately not the current `latest`, which is `7.0.2` — the native
compiler rewrite. A product that carries contract evidence and payment state
should not also be an early adopter of a rewritten compiler, and the portfolio
repository is already on the 5.x line, so one person maintains one mental model.
Re-evaluate TypeScript 7 after the pilot, as its own dependency plan.

#### Project fit and risks

No runtime footprint and no peer relationships. The risk is a deliberate one —
staying on 5.x means forgoing TypeScript 7's compile speed. For a codebase this
size that is not a meaningful cost, and the alternative risk (a compiler rewrite
under code that handles payment state) is not one worth taking in the first
release.


### tailwindcss@4.3.3

- OpenSrc command: `opensrc path tailwindcss@4.3.3 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/tailwindlabs/tailwindcss/4.3.3/packages/tailwindcss`
- Package manifest: `package.json`
- Engines: `{}`
- Peer dependencies: `{}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{".":{"style":"./index.css","types":"./src/index.ts","require":"./dist/lib.js","import":"./src/index.ts"},"./colors":{"require":"./src/compat/colors.cts","import":"./src/compat/colors.ts"},"./colors.js":{"require":"./src/compat/colors.cts","import":"./src/compat/colors.ts"},"./lib/util/flattenColorPalette":{"require":"./src/compat/flatten-color-palette.cts","import":"./src/compat/flatten-color-palette.ts"},"./lib/util/flattenColorPalette.js":{"require":"./src/compat/flatten-color-palette.cts","import":"./src/compat/flatten-color-palette.ts"},"./defaultTheme":{"require":"./src/compat/default-theme.cts","import":"./src/compat/default-theme.ts"},"./defaultTheme.js":{"require":"./src/compat/default-theme.cts","import":"./src/compat/default-theme.ts"},"./plugin":{"require":"./src/plugin.cts","import":"./src/plugin.ts"},"./plugin.js":{"require":"./src/plugin.cts","import":"./src/plugin.ts"},"./package.json":"./package.json","./index.css":"./index.css","./index":"./index.css","./preflight.css":"./preflight.css","./preflight":"./preflight.css","./theme.css":"./theme.css","./theme":"./theme.css","./utilities.css":"./utilities.css","./utilities":"./utilities.css"}`
- Documentation inventory: `README.md`

#### Docs and source findings

Manifest reviewed from the version-matched `packages/tailwindcss` source.
Tailwind 4 is CSS-first: configuration lives in the stylesheet rather than a
JavaScript config file, and the PostCSS integration ships as the separate
`@tailwindcss/postcss` package. **That companion package is not in this
candidate list.** Its necessity is verified against 26folio's own working
configuration, where `postcss.config.mjs` registers `@tailwindcss/postcss` and
`package.json` pins it alongside `tailwindcss` in the same 4.3.x line.
`TASK-108` must pin `@tailwindcss/postcss@4.3.3` to match this candidate.

#### Project fit and risks

Build-time only; it produces CSS and never enters a request path. The concrete
risk is the missing companion: without `@tailwindcss/postcss` pinned to the same
version, the PostCSS pipeline has no Tailwind plugin and the build produces
unstyled output. `TASK-108` must add it, and its absence from this plan is
recorded here rather than discovered during bootstrap.


### drizzle-orm@0.45.2

- OpenSrc command: `opensrc path drizzle-orm@0.45.2 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/drizzle-team/drizzle-orm/0.45.2`
- Package manifest: `drizzle-orm/package.json`
- Engines: `{}`
- Peer dependencies: `{"@aws-sdk/client-rds-data":">=3","@cloudflare/workers-types":">=4","@electric-sql/pglite":">=0.2.0","@libsql/client":">=0.10.0","@libsql/client-wasm":">=0.10.0","@neondatabase/serverless":">=0.10.0","@op-engineering/op-sqlite":">=2","@opentelemetry/api":"^1.4.1","@planetscale/database":">=1.13","@prisma/client":"*","@tidbcloud/serverless":"*","@types/better-sqlite3":"*","@types/pg":"*","@types/sql.js":"*","@vercel/postgres":">=0.8.0","@xata.io/client":"*","better-sqlite3":">=7","bun-types":"*","expo-sqlite":">=14.0.0","knex":"*","kysely":"*","mysql2":">=2","pg":">=8","postgres":">=3","sql.js":">=1","sqlite3":">=5","gel":">=2","@upstash/redis":">=1.34.7"}`
- Peer dependency metadata: `{"mysql2":{"optional":true},"@vercel/postgres":{"optional":true},"@xata.io/client":{"optional":true},"better-sqlite3":{"optional":true},"@types/better-sqlite3":{"optional":true},"sqlite3":{"optional":true},"sql.js":{"optional":true},"@types/sql.js":{"optional":true},"@cloudflare/workers-types":{"optional":true},"pg":{"optional":true},"@types/pg":{"optional":true},"postgres":{"optional":true},"@neondatabase/serverless":{"optional":true},"bun-types":{"optional":true},"@aws-sdk/client-rds-data":{"optional":true},"@planetscale/database":{"optional":true},"knex":{"optional":true},"kysely":{"optional":true},"@libsql/client":{"optional":true},"@libsql/client-wasm":{"optional":true},"@opentelemetry/api":{"optional":true},"expo-sqlite":{"optional":true},"gel":{"optional":true},"@op-engineering/op-sqlite":{"optional":true},"@electric-sql/pglite":{"optional":true},"@tidbcloud/serverless":{"optional":true},"prisma":{"optional":true},"@prisma/client":{"optional":true},"@upstash/redis":{"optional":true}}`
- Exports/runtime entry points: `{}`
- Documentation inventory: `changelogs/README.md`, `docs/custom-types.lite.md`, `docs/custom-types.md`, `docs/joins.md`, `docs/table-introspect-api.md`, `drizzle-arktype/README.md`, `drizzle-kit/README.md`, `drizzle-orm/src/cache/readme.md`, `drizzle-orm/src/knex/README.md`, `drizzle-orm/src/kysely/README.md`, `drizzle-orm/src/postgres-js/README.md`, `drizzle-orm/src/sqlite-core/README.md`, `drizzle-seed/README.md`, `drizzle-typebox/README.md`, `drizzle-valibot/README.md`, `drizzle-zod/README.md`, `eslint-plugin-drizzle/readme.md`, `README.md`, `SECURITY.md`

#### Docs and source findings

Manifest reviewed from the version-matched source. The package declares a long
optional peer list covering every supported driver; the one that matters here is
`postgres >=3`, satisfied by `postgres@3.4.9`. Drizzle is chosen over an ORM with
its own engine binary for three reasons that are specific to this product:
migrations are plain SQL files, so row-level security policies live next to the
tables they protect; queries stay close enough to SQL that an isolation bug is
visible in review; and there is no separate query engine process to deploy.
Note the pre-1.0 version line — a 1.0 release candidate exists — which is why
the version is pinned exactly rather than by caret.

#### Project fit and risks

It is simultaneously the application's data layer and a peer that Better Auth
validates against, so this exact version is load-bearing in two directions. Two
risks: the pre-1.0 line means a future 1.0 migration is coming, which is why the
version is exact and why the migration path is a task rather than a surprise;
and Drizzle does not manage row-level security itself, so RLS policies are
hand-written SQL in migrations, reviewed as security code rather than generated.


### drizzle-kit@0.31.10

- OpenSrc command: `opensrc path drizzle-kit@0.31.10 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/drizzle-team/drizzle-orm/0.31.10`
- Package manifest: `drizzle-kit/package.json`
- Engines: `{}`
- Peer dependencies: `{}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{".":{"import":{"types":"./index.d.mts","default":"./index.mjs"},"require":{"types":"./index.d.ts","default":"./index.js"},"types":"./index.d.mts","default":"./index.mjs"},"./api":{"import":{"types":"./api.d.mts","default":"./api.mjs"},"require":{"types":"./api.d.ts","default":"./api.js"},"types":"./api.d.mts","default":"./api.mjs"}}`
- Documentation inventory: `changelogs/README.md`, `docs/custom-types.lite.md`, `docs/custom-types.md`, `docs/joins.md`, `docs/table-introspect-api.md`, `drizzle-arktype/README.md`, `drizzle-kit/announcements/README.md`, `drizzle-kit/README.md`, `drizzle-orm/src/cache/readme.md`, `drizzle-orm/src/knex/README.md`, `drizzle-orm/src/kysely/README.md`, `drizzle-orm/src/postgres-js/README.md`, `drizzle-orm/src/sqlite-core/README.md`, `drizzle-seed/README.md`, `drizzle-typebox/README.md`, `drizzle-valibot/README.md`, `drizzle-zod/README.md`, `eslint-plugin-drizzle/readme.md`, `README.md`, `SECURITY.md`

#### Docs and source findings

Manifest reviewed from the version-matched source. This is the migration and
introspection tool for the ORM above. The version matters beyond Drizzle itself:
`better-auth@1.7.1` declares `drizzle-kit >=0.31.4 || >=1.0.0-beta.1` as a peer,
and 0.31.10 satisfies the first branch. Migrations are generated, then reviewed
and edited by hand before they are applied, because the security-relevant parts
of the schema are the parts a generator cannot infer.

#### Project fit and risks

Development and migration tooling only; nothing of it ships to production.
Its constraint is social rather than technical: generated migrations must be
read before they are applied, because a generator will happily drop a policy or
a constraint it did not create.


### postgres@3.4.9

- OpenSrc command: `opensrc path postgres@3.4.9 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/porsager/postgres/3.4.9`
- Package manifest: `package.json`
- Engines: `{"node":">=12"}`
- Peer dependencies: `{}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{"types":"./types/index.d.ts","bun":"./src/index.js","workerd":"./cf/src/index.js","import":"./src/index.js","default":"./cjs/src/index.js"}`
- Documentation inventory: `CHANGELOG.md`, `deno/README.md`, `README.md`

#### Docs and source findings

Manifest and README reviewed from the version-matched source. `engines.node >=12`,
no peers, tagged-template query API. It serves as Drizzle's driver for
application queries. Its coexistence with the `pg` driver that pg-boss depends
on is deliberate and bounded — see the cross-package matrix and the combined
conclusion.

#### Project fit and risks

Satisfies `drizzle-orm`'s `postgres >=3` peer and is explicitly named as a
supported driver by pg-boss's Drizzle transaction adapter, which is the pairing
this design depends on. The risk is having two PostgreSQL drivers in one
dependency tree (`postgres` here, `pg` inside pg-boss). The boundary is
documented in the combined conclusion, and it is a bounded cost rather than an
ambiguity: application queries use one, the queue's own polling uses the other,
and transactional enqueue crosses between them only through the documented
adapter.


### better-auth@1.7.1

- OpenSrc command: `opensrc path better-auth@1.7.1 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/better-auth/better-auth/1.7.1/packages/better-auth`
- Package manifest: `package.json`
- Engines: `{}`
- Peer dependencies: `{"@lynx-js/react":"*","@prisma/client":"^5.0.0 || ^6.0.0 || ^7.0.0","@sveltejs/kit":"^2.0.0","@tanstack/react-start":"^1.0.0","@tanstack/solid-start":"^1.0.0","better-sqlite3":"^12.0.0","drizzle-kit":">=0.31.4 || >=1.0.0-beta.1","drizzle-orm":"^0.45.2 || >=1.0.0-rc.1 <2.0.0","mongodb":"^6.0.0 || ^7.0.0","mysql2":"^3.0.0","next":"^14.0.0 || ^15.0.0 || ^16.0.0","pg":"^8.0.0","prisma":"^5.0.0 || ^6.0.0 || ^7.0.0","react":"^18.0.0 || ^19.0.0","react-dom":"^18.0.0 || ^19.0.0","solid-js":"^1.0.0","svelte":"^4.0.0 || ^5.0.0","vitest":"^2.0.0 || ^3.0.0 || ^4.0.0","vue":"^3.0.0"}`
- Peer dependency metadata: `{"@lynx-js/react":{"optional":true},"@prisma/client":{"optional":true},"@sveltejs/kit":{"optional":true},"@tanstack/react-start":{"optional":true},"@tanstack/solid-start":{"optional":true},"next":{"optional":true},"react":{"optional":true},"react-dom":{"optional":true},"solid-js":{"optional":true},"svelte":{"optional":true},"vue":{"optional":true},"drizzle-kit":{"optional":true},"drizzle-orm":{"optional":true},"mongodb":{"optional":true},"mysql2":{"optional":true},"pg":{"optional":true},"prisma":{"optional":true},"better-sqlite3":{"optional":true},"vitest":{"optional":true}}`
- Exports/runtime entry points: `{".":{"dev-source":"./src/index.ts","types":"./dist/index.d.mts","default":"./dist/index.mjs"},"./minimal":{"dev-source":"./src/auth/minimal.ts","types":"./dist/auth/minimal.d.mts","default":"./dist/auth/minimal.mjs"},"./social-providers":{"dev-source":"./src/social-providers/index.ts","types":"./dist/social-providers/index.d.mts","default":"./dist/social-providers/index.mjs"},"./client":{"dev-source":"./src/client/index.ts","types":"./dist/client/index.d.mts","default":"./dist/client/index.mjs"},"./client/plugins":{"dev-source":"./src/client/plugins/index.ts","types":"./dist/client/plugins/index.d.mts","default":"./dist/client/plugins/index.mjs"},"./types":{"dev-source":"./src/types/index.ts","types":"./dist/types/index.d.mts","default":"./dist/types/index.mjs"},"./crypto":{"dev-source":"./src/crypto/index.ts","types":"./dist/crypto/index.d.mts","default":"./dist/crypto/index.mjs"},"./cookies":{"dev-source":"./src/cookies/index.ts","types":"./dist/cookies/index.d.mts","default":"./dist/cookies/index.mjs"},"./cookies/utils":{"dev-source":"./src/cookies/cookie-utils.ts","types":"./dist/cookies/cookie-utils.d.mts","default":"./dist/cookies/cookie-utils.mjs"},"./oauth2":{"dev-source":"./src/oauth2/index.ts","types":"./dist/oauth2/index.d.mts","default":"./dist/oauth2/index.mjs"},"./react":{"dev-source":"./src/client/react/index.ts","types":"./dist/client/react/index.d.mts","default":"./dist/client/react/index.mjs"},"./solid":{"dev-source":"./src/client/solid/index.ts","types":"./dist/client/solid/index.d.mts","default":"./dist/client/solid/index.mjs"},"./lynx":{"dev-source":"./src/client/lynx/index.ts","types":"./dist/client/lynx/index.d.mts","default":"./dist/client/lynx/index.mjs"},"./test":{"dev-source":"./src/test-utils/index.ts","types":"./dist/test-utils/index.d.mts","default":"./dist/test-utils/index.mjs"},"./api":{"dev-source":"./src/api/index.ts","types":"./dist/api/index.d.mts","default":"./dist/api/index.mjs"},"./db":{"dev-source":"./src/db/index.ts","types":"./dist/db/index.d.mts","default":"./dist/db/index.mjs"},"./vue":{"dev-source":"./src/client/vue/index.ts","types":"./dist/client/vue/index.d.mts","default":"./dist/client/vue/index.mjs"},"./plugins":{"dev-source":"./src/plugins/index.ts","types":"./dist/plugins/index.d.mts","default":"./dist/plugins/index.mjs"},"./svelte-kit":{"dev-source":"./src/integrations/svelte-kit.ts","types":"./dist/integrations/svelte-kit.d.mts","default":"./dist/integrations/svelte-kit.mjs"},"./solid-start":{"dev-source":"./src/integrations/solid-start.ts","types":"./dist/integrations/solid-start.d.mts","default":"./dist/integrations/solid-start.mjs"},"./svelte":{"dev-source":"./src/client/svelte/index.ts","types":"./dist/client/svelte/index.d.mts","default":"./dist/client/svelte/index.mjs"},"./next-js":{"dev-source":"./src/integrations/next-js.ts","types":"./dist/integrations/next-js.d.mts","default":"./dist/integrations/next-js.mjs"},"./tanstack-start":{"dev-source":"./src/integrations/tanstack-start.ts","types":"./dist/integrations/tanstack-start.d.mts","default":"./dist/integrations/tanstack-start.mjs"},"./tanstack-start/solid":{"dev-source":"./src/integrations/tanstack-start-solid.ts","types":"./dist/integrations/tanstack-start-solid.d.mts","default":"./dist/integrations/tanstack-start-solid.mjs"},"./node":{"dev-source":"./src/integrations/node.ts","types":"./dist/integrations/node.d.mts","default":"./dist/integrations/node.mjs"},"./db/adapter":{"dev-source":"./src/db/adapter-kysely.ts","types":"./dist/db/adapter-kysely.d.mts","default":"./dist/db/adapter-kysely.mjs"},"./db/adapter/minimal":{"dev-source":"./src/db/adapter-base.ts","types":"./dist/db/adapter-base.d.mts","default":"./dist/db/adapter-base.mjs"},"./db/migration":{"dev-source":"./src/db/get-migration.ts","types":"./dist/db/get-migration.d.mts","default":"./dist/db/get-migration.mjs"},"./adapters/prisma":{"dev-source":"./src/adapters/prisma-adapter/index.ts","types":"./dist/adapters/prisma-adapter/index.d.mts","default":"./dist/adapters/prisma-adapter/index.mjs"},"./adapters/drizzle":{"dev-source":"./src/adapters/drizzle-adapter/index.ts","types":"./dist/adapters/drizzle-adapter/index.d.mts","default":"./dist/adapters/drizzle-adapter/index.mjs"},"./adapters/mongodb":{"dev-source":"./src/adapters/mongodb-adapter/index.ts","types":"./dist/adapters/mongodb-adapter/index.d.mts","default":"./dist/adapters/mongodb-adapter/index.mjs"},"./adapters/memory":{"dev-source":"./src/adapters/memory-adapter/index.ts","types":"./dist/adapters/memory-adapter/index.d.mts","default":"./dist/adapters/memory-adapter/index.mjs"},"./adapters":{"dev-source":"./src/adapters/index.ts","types":"./dist/adapters/index.d.mts","default":"./dist/adapters/index.mjs"},"./plugins/access":{"dev-source":"./src/plugins/access/index.ts","types":"./dist/plugins/access/index.d.mts","default":"./dist/plugins/access/index.mjs"},"./plugins/admin":{"dev-source":"./src/plugins/admin/index.ts","types":"./dist/plugins/admin/index.d.mts","default":"./dist/plugins/admin/index.mjs"},"./plugins/admin/access":{"dev-source":"./src/plugins/admin/access/index.ts","types":"./dist/plugins/admin/access/index.d.mts","default":"./dist/plugins/admin/access/index.mjs"},"./plugins/anonymous":{"dev-source":"./src/plugins/anonymous/index.ts","types":"./dist/plugins/anonymous/index.d.mts","default":"./dist/plugins/anonymous/index.mjs"},"./plugins/bearer":{"dev-source":"./src/plugins/bearer/index.ts","types":"./dist/plugins/bearer/index.d.mts","default":"./dist/plugins/bearer/index.mjs"},"./plugins/custom-session":{"dev-source":"./src/plugins/custom-session/index.ts","types":"./dist/plugins/custom-session/index.d.mts","default":"./dist/plugins/custom-session/index.mjs"},"./plugins/email-otp":{"dev-source":"./src/plugins/email-otp/index.ts","types":"./dist/plugins/email-otp/index.d.mts","default":"./dist/plugins/email-otp/index.mjs"},"./plugins/generic-oauth":{"dev-source":"./src/plugins/generic-oauth/index.ts","types":"./dist/plugins/generic-oauth/index.d.mts","default":"./dist/plugins/generic-oauth/index.mjs"},"./plugins/jwt":{"dev-source":"./src/plugins/jwt/index.ts","types":"./dist/plugins/jwt/index.d.mts","default":"./dist/plugins/jwt/index.mjs"},"./plugins/haveibeenpwned":{"dev-source":"./src/plugins/haveibeenpwned/index.ts","types":"./dist/plugins/haveibeenpwned/index.d.mts","default":"./dist/plugins/haveibeenpwned/index.mjs"},"./plugins/magic-link":{"dev-source":"./src/plugins/magic-link/index.ts","types":"./dist/plugins/magic-link/index.d.mts","default":"./dist/plugins/magic-link/index.mjs"},"./plugins/multi-session":{"dev-source":"./src/plugins/multi-session/index.ts","types":"./dist/plugins/multi-session/index.d.mts","default":"./dist/plugins/multi-session/index.mjs"},"./plugins/oauth-proxy":{"dev-source":"./src/plugins/oauth-proxy/index.ts","types":"./dist/plugins/oauth-proxy/index.d.mts","default":"./dist/plugins/oauth-proxy/index.mjs"},"./plugins/organization":{"dev-source":"./src/plugins/organization/index.ts","types":"./dist/plugins/organization/index.d.mts","default":"./dist/plugins/organization/index.mjs"},"./plugins/organization/access":{"dev-source":"./src/plugins/organization/access/index.ts","types":"./dist/plugins/organization/access/index.d.mts","default":"./dist/plugins/organization/access/index.mjs"},"./plugins/one-time-token":{"dev-source":"./src/plugins/one-time-token/index.ts","types":"./dist/plugins/one-time-token/index.d.mts","default":"./dist/plugins/one-time-token/index.mjs"},"./plugins/phone-number":{"dev-source":"./src/plugins/phone-number/index.ts","types":"./dist/plugins/phone-number/index.d.mts","default":"./dist/plugins/phone-number/index.mjs"},"./plugins/two-factor":{"dev-source":"./src/plugins/two-factor/index.ts","types":"./dist/plugins/two-factor/index.d.mts","default":"./dist/plugins/two-factor/index.mjs"},"./plugins/username":{"dev-source":"./src/plugins/username/index.ts","types":"./dist/plugins/username/index.d.mts","default":"./dist/plugins/username/index.mjs"},"./plugins/siwe":{"dev-source":"./src/plugins/siwe/index.ts","types":"./dist/plugins/siwe/index.d.mts","default":"./dist/plugins/siwe/index.mjs"},"./plugins/device-authorization":{"dev-source":"./src/plugins/device-authorization/index.ts","types":"./dist/plugins/device-authorization/index.d.mts","default":"./dist/plugins/device-authorization/index.mjs"}}`
- Documentation inventory: `CHANGELOG.md`, `README.md`, `src/plugins/oauth-popup/README.md`

#### Docs and source findings

Manifest reviewed from the version-matched `packages/better-auth` source. The
package is ESM (`"type": "module"`) and exposes framework-specific export
subpaths including `./next-js` and `./node`; it depends on
`@better-auth/drizzle-adapter`, which is the adapter this design uses. Its peer
ranges line up with this candidate set exactly rather than approximately:
`next ^14 || ^15 || ^16`, `react ^18 || ^19`, `react-dom ^18 || ^19`,
`drizzle-orm ^0.45.2 || >=1.0.0-rc.1 <2.0.0`, `drizzle-kit >=0.31.4`. The `pg`
peer applies only to the node-postgres adapter, which this design does not use.
Scope note: Better Auth serves **one** user, Abe. Clients never receive a Better
Auth session; their access is an opaque, hashed, scoped, expiring link token
implemented in application code, because their access is per-engagement rather
than per-identity.

#### Project fit and risks

Every peer range it declares is satisfied by an exact member of this set, which
is unusually clean for an auth library and is the main reason it is here rather
than a hand-rolled session. Two risks. First, the 1.x line is young and moves
quickly; pin exactly, read release notes, and treat an upgrade as a task with a
verification step rather than a routine bump. Second, scope creep: it would be
easy to also use it for client access, which would give clients identities the
product deliberately does not want. Client access stays a scoped link token, and
that boundary belongs in code review.


### pg-boss@12.27.0

- OpenSrc command: `opensrc path pg-boss@12.27.0 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/timgit/pg-boss/12.27.0`
- Package manifest: `package.json`
- Engines: `{"node":">=22.12.0"}`
- Peer dependencies: `{}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{}`
- Documentation inventory: `docs/api/adapters.md`, `docs/api/constructor.md`, `docs/api/events.md`, `docs/api/jobs.md`, `docs/api/ops.md`, `docs/api/pubsub.md`, `docs/api/queues.md`, `docs/api/scheduling.md`, `docs/api/testing.md`, `docs/api/utils.md`, `docs/api/workers.md`, `docs/cli.md`, `docs/dashboard.md`, `docs/database-backends.md`, `docs/index.md`, `docs/install.md`, `docs/introduction.md`, `docs/proxy.md`, `docs/sql/job-table.md`, `docs/sql/queue-functions.md`, `docs/sql/warning-table.md`, `examples/readme.cjs`, `examples/readme.mjs`, `packages/dashboard/README.md`, `packages/proxy/README.md`, `README.md`

#### Docs and source findings

Manifest, README, `docs/database-backends.md`, and `docs/api/adapters.md`
reviewed from the version-matched source. Three findings decide its selection:
1. `engines.node >=22.12.0` is the highest floor in this candidate set, so it
   sets the project's Node floor. The installed toolchain is 22.19.0.
2. Job fetching uses `SELECT FOR UPDATE SKIP LOCKED` on stock PostgreSQL, with
   the default `backend: 'postgres'` profile applying no compatibility
   downgrades.
3. `docs/api/adapters.md` documents `fromDrizzle(tx, sql)`, which runs
   `boss.send()` inside an existing Drizzle transaction and rolls the job back
   with it. Both the node-postgres and postgres-js drivers are named as
   supported. This is what makes "enqueue the PDF render in the same transaction
   as the acceptance record" a documented capability rather than an aspiration.
The package depends on `pg ^8.22.0` for its own pooling.

#### Project fit and risks

It fits because it needs no infrastructure the design does not already have: the
queue lives in the same PostgreSQL instance that holds the engagement record, so
one backup covers both and one transaction can span an application write and the
job that follows it. Two constraints it imposes. It raises the project's Node
floor to 22.12.0, which the current toolchain meets but which must be pinned in
CI and in the deployment image. And it requires a long-lived worker process,
which rules out a serverless-only deployment target — a constraint on hosting,
not a conflict with any other candidate.


### @aws-sdk/client-s3@3.1114.0

- OpenSrc command: `opensrc path @aws-sdk/client-s3@3.1114.0 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/aws/aws-sdk-js-v3/3.1114.0/clients/client-s3`
- Package manifest: `package.json`
- Engines: `{"node":">=20.0.0"}`
- Peer dependencies: `{}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{}`
- Documentation inventory: `CHANGELOG.md`, `README.md`, `test/e2e/README.md`

#### Docs and source findings

Manifest reviewed from the version-matched `clients/client-s3` source;
`engines.node >=20.0.0`. Used against Cloudflare R2 through the S3-compatible
API, which keeps the storage provider a matter of endpoint and credentials.
Modular v3 client, so only the S3 commands the application uses are imported.

#### Project fit and risks

No peer or runtime conflict with anything else in the set. The risks are
operational rather than structural: the AWS SDK v3 publishes very frequently, so
pin exactly and bump deliberately; and R2's S3 compatibility is broad but not
total, so `TASK-108` must prove presigned PUT, presigned GET, versioning, and
metadata reads against R2 itself rather than against AWS S3.


### @aws-sdk/s3-request-presigner@3.1114.0

- OpenSrc command: `opensrc path @aws-sdk/s3-request-presigner@3.1114.0 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/aws/aws-sdk-js-v3/3.1114.0/packages/s3-request-presigner`
- Package manifest: `package.json`
- Engines: `{"node":">=20.0.0"}`
- Peer dependencies: `{}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{}`
- Documentation inventory: `CHANGELOG.md`, `README.md`

#### Docs and source findings

Manifest reviewed from the version-matched `packages/s3-request-presigner`
source; `engines.node >=20.0.0`, same release train as the S3 client, which is
how the AWS SDK v3 expects its packages to be paired. It issues the presigned
PUT and short-lived signed GET URLs the upload rules in the security baseline
depend on.

#### Project fit and risks

Must move in lockstep with the S3 client — mismatched AWS SDK v3 versions are a
known source of subtle signature errors, so both are pinned to the same release.
No other candidate touches request signing.


### postmark@5.1.0

- OpenSrc command: `opensrc path postmark@5.1.0 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/ActiveCampaign/postmark.js/5.1.0`
- Package manifest: `package.json`
- Engines: `{"node":">=18.0.0"}`
- Peer dependencies: `{}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{}`
- Documentation inventory: `CHANGELOG.md`, `README.md`, `SECURITY.md`

#### Docs and source findings

Manifest reviewed from the version-matched source. It is the official
ActiveCampaign client (`github.com/ActiveCampaign/postmark.js`),
`engines.node >=18.0.0`, CommonJS, and — notably — it declares **no runtime
dependencies**, which is a real virtue in a package that handles the delivery of
agreement links and receipts. Chosen over Resend 6.20.0 because the product
sends few, critical messages where deliverability and delivery events matter
more than templating breadth. Resend remains the alternative if the owner
prefers it; the email module is one file behind an interface.

#### Project fit and risks

Zero runtime dependencies and no peers, so it cannot conflict with anything in
the set. The risks are external to the package: sending-domain reputation, SPF
and DKIM records, and the fact that a client's spam folder is functionally
identical to an outage. The design mitigates the last one by treating a failed
agreement-link delivery as an operator alert rather than a logged warning.


### @react-pdf/renderer@4.6.1

- OpenSrc command: `opensrc path @react-pdf/renderer@4.6.1 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/diegomura/react-pdf/4.6.1/packages/renderer`
- Package manifest: `package.json`
- Engines: `{}`
- Peer dependencies: `{"react":"^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{}`
- Documentation inventory: `CHANGELOG.md`, `README.md`

#### Docs and source findings

Manifest reviewed from the version-matched `packages/renderer` source. ESM,
peer `react ^16.8 || ^17 || ^18 || ^19`, and its dependency graph is the
project's own `@react-pdf/*` packages built on a PDFKit fork. That is the
deciding property: it renders in-process with no headless Chromium and no
native canvas binary, so the deployment image stays small and the acceptance
copy renders deterministically in a worker.

#### Project fit and risks

Satisfies its React peer against the same React version everything else uses,
and adds no native binary to the image. The honest risk is fidelity: it is not a
browser, so complex layouts and font handling need testing against real
documents. That is acceptable here because the artefact it renders — an
acceptance copy — is a controlled, deliberately plain document whose exact bytes
are hashed and stored. A drifting layout would change the hash, which is
detectable rather than silent.


### @anthropic-ai/sdk@0.120.0

- OpenSrc command: `opensrc path @anthropic-ai/sdk@0.120.0 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/anthropics/anthropic-sdk-typescript/0.120.0`
- Package manifest: `package.json`
- Engines: `{}`
- Peer dependencies: `{"zod":"^3.25.0 || ^4.0.0"}`
- Peer dependency metadata: `{"zod":{"optional":true}}`
- Exports/runtime entry points: `{".":{"import":"./dist/index.mjs","require":"./dist/index.js"},"./*.mjs":{"default":"./dist/*.mjs"},"./*.js":{"default":"./dist/*.js"},"./*":{"import":"./dist/*.mjs","require":"./dist/*.js"}}`
- Documentation inventory: `CHANGELOG.md`, `MIGRATION.md`, `packages/aws-sdk/CHANGELOG.md`, `packages/aws-sdk/README.md`, `packages/bedrock-sdk/CHANGELOG.md`, `packages/bedrock-sdk/README.md`, `packages/foundry-sdk/CHANGELOG.md`, `packages/foundry-sdk/README.md`, `packages/google-cloud-sdk/CHANGELOG.md`, `packages/google-cloud-sdk/README.md`, `packages/vertex-sdk/CHANGELOG.md`, `packages/vertex-sdk/README.md`, `README.md`, `SECURITY.md`, `src/core/README.md`, `src/internal/qs/README.md`, `src/internal/README.md`, `src/_vendor/partial-json-parser/README.md`

#### Docs and source findings

Manifest reviewed from the version-matched source
(`github.com/anthropics/anthropic-sdk-typescript`). CommonJS, runtime
dependencies limited to `standardwebhooks` and `json-schema-to-ts`, and a
declared peer of `zod ^3.25.0 || ^4.0.0` — satisfied by `zod@4.4.3` in this same
set, which is what allows one schema layer to serve both request validation and
structured model output. Models: `claude-opus-5` for drafting, extraction, and
comparison, `claude-haiku-4-5` for cheap classification. Pre-1.0 version line,
so pin exactly and read the changelog on every bump.

#### Project fit and risks

Its only peer is `zod`, satisfied by this set. The architectural risk is not the
package but the pattern: AI output must never become a fact. The design keeps
that boundary outside the SDK — drafts are stored with a null approver, and
retrieval takes an engagement scope — so a change of model or provider does not
change the trust model. Pre-1.0 versioning means exact pinning and changelog
review on every bump.


### zod@4.4.3

- OpenSrc command: `opensrc path zod@4.4.3 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/colinhacks/zod/4.4.3`
- Package manifest: `packages/zod/package.json`
- Engines: `{}`
- Peer dependencies: `{}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{"./package.json":"./package.json",".":{"@zod/source":"./src/index.ts","types":"./index.d.cts","import":"./index.js","require":"./index.cjs"},"./mini":{"@zod/source":"./src/mini/index.ts","types":"./mini/index.d.cts","import":"./mini/index.js","require":"./mini/index.cjs"},"./locales":{"@zod/source":"./src/locales/index.ts","types":"./locales/index.d.cts","import":"./locales/index.js","require":"./locales/index.cjs"},"./v3":{"@zod/source":"./src/v3/index.ts","types":"./v3/index.d.cts","import":"./v3/index.js","require":"./v3/index.cjs"},"./v4":{"@zod/source":"./src/v4/index.ts","types":"./v4/index.d.cts","import":"./v4/index.js","require":"./v4/index.cjs"},"./v4-mini":{"@zod/source":"./src/v4-mini/index.ts","types":"./v4-mini/index.d.cts","import":"./v4-mini/index.js","require":"./v4-mini/index.cjs"},"./v4/mini":{"@zod/source":"./src/v4/mini/index.ts","types":"./v4/mini/index.d.cts","import":"./v4/mini/index.js","require":"./v4/mini/index.cjs"},"./v4/core":{"@zod/source":"./src/v4/core/index.ts","types":"./v4/core/index.d.cts","import":"./v4/core/index.js","require":"./v4/core/index.cjs"},"./v4/locales":{"@zod/source":"./src/v4/locales/index.ts","types":"./v4/locales/index.d.cts","import":"./v4/locales/index.js","require":"./v4/locales/index.cjs"},"./v4/locales/*":{"@zod/source":"./src/v4/locales/*","types":"./v4/locales/*","import":"./v4/locales/*","require":"./v4/locales/*"}}`
- Documentation inventory: `packages/docs/content/api.mdx`, `packages/docs/content/basics.mdx`, `packages/docs/content/blog/clerk-fellowship.mdx`, `packages/docs/content/codecs.mdx`, `packages/docs/content/ecosystem.mdx`, `packages/docs/content/error-customization.mdx`, `packages/docs/content/error-formatting.mdx`, `packages/docs/content/index.mdx`, `packages/docs/content/json-schema.mdx`, `packages/docs/content/library-authors.mdx`, `packages/docs/content/metadata.mdx`, `packages/docs/content/packages/core.mdx`, `packages/docs/content/packages/mini.mdx`, `packages/docs/content/packages/zod.mdx`, `packages/docs/content/v4/changelog.mdx`, `packages/docs/content/v4/index.mdx`, `packages/docs/content/v4/versioning.mdx`, `packages/docs/public/robots.txt`, `packages/docs/README.md`, `packages/docs-v3/CHANGELOG.md`, `packages/docs-v3/MIGRATION.md`, `packages/docs-v3/README.md`, `packages/resolution/README.md`, `packages/tsc/README.md`, `packages/zod/README.md`, `README.md`, `SECURITY.md`

#### Docs and source findings

Manifest reviewed from the version-matched source. It is the single validation
layer: request bodies, webhook payloads after signature verification, and
structured model output. It also satisfies the Anthropic SDK's declared peer
range, so there is no second schema library in the tree.

#### Project fit and risks

No conflict, and it removes a class of them by being the only schema library in
the tree. The one constraint to respect: the Anthropic SDK's peer range covers
both 3.25+ and 4.x, so a future downgrade for another package's sake would not
break it — but two schema libraries would, in review if not at runtime.


### pino@10.3.1

- OpenSrc command: `opensrc path pino@10.3.1 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/pinojs/pino/10.3.1`
- Package manifest: `package.json`
- Engines: `{}`
- Peer dependencies: `{}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{}`
- Documentation inventory: `docs/api.md`, `docs/asynchronous.md`, `docs/benchmarks.md`, `docs/browser.md`, `docs/bundling.md`, `docs/child-loggers.md`, `docs/diagnostics.md`, `docs/ecosystem.md`, `docs/help.md`, `docs/lts.md`, `docs/pretty.md`, `docs/redaction.md`, `docs/transports.md`, `docs/web.md`, `README.md`, `SECURITY.md`

#### Docs and source findings

Manifest reviewed from the version-matched source. Structured JSON logging with
redaction paths, which is the specific feature this product needs: link tokens,
session cookies, provider signatures, and client contact details must never
reach a log line. Logging is the one place where a convenience default leaks
exactly the material the security baseline promises to protect.

#### Project fit and risks

No peers and no conflicts. Its risk is a configuration risk rather than a
dependency one: redaction paths must be written and tested, because an unlogged
field cannot leak and a mis-specified redaction path silently logs the value it
was meant to hide. `TASK-110` covers this with the audit work.


### @sentry/nextjs@10.70.0

- OpenSrc command: `opensrc path @sentry/nextjs@10.70.0 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/getsentry/sentry-javascript/10.70.0`
- Package manifest: `packages/nextjs/package.json`
- Engines: `{"node":">=18"}`
- Peer dependencies: `{"next":"^13.2.0 || ^14.0 || ^15.0.0-rc.0 || ^16.0.0-0"}`
- Peer dependency metadata: `{}`
- Exports/runtime entry points: `{"./package.json":"./package.json",".":{"types":"./build/types/index.types.d.ts","edge":{"import":"./build/esm/edge/index.js","require":"./build/cjs/edge/index.js","default":"./build/esm/edge/index.js"},"edge-light":{"import":"./build/esm/edge/index.js","require":"./build/cjs/edge/index.js","default":"./build/esm/edge/index.js"},"worker":{"import":"./build/esm/edge/index.js","require":"./build/cjs/edge/index.js","default":"./build/esm/edge/index.js"},"workerd":{"import":"./build/esm/edge/index.js","require":"./build/cjs/edge/index.js","default":"./build/esm/edge/index.js"},"browser":{"import":"./build/esm/index.client.js","require":"./build/cjs/index.client.js"},"node":"./build/cjs/index.server.js","import":"./build/esm/index.server.js"},"./async-storage-shim":{"import":{"default":"./build/esm/config/templates/requestAsyncStorageShim.js"},"require":{"default":"./build/cjs/config/templates/requestAsyncStorageShim.js"}},"./import":{"import":{"default":"./build/import-hook.mjs"}},"./loader":{"import":{"default":"./build/loader-hook.mjs"}}}`
- Documentation inventory: `.agents/skills/triage-issue/scripts/README.md`, `CHANGELOG.md`, `dev-packages/browser-integration-tests/README.md`, `dev-packages/browser-integration-tests/suites/tracing/trace-lifetime/README.md`, `dev-packages/e2e-tests/README.md`, `dev-packages/e2e-tests/test-applications/angular-17/README.md`, `dev-packages/e2e-tests/test-applications/angular-18/README.md`, `dev-packages/e2e-tests/test-applications/angular-19/README.md`, `dev-packages/e2e-tests/test-applications/angular-20/README.md`, `dev-packages/e2e-tests/test-applications/angular-21/README.md`, `dev-packages/e2e-tests/test-applications/angular-22/README.md`, `dev-packages/e2e-tests/test-applications/astro-4/README.md`, `dev-packages/e2e-tests/test-applications/astro-5/README.md`, `dev-packages/e2e-tests/test-applications/astro-6/README.md`, `dev-packages/e2e-tests/test-applications/astro-6-cf-workers/README.md`, `dev-packages/e2e-tests/test-applications/create-remix-app-v2/README.md`, `dev-packages/e2e-tests/test-applications/ember-classic/README.md`, `dev-packages/e2e-tests/test-applications/ember-embroider/README.md`, `dev-packages/e2e-tests/test-applications/nestjs-fastify/README.md`, `dev-packages/e2e-tests/test-applications/nestjs-orchestrion/README.md`, `dev-packages/e2e-tests/test-applications/nextjs-16-userfeedback/README.md`, `dev-packages/e2e-tests/test-applications/node-exports-test-app/README.md`, `dev-packages/e2e-tests/test-applications/node-firebase/README.md`, `dev-packages/e2e-tests/test-applications/solid/README.md`, `dev-packages/e2e-tests/test-applications/solid-tanstack-router/README.md`, `dev-packages/e2e-tests/test-applications/solidstart/README.md`, `dev-packages/e2e-tests/test-applications/solidstart-dynamic-import/README.md`, `dev-packages/e2e-tests/test-applications/solidstart-spa/README.md`, `dev-packages/e2e-tests/test-applications/solidstart-top-level-import/README.md`, `dev-packages/e2e-tests/test-applications/svelte-5/README.md`, `dev-packages/e2e-tests/test-applications/sveltekit-2/README.md`, `dev-packages/e2e-tests/test-applications/sveltekit-2-kit-tracing/README.md`, `dev-packages/e2e-tests/test-applications/sveltekit-2-svelte-5/README.md`, `dev-packages/e2e-tests/test-applications/sveltekit-2.5.0-twp/README.md`, `dev-packages/e2e-tests/test-applications/sveltekit-cloudflare-pages/README.md`, `dev-packages/e2e-tests/test-applications/vue-3/README.md`, `dev-packages/e2e-tests/test-applications/vue-tanstack-router/README.md`, `dev-packages/node-core-integration-tests/README.md`, `dev-packages/node-integration-tests/README.md`, `dev-packages/rollup-utils/README.md`

#### Docs and source findings

Manifest reviewed from the version-matched source; `engines.node >=18` and peer
`next ^13.2.0 || ^14.0 || ^15.0.0-rc.0 || ^16.0.0-0`, which admits `next@16.3.1`.
Error reporting only. Client identifiers are scrubbed before send, and the
integration's own instrumentation is configured rather than accepted wholesale,
since default capture would otherwise carry request bodies containing client
data.

#### Project fit and risks

Its Next.js peer range admits the selected framework version, which is the only
hard compatibility question it raises. The risk is data rather than versions:
default error capture can carry request payloads containing client material, so
the integration ships with scrubbing configured from the first commit rather
than added after the first incident.


## Cross-package compatibility matrix

| Candidate A | Candidate B | Compatibility evidence and constraints |
|---|---|---|
| next@16.3.1 | react@19.2.8 | Registry metadata for `next@16.3.1` declares `react ^18.2.0 || ^19.0.0`; 19.2.8 is inside it. One renderer, no competing framework. |
| next@16.3.1 | react-dom@19.2.8 | Same published peer range as react. Next owns rendering and routing; react-dom is its renderer, not a second one. |
| next@16.3.1 | typescript@5.9.3 | Next ships its own TypeScript integration and declares no TypeScript peer, so the compiler version is the project's choice. 5.9.3 type-checks the App Router types this version emits. |
| next@16.3.1 | tailwindcss@4.3.3 | Coupled only through PostCSS, and only via `@tailwindcss/postcss`, which is missing from this candidate list and must be pinned at 4.3.3 in TASK-108. Verified against 26folio's working `postcss.config.mjs`. |
| next@16.3.1 | drizzle-orm@0.45.2 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| next@16.3.1 | drizzle-kit@0.31.10 | Migration tooling only, and it does not ship to production; `next@16.3.1` is unaffected by it at runtime. |
| next@16.3.1 | postgres@3.4.9 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| next@16.3.1 | better-auth@1.7.1 | Better Auth declares `next ^14 || ^15 || ^16` and ships a `./next-js` export subpath. It owns the operator session; Next owns the request lifecycle around it. |
| next@16.3.1 | pg-boss@12.27.0 | No package-level relationship, but a real deployment constraint: pg-boss needs a long-lived process, which the Next server alone does not provide. Resolved by running `web` and `worker` process groups from one image. |
| next@16.3.1 | @aws-sdk/client-s3@3.1114.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| next@16.3.1 | @aws-sdk/s3-request-presigner@3.1114.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| next@16.3.1 | postmark@5.1.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| next@16.3.1 | @react-pdf/renderer@4.6.1 | Both use React, but not the same renderer target. React PDF runs in the worker and produces bytes; Next never renders a PDF in a request path. |
| next@16.3.1 | @anthropic-ai/sdk@0.120.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| next@16.3.1 | zod@4.4.3 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| next@16.3.1 | pino@10.3.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| next@16.3.1 | @sentry/nextjs@10.70.0 | Sentry declares `next ^16.0.0-0`, which admits 16.3.1. It wraps the framework's instrumentation hooks; no other candidate competes for them. |
| react@19.2.8 | react-dom@19.2.8 | `react-dom` declares `react ^19.2.8` — satisfied exactly, not by range. They upgrade together. |
| react@19.2.8 | typescript@5.9.3 | TypeScript 5.9.3 consumes the declarations `react@19.2.8` ships; there is no runtime coupling and neither constrains the other's version. |
| react@19.2.8 | tailwindcss@4.3.3 | Tailwind is build-time CSS generation and never enters `react@19.2.8`'s runtime path. No shared peer, plugin, or configuration surface. |
| react@19.2.8 | drizzle-orm@0.45.2 | `drizzle-orm@0.45.2` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react@19.2.8 | drizzle-kit@0.31.10 | Migration tooling only, and it does not ship to production; `react@19.2.8` is unaffected by it at runtime. |
| react@19.2.8 | postgres@3.4.9 | `postgres@3.4.9` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react@19.2.8 | better-auth@1.7.1 | Better Auth declares `react ^18 || ^19` for its client hooks. Only the operator UI uses them. |
| react@19.2.8 | pg-boss@12.27.0 | `pg-boss@12.27.0` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react@19.2.8 | @aws-sdk/client-s3@3.1114.0 | `@aws-sdk/client-s3@3.1114.0` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react@19.2.8 | @aws-sdk/s3-request-presigner@3.1114.0 | `@aws-sdk/s3-request-presigner@3.1114.0` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react@19.2.8 | postmark@5.1.0 | `postmark@5.1.0` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react@19.2.8 | @react-pdf/renderer@4.6.1 | React PDF declares `react ^16.8 || ^17 || ^18 || ^19`; 19.2.8 satisfies it. Two reconcilers coexist by design — DOM in the web process, PDF in the worker — and never render the same tree. |
| react@19.2.8 | @anthropic-ai/sdk@0.120.0 | `@anthropic-ai/sdk@0.120.0` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react@19.2.8 | zod@4.4.3 | `zod@4.4.3` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react@19.2.8 | pino@10.3.1 | `pino@10.3.1` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react@19.2.8 | @sentry/nextjs@10.70.0 | `@sentry/nextjs@10.70.0` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react-dom@19.2.8 | typescript@5.9.3 | TypeScript 5.9.3 consumes the declarations `react-dom@19.2.8` ships; there is no runtime coupling and neither constrains the other's version. |
| react-dom@19.2.8 | tailwindcss@4.3.3 | Tailwind is build-time CSS generation and never enters `react-dom@19.2.8`'s runtime path. No shared peer, plugin, or configuration surface. |
| react-dom@19.2.8 | drizzle-orm@0.45.2 | `drizzle-orm@0.45.2` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react-dom@19.2.8 | drizzle-kit@0.31.10 | Migration tooling only, and it does not ship to production; `react-dom@19.2.8` is unaffected by it at runtime. |
| react-dom@19.2.8 | postgres@3.4.9 | `postgres@3.4.9` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react-dom@19.2.8 | better-auth@1.7.1 | `better-auth@1.7.1` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react-dom@19.2.8 | pg-boss@12.27.0 | `pg-boss@12.27.0` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react-dom@19.2.8 | @aws-sdk/client-s3@3.1114.0 | `@aws-sdk/client-s3@3.1114.0` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react-dom@19.2.8 | @aws-sdk/s3-request-presigner@3.1114.0 | `@aws-sdk/s3-request-presigner@3.1114.0` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react-dom@19.2.8 | postmark@5.1.0 | `postmark@5.1.0` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react-dom@19.2.8 | @react-pdf/renderer@4.6.1 | `@react-pdf/renderer@4.6.1` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react-dom@19.2.8 | @anthropic-ai/sdk@0.120.0 | `@anthropic-ai/sdk@0.120.0` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react-dom@19.2.8 | zod@4.4.3 | `zod@4.4.3` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react-dom@19.2.8 | pino@10.3.1 | `pino@10.3.1` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| react-dom@19.2.8 | @sentry/nextjs@10.70.0 | `@sentry/nextjs@10.70.0` is a server-side library with no React peer or component surface; the two never appear in the same module graph beyond the shared Node runtime. |
| typescript@5.9.3 | tailwindcss@4.3.3 | TypeScript 5.9.3 consumes the declarations `tailwindcss@4.3.3` ships; there is no runtime coupling and neither constrains the other's version. |
| typescript@5.9.3 | drizzle-orm@0.45.2 | Drizzle's schema types are inferred, so the compiler version is what makes an out-of-scope query a compile error rather than a runtime leak. 5.9.3 handles the inference this version emits. |
| typescript@5.9.3 | drizzle-kit@0.31.10 | TypeScript 5.9.3 consumes the declarations `drizzle-kit@0.31.10` ships; there is no runtime coupling and neither constrains the other's version. |
| typescript@5.9.3 | postgres@3.4.9 | TypeScript 5.9.3 consumes the declarations `postgres@3.4.9` ships; there is no runtime coupling and neither constrains the other's version. |
| typescript@5.9.3 | better-auth@1.7.1 | TypeScript 5.9.3 consumes the declarations `better-auth@1.7.1` ships; there is no runtime coupling and neither constrains the other's version. |
| typescript@5.9.3 | pg-boss@12.27.0 | TypeScript 5.9.3 consumes the declarations `pg-boss@12.27.0` ships; there is no runtime coupling and neither constrains the other's version. |
| typescript@5.9.3 | @aws-sdk/client-s3@3.1114.0 | TypeScript 5.9.3 consumes the declarations `@aws-sdk/client-s3@3.1114.0` ships; there is no runtime coupling and neither constrains the other's version. |
| typescript@5.9.3 | @aws-sdk/s3-request-presigner@3.1114.0 | TypeScript 5.9.3 consumes the declarations `@aws-sdk/s3-request-presigner@3.1114.0` ships; there is no runtime coupling and neither constrains the other's version. |
| typescript@5.9.3 | postmark@5.1.0 | TypeScript 5.9.3 consumes the declarations `postmark@5.1.0` ships; there is no runtime coupling and neither constrains the other's version. |
| typescript@5.9.3 | @react-pdf/renderer@4.6.1 | TypeScript 5.9.3 consumes the declarations `@react-pdf/renderer@4.6.1` ships; there is no runtime coupling and neither constrains the other's version. |
| typescript@5.9.3 | @anthropic-ai/sdk@0.120.0 | TypeScript 5.9.3 consumes the declarations `@anthropic-ai/sdk@0.120.0` ships; there is no runtime coupling and neither constrains the other's version. |
| typescript@5.9.3 | zod@4.4.3 | Zod 4 relies on modern inference; 5.9.3 is well inside its supported range. Schema-derived types are the shared vocabulary between validation and the data layer. |
| typescript@5.9.3 | pino@10.3.1 | TypeScript 5.9.3 consumes the declarations `pino@10.3.1` ships; there is no runtime coupling and neither constrains the other's version. |
| typescript@5.9.3 | @sentry/nextjs@10.70.0 | TypeScript 5.9.3 consumes the declarations `@sentry/nextjs@10.70.0` ships; there is no runtime coupling and neither constrains the other's version. |
| tailwindcss@4.3.3 | drizzle-orm@0.45.2 | Tailwind is build-time CSS generation and never enters `drizzle-orm@0.45.2`'s runtime path. No shared peer, plugin, or configuration surface. |
| tailwindcss@4.3.3 | drizzle-kit@0.31.10 | Tailwind is build-time CSS generation and never enters `drizzle-kit@0.31.10`'s runtime path. No shared peer, plugin, or configuration surface. |
| tailwindcss@4.3.3 | postgres@3.4.9 | Tailwind is build-time CSS generation and never enters `postgres@3.4.9`'s runtime path. No shared peer, plugin, or configuration surface. |
| tailwindcss@4.3.3 | better-auth@1.7.1 | Tailwind is build-time CSS generation and never enters `better-auth@1.7.1`'s runtime path. No shared peer, plugin, or configuration surface. |
| tailwindcss@4.3.3 | pg-boss@12.27.0 | Tailwind is build-time CSS generation and never enters `pg-boss@12.27.0`'s runtime path. No shared peer, plugin, or configuration surface. |
| tailwindcss@4.3.3 | @aws-sdk/client-s3@3.1114.0 | Tailwind is build-time CSS generation and never enters `@aws-sdk/client-s3@3.1114.0`'s runtime path. No shared peer, plugin, or configuration surface. |
| tailwindcss@4.3.3 | @aws-sdk/s3-request-presigner@3.1114.0 | Tailwind is build-time CSS generation and never enters `@aws-sdk/s3-request-presigner@3.1114.0`'s runtime path. No shared peer, plugin, or configuration surface. |
| tailwindcss@4.3.3 | postmark@5.1.0 | Tailwind is build-time CSS generation and never enters `postmark@5.1.0`'s runtime path. No shared peer, plugin, or configuration surface. |
| tailwindcss@4.3.3 | @react-pdf/renderer@4.6.1 | Tailwind is build-time CSS generation and never enters `@react-pdf/renderer@4.6.1`'s runtime path. No shared peer, plugin, or configuration surface. |
| tailwindcss@4.3.3 | @anthropic-ai/sdk@0.120.0 | Tailwind is build-time CSS generation and never enters `@anthropic-ai/sdk@0.120.0`'s runtime path. No shared peer, plugin, or configuration surface. |
| tailwindcss@4.3.3 | zod@4.4.3 | Tailwind is build-time CSS generation and never enters `zod@4.4.3`'s runtime path. No shared peer, plugin, or configuration surface. |
| tailwindcss@4.3.3 | pino@10.3.1 | Tailwind is build-time CSS generation and never enters `pino@10.3.1`'s runtime path. No shared peer, plugin, or configuration surface. |
| tailwindcss@4.3.3 | @sentry/nextjs@10.70.0 | Tailwind is build-time CSS generation and never enters `@sentry/nextjs@10.70.0`'s runtime path. No shared peer, plugin, or configuration surface. |
| drizzle-orm@0.45.2 | drizzle-kit@0.31.10 | Same project, paired versions: the ORM defines the schema, the kit generates and applies migrations from it. RLS policies are hand-written into those generated files. |
| drizzle-orm@0.45.2 | postgres@3.4.9 | Drizzle declares `postgres >=3` as an optional peer and 3.4.9 satisfies it. postgres.js is the driver for every application query. |
| drizzle-orm@0.45.2 | better-auth@1.7.1 | Better Auth declares `drizzle-orm ^0.45.2 || >=1.0.0-rc.1 <2.0.0` and depends on `@better-auth/drizzle-adapter`. Auth tables live in the same database and the same migration history as the engagement schema, which is what keeps one backup sufficient. |
| drizzle-orm@0.45.2 | pg-boss@12.27.0 | The load-bearing pair. `docs/api/adapters.md` documents `fromDrizzle(tx, sql)`, which executes `boss.send()` inside a Drizzle transaction and rolls the job back with it; both the node-postgres and postgres-js drivers are named as supported. Ownership stays split: Drizzle owns application tables, pg-boss owns its own schema. |
| drizzle-orm@0.45.2 | @aws-sdk/client-s3@3.1114.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| drizzle-orm@0.45.2 | @aws-sdk/s3-request-presigner@3.1114.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| drizzle-orm@0.45.2 | postmark@5.1.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| drizzle-orm@0.45.2 | @react-pdf/renderer@4.6.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| drizzle-orm@0.45.2 | @anthropic-ai/sdk@0.120.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| drizzle-orm@0.45.2 | zod@4.4.3 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| drizzle-orm@0.45.2 | pino@10.3.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| drizzle-orm@0.45.2 | @sentry/nextjs@10.70.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| drizzle-kit@0.31.10 | postgres@3.4.9 | Migration tooling only, and it does not ship to production; `postgres@3.4.9` is unaffected by it at runtime. |
| drizzle-kit@0.31.10 | better-auth@1.7.1 | Better Auth declares `drizzle-kit >=0.31.4 || >=1.0.0-beta.1`; 0.31.10 satisfies the first branch. Its schema generation feeds the same migration pipeline as the application schema. |
| drizzle-kit@0.31.10 | pg-boss@12.27.0 | Migration tooling only, and it does not ship to production; `pg-boss@12.27.0` is unaffected by it at runtime. |
| drizzle-kit@0.31.10 | @aws-sdk/client-s3@3.1114.0 | Migration tooling only, and it does not ship to production; `@aws-sdk/client-s3@3.1114.0` is unaffected by it at runtime. |
| drizzle-kit@0.31.10 | @aws-sdk/s3-request-presigner@3.1114.0 | Migration tooling only, and it does not ship to production; `@aws-sdk/s3-request-presigner@3.1114.0` is unaffected by it at runtime. |
| drizzle-kit@0.31.10 | postmark@5.1.0 | Migration tooling only, and it does not ship to production; `postmark@5.1.0` is unaffected by it at runtime. |
| drizzle-kit@0.31.10 | @react-pdf/renderer@4.6.1 | Migration tooling only, and it does not ship to production; `@react-pdf/renderer@4.6.1` is unaffected by it at runtime. |
| drizzle-kit@0.31.10 | @anthropic-ai/sdk@0.120.0 | Migration tooling only, and it does not ship to production; `@anthropic-ai/sdk@0.120.0` is unaffected by it at runtime. |
| drizzle-kit@0.31.10 | zod@4.4.3 | Migration tooling only, and it does not ship to production; `zod@4.4.3` is unaffected by it at runtime. |
| drizzle-kit@0.31.10 | pino@10.3.1 | Migration tooling only, and it does not ship to production; `pino@10.3.1` is unaffected by it at runtime. |
| drizzle-kit@0.31.10 | @sentry/nextjs@10.70.0 | Migration tooling only, and it does not ship to production; `@sentry/nextjs@10.70.0` is unaffected by it at runtime. |
| postgres@3.4.9 | better-auth@1.7.1 | Better Auth reaches the database through the Drizzle adapter, so postgres.js serves it indirectly. Its `pg ^8.0.0` peer applies only to the node-postgres adapter, which this design does not use. |
| postgres@3.4.9 | pg-boss@12.27.0 | Two PostgreSQL drivers in one tree: postgres.js here, `pg ^8.22.0` inside pg-boss. Bounded deliberately — pg-boss owns its own pool for polling and maintenance, application queries never use it, and transactional enqueue crosses the boundary only through the documented Drizzle adapter. Both connect to the same database, so connection limits are budgeted per process group. |
| postgres@3.4.9 | @aws-sdk/client-s3@3.1114.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| postgres@3.4.9 | @aws-sdk/s3-request-presigner@3.1114.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| postgres@3.4.9 | postmark@5.1.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| postgres@3.4.9 | @react-pdf/renderer@4.6.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| postgres@3.4.9 | @anthropic-ai/sdk@0.120.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| postgres@3.4.9 | zod@4.4.3 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| postgres@3.4.9 | pino@10.3.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| postgres@3.4.9 | @sentry/nextjs@10.70.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| better-auth@1.7.1 | pg-boss@12.27.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| better-auth@1.7.1 | @aws-sdk/client-s3@3.1114.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| better-auth@1.7.1 | @aws-sdk/s3-request-presigner@3.1114.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| better-auth@1.7.1 | postmark@5.1.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| better-auth@1.7.1 | @react-pdf/renderer@4.6.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| better-auth@1.7.1 | @anthropic-ai/sdk@0.120.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| better-auth@1.7.1 | zod@4.4.3 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| better-auth@1.7.1 | pino@10.3.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| better-auth@1.7.1 | @sentry/nextjs@10.70.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| pg-boss@12.27.0 | @aws-sdk/client-s3@3.1114.0 | Document rendering and export jobs write to object storage from the worker. No shared configuration beyond credentials held in the same secret store. |
| pg-boss@12.27.0 | @aws-sdk/s3-request-presigner@3.1114.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| pg-boss@12.27.0 | postmark@5.1.0 | Email send is a job, not a request-path call, so delivery retries and idempotency are the queue's concern and deliverability is Postmark's. |
| pg-boss@12.27.0 | @react-pdf/renderer@4.6.1 | The worker is where they meet: a job renders the acceptance copy, hashes the bytes, and stores them. Neither knows about the other beyond that handler. |
| pg-boss@12.27.0 | @anthropic-ai/sdk@0.120.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| pg-boss@12.27.0 | zod@4.4.3 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| pg-boss@12.27.0 | pino@10.3.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| pg-boss@12.27.0 | @sentry/nextjs@10.70.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @aws-sdk/client-s3@3.1114.0 | @aws-sdk/s3-request-presigner@3.1114.0 | Same AWS SDK v3 release train and identical version. Mismatched versions across v3 packages are a known source of signature errors, so they are pinned together. |
| @aws-sdk/client-s3@3.1114.0 | postmark@5.1.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @aws-sdk/client-s3@3.1114.0 | @react-pdf/renderer@4.6.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @aws-sdk/client-s3@3.1114.0 | @anthropic-ai/sdk@0.120.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @aws-sdk/client-s3@3.1114.0 | zod@4.4.3 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @aws-sdk/client-s3@3.1114.0 | pino@10.3.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @aws-sdk/client-s3@3.1114.0 | @sentry/nextjs@10.70.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @aws-sdk/s3-request-presigner@3.1114.0 | postmark@5.1.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @aws-sdk/s3-request-presigner@3.1114.0 | @react-pdf/renderer@4.6.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @aws-sdk/s3-request-presigner@3.1114.0 | @anthropic-ai/sdk@0.120.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @aws-sdk/s3-request-presigner@3.1114.0 | zod@4.4.3 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @aws-sdk/s3-request-presigner@3.1114.0 | pino@10.3.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @aws-sdk/s3-request-presigner@3.1114.0 | @sentry/nextjs@10.70.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| postmark@5.1.0 | @react-pdf/renderer@4.6.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| postmark@5.1.0 | @anthropic-ai/sdk@0.120.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| postmark@5.1.0 | zod@4.4.3 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| postmark@5.1.0 | pino@10.3.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| postmark@5.1.0 | @sentry/nextjs@10.70.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @react-pdf/renderer@4.6.1 | @anthropic-ai/sdk@0.120.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @react-pdf/renderer@4.6.1 | zod@4.4.3 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @react-pdf/renderer@4.6.1 | pino@10.3.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @react-pdf/renderer@4.6.1 | @sentry/nextjs@10.70.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @anthropic-ai/sdk@0.120.0 | zod@4.4.3 | The SDK declares `zod ^3.25.0 || ^4.0.0`; 4.4.3 satisfies it. One schema layer covers request validation and structured model output. |
| @anthropic-ai/sdk@0.120.0 | pino@10.3.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| @anthropic-ai/sdk@0.120.0 | @sentry/nextjs@10.70.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| zod@4.4.3 | pino@10.3.1 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| zod@4.4.3 | @sentry/nextjs@10.70.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |
| pino@10.3.1 | @sentry/nextjs@10.70.0 | No shared peer, plugin, build, or configuration surface. Both are plain Node libraries, and their only common constraint is the Node 22.12.0 floor this set inherits from pg-boss and satisfies on 22.19.0. |

## Combined architecture and best-practice conclusion

Three overlaps exist in this set, and each one has a stated owner.

**Two PostgreSQL drivers.** postgres.js serves every application query through
Drizzle. `pg`, a dependency of pg-boss, serves only pg-boss's own pooling,
polling, and maintenance. They never share a transaction implicitly; the one
place the boundary is crossed is `fromDrizzle(tx, sql)`, which pg-boss documents
for exactly this purpose. Connection limits are budgeted per process group
because both drivers open pools against the same database.

**Two schema authorities.** Drizzle owns the application schema and its
migrations, including the row-level security policies. pg-boss owns its own
schema and migrates itself on start. Neither generates into the other's tables,
and application migrations never touch the queue's.

**Two React reconcilers.** react-dom renders the web process. React PDF renders
documents in the worker. They share the React version and nothing else, and no
code path renders one tree through both.

System-wide conventions this project adopts: exact versions with a committed
lockfile, ESM-first application code, one validation library (Zod) at every
trust boundary, one logger (pino) with redaction configured before the first
handler, one queue for anything that can be retried, and no business state
written outside the service layer. Where a library's documentation prescribes a
convenience default that weakens an EPIC-025 guarantee — Sentry's broad default
capture, an auth library's willingness to mint sessions for anyone — the guard
is written first and the default is not used.

Node 22.12.0 is the project's engine floor, set by pg-boss and pinned in CI and
the deployment image.

## Package-manager compatibility result

The pre-install resolver ran while this plan was created. It installed no package
payloads.

- Result: **accepted**
- Exit status: `0`
- Standard output: `up to date in 3m 209 packages are looking for funding run 'npm fund' for details`
- Warnings/errors: none

The resolver accepted the complete candidate set with exit status 0 and no
warnings, which rules out the failure this step exists to catch: an
unsatisfiable peer graph across eighteen packages, several of which
(better-auth, drizzle-orm, drizzle-kit, react, react-dom, next) constrain each
other directly.

Two limits on what that proves, stated plainly:

1. **It resolved against the wrong project.** The dry run ran inside 26folio,
   against the portfolio's existing graph, because the client-operations
   repository does not exist yet. It therefore proves the candidates are
   mutually satisfiable and compatible with a Next.js and React application
   graph on Node 22 — not that they resolve inside a repository that has not
   been created. `TASK-108` re-runs resolution in the new repository as its
   first verification step.
2. **Resolution is not runtime fit.** Nothing in a dependency graph proves that
   R2 honours the S3 calls this design makes, that React PDF's output is stable
   enough to hash, that pg-boss's Drizzle adapter behaves as documented against
   postgres.js, or that Better Auth's session cookie is scoped as intended. Each
   of those is a probe in the verification list below.

One gap the resolver could not report, because the package was never offered to
it: `@tailwindcss/postcss@4.3.3` is required alongside `tailwindcss@4.3.3` and is
absent from this plan's candidate list.

## Verification after installation

Each probe is small, and each one fails loudly if a specific assumption in this
plan is wrong. `TASK-108` runs them in the new repository.

1. `npm ci` from the committed lockfile on Node 22.19.0, then `npm run build` and
   `tsc --noEmit`. Proves resolution and type-check in the real project rather
   than in 26folio.
2. A page styled with a Tailwind utility renders styled. Proves
   `@tailwindcss/postcss` was actually added and pinned.
3. `drizzle-kit` generates and applies a baseline migration containing one table
   with a row-level security policy, and a client-role connection is denied a
   row outside its scope. Proves the isolation mechanism, not just the ORM.
4. pg-boss starts, creates a queue, and `boss.send()` runs inside a Drizzle
   transaction through `fromDrizzle(tx, sql)`; rolling that transaction back
   leaves no job. Proves the transactional-enqueue claim this design rests on.
5. Better Auth signs the operator in, and the session cookie is observed scoped
   to the ops host and absent from a request to the client host. Proves the
   two-origin boundary.
6. A presigned PUT uploads a file to R2 and a presigned GET retrieves it; the
   server reads the object's metadata and hash afterwards. Proves R2's S3
   compatibility for the exact operations used.
7. React PDF renders a one-page document in the worker; rendering it twice
   produces identical bytes and therefore an identical SHA-256. Proves the
   acceptance copy can be hashed meaningfully.
8. Postmark delivers one message to a real inbox from the configured sending
   domain, with SPF and DKIM passing.
9. The Anthropic SDK returns a structured response validated by a Zod schema,
   confirming the peer pairing works in practice.
10. A deliberate error reaches Sentry with client identifiers scrubbed; a log
    line containing a link token is emitted and observed redacted by pino.

Probes 3, 4, 5, and 10 are the ones that must not be skipped. They are the
mechanisms the security baseline promises.

## Human decision

AGENT: after completing every required field, change `status` to
`review-ready`.

HUMAN: review the evidence and exact versions. If approved, change `status` to
`approved` and `human_approval` to `approved`. The OS install command will
not run this plan until then. Direct package-manager commands remain available
because the OS does not gate pushes.

## Licenses

Read from the registry metadata for each exact version. Every candidate is a
permissive licence with no copyleft obligation and no commercial-use
restriction, so nothing in this set constrains a private, closed application.

| Candidate | License |
|---|---|
| next@16.3.1 | MIT |
| react@19.2.8 | MIT |
| react-dom@19.2.8 | MIT |
| typescript@5.9.3 | Apache-2.0 |
| tailwindcss@4.3.3 | MIT |
| drizzle-orm@0.45.2 | Apache-2.0 |
| drizzle-kit@0.31.10 | MIT |
| postgres@3.4.9 | Unlicense |
| better-auth@1.7.1 | MIT |
| pg-boss@12.27.0 | MIT |
| @aws-sdk/client-s3@3.1114.0 | Apache-2.0 |
| @aws-sdk/s3-request-presigner@3.1114.0 | Apache-2.0 |
| postmark@5.1.0 | MIT |
| @react-pdf/renderer@4.6.1 | MIT |
| @anthropic-ai/sdk@0.120.0 | MIT |
| zod@4.4.3 | MIT |
| pino@10.3.1 | MIT |
| @sentry/nextjs@10.70.0 | MIT |

Self-hosting implications: none of these are hosted services in disguise.
PostgreSQL 17 (PostgreSQL License) is the one server-side component the project
runs rather than imports, and it is managed by the platform rather than
self-operated.

## Hosted services and their API versions

Services are not npm packages, so their versions are the ones their own
documentation names. Pricing is deliberately absent: every published price is a
current estimate to confirm at `TASK-108`, not a durable fact.

| Service | Version / surface | Evidence | Exit path |
|---|---|---|---|
| Lenco (by BroadPay) | Collections API v2.0, `POST /collections/mobile-money`, statuses `pending`/`successful`/`failed`/`pay-offline`, operators `mtn`/`airtel`/`zamtel`, currency ZMW. Webhooks signed `X-Lenco-Signature` (HMAC-SHA512 over the raw body, key derived from the API token), unacknowledged events retried hourly for 24 hours, plus a collection status requery endpoint. | Official API reference (`lenco-api.readme.io`) | Payment adapter interface; swap the implementation module. |
| Flutterwave | v3 Zambia mobile money collections in ZMW, `charge.completed` webhook plus an independent verification endpoint. Documented as available to Zambian merchants by default. | Official developer documentation | Documented fallback adapter. |
| Stripe | Not applicable while the invoicing entity is Zambian: Stripe's published country list does not include Zambia, and its African coverage is Côte d'Ivoire plus the Paystack extended network. | `stripe.com/global` | Becomes the international card adapter only if the entity moves to a supported country. |
| Anthropic API | `@anthropic-ai/sdk@0.120.0`; models `claude-opus-5` and `claude-haiku-4-5`. No embeddings endpoint is published, which is why retrieval is PostgreSQL full-text search in the first release. | SDK manifest and current model reference | Model calls sit behind one module; drafts are never facts, so a provider change does not change the trust model. |
| Cloudflare R2 | S3-compatible API, consumed through AWS SDK v3. | AWS SDK v3 client used against the S3 API surface | Any S3-compatible provider: endpoint and credentials. |
| Postmark | Transactional API via the official `postmark@5.1.0` client. | Package manifest (ActiveCampaign) | One email module behind an interface; Resend 6.20.0 is the evaluated alternative. |
| Fly.io | Two process groups from one image. Region note: Fly lists exactly one African region, Johannesburg, and Managed Postgres is **not** available there, so app and database run together in a European region instead of being split. | Official Fly regions reference | Standard Node container plus managed PostgreSQL; nothing in the application depends on Fly-specific APIs. |
