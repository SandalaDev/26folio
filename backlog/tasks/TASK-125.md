---
id: TASK-125
title: "Wire the form to the live route: honeypot, error states and honest copy"
status: ready
priority: P2
risk_level: medium
epic_ref: backlog/epics/EPIC-028.md
progress_weight: 2
files_allowed:
  - src/components/site/contact-form.tsx
  - src/app/(site)/contact/page.tsx
skill_refs: [design-taste-frontend, writing-style]
parallel:
  suitable: true
  reason: Touches only the client form and page; independent of the auto-reply once the route contract is fixed.
  dependencies: [TASK-123]
  result: null
testing:
  recommendation: with-task
  reason: A user-facing state machine with five outcomes. Verify each state in a rendered browser pass, at mobile and desktop widths, with reduced motion.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---
# Task: Wire the form to the live route: honeypot, error states and honest copy

## Scope

Keep the existing layout, tokens and motion. Change behavior and copy only.

1. Add the honeypot input named `website`, visually hidden and removed from the
   tab order and accessibility tree (`tabIndex={-1}`, `aria-hidden`,
   `autoComplete="off"`), included in the POST body.
1a. Add the Turnstile widget using the approach recorded in TASK-122, themed
   to the site (dark or light by `prefers-color-scheme`), placed above the
   submit button without shifting the default layout. Include the token in
   the POST. Reset the widget after a failed attempt. Submit stays disabled
   until a token exists, and the form explains a widget that fails to load
   instead of hanging.
2. Render server `400` field errors in the existing error slots, including a
   Turnstile failure ("please try the check again").
3. Handle `429` with a calm "too many messages, try again later" note, and
   `502`/`503`/network failure with a note that points to the direct email and
   social links on the page. Remove "Email delivery is not wired up yet".
4. Keep the success state; align its wording with the auto-reply from
   TASK-124 so the two never disagree.
5. Prevent double submit and keep focus management correct: move focus to the
   first invalid field on error, and announce status changes to assistive tech.
6. Update the doc comment in the form that still calls the route a 501 stub.

## Acceptance Criteria

- [ ] Success, client validation, server validation, rate limited and
      delivery failure each render the intended state.
- [ ] The honeypot cannot be reached by keyboard or screen reader.
- [ ] The Turnstile widget renders in both colour schemes, works with the
      keyboard, and a blocked or failed widget produces a clear message.
- [ ] No state claims success when the route did not return 200.
- [ ] No visual change to the default form at any width.
- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Rendered inspection of every state against a stubbed route, at
  375px and desktop, with `prefers-reduced-motion`. No component test suite
  exists and this task does not justify one.

## Notes

The preview tab can freeze animation when hidden; check `document.hidden`
before judging motion.
