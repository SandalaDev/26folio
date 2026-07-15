---
id: TASK-066
title: "Rebuild BioModal: wide shell, chapter structure, typography system"
status: ready
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-017
slice: EPIC-017-SLICE-1
depends_on: []
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, stop-slop]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: true
handoff_required: false
handoff_type: []
handoff_file: ""
review_waiver: "Solo dev (reviewer: human). Cross-model review reassigned to the human at the PR into dev, per OS degraded mode."
protected_paths_touched: []
files_allowed:
  - src/components/about/bio-modal.tsx
  - src/components/about/who-i-am/
  - src/lib/who-i-am.ts
  - src/app/(site)/about/page.tsx
  - planning/content/.slop/
  - planning/slices/EPIC-017-SLICE-1.md
  - backlog/tasks/TASK-066.md
  - backlog/tasks/TASK-067.md
---

# Task: Wide shell, chapters, typography

> Owner (2026-07-15): expand the modal to ~80vw (agent's call on the exact
> value); redo the typography with an improved mix of font weights and
> layout. Copy is owner-approved and does not change.

## Scope

1. `src/lib/who-i-am.ts`: extract the bio copy from `bio-modal.tsx` into a
   typed chapter module (Prologue + three epochs; paragraphs verbatim;
   pull-quote and lede annotations per the slice plan).
2. Rebuild `BioModal` as the chaptered reader shell: local `DialogContent`
   width/height override, internal scroll container, lg+ rail + reading
   pane grid, mobile stack. Rail may ship static in this task (markup +
   layout); TASK-067 wires the motion and active state.
3. Typography pass: chapter openings (eyebrow, weight-contrast Clash
   Display title, oversized numeral backdrop — static), body measure
   ~65–70ch, lede treatment, pull quotes, epoch accent mapping
   (caramel/peach/rose), comfortable leading for a long read.

## Acceptance criteria
- [ ] Modal opens ~80vw on desktop, ~92vw mobile, no horizontal overflow;
      Dialog a11y intact (focus trap, Esc, overlay, close button).
- [ ] Copy renders verbatim from the typed module; nothing rewritten.
- [ ] Chapters visually distinct; measure capped; pull quotes + ledes in.
- [ ] Shared `src/components/ui/dialog.tsx` untouched.
- [ ] lint / typecheck / build green; slop >= 35/50 on changed src files;
      in-browser check at desktop + 375px.
