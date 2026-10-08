---
id: TASK-129
title: "Prepare the site for Cloudflare: adapter, config, images, rate limit and spine updates"
status: ready
priority: P1
risk_level: high
epic_ref: backlog/epics/EPIC-028.md
progress_weight: 3
files_allowed:
  - package.json
  - package-lock.json
  - .gitignore
  - next.config.ts
  - wrangler.jsonc
  - open-next.config.ts
  - .github/
  - src/lib/env.ts
  - src/app/api/contact/route.ts
  - planning/dependencies/
  - project-spine/
  - env.example
skill_refs:
  - opensrc-research
parallel:
  suitable: false
  reason: One deployment configuration touching the manifest, build and runtime; splitting it would create conflicting configs.
  dependencies:
    - TASK-124
    - TASK-125
    - TASK-127
  result: null
testing:
  recommendation: with-task
  reason: Build and runtime change with no application logic. Verify the Cloudflare build, a local Workers-runtime run, and a preview deployment serving every route and image.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
started_at: 2026-10-08T16:45:33Z
---
# Task: Prepare the site for Cloudflare: adapter, config, images, rate limit and spine updates

Owner decision of 2026-10-08 (project-state/decisions.md): the site is hosted
on Cloudflare, and deployment preparation happens here, at the end.

## Scope

1. **Architecture plan first.** Run `os deps plan architecture` for the
   Cloudflare adapter for Next.js 15.5 at an exact version, plus Wrangler at
   an exact version. Read version-matched source and docs via OpenSrc:
   supported Next features, required compatibility flags, runtime limits,
   and how the adapter handles API routes, static pages and images. A human
   approves the plan before any install.
2. **Adapter and configuration.** Install the approved packages, add the
   Wrangler configuration and adapter config, add build, preview and deploy
   scripts, and keep `npm run build` working.
3. **Secrets and bindings.** Map `RESEND_API_KEY`, `RESEND_FROM_EMAIL`,
   `CONTACT_TO_EMAIL` and `TURNSTILE_SECRET_KEY` to Cloudflare secrets and
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to a build-time variable. Local Workers
   runs use `.dev.vars`; add `.dev.vars` to `.gitignore` in this task. Confirm
   `src/lib/env.ts` reads them in the Workers runtime. Nothing secret is
   committed.
4. **Rate limit.** Implement the mechanism chosen in TASK-122 (rate-limiting
   rule documented as configuration, and/or a binding behind the limiter
   interface from TASK-123).
5. **Images.** Nine components use `next/image`, and the default optimizer is
   not available on Workers. Pick and implement a strategy: Cloudflare Images
   or an image loader, or pre-sized static assets with `unoptimized`. Keep
   the ASCII filename rule from the earlier accented-filename failures, and
   verify every image URL returns 200 by fetching, not by checking element
   dimensions.
6. **Static and caching.** Confirm static pages remain static and set sensible
   cache headers for assets.
7. **Spine updates.** Rewrite the Dokploy statements in `project-spine/00-brief`,
   `01-project-charter` and `06-project-technical-plan` to match the recorded
   decision, including environments and the deployment steps.
8. **Preview deployment.** Deploy to a Cloudflare preview URL for TASK-128.

## Acceptance Criteria

- [ ] An approved architecture plan exists and `os deps check` passes before
      install.
- [ ] The site builds for Cloudflare and runs under the local Workers runtime.
- [ ] Every route renders on the preview deployment, and every image URL on
      the About, Work and Capabilities pages returns 200.
- [ ] The contact route reads its settings on Cloudflare and returns 503, not a
      crash, when they are missing.
- [ ] No secret, key or recipient address is in the repository.
- [ ] The project spine no longer describes Dokploy as the host.
- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Dependency Evidence

- plan: to be produced as step 1 (planning/dependencies/DEP-...-architecture.md)

## Testing

- recommendation: with-task
- rationale: Deployment and runtime configuration. The checks are the build,
  a local Workers run and a preview deployment walked route by route; TASK-128
  then proves the contact flow on it.

## Notes

Weight 3: new runtime target, new dependencies, and a cross-cutting image
change. The owner does the Cloudflare project and DNS setup; the agent
prepares the repository and the checklist.

## Progress notes (2026-10-08)

Done without installing anything:

- Architecture plan `planning/dependencies/DEP-20261008-165023-architecture.md`
  (adapter 1.20.9, wrangler 4.148.0, next 15.5.27). Evidence complete, status
  `review-ready`, `os deps check` passes. **A human must approve it** before
  `os deps install`. The plan carries three decisions for the owner: accept the
  Next patch bump from 15.5.19 (the adapter refuses anything below 15.5.27),
  confirm no ISR or R2 cache is wanted, and confirm the `IMAGES` binding
  (transformation quota and price were not verified).
- Spine rewrite (step 7): `00-brief`, `01-project-charter`,
  `06-project-technical-plan` and the R06 risk no longer describe Dokploy.
  `02-roadmap` EPIC-009 and `INTAKE-INTERVIEW.md` still mention it as history.
- `.gitignore` now excludes `.dev.vars`, `.wrangler/` and `.open-next/`.

Blocked on the approval above: steps 2 to 6 and 8 (install, `wrangler.jsonc`,
`open-next.config.ts`, scripts, local Workers run, image check, preview
deployment). The preview deployment also needs the owner's Cloudflare project.

## Progress notes, part 2 (2026-10-08)

The owner approved the plan in chat on 2026-10-08, as written, including its
three decisions. `os deps install` refuses architecture plans, so the exact
versions were installed with npm: `next@15.5.27`, `@opennextjs/cloudflare@1.20.9`
(dev), `wrangler@4.148.0` (dev).

Done and verified:

- `wrangler.jsonc` (`nodejs_compat`, `global_fetch_strictly_public`, `ASSETS`,
  `IMAGES`, `RESEND_FROM_EMAIL` var), `open-next.config.ts`, scripts
  `cf:build`, `cf:preview`, `cf:deploy`, and `eslint`/`tsc` ignores for
  `.open-next/` and `.wrangler/`.
- `npm run cf:build` completes on Windows. Lint, typecheck, build and
  `test:contact` (41 pass) pass on Next 15.5.27.
- Finding: with no incremental cache every `/work/[slug]` page returned 404 under
  Workers, because the adapter reads prerendered pages from its cache. The fix
  is the adapter's read-only `static-assets-incremental-cache` (no R2, no extra
  binding, no ISR). It is loaded by `cf:preview` and `cf:deploy`, not by a bare
  `wrangler dev`/`wrangler deploy`. Recorded in the spine.
- Local Workers run (`cf:preview`, test Turnstile secret in a gitignored
  `.dev.vars`): every route returned 200 (`/`, `/about`, `/about/the-way-i-am`,
  `/capabilities`, `/work`, all four `/work/[slug]`, `/contact`), unknown path
  404. 75 image and asset URLs found on those pages all returned 200 by
  fetching (JPEG, PNG, SVG, and 10 WebP produced by the `IMAGES` binding).
- Contact route under workerd: 400 field errors, honeypot 200, missing token
  400, dummy token reaches Resend and returns 502 for the fake key, sixth request
  429 with `Retry-After`, GET 405, and with no secrets 503 (`not-configured`),
  never a crash. `process.env` is populated per request, so `src/lib/env.ts`
  works unchanged.
- `npm audit`: 14 findings (13 high, 1 moderate) against 12 before (11 high, 1
  critical). The critical one is gone with the Next bump. `wrangler` and
  `miniflare` are new high findings, in dev tooling only; nothing was run with
  `audit fix`.

Not done, needs the owner:

- Step 8, the preview deployment, and with it the acceptance line "every route
  renders on the preview deployment". It needs the Cloudflare project and
  `wrangler login`.
- Step 4 rate limit: the WAF rule is dashboard configuration. It goes in the
  TASK-128 launch checklist: `POST /api/contact`, Free plan allows one rule, a
  10 second period, IP only. Prove it fires on a custom hostname, not workers.dev.
- The from address in `wrangler.jsonc` (`contact@send.sandala.site`) is still a
  recommendation awaiting the owner.
- Not verified here: image binding quota and price in production, and cache
  headers on the deployed assets.
