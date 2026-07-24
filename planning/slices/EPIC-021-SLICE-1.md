# EPIC-021 SLICE-1 — Pillar content layer + capability-explorer page

Owner brief 2026-07-24. Source of truth for positioning, taxonomy, IA and
copy direction: [Capabilities.md](../content/page-copy/Capabilities.md).

## TASK-079 — content layer

- **`src/lib/services.ts` rewritten** around the four pillars
  (`platforms`, `operations`, `automation`, `data`). Schema grows from the
  flat card shape to the explorer's structured panel: per pillar —
  `title`, one-line `description` (home rail), `audience`, `problem`,
  `builds[]` (concrete systems), `replaces[]` (named tool-sprawl),
  `anchor` line, `icon`. Keep `serviceIds` export; keep the module pure
  data.
- `ServiceIcon` keys updated to match four pillars; the home
  CapabilityRail's icon map follows.
- All public copy drafted from the strategy doc and passed through
  stop-slop with artifacts pre-generated (gate recomputes).
- Grep for retired anchor ids (`web-development`, `custom-software`,
  `ai-integration`, `mobile-payments`, `e-commerce`) and fix stragglers.

## TASK-080 — page rebuild

- **Capability explorer** (new `src/components/capabilities/…`):
  disclosure rows, one open at a time, height-reveal into the structured
  panel; real button + `aria-expanded` + `aria-controls`, keyboard
  reachable, reduced-motion static. Replaces ServiceTabs on the page
  (ServiceTabs + useTabbedContent may be deleted if nothing else consumes
  them — verify before removing).
- **Why-one-engineer strip**: short manifesto block, text-first.
- **Engagement section**: Build → Evolve two-beat explorer + ownership
  guarantee. Replaces ProcessSteps on the page (same deletion rule).
- **TechGrid** moves below the engagement section; **CTACallout** kept
  with fit-check tone.
- Home page: verify the rail renders four cards and anchors land.
- In-browser verification desktop + 375px: explorer open/close/switch,
  anchor navigation, no horizontal overflow, zero console errors
  (hidden-tab rAF freeze caveat applies to visual motion checks).

## Notes

- force-static stays on /capabilities.
- No pricing numbers; engagement model qualitative (OWNER REVIEW hook for
  future ranges).
- Watch bundle hygiene: explorer is a client component; page shell stays
  server where possible.
