---
id: TASK-086
title: "Build the colored technology atlas"
status: done
priority: P1
risk_level: medium
epic_ref: backlog/epics/EPIC-023.md
depends_on: [TASK-084]
progress_weight: 1
files_allowed:
  - public/icons/color/
  - src/lib/capabilities.ts
  - src/components/capabilities/tech-grid.tsx
  - src/components/capabilities/technologies-section.tsx
skill_refs: [impeccable, framer-motion, framer-motion-react, writing-style]
---
# Task: Build the colored technology atlas

## Scope

Map applicable technologies from the owner brief to the supplied colored SVG
inventory and present them as categorized technical evidence with concise usage
explanations. Technologies without a supplied mark remain visible as deliberate
text-only entries.

## Acceptance Criteria

- [x] Applicable icons are loaded only from `public/icons/color/`.
- [x] Unrelated supplied icons do not appear.
- [x] Missing marks are documented and render without broken images.
- [x] Technology categories and descriptions match the supplied brief.
- [x] Hover and focus reveal the same usage information; reduced motion keeps every item readable.

## Dependency Evidence

- plan: none

## Testing

- recommendation: with-task
- rationale: Verify every configured icon path exists, then inspect keyboard,
  hover, timed-swap, and static reduced-motion states in TASK-087.

## Notes

Known missing marks at planning time: GitHub, Alibaba Cloud, Sentry,
WhatsApp/SMS, ZRA Smart Invoice, mobile-money gateways, REST APIs, Webhooks, and
a generic API or integration symbol. These remain text-only unless the owner
supplies icons.

The atlas exposes supplied-mark counts per category and labels every fallback
`text-only / mark not supplied`.
