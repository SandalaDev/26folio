---
id: TASK-028
title: "ServiceTabs — services section"
status: done
priority: P1
risk_level: low
preferred_executor: claude-code
reviewer: human
epic: EPIC-006
epic_ref: backlog/epics/EPIC-006-capabilities-page.md
slice: EPIC-006-SLICE-2
depends_on: [TASK-027]
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
  - src/components/capabilities/service-tabs.tsx
  - backlog/tasks/TASK-028.md
progress_weight: 1
---

# Task: ServiceTabs

> **Content is already decided** — [11-content-strategy.md](../../project-spine/11-content-strategy.md)
> §4 `/capabilities` point 1 lists the three services and their sub-bullets verbatim.
> This task ports that into tab content, it doesn't draft new copy.

## Scope
`ServiceTabs`: vertical topic tabs (addepto.com reference) built on
`useTabbedContent` (`orientation: "vertical"`), one tab per service — **Web
development**, **Custom software**, **AI integration** — each tab id matching
`CapabilityRail`'s anchor ids from EPIC-003 (`web-development`, `custom-software`,
`ai-integration`) so the home page's forward links resolve correctly. Tab content
swaps with a Framer cross-fade. On mount, if `window.location.hash` matches one of
the tab ids, pre-select that tab (`initialId`) so EPIC-003's deep links land on the
right panel instead of just the top of the page.

Content per tab (verbatim from the content outline):
- **Web development (beyond a website):** Payload CMS builds ("I build it, you
  control it"), landing pages, dashboards, internal tools.
- **Custom software:** booking systems / CRMs, mobile-money & payment-gateway
  integration, e-commerce.
- **AI integration:** customer-care voice & chatbots, receptionist bot, custom
  integrations, local/on-prem AI.

## Acceptance criteria
- [ ] Tab ids exactly match `CapabilityRail`'s anchor ids (`web-development`,
  `custom-software`, `ai-integration`) — verify against
  `src/components/home/capability-rail.tsx`.
- [ ] Real ARIA tabs via `useTabbedContent` (not a fork) — `getTabListProps`/
  `getTabProps`/`getTabPanelProps` used as-is.
- [ ] Hash-based pre-selection only runs client-side (reads `window.location.hash`
  in an effect, not at render time — SSR-safe).
- [ ] Content sub-bullets match the outline exactly — no added/dropped items.
- [ ] `npm run lint` and `npm run typecheck` pass.

## Notes
Low risk: content-driven component, no data fetching, no GSAP.
