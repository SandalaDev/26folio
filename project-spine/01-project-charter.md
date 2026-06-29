---
id: PROJECT-CHARTER
status: draft
created: 2026-06-28
source: hydrated from 00-original-intent.md + INTAKE-INTERVIEW.md
---

# Project Charter — sandala.dev

## Project summary

A personal portfolio and consulting website for Abe Sandala — independent
software consultant. The site positions him as a strategic engineering partner
for businesses, not a commodity freelancer.

## Ecosystem context

sandala.dev is one of two related but independent properties:

| Property | Purpose | Stack |
|---|---|---|
| **sandala.dev** (this project) | Portfolio, consulting platform, conversion | Next.js, static/SSG |
| **scrumtrulescent.com** (separate project) | Personal magazine publication | Next.js + Payload CMS |

The portfolio links to the magazine. The magazine links back to the portfolio.
They share an owner and a brand ecosystem but are separate codebases, separate
domains, and separate deployments. The Payload CMS project is *not* a deferred
phase of sandala.dev — it is a distinct project with its own spine.

## Scope — this phase (sandala.dev)

**In scope:**
- Static/SSG Next.js website with no database or CMS
- Public-facing pages: Home, About, Work, Services, Contact
- "From Scrumtrulescent Magazine" section on the Home page — 3 hand-picked
  featured articles fetched from the magazine's Payload REST API at build time
- World-class UI with Framer Motion, GSAP, Lottie/SVG animations
- Contact form via Resend (email delivery only — no stored submissions)
- Media assets served from Cloudflare R2
- Dockerised deployment on a self-hosted VPS via Dokploy

**Out of scope — sandala.dev (this project, ever or this phase):**
- Blog or article pages (content lives at scrumtrulescent.com)
- Database, ORM, or CMS of any kind — this site stays static
- Admin interface
- User authentication
- Payment integrations (MoMo, Airtel, ZamPay)
- ZRA Smart Invoice compliance
- Multi-tenancy
- SaaS or product features
- Analytics beyond privacy-safe page views

## Stakeholders

| Role | Who | Responsibility |
|---|---|---|
| Owner / decision-maker | Abe Sandala | Final approval on all design, copy, and engineering decisions |
| Planning agent | Claude Code | Spine hydration, task decomposition |
| Execution agent | Claude Code | Implementation within approved tasks |
| Reviewer | Different model family or human | Cross-model review before merge |

## Constraints

| Constraint | Detail |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui, 21st.dev elements |
| Animation | Framer Motion, GSAP, Lottie |
| Email | Resend |
| Storage | Cloudflare R2 |
| Hosting | Self-hosted VPS · Dokploy |
| No database | sandala.dev is and remains static/SSG |
| Magazine API | Read-only fetch from scrumtrulescent.com Payload REST API at build time |

## Success criteria

1. Qualified consulting inquiries generated within 30 days of launch.
2. Lighthouse performance score ≥ 90 on all pages.
3. No CLS issues; animations never reduce usability.
4. Contact form delivers emails via Resend reliably.
5. Full deployment via Dokploy with zero-downtime updates.
6. "From Scrumtrulescent Magazine" section loads featured articles from the
   magazine API at build time with a graceful fallback if the API is unavailable.
