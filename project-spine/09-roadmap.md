---
id: ROADMAP
status: draft
created: 2026-06-28
source: hydrated from 00-original-intent.md + INTAKE-INTERVIEW.md
---

# Roadmap — sandala.dev

## Ecosystem overview

This roadmap covers **sandala.dev only**. The companion project
**scrumtrulescent.com** (Scrumtrulescent Magazine — Payload CMS) has its own
roadmap in its own project spine.

---

## Phase 1 — Foundation (current)

**Goal:** Launch a world-class static portfolio site. No database. No CMS on
this domain. Content is Markdown files and static data, media is R2. The only
external data dependency is a read-only fetch from the magazine API.

### P1 — Must ship

| Epic | Deliverable |
|---|---|
| EPIC-001 | Project scaffold: Next.js 15, TypeScript, Tailwind v4, shadcn/ui |
| EPIC-002 | Design system: tokens, typography, colour, spacing, base components |
| EPIC-003 | Home page: hero (GSAP/Framer Motion), featured work, services teaser, From Magazine section |
| EPIC-004 | About page: narrative, photography placeholder, philosophy |
| EPIC-005 | Work page: project grid + individual case study pages |
| EPIC-006 | Services page: value ladder, CTA |
| EPIC-007 | Magazine integration: `lib/magazine.ts` client + MagazinePreview section component |
| EPIC-008 | Contact: form + Resend integration |
| EPIC-009 | Deployment: Dockerfile, Dokploy config, staging + prod environments |
| EPIC-010 | SEO: metadata, OG images, sitemap, robots.txt |

### P2 — Ship if time allows (Phase 1 extension)

- Lottie animation integration (icon animations, section accents)
- 21st.dev component integration (creative UI elements)
- Performance audit and Lighthouse CI gate
- Accessibility audit

---

## Phase 2 — Polish & Ecosystem Deepening (future)

**Goal:** Deepen the connection between the portfolio and the magazine once
both sites are live and generating traffic.

- Analytics (privacy-safe — Plausible or Fathom) on sandala.dev
- Richer magazine preview — more than 3 cards, possibly category filtering
- Portfolio SEO improvements driven by real traffic data
- Case study expansion as client work accumulates
- Photography — replace placeholders with real imagery

**Note:** Payload CMS is the magazine's technology, not sandala.dev's. The
portfolio stays static indefinitely. No CMS will be added to this codebase.

---

## Phase 3 — Integrations & Products (future)

**Goal:** Add revenue-generating capabilities to the portfolio.

- African payment integrations (MoMo, Airtel, ZamPay) — if a product is built
- ZRA Smart Invoice compliance tooling — if a product requires it
- Newsletter capture on sandala.dev — linked to the magazine's subscriber list
- Speaking / workshop booking (if demand warrants it)

---

## Sequencing rationale

Phase 1 ships the revenue asset (consulting inquiries) with the minimum
complexity that can still be world-class. The magazine is a parallel project,
not a future phase of this one. They launch on their own timelines; the
portfolio should not wait for the magazine, and the magazine should not wait
for the portfolio.

The one integration point (EPIC-007) is deliberately minimal — a read-only
API fetch behind ISR. If the magazine isn't live yet when the portfolio ships,
the section gracefully shows nothing. No hard dependency between the two.
