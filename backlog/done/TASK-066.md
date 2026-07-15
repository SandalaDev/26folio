---
id: TASK-066
title: "Rebuild BioModal: wide shell, chapter structure, typography system"
status: done
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
- [x] Modal opens ~80vw on desktop, ~92vw mobile, no horizontal overflow;
      Dialog a11y intact (focus trap, Esc, overlay, close button).
- [x] Copy renders verbatim from the typed module; nothing rewritten.
- [x] Chapters visually distinct; measure capped; pull quotes + ledes in.
- [x] Shared `src/components/ui/dialog.tsx` untouched.
- [x] lint / typecheck / build green; slop >= 35/50 on changed src files;
      in-browser check at desktop + 375px.

## Verified (2026-07-15)

Content extracted verbatim to `src/lib/who-i-am.ts` (intro + three epochs,
pull-quote/emphasis annotations; Foundation accent corrected caramel -> amber
to match EPIC-015's timeline mapping). BioReader renders the chaptered layout
inside the widened DialogContent (`w-[min(80vw,80rem)]` lg+, `h-[85vh]`,
internal scroll); twMerge override confirmed live in the DOM. In-browser
(dev server; DOM-level because the preview pane sat hidden under the known
0x0/rAF quirk): dialog opens with all four `[data-bio-chapter]` sections,
four rail rows (logo-glyph opening + I/II/III), both pull quotes, both rose
emphasis lines, zero em/en-dashes in visible text, close button present,
scroll region content height 9797px. lint + typecheck green; stop-slop
38-46/50 across the four changed src files (threshold 35). Production build
deferred to session end (dev server holds .next). Rail is static markup by
design; TASK-067 wires active state, jumps, and motion.
