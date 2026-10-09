# Work: page copy

EPIC-029 TASK-137, TASK-139 and TASK-140 (revising EPIC-026 TASK-101). Every
string on the project pages, gathered so they can be read side by side. This
file is the review surface; the shipped strings live in `src/lib/projects.ts`.
Scrumtrulescent and Cloudege are added when their assets arrive.

**Status: awaiting owner approval.** Written from what the artwork shows.
stop-slop: 50/50.

## Rules this copy holds to

- No metrics, outcomes, testimonials, client quotes or years.
- Credits: The Flavour Grills Cafe is "Client". The other three are
  "Self-commissioned", and say so in the first word of their text as well as on
  the card.
- Provision Finance's mockups contain the line "A Bank of Zambia accredited
  financial institution" inside the artwork. The copy states plainly that
  Provision is not a real institution, so that text cannot be read as a claim.
- Design decisions are described as decisions. Nothing claims a decision was
  validated, well received or effective.
- Each page ends on a link to the "Brand Identity & Interface Design"
  capability, then "Start a project".

## `/work` page (TASK-140)

**Title** (existing, EPIC-020): A few things I've shipped

**Supporting line:** My own ventures, a brand identity for a client, and brand
work I set myself. Each card says which is which.

No project count, so it stays true as Scrumtrulescent and Cloudege join. Each
card shows its credit and disciplines under the title.

## sandala.dev (TASK-137)

- **Tagline:** This site
- **Credit:** Own venture
- **Disciplines:** Interface design, Design system, Front-end engineering
- **Description:** This site: a design system, its motion and a working contact pipeline, designed and built by one person.
- **Ends on:** Brand Identity & Interface Design. The plan named the "motion"
  technology area, but that is a tab on /capabilities, not a section a link can
  land on.

**The idea**

Own venture: the site you are reading. It had two jobs. The first was to say plainly what I do and for whom, so every page starts from a problem a business would recognize before it names any technology. The second was to be evidence in its own right, so it is built the way I build for clients. A warm, dark design system with square corners and a small set of tokens keeps every page in one language, including these project pages, which fit their layout to each project's artwork but never borrow its colours. Motion appears where it explains something and switches off entirely for anyone whose device asks for reduced motion. The contact form checks for a human with Turnstile, validates on the server, delivers the inquiry by email through Resend and sends the sender an acknowledgement. Every page is generated ahead of time and served from Cloudflare's edge, with no database to maintain. Built with Next.js, TypeScript, Tailwind CSS, Framer Motion and GSAP, on Cloudflare Workers.

**Captions**

- Capabilities: services described by the problem they solve.
- About: the person, in the same voice as the work.
- Contact: Turnstile, server validation, email delivery and an auto-reply.

## The Flavour Grills Cafe

- **Tagline:** Restaurant & hospitality
- **Credit:** Client
- **Disciplines:** Brand identity, Print & collateral
- **Description:** Identity and collateral for a Zambian restaurant, bar and events venue, built around a lidded cooking pot.

**The brief**

The one commissioned project here. Flavour Grills is a restaurant, a bar and a special-events venue, so the identity has to work in three registers at once: something you read at the table, something you recognise from outside, and something that leaves with you. The mark is a lidded three-legged cooking pot, drawn plainly enough to hold at business-card scale and to reverse to a single colour where the printing calls for it, which is why it ships in coral-and-navy, all-navy and all-white. The collateral was designed as a set rather than a logo plus applications: menu folder, stationery, spice-jar labels, coffee packaging and leather tags.

**Captions**

- Collateral: menu folder, stationery, spice labels, coffee packaging and leather tags.

## Provision Finance

- **Tagline:** Financial services
- **Credit:** Self-commissioned
- **Disciplines:** Brand identity, Web design
- **Description:** A retail finance identity taken from a constructed mark through to two complete page designs.

**The idea**

Self-commissioned. I gave a retail finance brand a mark with an argument behind it, then pushed far enough to see whether the mark could carry an interface as well as a shopfront. Four attributes (professional, visionary, precise, proficient) resolved into a three-bar device drawn on golden-ratio construction, then reversed for navy and for white. The site design puts borrowing, transacting and saving on the landing page as three equal actions, and keeps a live exchange-rate strip above the fold where a customer checking rates will see it first. Provision Finance is not a real institution, and the copy inside these mockups is placeholder.

**Captions**

- Rationale board: the mark derived from the attributes, on golden-ratio construction.
- Brand board: reversals and the two pattern treatments.
- Homepage: three equal front doors, with live exchange rates.
- Products: loans and accounts, laid out for comparison.

## OK Pharmacy

- **Tagline:** Pharmacy & retail
- **Credit:** Self-commissioned
- **Disciplines:** Brand identity, Signage & packaging, Web design
- **Description:** A 24-hour pharmacy identity built on a monogram that doubles as a hand gesture.

**The idea**

Self-commissioned. The idea is one shape doing two jobs: the O of the wordmark is a hand making an OK sign, so the letter and the reassurance arrive together. A pharmacy mark has to be read from across a mall on lit signage and at avatar size on a social profile, so the monogram was drawn to stand alone, without wordmark or tagline, and the fuller lockups build outward from it. From there it went onto 24-hour signage, retail packaging, print, social and a storefront design with a branch locator.

**Captions**

- Suspended signage: the 24-hour promise carried at distance.
- Storefront: retail catalogue, stocked brands and branch locator.

## Gardenfare Foods

- **Tagline:** Food & packaging
- **Credit:** Self-commissioned
- **Disciplines:** Brand identity, Packaging design
- **Description:** A food brand whose stamp mark had to hold up across four very different pack formats.

**The idea**

Self-commissioned, and the constraint I set myself was format. A can, a gusseted pouch, a bottle and a jar give four different curves, four label shapes and four printing methods, so the mark had to be indifferent to all of them. A circular stamp, a tree and wheat ears inside a scalloped ring, holds its shape on every one and still reads at the size a jar lid allows. Four colourways carry it across the range, so each product reads as its own thing without leaving the family.

**Captions**

- Colourways: one mark, four grounds to print on.
- GardenFruit: mixed fruit juice
- GardenOats: lightly sweetened
- GardenSoy: organic soy milk
- GardenSpread: creamy peanut butter
- Applications: the mark against real product photography.

## Owner decisions still open

1. **The client's contact details are legible in `poster-pastry`.** The coral
   band at the foot of that poster carries Flavour Grills' phone numbers and web
   address. It appears on the page and in both Flavour Grills preview clips.
   The client distributes the poster itself, but republishing their contact
   details on a portfolio is their call. Confirm, or supply a version with the
   band cropped (the clips are rebuilt from it with one command).
2. **`role` is unset on the four brand projects.** The artwork shows what was
   made, not who else was involved. Fill it only if there is something to say.

The AI-generated dispensary scene was ruled out at the EPIC-029 kickoff and is
no longer in the repository.
