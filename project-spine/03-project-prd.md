---
id: PROJECT-PRD
status: approved
created: 2026-06-28
source: hydrated from 00-original-intent.md + INTAKE-INTERVIEW.md
---

# Project PRD — sandala.dev

## Pages and features

### Home
- Hero section with animated headline, sub-headline, and primary CTA
- Brief value proposition (who Abe is, what he does, why it matters)
- Featured work — 2–3 case study previews
- Services teaser with a link to the full services page
- Testimonials or social proof (optional for v1 if assets aren't ready)
- "From Scrumtrulescent Magazine" — 3 hand-picked featured articles fetched from
  the magazine's Payload API; each card links out to scrumtrulescent.com
- Footer with links, contact, and social

### About
- Personal narrative: who Abe is, how he thinks, why consulting
- Photo / brand imagery (placeholder-ready if photography not yet available)
- Engineering philosophy aligned with the manifesto
- African expertise as a specialisation, not a limitation
- Links to relevant work and writing

### Work (Portfolio)
- Grid of case studies/projects
- Each case study: problem → approach → outcome (business result, not just tech)
- Tech stack badges where relevant, never the focus

### Services
- Service hierarchy: websites → CMS → e-commerce → payments → business systems
  → internal tools → automation → AI integrations → long-term consulting
- Framed as "where do you want to go?" not a price list
- Primary CTA: contact form

### Contact
- Simple form: name, email, message, optional "type of project" selector
- Resend handles delivery — no data stored, no backend database
- Confirmation state on submit

## Global requirements

| Requirement | Detail |
|---|---|
| Responsive | Mobile-first, tested at 375 / 768 / 1280 / 1440px |
| Accessibility | WCAG 2.1 AA minimum; keyboard nav; reduced-motion support |
| Performance | Lighthouse ≥ 90 all pages; LCP < 2.5 s; CLS < 0.1 |
| SEO | OG tags, sitemap.xml, robots.txt, semantic HTML |
| Animations | Must respect `prefers-reduced-motion`; never block content |
| Contact | Resend integration; no stored submissions |
| Media | Images and video via Cloudflare R2 |
| Fonts | System or self-hosted; no Google Fonts calls in prod |

## Non-requirements (sandala.dev — this phase and permanently)

- Blog or article pages — content lives at scrumtrulescent.com
- Authentication of any kind
- Admin interface / CMS
- Database or persistent data store
- Payment flows
- ZRA / compliance integrations
- Multi-language / i18n
- A/B testing infrastructure

## Magazine integration spec

The "From Scrumtrulescent Magazine" section is the only dynamic data on
sandala.dev. It must be designed so that the portfolio can build and deploy
independently of the magazine.

**Fetch strategy:** ISR (Incremental Static Regeneration) with a 1-hour
revalidation window, falling back to cached data if the magazine API is
unreachable. No article data is bundled at build time in a way that would
block deployment if scrumtrulescent.com is down.

**Data consumed:** For each featured article — `title`, `excerpt`, `slug`,
`cover_image`, `published_at`, `category`. No body content is reproduced
on sandala.dev; cards link out to the full article on scrumtrulescent.com.

**Curation:** Articles shown in this section are hand-picked by the owner
via a `featured_on_portfolio: true` flag in the magazine's Payload CMS — not
automatically the latest post. Quality over recency.
