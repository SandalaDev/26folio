---
id: TECHNICAL-PLAN
status: draft
created: 2026-06-28
source: hydrated from 00-original-intent.md + INTAKE-INTERVIEW.md
---

# Technical Plan — sandala.dev

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSG for all pages; no server-side DB calls |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS v4 | Utility-first; no inline styles |
| Components | shadcn/ui | Accessible primitives |
| UI elements | 21st.dev | Creative component library |
| Animation | Framer Motion | Layout animations, page transitions, scroll-driven |
| Animation | GSAP | Timeline-heavy sequences, SVG morphing, complex scroll |
| Animation | Lottie | Lightweight JSON-based vector animations |
| Email | Resend | Contact form delivery only |
| Media | Cloudflare R2 | Images, video, Lottie JSON |
| Runtime | Node.js | Next.js server; API routes for contact form only |
| Deployment | Dokploy on VPS | Docker-based; zero-downtime deploys |

## Project structure

```
src/
  app/                    # Next.js App Router
    (site)/               # Route group — all public pages
      page.tsx            # Home (includes From Scrumtrulescent Magazine section)
      about/page.tsx
      work/page.tsx
      work/[slug]/page.tsx
      services/page.tsx
      contact/page.tsx
    api/
      contact/route.ts    # Resend POST handler
  components/
    ui/                   # shadcn/ui primitives
    motion/               # Framer Motion wrapper components
    gsap/                 # GSAP-powered components
    lottie/               # Lottie player wrappers
    sections/             # Page section components
      MagazinePreview/    # "From Scrumtrulescent Magazine" home section
    layout/               # Header, Footer, Navigation
  lib/
    resend.ts             # Resend client
    r2.ts                 # Cloudflare R2 URLs
    magazine.ts           # Scrumtrulescent Magazine Payload REST API client
  content/
    projects/             # Case studies (Markdown)
    services.ts           # Static services data
    nav.ts                # Navigation config
```

## Environments

| Env | Purpose | Notes |
|---|---|---|
| local | Development | `pnpm dev` / `next dev` |
| staging | Pre-prod review | Dokploy preview environment on same VPS |
| production | Live site | Dokploy production on VPS |

## Environment variables

| Variable | Used by | Notes |
|---|---|---|
| `RESEND_API_KEY` | Resend client | Secret — never committed |
| `RESEND_FROM_EMAIL` | Contact form | Verified sender address |
| `CONTACT_TO_EMAIL` | Contact form | Abe's delivery address |
| `NEXT_PUBLIC_R2_URL` | Media URLs | Public Cloudflare R2 base URL |
| `MAGAZINE_API_URL` | Magazine client | Base URL for scrumtrulescent.com Payload REST API |
| `MAGAZINE_API_KEY` | Magazine client | Read-only API key for Payload; never exposed client-side |

## Deployment (Dokploy)

1. Push to `main` triggers a Dokploy webhook.
2. Dokploy builds the Docker image (`Dockerfile` in repo root).
3. Image runs `next start` on port 3000 inside the container.
4. Dokploy manages reverse proxy (Traefik) and SSL termination.
5. Zero-downtime via container replacement.

Dockerfile pattern:
```dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --frozen-lockfile
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Skills to install

The following skills must be installed via `scripts/skills.sh` before
implementation begins:
- `tailwind` — Tailwind CSS v4 conventions and utility patterns
- `shadcn-ui` — shadcn/ui component usage and customisation
- `framer-motion` — Framer Motion animation patterns
- `gsap` — GSAP timeline, ScrollTrigger, SVG animation
- `lottie` — Lottie-web / react-lottie integration
- `21st-dev` — 21st.dev component catalogue and usage
- `nextjs-app-router` — Next.js App Router conventions
- `resend` — Resend email API
- `cloudflare-r2` — R2 asset management
- `payload-rest-api` — Payload CMS REST API consumption (read-only client)

## Magazine API client (`lib/magazine.ts`)

sandala.dev is a read-only consumer of the Scrumtrulescent Magazine Payload API.
The client:

```ts
// Fetches articles flagged featured_on_portfolio: true from the magazine
// Uses Next.js fetch with { next: { revalidate: 3600 } } — 1-hour ISR
// Returns MagazineArticle[] | [] on any error (never throws, never blocks build)
export async function getFeaturedMagazineArticles(): Promise<MagazineArticle[]>

export type MagazineArticle = {
  id: string
  title: string
  excerpt: string
  slug: string
  cover_image: string   // R2 URL served by the magazine
  published_at: string  // ISO 8601
  category: string
  url: string           // Full URL on scrumtrulescent.com
}
```

## Not in sandala.dev (ever)

- Payload CMS — that is the magazine project (scrumtrulescent.com), a separate codebase
- Blog pages or article routes — content lives at scrumtrulescent.com only
- Authentication
- Third-party integrations (payment, compliance)
- Newsletter infrastructure
