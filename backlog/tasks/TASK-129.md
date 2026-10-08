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
skill_refs: [opensrc-research]
parallel:
  suitable: false
  reason: One deployment configuration touching the manifest, build and runtime; splitting it would create conflicting configs.
  dependencies: [TASK-124, TASK-125, TASK-127]
  result: null
testing:
  recommendation: with-task
  reason: Build and runtime change with no application logic. Verify the Cloudflare build, a local Workers-runtime run, and a preview deployment serving every route and image.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
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
