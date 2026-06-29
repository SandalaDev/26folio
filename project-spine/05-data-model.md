---
id: DATA-MODEL
status: draft
created: 2026-06-28
source: hydrated from 00-original-intent.md + INTAKE-INTERVIEW.md
protected: true
---

# Data Model — sandala.dev

## Phase 1 position

**No database exists in this phase.** All content is file-based (Markdown,
TypeScript data files). This file is intentionally minimal and acts as a
future-phase gate: nothing should create a database schema, ORM, or migration
without updating this file and obtaining human approval (see CODEOWNERS).

## File-based storage (current)

| Content type | Location | Format |
|---|---|---|
| Blog posts | `content/posts/*.md` | Markdown with frontmatter |
| Case studies | `content/projects/*.md` | Markdown with frontmatter |
| Services | `content/services.ts` | TypeScript static array |
| Navigation | `content/nav.ts` | TypeScript static object |

## Cloudflare R2 (media)

Media assets (images, video, Lottie JSON files) are stored in Cloudflare R2
and served via R2's public endpoint or a Cloudflare custom domain.

| Bucket path | Content |
|---|---|
| `/images/projects/*` | Case study screenshots and cover images |
| `/images/og/*` | Pre-rendered OG images |
| `/video/*` | Background/hero video files |
| `/lottie/*` | Lottie animation JSON files |

No signed URLs required in this phase — all R2 content is public-read.

## Resend (transient email)

Contact form submissions are forwarded to Resend as an email delivery API call.
**No submission data is stored anywhere.** The payload is:
- to: Abe Sandala's email address (env var `CONTACT_TO_EMAIL`)
- from: Resend verified sender domain (env var `RESEND_FROM_EMAIL`)
- subject: "New contact: sandala.dev"
- body: name, email, message, project_type

No webhook, no database write, no queue — fire and forget.

## Future phases (deferred — do not build yet)

The following were in the original brief's assets list but are explicitly
deferred until a later phase when a CMS is warranted:

- Payload CMS (requires a database)
- PostgreSQL schema for posts/projects
- Authentication (admin access to CMS)
- Stored contact submissions

**Gate:** Any task touching `src/db/`, an ORM config, or a migration file
requires human approval per CODEOWNERS before merge.
