---
id: TASK-022
title: "Magazine section & social links"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-004
epic_ref: backlog/epics/EPIC-004-about-page.md
slice: EPIC-004-SLICE-5
depends_on: [TASK-011]
design_refs: [12-ui-element-map.md, 11-content-strategy.md]
skill_refs: [design-taste-frontend, impeccable]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: false
handoff_required: false
handoff_type: []
protected_paths_touched: []
files_allowed:
  - src/components/about/magazine-section.tsx
  - src/components/about/social-links.tsx
  - backlog/tasks/TASK-022.md
progress_weight: 1
---

# Task: Magazine section & social links

## Scope
- `MagazineSection`: what Scrumtrulescent is, why it exists, and what a reader
  should take from it, drawn from the documented ecosystem rationale (a parallel
  publication that builds an audience and feeds consulting inquiries, not invented
  personal motivation) — links out to scrumtrulescent.com.
- `SocialLinks`: TikTok, YouTube, X, Bluesky, GitHub — **no LinkedIn**, same shape
  (and placeholder `#` hrefs) as `SiteFooter`'s list from EPIC-003.

## Acceptance criteria
- [ ] `MagazineSection` copy doesn't reproduce magazine article content (charter
  constraint) — it describes the magazine, doesn't excerpt it.
- [ ] Outbound link to scrumtrulescent.com uses `target="_blank" rel="noopener
  noreferrer"`.
- [ ] `SocialLinks` renders exactly the five platforms, no LinkedIn, each opening in
  a new tab with `rel="noopener noreferrer"`.
- [ ] `npm run lint` and `npm run typecheck` pass.

## Notes
Low risk: structural + already-documented content, no invented personal facts.
`public_text: false` — placeholder hrefs pending owner-confirmed profile links.
