---
id: TASK-012
title: "Global chrome — SiteHeader, MobileNav, SiteFooter"
status: done
priority: P1
risk_level: medium
preferred_executor: claude-code
reviewer: human
epic: EPIC-003
slice: EPIC-003-SLICE-2
depends_on: [TASK-011]
design_refs: [12-ui-element-map.md, 11-content-strategy.md]
skill_refs: [design-taste-frontend, shadcn-ui-builder]

verification_required:
  lint: true
  typecheck: true
  unit: false
  integration: false
  e2e: false
  accessibility: false

public_text: false
handoff_required: true
handoff_type:
  - review
handoff_file: handoffs/review/HANDOFF-REVIEW-TASK-012.md
protected_paths_touched: []
files_allowed:
  - src/components/site/site-header.tsx
  - src/components/site/mobile-nav.tsx
  - src/components/site/site-footer.tsx
  - src/components/ui/sheet.tsx
  - src/components/ui/navigation-menu.tsx
  - src/app/(site)/layout.tsx
  - package.json
  - package-lock.json
  - backlog/tasks/TASK-012.md
---

# Task: Global chrome

> **Every later page epic inherits this.** [12-ui-element-map.md](../../project-spine/12-ui-element-map.md)
> §2 specs `SiteHeader` (desktop nav, sticky warm-blur backdrop) + `MobileNav`
> (shadcn `Sheet` drawer) + `SiteFooter`. Nav order is fixed (§3 content strategy):
> Home · About · Capabilities · Work · Contact. **No LinkedIn anywhere** (§7 policy).

## Scope
- Vendor `src/components/ui/sheet.tsx` (Radix `Dialog` side-sheet) and
  `src/components/ui/navigation-menu.tsx` from the known shadcn source, stripped of
  rounding, token-styled (hard corners, rose focus ring). Add `@radix-ui/react-dialog`
  + `@radix-ui/react-navigation-menu` deps.
- `SiteHeader`: sticky header, warm translucent backdrop-blur, desktop nav links
  (current route gets a `text-rose` indicator), hides on scroll-down / shows on
  scroll-up (Framer), `MobileNav` trigger visible below the desktop breakpoint.
- `MobileNav`: shadcn `Sheet` drawer (slide from the right), same nav links, closes
  on link click and `Escape`.
- `SiteFooter`: nav repeat + social links (TikTok, YouTube, X, Bluesky, GitHub — no
  LinkedIn) + Scrumtrulescent link + monochrome wordmark, Framer entry on viewport
  enter.
- Wire all three into `src/app/(site)/layout.tsx`: `<SiteHeader />` + `<main>` +
  `<SiteFooter />`.

## Acceptance criteria
- [ ] `Sheet`/`NavigationMenu` primitives are hard-cornered, rose-focus-ring, no
  default shadcn rounding.
- [ ] `SiteHeader` uses semantic `<header>`/`<nav>`; active route link uses
  `usePathname()` for the `text-rose` state.
- [ ] `MobileNav` trigger has an accessible name (icon-only button needs `aria-label`,
  §10); the drawer traps focus via Radix `Dialog` defaults.
- [ ] `SiteFooter` is a semantic `<footer>`; social links open `target="_blank"
  rel="noopener noreferrer"`; **no LinkedIn link**.
- [ ] Header scroll show/hide and footer entry respect `useReducedMotion()`.
- [ ] `(site)/layout.tsx` keeps the route group fully static (no `force-dynamic`).
- [ ] `npm run lint`, `npm run typecheck` pass; `npm run build` green + static.

## Notes
Medium risk: shared chrome every page inherits — route via cross-model review
(`handoffs/review/HANDOFF-REVIEW-TASK-012.md`). Social handle URLs are placeholders
(`#`) until the real profile links are confirmed by the owner — flagged inline, not a
blocker to shipping the structural component.
