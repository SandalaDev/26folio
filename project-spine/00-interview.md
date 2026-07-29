---
phase: interview
status: answered
source: "Legacy intake interview, charter, architecture principles, and owner decisions"
---
# Intake Interview

## Q1. Is this project still a static portfolio rather than a CMS-backed publication?

prompt: Confirm the product boundary between sandala.dev and Scrumtrulescent.

answer: Yes. sandala.dev remains static by default, with no database or CMS.
Scrumtrulescent is a separate publication and codebase. The portfolio may read
selected magazine content through a failure-tolerant API client.

## Q2. What should current work optimize for?

prompt: Choose the next operating priority after the completed design and
content epics.

answer: Preserve the completed portfolio work, make project continuity reliable,
finish owner-review and launch-readiness gaps, and avoid another broad redesign
without a new owner brief.

## Q3. Which workflow should the repository use?

prompt: Choose GitHub Flow or the existing dev integration flow.

answer: Keep the established trunk-dev model: epic feature branches target
`dev`; reviewed integration work later moves from `dev` to `main`.
