# Skills Registry

Index of vendored and authored skills. `skills.sh validate` confirms every entry
has a non-empty SKILL.md on disk (fails-closed on corruption). `skills.sh audit`
additionally treats empty stubs as failures (release readiness).

A skill is a governed, reusable capability package — a `SKILL.md` folder, optional
scripts and references. It is not a task, not a shortcut, and not a replacement
for the Project Spine. Load only the `skill_refs` a task declares; never all skills.

## layer: core (`.agents/skills/`) — always present, stack-agnostic

| name | role | status |
|---|---|---|
| `opensrc-research` | Exact-version source/docs research, compatibility cross-checking, and architecture evidence before dependency installation. | authored |
| `writing-style` | Purpose, audience, structure, voice, and revision for prose; composes with domain rules and stop-slop. | authored |
| `ds-handoff` | How to write a quality handoff (the judgement layer over create-handoff.mjs). | authored |
| `ds-task-slicer` | Decompose an epic into bounded tasks. | authored |
| `ds-test-planner` | Assess risk after planning and recommend testing work (non-blocking). | authored |

## layer: frontend (`pack-frontend/skills/`) — default-on, detachable

| name | role | status |
|---|---|---|
| `impeccable` | Active design lane: UI implementation, polish, visual QA, anti-generic detection. | authored |
| `design-taste-frontend` | Brief inference + taste dials; direction input to the active lane. | authored |
| `shadcn-ui-builder` | shadcn/ui setup, CLI, primitive composition, accessible owned components. | authored |
| `21st-dev-components` | Find/adapt free, public 21st.dev marketing blocks before hand-building. | authored |
| `stop-slop` | Advisory prose scorer for public-facing text (score.mjs); run on demand, never a gate. | authored |

## rules

- A task may not reference a skill whose SKILL.md is absent or empty (validate-task.mjs warns; skills.sh audit fails).
- Use `opensrc-research` before initial application packages, new dependencies,
  upgrades, and far-reaching technical choices. OpenSrc provides source evidence;
  package-manager resolution, project checks, and human approval complete the
  compatibility decision.
- One active design lane per UI pass. Impeccable is the default active lane; design-taste-frontend feeds it direction; shadcn + 21st support it. Never run two active design authorities at once.
- For meaningful prose, apply project/domain constraints, then `writing-style`,
  then stop-slop's scorer. Finish with factual/domain review and require human
  approval for sensitive or public claims. The score is advisory, never a gate.
