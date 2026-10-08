---
id: TASK-122
title: Decide the delivery integration and record the dependency plan
status: done
priority: P1
risk_level: low
epic_ref: backlog/epics/EPIC-028.md
progress_weight: 1
files_allowed:
  - planning/dependencies/
  - env.example
  - src/lib/env.ts
skill_refs:
  - opensrc-research
parallel:
  suitable: false
  reason: Everything else in the epic depends on this decision, and it is a single research artifact.
  dependencies: []
  result: null
testing:
  recommendation: none
  reason: A research and decision record; no runtime behavior changes. Verified by the plan passing `os deps check`.
  commands:
    - bash scripts/os.sh deps check <plan.md>
started_at: 2026-10-08T16:18:57Z
completed_at: 2026-10-08T16:21:08Z
---
# Task: Decide the delivery integration and record the dependency plan

## Scope

1. Compare two ways to call Resend from the Next.js 15.5 route handler: the
   REST API through `fetch` (no new package) and the `resend` SDK at an exact
   version. Read version-matched source and docs through OpenSrc, including
   engines, peer ranges and how each handles errors and retries.
2. Write the evidence with `os deps plan add` (or record `plan: none` with the
   reasoning if `fetch` wins), including a recommendation and the tradeoff.
3. Settle the environment variables and add them to `env.example`:
   `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`,
   `TURNSTILE_SECRET_KEY` and the public `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
   Values stay empty. Add them to the typed accessor in `src/lib/env.ts`.
4. **Cloudflare fit.** Confirm from the evidence that the chosen call style
   runs on Workers (no Node-only dependencies). Choose the real rate-limit
   mechanism: a Cloudflare WAF rate-limiting rule (configuration only), the
   Workers rate-limiting binding, or both. Record it with the tradeoff for
   TASK-123 and TASK-129.
5. **Turnstile (owner decision, 2026-10-08).** Read the Turnstile client
   widget and server verification docs. Decide how the widget loads in a
   Next.js client component without a new package (script tag and explicit
   render versus a wrapper package), the exact verification request, the
   response fields to check (success, hostname, action) and the failure
   behaviour. Record Cloudflare's published test site and secret keys for
   local development.
6. Record the sender: the domain is `send.sandala.site` (owner decision); set
   the from-address local part and display name with the owner. Never write a
   real key or recipient address into the repository.

## Acceptance Criteria

- [x] A dependency decision exists under `planning/dependencies/` (or an
      explicit `plan: none` rationale) naming the chosen approach and the
      rejected one.
- [ ] If a package is chosen, the plan passes `os deps check` and a human has
      approved it before any install. If `fetch` is chosen, no manifest change.
- [ ] `env.example` lists all five variables with comments and no values,
      and `src/lib/env.ts` exposes them.
- [ ] The record covers Turnstile loading, verification and failure behaviour.
- [ ] The record states the Workers-compatibility finding and the chosen
      rate-limit mechanism.
- [ ] EPIC-028 "Dependency / Architecture Evidence" links the decision.

## Dependency Evidence

- plan: this task produces it

## Testing

- recommendation: none
- rationale: Documentation and an example env file. The plan check is the
  verification.

## Notes

Recommendation to evaluate first: the contact route sends two small
transactional messages. A thin `fetch` wrapper avoids a package and its
supply-chain surface, at the cost of owning the error handling. Let the
evidence decide; do not pre-commit.
