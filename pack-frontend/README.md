# pack-frontend (L4 — optional, default-on)

The frontend opinionation layer. This is what makes a Next.js / web project fast to
start: a design-system elicitation phase, a content phase, a UI-element-map phase,
and a set of authored design-lane skills. **It is detachable** — the agent-os core
(L0–L3) does not depend on it. A non-frontend project (CLI, backend service,
library) deletes this directory and loses nothing.

## What's in here

### `elicit-phase.sh` — one parameterized elicitation script
Replaces three near-identical legacy scripts (design/content/ui). Each phase:
questionnaire + your references → fail-closed `ready` gate → agent generates the
artifact → you approve.

```bash
bash pack-frontend/elicit-phase.sh design  questionnaire   # scaffold the questionnaire
# ...answer it, drop screenshots into project-spine/references/design/, set status: ready
bash pack-frontend/elicit-phase.sh design  ready            # fail-closed gate
# ...agent generates 10-design-system.md + 10-design-system.html
bash pack-frontend/elicit-phase.sh design  preview          # inspect the HTML, then approve
bash pack-frontend/elicit-phase.sh content ready            # gated on design: approved
bash pack-frontend/elicit-phase.sh ui       ready           # gated on content: approved
```

The phases are sequential and fail-closed: **design → content → ui**. The design
phase carries a **preview gate** — you must open the rendered `10-design-system.html`
in a browser and inspect it before approving. Never approve a design system unseen.

### `skills/` — authored design-lane skills (real content, no stubs)
- **impeccable** — the default active design authority (implementation, polish, QA).
- **design-taste-frontend** — taste/brief inference; direction input to Impeccable.
- **shadcn-ui-builder** — shadcn/ui primitive composition.
- **21st-dev-components** — find/adapt free, public components before hand-building.
- **stop-slop** — the mandatory public-text gate; `score.mjs` recomputes the slop
  score from externalized rules (`references/tells.json`) and `verify.sh` re-checks it.

Rule: **one active design lane per UI pass.** Impeccable is active by default;
design-taste feeds it; shadcn + 21st support it. Never run two active authorities.

## How to detach (for a non-frontend project)
```bash
rm -rf pack-frontend
# remove the frontend skills from .agents/skills/registry.md (the design lanes)
```
The core (memory, gate, dashboard, workflow) is untouched.
