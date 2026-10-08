---
id: "DEP-20261008-165023-architecture"
mode: "architecture"
status: "approved"
human_approval: "approved"
purpose: "Cloudflare Workers hosting for the Next.js 15.5 site: OpenNext adapter, Wrangler, and the Next patch the adapter requires"
opensrc_cli: "0.7.2"
created_at: "2026-10-08T16:50:23Z"
packages:
  - "@opennextjs/cloudflare@1.20.9"
  - "wrangler@4.148.0"
  - "next@15.5.27"
---

# Dependency evidence: Cloudflare Workers hosting for the Next.js 15.5 site: OpenNext adapter, Wrangler, and the Next patch the adapter requires

OpenSrc fetched the exact candidate sources before project packages were
installed. OpenSrc is evidence access, not proof of compatibility.

Owner decision of 2026-10-08 (`project-state/decisions.md`): the site is hosted
on Cloudflare. This plan covers TASK-129 of EPIC-028. It changes
`package.json` and `package-lock.json`, so it needs human approval before any
install.

## Candidate evidence

### @opennextjs/cloudflare@1.20.9

- OpenSrc command: `opensrc path @opennextjs/cloudflare@1.20.9 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/opennextjs/opennextjs-cloudflare/1.20.9/packages/cloudflare`
- Package manifest: `package.json`
- Engines: `{}`
- Peer dependencies: `{"next":">=15.5.27 <16 || >=16.3.8","rclone.js":"^0.6.6","wrangler":"catalog:"}` (the npm registry resolves `wrangler` to `^4.125.0`)
- Peer dependency metadata: `{"rclone.js":{"optional":true}}`
- Exports/runtime entry points: `{".":{"import":"./dist/api/index.js"},"./*":{"import":"./dist/api/*.js"}}`
- Documentation inventory: `CHANGELOG.md`, `README.md`, `templates/wrangler.jsonc`, `templates/open-next.config.ts`

#### Docs and source findings

- The CLI has `build`, `preview`, `deploy`, `upload`, `populate-cache`,
  `migrate` and `skew-protection` commands. The README flow is
  `opennextjs-cloudflare build`, then `wrangler dev` (local) or
  `opennextjs-cloudflare deploy`. The adapter wraps `next build`, so the
  existing `npm run build` keeps working as the Next-only build.
- The template Worker (`src/cli/templates/worker.ts`) serves `/_next/image`
  itself, hands everything else to the Next server handler, and serves static
  output from an `ASSETS` binding. Static pages stay static assets.
- `templates/wrangler.jsonc` sets compatibility flags `nodejs_compat` and
  `global_fetch_strictly_public`, an `ASSETS` binding on `.open-next/assets`,
  a `WORKER_SELF_REFERENCE` service binding, an optional R2 incremental-cache
  bucket, and an `images` binding named `IMAGES`.
- Images: `src/cli/templates/images.ts` handles `/_next/image`. Local paths
  are fetched from `ASSETS`; transforms use the `IMAGES` binding. The file
  states that optimization is disabled and the original is returned if
  `env.IMAGES` is undefined, and SVG is only passed through when
  `__IMAGES_ALLOW_SVG__` is set. So `next/image` can stay as it is, either
  optimized with the binding or served as originals without it.
- Environment: `src/cli/templates/init.ts` runs `populateProcessEnv` on each
  request, copying Worker `env` string bindings into `process.env`. The
  existing `src/lib/env.ts` therefore works unchanged on Workers, provided it
  is first read during a request. `NEXT_PUBLIC_*` values are inlined at build.
- Changelog: 1.20.8 raised the supported Next floor to 15.5.27 "to include the
  latest security fixes"; 1.20.7 raised it to 15.5.26 over a critical
  `next/og` vulnerability. 1.20.9 isolates module-loading cache state between
  concurrent requests.
- The adapter's R2 incremental cache and Durable Object cache pieces are
  needed for ISR and `revalidate`. This site has no ISR; its one dynamic
  route (`/api/contact`) does no caching. The plan leaves the incremental
  cache at its default (no cache bindings) and does not create an R2 bucket.
  This is a decision for the human to confirm below.
- Windows: no statement about Windows support was found in the README,
  CONTRIBUTING or AGENTS files of this version. This is unverified for the
  owner's machine; see Verification.

#### Project fit and risks

- Fits: Next 15.5 App Router, React 19.1, one Node-runtime route handler, no
  middleware, no ISR, static pages. The route handler uses only web-standard
  APIs (TASK-122 decision), so `nodejs_compat` is the only runtime flag
  needed.
- 1.20.9 is the latest release at planning time. The adapter's floor on Next
  tracks security fixes, so staying on a current adapter is part of keeping
  the site patched.
- Risks: a new build step and a bundling layer (`@opennextjs/aws@4.1.8`) that
  patches Next's compiled output; native dependency `@ast-grep/napi`; the
  adapter is young and its release cadence is fast. Mitigated by pinning exact
  versions and by the preview-deployment check in TASK-128.

### wrangler@4.148.0

- OpenSrc command: `opensrc path wrangler@4.148.0 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/cloudflare/workers-sdk/4.148.0/packages/wrangler`
- Package manifest: `package.json`
- Engines: `{"node":">=22.0.0"}`
- Peer dependencies: `{"@cloudflare/workers-types":"catalog:default"}`
- Peer dependency metadata: `{"@cloudflare/workers-types":{"optional":true}}`
- Exports/runtime entry points: `{".":{"default":"./wrangler-dist/cli.js"},"./experimental-config":{"import":"./wrangler-dist/experimental-config.mjs"}}`
- Documentation inventory: `README.md`, `CHANGELOG.md`

#### Docs and source findings

- Wrangler is the Cloudflare CLI that runs the Worker locally (`wrangler dev`,
  which reads secrets from a gitignored `.dev.vars`), manages secrets
  (`wrangler secret put`) and deploys. The adapter's `preview` and `deploy`
  commands call it.
- It requires Node 22 or newer. The repository runs Node 22.19.0, so the
  engine requirement is met without changing the toolchain.
- The adapter declares `wrangler ^4.125.0` as a peer; 4.148.0 is inside that
  range and is the current release.

#### Project fit and risks

- It is a dev dependency only; nothing from it ships in the Worker bundle.
- Wrangler is released very frequently. Exact pinning and a lockfile are the
  guard; upgrades should be deliberate.

### next@15.5.27

- OpenSrc command: `opensrc path next@15.5.27 --cwd .`
- Evidence cache used for this review: `C:/Users/abesa/.opensrc/repos/github.com/vercel/next.js/15.5.27`
- Package manifest: `packages/next/package.json`
- Engines: `{"node":"^18.18.0 || ^19.8.0 || >= 20.0.0"}`
- Peer dependencies: `{"react":"^18.2.0 || ^19.0.0","react-dom":"^18.2.0 || ^19.0.0","sass":"^1.3.0","@opentelemetry/api":"^1.1.0","@playwright/test":"^1.51.1","babel-plugin-react-compiler":"*"}`
- Peer dependency metadata: all of `sass`, `@opentelemetry/api`, `@playwright/test` and `babel-plugin-react-compiler` are optional.
- Exports/runtime entry points: `{}`
- Documentation inventory: `docs/01-app/01-getting-started/12-images.mdx`, `15-route-handlers-and-middleware.mdx`, `16-deploying.mdx`, `17-upgrading.mdx`

#### Docs and source findings

- This is a patch bump inside the 15.5 line (the repository is on 15.5.19),
  so no migration guide applies. The only reason to move is that the adapter
  refuses Next below 15.5.27, and that floor exists for security fixes.
- The repository's React 19.1.0 and react-dom 19.1.0 satisfy the peer range.

#### Project fit and risks

- Risk is low: same minor version, same major, no config change expected.
  `eslint-config-next` is not pinned to the same patch in the manifest; its
  compatibility is checked by the lint run after install.

## Cross-package compatibility matrix

| Candidate A | Candidate B | Compatibility evidence and constraints |
|---|---|---|
| @opennextjs/cloudflare@1.20.9 | wrangler@4.148.0 | Adapter peer is `^4.125.0`; 4.148.0 satisfies it. The adapter's `preview` and `deploy` shell out to Wrangler. Wrangler needs Node >=22; the repo runs 22.19.0. |
| @opennextjs/cloudflare@1.20.9 | next@15.5.27 | Adapter peer is `>=15.5.27 <16 || >=16.3.8`; 15.5.27 is exactly the floor. Next 15.5.19, the current version, is outside the range, so the Next patch bump is required, not optional. |
| wrangler@4.148.0 | next@15.5.27 | No direct constraint. Wrangler runs the bundle the adapter produces, not Next. |

## Combined architecture and best-practice conclusion

- Ownership: Next builds the app; the adapter patches and bundles that build
  into one Worker plus a static assets directory; Wrangler configures and runs
  the Worker and owns secrets. Cloudflare's edge owns the rate-limiting rule
  and Turnstile. No overlap needs reconciling.
- Pattern: the OpenNext template, trimmed. Keep `nodejs_compat` and
  `global_fetch_strictly_public`, the `ASSETS` binding and the `IMAGES`
  binding. Drop the R2 incremental cache and the self-reference service
  binding unless the owner wants ISR later, because the site has none.
- Images: keep `next/image` unchanged and enable the `IMAGES` binding so
  `/_next/image` optimizes. If the binding's quota or cost is a problem, the
  fallback is `images.unoptimized` with pre-sized assets. Either way the ASCII
  filename rule stays and every image URL is verified by fetching.
- Secrets: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `TURNSTILE_SECRET_KEY` are
  Wrangler secrets; `RESEND_FROM_EMAIL` is a plain variable;
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is a build-time variable. Locally they go
  in the gitignored `.dev.vars` and `.env.local`.
- Rate limit: the WAF rule from the TASK-122 record, configured in the
  dashboard and documented in the launch checklist; nothing here installs it.
- Conventions: exact version pins (no carets), `npm run build` stays the
  Next-only check, new scripts `cf:build`, `cf:preview` and `cf:deploy` wrap
  the adapter commands.

## Package-manager compatibility result

The pre-install resolver ran while this plan was created. It installed no package
payloads.

- Result: **accepted**
- Exit status: `0`
- Standard output: `up to date in 2m 232 packages are looking for funding run 'npm fund' for details`
- Warnings/errors: none

Interpretation: npm accepted the three exact versions together with the
existing tree, which agrees with the peer-range reading above. It does not
prove the build or runtime works; the probes below do.

## Verification after installation

1. `npm run lint`, `npm run typecheck`, `npm run build` and `npm run test:contact`
   still pass after the Next patch bump.
2. `opennextjs-cloudflare build` completes on the owner's machine. If it
   fails on Windows, build in WSL or CI on Linux and record that.
3. `wrangler dev` serves every route, and `/api/contact` returns 503 (not a
   crash) with no secrets and a normal response with `.dev.vars` populated
   with Cloudflare's test Turnstile keys.
4. Every image URL on the About, Work and Capabilities pages returns 200 by
   fetching, with and without the `IMAGES` binding.
5. A preview deployment serves every route; TASK-128 then proves the contact
   flow end to end.

## Human decision

AGENT: after completing every required field, change `status` to
`review-ready`. Done.

Decisions for the human, besides approving the three exact versions:

1. Accept the Next patch bump from 15.5.19 to 15.5.27.
2. Confirm no ISR or incremental cache is wanted now (no R2 bucket created).
3. Confirm the `IMAGES` binding is acceptable, noting its transformation
   quota and pricing were not verified in this research and should be checked
   in the Cloudflare dashboard.

HUMAN (approved in chat by the owner on 2026-10-08, as written, including the three decisions above; recorded by the agent): review the evidence and exact versions. If approved, change `status` to
`approved` and `human_approval` to `approved`. The OS install command will
not run this plan until then. Direct package-manager commands remain available
because the OS does not gate pushes.
