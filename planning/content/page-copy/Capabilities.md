# Capabilities page — positioning strategy & copy source (EPIC-021)

Owner brief (2026-07-24): rebuild /capabilities from the two market-research
reports + the relationship-pricing doc into the most convincing page on the
portfolio. Owner decisions taken in chat: **global market focus**
(creator / agency / SaaS-adjacent operators, USD framing, Zambia work served
but not led with), and **straight to code** (this doc is the durable strategy
record; no separate strategy deliverable).

This file is the source the tasks draft final copy from. Final page copy goes
through stop-slop; nothing here is verbatim-final until it has.

---

## 1. Positioning

**One line:** an engineering partner who builds the systems a business runs
on — and stays to keep improving them.

- Not a freelancer (deliver-and-disappear), not an agency (layers, handoffs,
  juniors). One senior engineer with AI leverage shipping what recently took
  a team.
- The research's through-line: nobody wants a website; they want revenue,
  time back, and control. Sell systems and outcomes, never "digital
  transformation" or "AI" as the headline.
- Why-now economics (used sparingly, one strip on the page): AI collapsed
  the cost of the typing; judgment, taste, and accountability are what you
  hire. One person now carries discovery → build → run.

**Ideal clients** (all evidenced in the reports):
- Creators / coaches / niche founders earning enough that platform fees and
  platform risk hurt (Skool/Kajabi/Substack 2.9–10%; deplatforming
  precedents).
- Agencies & service firms, ~3–50 staff, drowning in duct-taped tools
  (research: 22–31% of staff time lost to non-billable admin).
- Operators with data scattered across 5–10 systems and no coherent view.

**Against agencies:** no telephone game — the person you talk to builds it.
**Against cheap freelancers:** you're not buying hours, you're buying a
system that keeps compounding; ownership + continuity are the product.

## 2. Service taxonomy — four pillars

The current five-service list (web dev / custom software / AI integration /
mobile payments / e-commerce) dies. Payments + e-commerce fold into
Platforms as capabilities; "custom software" splits across Operations and
Automation; "web development" as a headline label is retired (research #3:
nobody buys a website). Four pillars, each with a research paper trail:

### P1 — `platforms` · Platforms you own
- **For:** creators, coaches, communities, independent brands.
- **Problem:** rented audiences — 2.9–10% platform fees, no data ownership,
  one policy decision from going dark (Yeezy/Shopify, PayPal precedents).
- **What I build:** membership + course + community + newsletter + commerce
  on their own domain and infrastructure; Stripe direct (and mobile-money
  rails where the market needs them); full data export; done-for-you
  migration. (Research: OwnStack, CreatorStack, LaunchOS.)
- **Outcome framing:** keep the margin, keep the audience, keep the keys.

### P2 — `operations` · Operations systems
- **For:** agencies, studios, service firms.
- **Problem:** the business runs across ClickUp + Sheets + inbox + memory;
  onboarding, delivery, reporting and billing all leak hours.
- **What I build:** one internal system shaped to how the team already
  works — client portals, delivery pipelines, time/billing, dashboards,
  automated reporting. (Research: OpsEngine/AgencyOS; recovered billable
  hours as the ROI story.)
- **Outcome framing:** the admin hours come back as billable hours.

### P3 — `automation` · Automation & applied AI
- **For:** any operator with repetitive knowledge work.
- **Problem:** copy-paste between tools; AI curiosity but chatbot fatigue.
- **What I build:** workflow automation and integration middleware; AI
  agents scoped to finish one job end-to-end (intake, qualification,
  document drafting, reporting) with human handoff where judgment starts.
  (Research: AgentBridge, NicheAgent, middleware; integration — not the
  model — is the hard part; payback measured in months.)
- **Outcome framing:** the busywork completes itself; people do judgment.

### P4 — `data` · Data & integrations
- **For:** operators with 5–10 systems and no single source of truth.
- **Problem:** decisions made on exports, gut feel, and stale spreadsheets.
- **What I build:** pipelines that pull every system into one warehouse,
  clean it, and land it as the report the owner actually reads; API
  wrappers around awkward third-party systems. (Research: DataPipe /
  DataBridge.)
- **Outcome framing:** one screen you trust instead of ten you don't.

Each pillar's expanded panel carries: who it's for → the problem in the
buyer's words → what I build (concrete systems, not features) → what it
replaces (named tool-sprawl) → one proof/anchor line.

## 3. Engagement model — Build, then Evolve

From the relationship-pricing doc, adopted: two-phase engagement, presented
as investment in a compounding asset — never "maintenance", never SaaS.

- **Build.** Fixed scope, fixed price, weeks not quarters. Ends with a
  working system the client owns outright.
- **Evolve.** A monthly partnership: the system keeps absorbing work —
  new automations, integrations, refinements — steered by what the
  business learns each month. This is where the compounding happens.
- **The guarantee (risk reversal):** the client owns everything — code,
  data, infrastructure, accounts. Cancel anytime and everything keeps
  running. (Direct counter to both agency lock-in and platform risk.)

No numeric pricing on the page in this epic — the structure supports
adding ranges later, but publishing rates is an owner decision
(OWNER REVIEW). The model is presented qualitatively.

This section **replaces** ProcessSteps' transactional four stages
(inquiry → contract + down payment → delivery → handover) on the page —
that flow contradicts the relationship positioning.

## 4. Page architecture (IA + interaction)

1. **Hero** — PageHero (EPIC-020 pattern, unchanged shell). Positioning
   statement + one measured supporting line. 30-second test lives here.
2. **Capability explorer** — the four pillars as a progressive-disclosure
   explorer: compact pillar rows/rails, one open at a time, expanding into
   the structured panel (§2). ARIA disclosure semantics, keyboard
   reachable, framer height-reveal (bookshelf reading-panel precedent from
   EPIC-018). No card walls, no 30 sections.
3. **Why one engineer** — short manifesto strip (3–4 lines max): the
   economics answer to "can one person really carry this?". Text-first,
   no infographic theater.
4. **How we work** — Build → Evolve as a two-beat step explorer +
   the ownership guarantee as a distinct closing line/card.
5. **Technologies** — TechGrid kept, demoted below the engagement model
   (proof layer, not pitch layer).
6. **CTA** — CTACallout, fit-check tone (current "tell me what you're
   trying to build and I'll tell you straight whether I'm the right fit"
   voice is already correct; keep or lightly retune).

**Motion:** house system only — fadeUp/stagger entrances, height-reveal
disclosures, EASE_OUT, transform/opacity, reduced-motion gated. Nothing
novelty; motion exists to reveal structure.

**Home CapabilityRail:** consumes the same single source (services.ts) —
becomes four pillar cards; `/capabilities#<id>` anchors stay coherent by
construction. Old anchor ids (web-development etc.) retire; grep for
stray hardcoded references during implementation.

## 5. CTA strategy

One primary action site-wide: `/contact` with fit-check framing (low
threat, high agency: "tell me what's broken"). The explorer panels each
end in a quiet inline text-link to contact, so a convinced reader never
scrolls to convert. No calendly-style urgency, no dual competing CTAs.

## 6. What the research supports vs. what was cut

- **Cut:** leading with Zambia/ZRA compliance (owner chose global; local
  work still fits under Platforms/Automation capabilities without
  headline real estate). Pricing numbers (owner decision). "AI" as a
  brand pillar (report #3's slop stigma; AI is the how, not the what).
  ProcessSteps' transactional stages (contradicts relationship model).
- **Kept but reframed:** payments/e-commerce → capabilities inside
  Platforms; internal tools/CRMs/booking → concrete systems inside
  Operations.
- **Extended beyond the reports (flagged):** the ownership guarantee as
  the page's central risk-reversal is a synthesis of report #2's
  deplatforming thread + the pricing doc's cancel-anytime logic — it is
  the single most defensible differentiator vs. both agencies and
  platforms, so it gets structural prominence.
