---
id: DOMAIN-MODEL
status: approved
created: 2026-06-28
source: hydrated from 00-original-intent.md + INTAKE-INTERVIEW.md
---

# Domain Model — sandala.dev

## Context

This phase has no database. The domain model is a shared vocabulary for content
structure and UI concepts — not a relational schema. All entities below live as
Markdown files or static data, not in a data store.

## Core entities

### Page
The top-level unit of the site. Each page maps to a route.

| Attribute | Type | Notes |
|---|---|---|
| slug | string | URL path segment |
| title | string | Page title (SEO) |
| description | string | Meta description |
| sections | Section[] | Ordered list of content sections |

### Section
A distinct content block within a page (hero, feature grid, testimonial, etc.).

| Attribute | Type | Notes |
|---|---|---|
| type | enum | hero · feature · work-grid · services · testimonial · cta · text |
| content | object | Type-specific payload |
| animation | string? | GSAP / Framer Motion variant name, if any |

### Project (Case Study)
A piece of portfolio work displayed on the Work page.

| Attribute | Type | Notes |
|---|---|---|
| id | string | kebab-case slug |
| title | string | |
| client | string | Name or anonymised description |
| problem | string | What the client needed solved |
| approach | string | Engineering/design approach |
| outcome | string | Business result, not just delivery |
| tech | string[] | Technologies used |
| cover | string | R2 asset URL |
| featured | boolean | Show on Home page preview |
| published | boolean | Include in Work grid |

### Post (Blog / Essay)
A piece of writing — stored as Markdown in `content/posts/`.

| Attribute | Type | Notes |
|---|---|---|
| slug | string | URL path segment |
| title | string | |
| date | ISO 8601 | Publish date |
| excerpt | string | Used in listing and OG description |
| reading_time | number | Minutes, computed from word count |
| tags | string[] | Categorical labels |
| published | boolean | Gates inclusion in listing |

### Service
A consulting service tier — static data in `content/services.ts`.

| Attribute | Type | Notes |
|---|---|---|
| id | string | |
| title | string | |
| description | string | |
| tier | 1–9 | Position in the service hierarchy |
| cta | string | Button label |

### ContactSubmission
Transient — never stored. Collected in the contact form, sent via Resend, discarded.

| Attribute | Type |
|---|---|
| name | string |
| email | email |
| message | string |
| project_type | string? |

## Ubiquitous language

| Term | Meaning in this project |
|---|---|
| Case study | A Project entity presented with problem/approach/outcome framing |
| Post | A blog article or essay; static Markdown |
| Service tier | A level of engagement in the consulting value ladder |
| Motion | Deliberate animation (Framer Motion / GSAP / Lottie) — always purposeful |
| Slop | AI-generated filler text, vague claims, or decorative copy — never published |
| Above the fold | The visible area before scroll on each page's primary breakpoint |
