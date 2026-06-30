# Skills Registry

Source of truth for the skill catalog. `scripts/skills.sh validate` reads the
table below (rows beginning `| <name>`); `audit` enforces that every listed skill
is authored. `lock.json` records vendoring method + pinned commit per skill.

Status legend: **authored** = real content on disk · **vendored** = pulled from an
upstream source (see lock.json) · **stub** = folder exists, SKILL.md empty, not yet
written (tracked debt — `skills.sh validate` warns, `audit` fails).

| name | role | status |
|---|---|---|
| ds-handoff | Creates review/session/task handoff artifacts at session end; updates handoff_queue. | authored |
| ds-reviewer | Cross-model diff review against task/slice/spine/tests; writes REVIEW notes. | authored |
| stop-slop | Public-text de-slop gate; recomputed by verify-task.sh. | vendored |
| design-taste-frontend | Brief inference + anti-templated design direction for landing/portfolio/redesign. | vendored |
| ds-task-slicer | Splits epics into slices and risk-matched tasks. | stub |
| ds-test-planner | Maps acceptance criteria + risk to minimal verification. | stub |
| ds-content-review | Review gate for public/client-facing copy and UX writing. | stub |
| impeccable | Active design lane: implementation, polish, visual QA, anti-generic detection. | stub |
| frontend-design | Fallback/exploration design lane for first-pass concepts. | stub |
| shadcn-ui-builder | shadcn/ui setup, CLI, accessible primitive composition. | stub |
| 21st-dev-components | Free/public 21st.dev component reuse before hand-rolling. | stub |

## Known debt
The seven `stub` skills above are folders with empty `SKILL.md` files created by
`skills.sh install-defaults`. They are intentionally deferred until a task needs
them. A task must not list an empty stub in `skill_refs` — `validate-task.mjs`
warns on that. Author a stub before relying on it; run `skills.sh audit` to see the
full backlog.
