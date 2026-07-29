# Decisions

An append-only ADR-lite log. New entries are added with `os decide`.

## 2026-06-28 — Keep the portfolio static and separate from the magazine

context: sandala.dev and Scrumtrulescent share an owner and brand ecosystem but
serve different jobs.

decision: sandala.dev remains static by default with no database or CMS.
Scrumtrulescent remains a separate codebase; portfolio integration is read-only
and failure tolerant.

alternatives: A shared Payload CMS or local blog was rejected because it couples
launches and adds operating complexity to the portfolio.

## 2026-06-28 — Use a strict, accessible Next.js application foundation

context: The site itself is the primary proof of engineering and design quality.

decision: Use Next.js App Router, strict TypeScript, Tailwind CSS, accessible
component composition, purposeful motion, reduced-motion support, and
environment variables for secrets.

alternatives: Unstructured inline styling, decorative animation, and duplicated
page patterns were rejected because they weaken consistency and maintainability.

## 2026-07-29 — Preserve the trunk-dev delivery model

context: 26folio already integrates epic branches through `dev` before release
to `main`.

decision: Set `state.flow` to `trunk-dev`; one feature branch carries one epic.

alternatives: Switching the active project to direct GitHub Flow during an OS
migration was rejected because it changes delivery behavior without product
benefit.

## 2026-07-29 — Replace the legacy Agent OS and preserve its evidence

context: The old OS used duplicate uppercase runtime state, blocking gates, and
heavy context that had become unreliable, but its backlog and spine contain
valuable project history.

decision: Replace runtime machinery with Agent OS v1, convert current context to
the lean schema, retain detailed legacy artifacts by path, and remove obsolete
generated views and gates.

alternatives: Keeping the broken runtime was rejected. Deleting all historical
artifacts was rejected because it would discard product intent and implementation
rationale.

## 2026-07-29 — Pin the OS YAML runtime exactly

context: The existing lockfile already resolved YAML 2.9.0, while the manifest
allowed later 2.x releases.

decision: Pin `yaml@2.9.0`, backed by
`planning/dependencies/DEP-20260729-205420-add.md`.

alternatives: A caret range was rejected because unattended installs could
silently change the OS parser.
