---
id: TASK-064
title: "Build /about/the-way-i-am: content module, nine sections, nav + motion"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-016
slice: EPIC-016-SLICE-1
depends_on: []
design_refs: [10-design-system.md, 12-ui-element-map.md]
skill_refs: [design-taste-frontend, framer-motion, stop-slop]

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
  - src/app/(site)/about/the-way-i-am/
  - src/components/the-way/
  - src/lib/the-way.ts
  - planning/content/page-copy/TheWay.md
  - planning/content/.slop/
  - planning/slices/EPIC-016-SLICE-1.md
  - backlog/tasks/TASK-064.md
  - backlog/tasks/TASK-065.md
---

# Task: Build the "The Way I Am" page

> Owner (2026-07-15): dedicated page, NOT a modal. Museum walk. Own URL,
> navigation, transitions, identity. Full creative control inside the
> existing design system. Content: `planning/content/page-copy/TheWay.md`.

## Scope

1. `src/lib/the-way.ts`: typed content (curiosity table, hobbies, music
   production/artists/albums, creative practice, collections, principles,
   books with authors + takeaways) transcribed from TheWay.md, de-slopped.
2. `src/app/(site)/about/the-way-i-am/page.tsx`: force-static route with
   metadata, composing the nine sections.
3. `src/components/the-way/`: hero, curiosity table, hobbies index, music
   (now-playing + chips + album wall), creative practice row, collection
   shelves, principle cards, bookshelf with expanding spreads, CTA band,
   plus the nav layer (back link, progress bar, floating TOC, pager).
4. Motion per slice contract: scroll-linked, transform/opacity only,
   reduced-motion safe, 60fps.

## Acceptance criteria
- [x] All nine sections render the owner's real content, no placeholders.
- [x] Progress bar, floating TOC, back nav and pager function on scroll.
- [x] Bookshelf spines expand into cover/title/author/takeaway spreads.
- [x] Reduced-motion collapses choreography to static.
- [x] lint / typecheck / build green; slop score >= 35/50.

## Verified (2026-07-15)
Route live at /about/the-way-i-am (force-static, 25.2 kB route JS in the
production build). In-browser (dev server, DOM-level because the preview
pane was hidden and screenshots stall under the known rAF-freeze quirk):
all nine `[data-way-section]` anchors present; h1 + full owner copy render
(no em-dashes anywhere in visible text); 38 album sleeves + 17 artist chips
+ 4 plugin chips; 14 book spines, first spine click sets aria-expanded and
opens the How to Speak Money spread (cover/title/author/takeaway); pager
links /about; CTA buttons land /contact and /work; 9-item floating TOC and
top progress hairline mounted; TOC hidden and hero back-link shown at
375px, zero horizontal overflow. Reduced-motion: every component gates
choreography behind useReducedMotion or motion-reduce classes (code
audit; media-query emulation is not available in this harness). lint +
typecheck + `next build` (14 routes) green; stop-slop 42-50/50 across all
15 changed src files (threshold 35).
