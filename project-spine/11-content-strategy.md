---
id: CONTENT-STRATEGY
status: approved
phase: 5
generated_from:
  - 11-content-strategy.QUESTIONNAIRE.md
references:
  - https://www.baunfire.com/
  - https://brittanychiang.com/
  - https://www.ramotion.com/
  - https://addepto.com/
  - https://addepto.com/ai-integration-services/
related:
  - 01-project-charter.md
  - 03-project-prd.md
  - 10-design-system.md
---

# Content Strategy & Structure — sandala.dev

> Elicited from the questionnaire, not guessed. This document prescribes the
> **sitemap**, the **per-page content outline**, and the **content inventory** —
> the three things the build phase is gated on. Public copy is written later, per
> page, against the voice rules in §2; the verify gate de-slops it before ship.

## 1. Audience & conversion goal

| | Who | What they should do |
|---|---|---|
| **Primary** | Owners of cash-rich businesses that have the most to gain from a real online presence | Inquire about an engagement |
| **Secondary** | Decision-makers inside large multinational firms | Inquire about an engagement |

Single conversion across the whole site: **a qualified inquiry.** Every page ends
pointing at that — the CTA wording changes per page (§3) but the destination is the
contact form. Proof of credibility is the *work itself*, not metrics or logos (§5).

These are non-technical buyers. Copy sells **outcomes and judgement**, not stacks.
Technology names appear only where they signal competence (Capabilities) and never
as the headline.

## 2. Voice & tone

**Three words: Intelligent · Fun · Resourceful.**

- **Intelligent** — say the non-obvious thing. Show you understand the buyer's
  business problem before naming a solution.
- **Fun** — wit, warmth, a human at the keyboard. Confident enough to not be stiff.
- **Resourceful** — "I'll find a way" energy; range across web, custom software, and AI.

**Never sound like:** boring, rigid, copied, dull, generic filler. No corporate
throat-clearing, no template phrases ("We are passionate about leveraging
solutions"), no buzzword stacking. If a sentence could appear on any agency site,
it's wrong — the brand is *two things that weren't supposed to go together, made
intentional* (per [10-design-system.md](10-design-system.md) §1).

**Writing rules**
- Lead with the reader's stake, not Abe's résumé.
- Short sentences carry the weight; one idea each.
- First person ("I"), direct address ("you" / "your business").
- Specific over grand: "a booking system your front desk actually uses" beats
  "bespoke enterprise solutions."
- Every public string passes stop-slop + ds-content-review before ship (CLAUDE.md).

## 3. Sitemap (routes)

Five top-level routes. No blog/articles here — long-form lives on
scrumtrulescent.com and is *linked*, never reproduced (charter constraint).

| Route | Single job | Primary CTA |
|---|---|---|
| `/` (Home) | Introduce Abe and summarise what he does | **Let's talk** |
| `/about` | Deep dive into who he is; showcase competitive advantage | **Want to work with me** |
| `/capabilities` | Services + technologies + how an engagement works | **Request a proposal & quote** |
| `/work` | Projects portfolio | **Start a project** |
| `/contact` | Contact details + inquiry form | *(form is the action)* |

> Naming note: the charter/PRD called this page "Services"; the owner's chosen
> route and label is **Capabilities**. This doc is canonical for naming going
> forward; reconcile the PRD wording at next spine pass.

Global nav: Home · About · Capabilities · Work · Contact. Footer repeats nav +
social links + a link to Scrumtrulescent magazine.

## 4. Per-page content outline

### `/` Home
1. **Hero** — animated headline + sub-headline + primary CTA ("Let's talk").
   The one-line positioning: a strategic engineering partner, not a commodity
   freelancer.
2. **Featured work** — 2–3 project previews (brief description each), linking to
   `/work`. No metrics/testimonials in v1 (§5).
3. **What I do** — condensed capabilities teaser (web · custom software · AI),
   linking to `/capabilities`.
4. **From Scrumtrulescent** — 3 hand-picked featured articles fetched from the
   magazine's Payload REST API at build time (ISR, 1-hour revalidate, graceful
   fallback). Cards link **out** to scrumtrulescent.com; no body content is copied
   here (charter §magazine-integration).
5. **Footer** — nav, contact, socials, magazine link.

### `/about`
Borrows structure from brittanychiang.com, adapted to the warm/angular system.
1. **Hybrid intro** — works simultaneously as a *business* intro and a *personal*
   bio. One opening that earns trust and shows personality.
2. **Scroll experience — two columns:**
   - **Sticky cards** (one side): two cards that open modals.
     - **"The way I am"** → modal of interests, presented by category with images,
       in a playful layout.
     - **"Who I am"** → modal with the detailed biography.
   - **Animated-on-scroll timeline** (other side): career / journey beats revealing
     as you scroll (GSAP ScrollTrigger, per design §6).
3. **Scrumtrulescent section** — what the magazine is, why it exists, and what Abe
   hopes a reader takes from it; links to scrumtrulescent.com.
4. **Social links** — TikTok, YouTube, X, Bluesky, GitHub.
   **No LinkedIn** — deliberate brand decision; do not add it anywhere on the site.

### `/capabilities`
Heavily borrows content organisation from addepto.com. Three sections:

1. **Services**
   - **Web development (beyond a website):** Payload CMS builds ("I build it, you
     control it"), landing pages, dashboards, internal tools.
   - **Custom software:** booking systems / CRMs, mobile-money & payment-gateway
     integration, e-commerce.
   - **AI integration:** customer-care voice & chatbots, receptionist bot, custom
     integrations, local/on-prem AI.
2. **Technologies**
   - Intro on skillset and tooling philosophy.
   - **Logo grid** (ramotion.com-inspired): *does not scroll* — animates a new set
     of logos into view every few seconds; on hover each logo shows the technology
     name **and what Abe uses it for**.
3. **How I work — "What working with me looks like"**
   - Engagement process end-to-end: inquiry → signed contract + down payment →
     delivery → project handover.
   - UI borrowed from addepto.com/ai-integration-services/.

CTA: **Request a proposal & quote**.

### `/work`
- Grid of projects, each with a **brief description** (problem/outcome framing where
  possible). No case-study deep dives, testimonials, or metrics in v1 — projects
  stand on their own for now (§5).
- CTA: **Start a project**.

### `/contact`
- Contact details + inquiry form: name, email, message, optional "type of project"
  selector. Resend delivery only — no stored submissions (charter constraint).
- Clear confirmation state on submit.

## 5. Content inventory

| Item | Status | Owner |
|---|---|---|
| All page copy (Home, About, Capabilities, Work, Contact) | **To create** | Agent drafts → Abe curates/approves |
| Bio (short + long), interests content | To create | Abe provides raw material; agent shapes |
| Project entries + brief descriptions | To create | Abe supplies projects; agent writes briefs |
| Technology list + "what I use it for" lines | To create | Abe lists tools; agent writes hover copy |
| Engagement-process steps | To create | Agent drafts from Abe's actual process |
| Scrumtrulescent intro blurb | To create | Agent drafts; Abe approves |
| Photography / portrait | Exists (partial) | `Portrait 800 transparent.png` in repo root — confirm usage rights/placement |
| Featured magazine articles | External | Pulled live from scrumtrulescent.com API; not authored here |
| Testimonials / metrics / client logos | **Not in v1** | Deliberately excluded for now |

Nothing pre-written exists — everything is generated from scratch, agent-created and
owner-curated.

## 6. SEO intent

Owner deferred to recommendations; proposed below for approval.

**Canonical domain:** `https://sandala.dev` (apex, HTTPS, no `www`). Every page sets
a self-referential canonical tag; trailing-slash behaviour consistent with Next.js
defaults.

**OG / social-share image policy** *(what this means: the preview card shown when a
link is shared on X, Bluesky, WhatsApp, etc.)*:
- A branded default OG image (1200×630) using the warm-dark palette + wordmark.
- Per-page OG title/description; project pages may get a project-specific image.
- Twitter card `summary_large_image`. Images served from Cloudflare R2.

**Search intents to target** (buyer-language, not jargon):
- "software consultant / developer" + region (Zambia / Africa) — geo positioning.
- "custom business software" — booking systems, CRM, internal tools.
- "mobile money / payment gateway integration."
- "Payload CMS developer."
- "AI chatbot / voice assistant integration for business."

Intent is **commercial/consideration**, not informational — so the magazine
(scrumtrulescent.com) carries the keyword/blog SEO load, while sandala.dev optimises
for branded + high-intent service queries. Standard hygiene: semantic HTML,
`sitemap.xml`, `robots.txt`, descriptive alt text, fast LCP (design + charter).

## 7. Cross-property & social policy

- **Magazine (scrumtrulescent.com):** linked from Home (featured articles), About
  (dedicated section), and footer. Never reproduce article bodies — link out.
- **Socials:** TikTok, YouTube, X, Bluesky, GitHub. **LinkedIn is intentionally
  excluded** and must not be added.

---

### Your next step
Review §3 (sitemap), §4 (per-page), and §6 (SEO — these are my recommendations on
the parts you deferred). When it reads right:

1. Set `status: approved` in the frontmatter above.
2. The build phase (epics/slices/tasks) can then be planned against this structure.
