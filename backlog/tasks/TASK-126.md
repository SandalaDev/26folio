---
id: TASK-126
title: "Replace placeholder contact details and social links with real ones"
status: ready
priority: P2
risk_level: low
epic_ref: backlog/epics/EPIC-028.md
progress_weight: 1
files_allowed:
  - src/components/about/social-links.tsx
  - src/components/site/site-footer.tsx
  - src/app/(site)/contact/page.tsx
skill_refs: []
parallel:
  suitable: true
  reason: Small data change that only waits on owner-supplied values; no file overlap with the route or form work.
  dependencies: []
  result: null
testing:
  recommendation: with-task
  reason: Wrong URLs are the only failure and are caught by checking each link resolves; lint, typecheck and build cover the rest.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---
# Task: Replace placeholder contact details and social links with real ones

## Scope

1. Owner supplies the real URL for TikTok, YouTube, X, Bluesky and GitHub.
   No LinkedIn, per the existing decision. The owner said these come later,
   so this task waits for them.
2. Replace every `href="#"` in `SocialLinks` and the matching list in the site
   footer. Keep one source of truth for the list if the two copies can be
   shared without widening scope.
3. Only if the owner decides to show an address publicly: add it to the
   "Direct" block as a `mailto:` link, with a decision on scraping
   protection. Default is not to show one; the form is the path, and the
   inquiry destination stays a secret.
4. A channel the owner does not want listed is removed rather than left as a
   dead button.

## Acceptance Criteria

- [ ] No `href="#"` remains in contact or footer social links.
- [ ] Each link opens the intended profile; if a public address is shown, its
      link opens a message to it.
- [ ] Icon buttons keep accessible names and the existing styling.
- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Fetch each URL and click the rendered link; trivial otherwise.

## Notes

Blocked on owner inputs; this is the first thing to ask for in the kickoff.
Real addresses are public site content, not secrets, but do not paste them
anywhere beyond the files that render them.
