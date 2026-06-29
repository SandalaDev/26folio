---
id: UI-ELEMENT-MAP
status: draft            # draft -> owner sets approved to complete project start
phase: 6
generated_from:
  - 12-ui-element-map.QUESTIONNAIRE.md
references:
  - https://addepto.com/
  - https://addepto.com/ai-integration-services/
  - https://www.baunfire.com/
  - https://brittanychiang.com/
  - https://www.ramotion.com/
  - https://21st.dev/community/components/dhiluxui/celestial-ink-shader/default
related:
  - 10-design-system.md
  - 11-content-strategy.md
---

# UI Element Map — sandala.dev

> Every content block in the approved sitemap ([11-content-strategy.md](11-content-strategy.md) §3–4)
> mapped to **one exact UI element**: its component name, its source, its reference,
> and its motion binding. This is the contract the build phase implements against —
> a block that isn't here doesn't get built, and a component named here is the one
> built (not a freehand reinterpretation).
>
> **Source order** ([10-design-system.md](10-design-system.md) §8): shadcn/ui primitive →
> 21st.dev for expressive/hero blocks → custom only where a cited reference demands it.
> **Motion ownership** (§6): one library per job — Framer for entry/stagger/page,
> GSAP+ScrollTrigger for scroll-driven, Lottie for icon playback. Every effect has a
> `prefers-reduced-motion` fallback.

## 1. Shared primitives (built once, used everywhere)

These are referenced by name throughout §3–§4. They are built first; pages compose them.

| Component | Source | Role | Motion |
|---|---|---|---|
| `Button` | shadcn base + custom variants | Primary / ghost CTAs. Hard corners, `background` text on `rose`/`caramel` fills | Framer hover variants (§7 #4) |
| `Section` | custom | Section wrapper enforcing `py-20 md:py-28 px-6 md:px-12 lg:px-24`, `max-w-7xl` | — |
| `Eyebrow` | custom | Uppercase tracked label above section headings | — |
| `Cursor` / `useCursor()` | custom | Custom cursor + hover states; pointer-fine only | shared pointer tracker |
| `FlashlightCursor` | custom | Warm radial spotlight (low-opacity `peach`/`rose`), pointer-fine only | shared pointer tracker (§7 #2/#6) |
| `usePointer()` | custom | Single `mousemove` source feeding `Cursor` + `FlashlightCursor` | — |
| `CTACallout` | custom | End-of-page conversion band; per-page CTA copy → `/contact` | Framer entry |

> `Cursor` and `FlashlightCursor` **must** share `usePointer()` — one listener, two
> consumers ([10-design-system.md](10-design-system.md) §7). Both disable on touch and never
> remove the native focus ring (§10).

## 2. Global elements

| Block | Component | Source | Reference | Motion |
|---|---|---|---|---|
| Header / nav | `SiteHeader` (desktop nav) + `MobileNav` (shadcn `Sheet` drawer) | shadcn `NavigationMenu` + custom | **addepto.com** header, adapted to our system: warm-dark, hard corners, sticky | Sticky w/ warm blur backdrop (§5); Framer show/hide on scroll |
| Footer | `SiteFooter` | custom | Monochromatic; nav + socials + Scrumtrulescent link + **monochromatic wordmark** | Framer entry on enter |
| Page transitions | `PageTransition` | custom (Framer `AnimatePresence mode="wait"`) | — | §6 page = 500ms |

Nav links: Home · About · Capabilities · Work · Contact (§3). Footer repeats nav +
socials + magazine link. **No LinkedIn anywhere** (§7 policy).

## 3. Page maps

### `/` Home

| # | Block | Component | Source | Reference | Motion |
|---|---|---|---|---|---|
| 1 | Hero | `Hero` = `ShaderBackground` + headline + sub + `Button` | **21st.dev** (shader) + custom + shadcn (button) | [celestial-ink-shader](https://21st.dev/community/components/dhiluxui/celestial-ink-shader/default) — **background only**, re-tinted to system colors | WebGL shader; headline Framer fade-up; CTA "Let's talk" |
| 2 | Featured Work | `WorkCard` ×2 inside `Section` | custom | **baunfire.com** section below hero (on-hover motion) | `WorkCard` zoom + diagonal reveal, Framer (§7 #3) |
| 3 | What I do | `CapabilityRail` (pinned horizontal scroll) | custom | baunfire/ramotion feel; each panel deep-links to the matching `/capabilities` section | **GSAP ScrollTrigger** pin + horizontal scrub (scroll-driven → GSAP, §6) |
| 4 | From Scrumtrulescent | `MagazineTeaser` + `ArticleCard` ×3 | custom + shadcn `Card` | Payload REST API (ISR 1h, graceful fallback); cards link **out** to scrumtrulescent.com | Framer staggered entry (`stagger .08`) |
| 5 | CTA band | `CTACallout` | shared (§1) | CTA → `/contact` | Framer entry |
| 6 | Footer | `SiteFooter` | global (§2) | — | — |

> **Hero guardrail:** the shader must obey [10-design-system.md](10-design-system.md) §3 —
> warm-dark base, `rose`/`peach`/`caramel` only, **no magenta, no harsh two-stop ramp**.
> Provide a static warm-gradient poster for `prefers-reduced-motion` and low-power GPUs.

### `/about`

Structure borrowed from brittanychiang.com, warmed to our system.

| # | Block | Component | Source | Reference | Motion |
|---|---|---|---|---|---|
| 1 | Hybrid intro (business + personal) | `AboutIntro` | custom | brittanychiang.com intro; one opening that reads as both | Framer fade-up; `FlashlightCursor` active here |
| 2a | Sticky cards (one column) | `StickyCard` ×2 | custom + shadcn `Dialog` | — | Sticky position; Framer hover |
| 2a-i | "The way I am" → interests | `InterestsModal` | shadcn `Dialog` + custom | Categorised interests, images, playful layout | Framer content stagger inside modal |
| 2a-ii | "Who I am" → biography | `BioModal` | shadcn `Dialog` + custom | Detailed bio | Framer fade |
| 2b | Animated timeline (other column) | `Timeline` | custom | brittanychiang.com vertical timeline | **GSAP ScrollTrigger** reveal-on-scroll (§7 #5) |
| 3 | Scrumtrulescent section | `MagazineSection` | custom | What it is / why / takeaway; links to scrumtrulescent.com | Framer entry |
| 4 | Social links | `SocialLinks` | custom | TikTok · YouTube · X · Bluesky · GitHub — **No LinkedIn** | Framer hover |
| 5 | CTA band | `CTACallout` ("Want to work with me") | shared (§1) | → `/contact` | Framer entry |

### `/capabilities`

Content organisation heavily borrowed from addepto.com. The two tabbed sections share
**one headless primitive** `useTabbedContent` with two skins (§7 #9/#10).

| # | Block | Component | Source | Reference | Motion |
|---|---|---|---|---|---|
| 1 | Services (Web dev · Custom software · AI integration) | `ServiceTabs` (skin of `TopicTabs`) | custom + shadcn | **addepto.com** vertical topic tabs → content card swaps (§7 #10, `...235531.png`) | Framer content cross-fade on select |
| 2a | Technologies — intro | `Section` + copy | custom | Skillset / tooling philosophy | Framer fade-up |
| 2b | Technologies — logo grid | `TechGrid` + `LogoHoverCard` | custom (hover card on shadcn `HoverCard`) | **ramotion.com** home logos — fixed grid, **does not scroll**; new set animates in every few seconds; hover shows tech name **+ what I use it for** | GSAP/Framer timed swap; Framer hover card (§7 #7) |
| 3 | How I work — "What working with me looks like" | `ProcessSteps` (skin of `IconTabs`) | custom | **addepto.com/ai-integration-services/** — inquiry → signed contract + down payment → delivery → handover (§7 #9, `...235334.png`) | Framer step content swap; `useTabbedContent` |
| 4 | CTA band | `CTACallout` ("Request a proposal & quote") | shared (§1) | → `/contact` | Framer entry |

### `/work`

| # | Block | Component | Source | Reference | Motion |
|---|---|---|---|---|---|
| 1 | Project grid | `WorkGrid` + `WorkCard` | custom | baunfire.com card motion; brief description per project (problem/outcome). No case studies/metrics in v1 | `WorkCard` zoom + diagonal reveal, Framer (§7 #3); optional `HoverVideo` (§7 #8) where a clip exists |
| 2 | CTA band | `CTACallout` ("Start a project") | shared (§1) | → `/contact` | Framer entry |

### `/contact`

| # | Block | Component | Source | Reference | Motion |
|---|---|---|---|---|---|
| 1 | Inquiry form | `ContactForm` = shadcn `Form` + `Input` + `Textarea` + `Select` ("type of project", optional) + `Button` | **shadcn/ui** | name · email · message · optional project type; Resend delivery, **no stored submissions** | Framer field entry |
| 2 | Confirmation state | inline success in `ContactForm` + shadcn `Toast` | shadcn | Clear confirmation on submit | Framer fade-in |
| 3 | Contact details | `Section` + `SocialLinks` | custom | Direct details + socials (no LinkedIn) | — |

## 4. Component → source rollup

| Source | Components |
|---|---|
| **shadcn/ui** (primitive) | `Button`, `NavigationMenu`, `Sheet`, `Dialog`, `Card`, `HoverCard`, `Form`, `Input`, `Textarea`, `Select`, `Toast` |
| **21st.dev** (expressive) | `ShaderBackground` (celestial-ink-shader, re-tinted — document the usage in its build task per §8) |
| **custom** (cited reference) | `Hero`, `WorkCard`, `WorkGrid`, `CapabilityRail`, `MagazineTeaser`, `ArticleCard`, `AboutIntro`, `StickyCard`, `InterestsModal`, `BioModal`, `Timeline`, `MagazineSection`, `SocialLinks`, `ServiceTabs`, `TechGrid`, `LogoHoverCard`, `ProcessSteps`, `SiteHeader`, `MobileNav`, `SiteFooter`, `CTACallout`, `Cursor`, `FlashlightCursor`, `PageTransition` |
| **shared headless** | `useTabbedContent` (→ `ServiceTabs` + `ProcessSteps`), `usePointer()` (→ `Cursor` + `FlashlightCursor`) |

## 5. Motion → library binding (§6 ownership, enforced)

| Library | Used by |
|---|---|
| **Framer Motion** | entry fades, staggers, hover variants, `Button`, modals, `PageTransition` (`AnimatePresence`) |
| **GSAP + ScrollTrigger** | `CapabilityRail` (pinned horizontal scroll), `Timeline` (scroll reveal), `TechGrid` timed swap |
| **Lottie** | reserved for any icon/illustration playback (none required by current blocks; introduce per-task) |
| **WebGL** | `ShaderBackground` only |

Duration defaults: micro 150ms · component 300ms · page 500ms · scroll = progress-driven.
Easing `[0.22, 1, 0.36, 1]`; no springs/overshoot. `prefers-reduced-motion` disables all
choreography and serves static fallbacks (shader poster, instant reveals).

## 6. Open decisions & risks (resolve in build tasks)

1. **Shader performance & a11y** — `ShaderBackground` needs a low-power/reduced-motion
   static poster and a GPU-tier guard; spec it in the Hero task before shipping WebGL on a
   marketing hero.
2. **Horizontal scroll accessibility** — `CapabilityRail` (pinned GSAP) must remain
   keyboard-reachable and degrade to a normal vertical/stacked list on touch and under
   reduced motion (§11). Confirm deep-links to `/capabilities` sections work without the scroll.
3. **Magazine API fallback** — `ArticleCard` ×3 depend on the Payload REST API; the
   graceful-fallback UI (when the fetch fails or returns < 3) is part of the `MagazineTeaser`
   task, not an afterthought.
4. **`useTabbedContent` first** — build the headless primitive before `ServiceTabs` and
   `ProcessSteps` so the two addepto-derived sections don't fork into two implementations.
5. **PRD naming** — sitemap uses **Capabilities** (not "Services"); reconcile the PRD label
   at the next spine pass (already flagged in [11-content-strategy.md](11-content-strategy.md) §3).

---

### Your next step

1. Review the per-page maps (§3) and the source rollup (§4) — these are the components
   the build phase will be planned around.
2. When it reads right, set `status: approved` in the frontmatter above. That completes
   the project-start spine; epics/slices/tasks get planned against this map.
