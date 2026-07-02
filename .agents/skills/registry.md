# Skills Registry

Source of truth for the skill catalog. `scripts/skills.sh validate` reads the
table below (rows beginning `| <name>`); `audit` enforces that every listed skill
is authored. `lock.json` records vendoring method + pinned commit per skill.

Status legend: **authored** = real content on disk · **vendored** = pulled from an
upstream source (see lock.json). Only authored/vendored skills are catalogued —
empty stubs are not pre-created. Add a skill with `skills.sh add <name>` (candidate
under `local/`) and author its `SKILL.md` before any task references it;
`validate-task.mjs` fails a task whose `skill_refs` point at a missing skill.

| name | role | status |
|---|---|---|
| design-taste-frontend | Brief inference + anti-templated design direction for landing/portfolio/redesign. The active design lane. | vendored |
| stop-slop | Public-text de-slop gate; recomputed by verify-task.sh. | vendored |
| ds-handoff | Creates review/session/task handoff artifacts at session end; updates handoff_queue. | authored |
| ds-reviewer | Cross-model diff review against task/slice/spine/tests; writes REVIEW notes. | authored |
