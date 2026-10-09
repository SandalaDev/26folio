---
id: TASK-132
title: "Owner asset intake for Cloudege, Scrumtrulescent, sandala.dev and the OK cover"
status: blocked
priority: P1
risk_level: low
epic_ref: EPIC-029
progress_weight: 1
depends_on: []
files_allowed:
  - public/projects/
  - backlog/tasks/TASK-132.md
skill_refs: []
parallel:
  suitable: true
  reason: Owner work; no code overlap.
  dependencies: []
  result: null
testing:
  recommendation: none
  reason: An intake checklist; the consuming tasks check what arrives.
  commands:
    - npm run lint
    - npm run typecheck
    - npm run build
---

# Task: Owner asset intake for Cloudege, Scrumtrulescent, sandala.dev and the OK cover

## Scope

Track the owner-supplied assets agreed at kickoff. Drop originals in
`public/projects/<project>/` (gitignored). Tick each line as it lands.

- [ ] Cloudege: product names, one-line purpose and status for each of the six
- [ ] Cloudege: 1 or 2 real screens per product, demo data, 2x
- [ ] Cloudege: logo or wordmark (SVG preferred)
- [ ] Cloudege: live URLs, if public
- [ ] Cloudege: card loop (5 to 8 s) and hero loop (10 to 15 s)
- [ ] Cloudege: the partner's sign-off on the finished page content
- [ ] Scrumtrulescent: Payload admin screens and a recording (read an article, then publish one)
- [ ] Scrumtrulescent: public screens (home, an article, the article at phone width). Moved here from TASK-133: scrumtrulescent.com is not live. Supply them, or authorize the agent to run the magazine locally and capture them.
- [ ] Scrumtrulescent: its status to state on the page (in development, private beta, launching on a date)
- [ ] sandala.dev: a recording of moving through the site
- [ ] OK Pharmacy: a regenerated cover scene with the mark and text correct and no visible watermark

Clip spec: muted MP4 (H.264), any length over the target is fine; the agent
trims and encodes.

## Acceptance Criteria

- [ ] Every line above is ticked or explicitly dropped by the owner.

## Dependency Evidence

- plan: none

## Testing

- recommendation: none
- rationale: An intake checklist; the consuming tasks check what arrives.

## Notes

Shaped at the EPIC-029 kickoff on 2026-10-09. See the epic for the decisions
this task carries out.
