---
id: TASK-127
title: "tests: contact route validation, sanitising and rate limit"
status: ready
priority: P2
risk_level: medium
epic_ref: backlog/epics/EPIC-028.md
progress_weight: 2
files_allowed:
  - src/lib/contact/
  - tests/
  - package.json
skill_refs: []
parallel:
  suitable: true
  reason: Tests the pure modules from TASK-123 and shares no files with the form or details tasks.
  dependencies: [TASK-123]
  result: null
testing:
  recommendation: none
  reason: This task is the test work for the epic; its own check is that the suite runs and fails when the logic is broken.
  commands:
    - node --test tests/
---
# Task: tests: contact route validation, sanitising and rate limit

## Scope

Dedicated tests recommended by EPIC-028's Testing section, written with the
built-in `node:test` runner on Node 22.19 (native TypeScript type stripping).
No new package. If a module needs a path alias to import, fix that in
TASK-123's structure rather than adding a loader.

Cover, with table-driven cases:

1. **Validation:** required fields, trimming, email shapes (valid and
   invalid), each length cap at the limit and one over, unknown `projectType`
   dropped, wrong types rejected.
2. **Sanitising:** CR, LF and CRLF stripped from anything bound for a header
   or subject; Unicode and very long input survive within limits.
3. **Honeypot:** empty and non-empty values produce the decision the route
   expects.
3a. **Turnstile verifier** with an injected `fetch`: success, failure,
   hostname mismatch, malformed response, network error and timeout each map
   to the right decision, and the secret never appears in the returned value
   or logs.
4. **Rate limiter:** allows N, blocks N+1, window expiry resets, separate IPs
   are independent, cleanup does not drop live entries. Use an injected clock.
   Test through the limiter interface so a Cloudflare-backed implementation
   can reuse the same cases.
4a. **Client IP:** `cf-connecting-ip` beats `x-forwarded-for`; the first
   forwarded hop is used; missing, empty and malformed headers fall back to a
   shared key without throwing.
5. Add an `npm` script for the suite and replace the failing placeholder
   `test` script only if the owner agrees; otherwise add `test:contact`.

## Acceptance Criteria

- [ ] The suite runs with one command and passes.
- [ ] Deliberately breaking each rule (cap, strip, window) makes at least one
      test fail; record the mutation check in the task evidence.
- [ ] No dependency was added.
- [ ] Lint and typecheck cover the test files without exceptions.

## Dependency Evidence

- plan: none

## Testing

- recommendation: none
- rationale: This task is the testing work.

## Notes

Tests never gate a push in this OS. They are evidence the owner can weigh at PR
review.
