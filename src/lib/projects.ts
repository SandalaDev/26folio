/**
 * Project data for the home page's Featured Work block and the `/work` grid +
 * project pages.
 *
 * EPIC-026 TASK-094 turned this from a flat card shape into a composition model.
 * Each project carries an ordered list of typed blocks naming which of its assets
 * it presents and how, and `ProjectComposition` walks that list. There is no
 * shared page template: a project with six assets and one with thirteen produce
 * visibly different pages out of identical chrome. Adding a block to one project
 * changes nothing about the others.
 *
 * What adapts is layout. What never adapts is the visual language — no project
 * page borrows its subject's palette, type, or primitives (owner instruction,
 * 2026-08-15). Brand colours appear only inside the artwork and as labelled
 * `palette` swatches, which are content being shown rather than chrome doing the
 * showing.
 *
 * Assets, dimensions, and roles come from `public/images/projects/MANIFEST.md`
 * (TASK-093).
 *
 * Copy (TASK-101) is written from what the artwork actually shows and awaits owner
 * approval. It contains no metrics, outcomes, testimonials or client quotes —
 * partly because the content strategy forbids them, and partly because none of
 * that evidence exists. Only Flavour Grills was commissioned; the other three are
 * credited "Self-commissioned" and say so in their prose too (EPIC-029 TASK-139
 * brings the prose in line with that label).
 */

/** A committed image under `public/images/projects/<slug>/`. */
export interface Asset {
  src: string;
  /** Intrinsic size from MANIFEST.md — next/image needs both for non-fill use. */
  width: number;
  height: number;
  /** Real description; `""` only where the image is genuinely decorative. */
  alt: string;
  /** Optional caption rendered below the artefact's plate. */
  caption?: string;
  /**
   * The mat this artefact needs, decided by what its own ink requires (see
   * PlateTone). Lives on the asset rather than on each block variant, because
   * "what mat does this artwork need" is a property of the artwork — a single
   * logo suite can hold three lockups wanting three different tones. Blocks
   * supply a sensible default when omitted.
   */
  tone?: PlateTone;
}

/**
 * How an artefact is matted. The plate is built from site tokens, so foreign
 * artwork sits inside our language without being recoloured (TASK-095).
 * Chosen per artefact by what its ink needs, never per project.
 */
export type PlateTone =
  /** `surface` mat. Default; also correct for light-ink artwork. */
  | "neutral"
  /** `surface-2`, recessed. Contains artwork without a full mat. */
  | "sunken"
  /** Warm pale `ink` mat. Required for dark ink supplied on transparency. */
  | "light"
  /** No mat, for artwork that fills its own frame edge to edge. */
  | "bare";

export type ProjectBlock =
  | { kind: "hero"; cover: Asset }
  | { kind: "note"; heading?: string; body: string }
  | { kind: "logo-suite"; lockups: Asset[] }
  | { kind: "palette"; swatches: { hex: string; name: string }[] }
  /**
   * `label` gives each block a distinct section heading. It matters where a
   * project uses the same block twice: Provision has two `screens` and two
   * `board` blocks, and two identical headings read as a mistake to anyone
   * navigating by heading.
   */
  | { kind: "board"; sheet: Asset; label?: string }
  | { kind: "flatlay"; image: Asset }
  | { kind: "poster"; posters: Asset[] }
  | { kind: "packaging"; items: Asset[] }
  | { kind: "in-situ"; scenes: Asset[] }
  | { kind: "screens"; shot: Asset; label?: string }
  | { kind: "devices"; mocks: Asset[] }
  | { kind: "social"; items: Asset[] };

export interface Project {
  slug: string;
  title: string;
  /** Short category descriptor shown on cards. */
  tagline?: string;
  /** One line, used on the card and as the page's meta description. */
  description: string;
  href: string;
  /** Card background image (public path). */
  image?: string;
  /** What kind of work this was: "Brand identity", "Packaging design", … */
  disciplines: string[];
  /**
   * Whose work this was. Stated plainly on the card and the page: presenting
   * self-commissioned work as client work is the overclaim the charter exists to
   * prevent. There is deliberately no year field (EPIC-029 decision 16).
   */
  credit: ProjectCredit;
  /** The owner's role, where it needs saying (e.g. Cloudege's co-founder credit). */
  role?: string;
  /**
   * The `/capabilities` service this project evidences, by `CapabilityService.id`.
   * The page ends on a link to it; an id that does not resolve renders no link.
   */
  capability?: string;
  /** Muted preview loops. The poster stands in whenever motion is reduced. */
  video?: { card?: VideoClip; hero?: VideoClip };
  /** The composition, in render order. */
  blocks: ProjectBlock[];
}

export type ProjectCredit = "Client" | "Own venture" | "Self-commissioned";

/** A muted loop under `public/videos/projects/<slug>/`. */
export interface VideoClip {
  mp4: string;
  webm?: string;
  /** First-frame still; shown before playback and instead of it. */
  poster: string;
}

/* ---------------------------------------------------------------------------
   Brand palettes.

   Sourced exactly, not eyeballed: the first three come from `fill` / `stop-color`
   values in the committed vector logos, the fourth from sampling the lossless
   original PNG (`public/projects/flavour grills/flavour_main.png`) since that
   identity ships no SVG. These are CONTENT — the values a `palette` block
   displays. None is applied to any page surface.
   --------------------------------------------------------------------------- */

const OK_PALETTE = [
  { hex: "#2cb1e9", name: "Signal blue" }, // logo-symbol.svg, logo-full.svg
  { hex: "#00d8a4", name: "Wellness green" }, // logo-full.svg wordmark
];

const PROVISION_PALETTE = [
  { hex: "#201f71", name: "Deep navy" }, // logo.svg wordmark
  { hex: "#e62634", name: "Signal red" }, // logo.svg three-bar mark
  { hex: "#e5e3e3", name: "Contour grey" }, // logo.svg ground
];

const GARDENFARE_PALETTE = [
  { hex: "#48a52e", name: "Leaf green" }, // logo.svg ring
  { hex: "#f5cc3c", name: "Wheat yellow" }, // logo.svg tree and ears
  { hex: "#ff762c", name: "Harvest orange" }, // colourway board
  { hex: "#590f09", name: "Deep russet" }, // colourway board
];

const FLAVOUR_PALETTE = [
  { hex: "#ff755e", name: "Coral" }, // sampled from flavour_main.png
  { hex: "#002765", name: "Pot navy" }, // sampled from flavour_main.png
];

/* ---------------------------------------------------------------------------
   Compositions.

   Array order is the grid order and the previous/next order (EPIC-029 decision
   4): own ventures, then the client project, then self-commissioned work.
   Cloudege, Scrumtrulescent and sandala.dev join at the front as their pages
   land (TASK-137, TASK-138).

   The home page's FeaturedWork does not follow this order; it renders
   `featuredOnHome`, because Flavour Grills' only cover is a portrait flatlay
   that reads poorly in a wide featured card.
   --------------------------------------------------------------------------- */

/** The card and hero loops built by tools/build-clips.mjs (EPIC-029 TASK-135). */
function clips(slug: string): Project["video"] {
  const base = `/videos/projects/${slug}`;
  const clip = (name: "card" | "hero"): VideoClip => ({
    mp4: `${base}/${name}.mp4`,
    webm: `${base}/${name}.webm`,
    poster: `${base}/${name}-poster.webp`,
  });
  return { card: clip("card"), hero: clip("hero") };
}

export const featuredOnHome = ["provision-finance", "ok-pharmacy"] as const;

export const projects: Project[] = [
  {
    slug: "scrumtrulescent",
    title: "Scrumtrulescent",
    tagline: "Personal publication",
    description:
      "My personal publication and the private editorial desk behind it, designed and built on Payload CMS. In development.",
    href: "/work/scrumtrulescent",
    image: "/images/projects/scrumtrulescent/screen-home.webp",
    disciplines: ["Product design", "Design system", "Payload CMS engineering"],
    credit: "Own venture",
    capability: "cms",
    blocks: [
      {
        kind: "hero",
        cover: {
          src: "/images/projects/scrumtrulescent/screen-home.webp",
          width: 1600,
          height: 1000,
          alt: "The Scrumtrulescent home page in its light theme: the line A uniquirky perspective on code, music, sport, technology, books and movies beside the illustrated scrumtrulescent lockup, between heavy black rules.",
          tone: "bare",
        },
      },
      {
        kind: "note",
        body: "Own venture, in development. Scrumtrulescent is my personal publication: one person writing across code, tech, opinion, sport, television, film, books and music, with the continuity of a social feed and the care of a printed magazine. The public site is a sharp editorial broadsheet: black rules, condensed headlines, a serif for reading, and one electric pink used as a pointer and never as a mood. It has light and dark themes, topic pages, search, an email list, and a living design system page that documents its own rules. Behind it sits a private editorial desk built into Payload. One story record carries an idea through research, outlining, drafting, fact-checking, scheduling and publication without being copied between collections. The desk adds quick capture, a pipeline board, a calendar and a balance view across topics; the writing workspace adds an outline, version history, focus mode and panels for research, fact checks and spelling. One rule shapes all of it: I write every published word. AI can help with research and fact checks, and may not draft, rewrite or publish. The first articles are being written now, so what you see here is the real build with nothing published yet. Built with Next.js, Payload CMS, PostgreSQL and TypeScript.",
      },
      {
        kind: "logo-suite",
        lockups: [
          {
          src: "/images/projects/scrumtrulescent/logo-lockup.svg",
          width: 900,
          height: 600,
          alt: "The Scrumtrulescent lockup: an illustrated portrait of Abe adjusting his glasses above the scrumtrulescent wordmark, black on white.",
          tone: "light",
        },
          {
          src: "/images/projects/scrumtrulescent/logo-lockup-dark.svg",
          width: 900,
          height: 600,
          alt: "The dark-theme lockup: the same portrait and wordmark with white lettering and an illustrated border.",
          tone: "neutral",
        },
          {
          src: "/images/projects/scrumtrulescent/logo-mark.svg",
          width: 500,
          height: 500,
          alt: "The head mark alone, used as the site's home link.",
          tone: "light",
        },
        ],
      },
      {
        kind: "palette",
        swatches: [
          { hex: "#0a0a0a", name: "Ink" }, // 10-design-system.md neutral-950
          { hex: "#ffffff", name: "Paper" }, // neutral-0
          { hex: "#ff2d6f", name: "Signal pink" }, // pink-500
        ],
      },
      {
        kind: "board",
        label: "Design system",
        sheet: {
          src: "/images/projects/scrumtrulescent/board-design-system.webp",
          width: 1600,
          height: 1111,
          alt: "The magazine's design system page: the headline Hard rules. Human stories., a short statement of the system, section links, and the start of the typography section.",
          caption: "Design system: the rules, published as a page of the site.",
        },
      },
      {
        kind: "board",
        label: "Editorial patterns",
        sheet: {
          src: "/images/projects/scrumtrulescent/board-editorial.webp",
          width: 1600,
          height: 778,
          alt: "Editorial patterns from the design system: a lead story card with a portrait and an Essay label beside a list of three shorter story entries tagged Field note, Opinion and Review.",
          caption: "Editorial patterns: story cards and lists from the design system.",
        },
      },
      {
        kind: "screens",
        label: "Topic page",
        shot: {
          src: "/images/projects/scrumtrulescent/screen-topic.webp",
          width: 1600,
          height: 1000,
          alt: "The Tech topic page: the heading Tech with the line The Times They Are A-Changin, and a black collection card reading HOW THINGS WORK. beside Networking.",
          caption: "Topic page: Tech, with a collection of connected pieces.",
        },
      },
      {
        kind: "screens",
        label: "Dark theme",
        shot: {
          src: "/images/projects/scrumtrulescent/screen-home-dark.webp",
          width: 1600,
          height: 1000,
          alt: "The Scrumtrulescent home page in its dark theme: white type and rules on black, with the dark lockup.",
          caption: "Dark theme: the same home page after dark.",
        },
      },
      {
        kind: "devices",
        mocks: [
          {
          src: "/images/projects/scrumtrulescent/phone-home.webp",
          width: 780,
          height: 1688,
          alt: "The Scrumtrulescent home page at phone width: the head mark and a menu button above the introduction and the portrait.",
        },
        ],
      },
    ],
  },
  {
    slug: "sandala-dev",
    title: "sandala.dev",
    tagline: "This site",
    description:
      "This site: a design system, its motion and a working contact pipeline, designed and built by one person.",
    href: "/work/sandala-dev",
    image: "/images/projects/sandala-dev/screen-home.webp",
    disciplines: ["Interface design", "Design system", "Front-end engineering"],
    credit: "Own venture",
    // The plan named the "motion" technology area, but that is a tab, not a
    // service a link can land on; the design service is what this site evidences.
    capability: "design",
    blocks: [
      {
        kind: "hero",
        cover: {
          src: "/images/projects/sandala-dev/screen-home.webp",
          width: 1600,
          height: 1000,
          alt: "The sandala.dev home page: the headline I build the software your business actually needs, a circular portrait, a positioning paragraph and a Let's talk button on a warm dark gradient.",
          tone: "bare",
        },
      },
      {
        kind: "note",
        body: "Own venture: the site you are reading. It had two jobs. The first was to say plainly what I do and for whom, so every page starts from a problem a business would recognize before it names any technology. The second was to be evidence in its own right, so it is built the way I build for clients. A warm, dark design system with square corners and a small set of tokens keeps every page in one language, including these project pages, which fit their layout to each project's artwork but never borrow its colours. Motion appears where it explains something and switches off entirely for anyone whose device asks for reduced motion. The contact form checks for a human with Turnstile, validates on the server, delivers the inquiry by email through Resend and sends the sender an acknowledgement. Every page is generated ahead of time and served from Cloudflare's edge, with no database to maintain. Built with Next.js, TypeScript, Tailwind CSS, Framer Motion and GSAP, on Cloudflare Workers.",
      },
      {
        kind: "screens",
        label: "Capabilities",
        shot: {
          src: "/images/projects/sandala-dev/screen-capabilities.webp",
          width: 1600,
          height: 1000,
          alt: "The capabilities page hero: Custom software for businesses that have outgrown manual work, beside a diagram linking payments, automation and customers to a useful system.",
          caption: "Capabilities: services described by the problem they solve.",
        },
      },
      {
        kind: "screens",
        label: "About",
        shot: {
          src: "/images/projects/sandala-dev/screen-about.webp",
          width: 1600,
          height: 1000,
          alt: "The about page hero: Engineer. Designer. Builder. above a short biography.",
          caption: "About: the person, in the same voice as the work.",
        },
      },
      {
        kind: "devices",
        mocks: [
          {
            src: "/images/projects/sandala-dev/phone-home.webp",
            width: 780,
            height: 1688,
            alt: "The home page at phone width: the headline, portrait, paragraph and Let's talk button stacked in one column.",
          },
          {
            src: "/images/projects/sandala-dev/phone-contact.webp",
            width: 780,
            height: 1688,
            alt: "The contact page at phone width: the Let's talk heading above name, email, project type and message fields.",
          },
        ],
      },
      {
        kind: "screens",
        label: "Contact",
        shot: {
          src: "/images/projects/sandala-dev/screen-contact.webp",
          width: 1600,
          height: 1000,
          alt: "The contact page: an inquiry form with name, email, project type and message fields, beside direct channels and a note on what happens next.",
          caption: "Contact: Turnstile, server validation, email delivery and an auto-reply.",
        },
      },
    ],
  },
  {
    slug: "flavour-grills-cafe",
    title: "The Flavour Grills Cafe",
    tagline: "Restaurant & hospitality",
    description:
      "Identity and collateral for a Zambian restaurant, bar and events venue, built around a lidded cooking pot.",
    href: "/work/flavour-grills-cafe",
    image: "/images/projects/flavour-grills-cafe/flatlay.webp",
    disciplines: ["Brand identity", "Print & collateral"],
    credit: "Client",
    capability: "design",
    video: clips("flavour-grills-cafe"),
    blocks: [
      {
        kind: "hero",
        // Shares flatlay.webp — this identity ships no separate cover asset, and
        // cropping one would alter the artwork. The hero shows it contained; the
        // flatlay block below gives it full room. TASK-101/TASK-096 to confirm
        // the two presentations read as intentional rather than repeated.
        cover: {
          src: "/images/projects/flavour-grills-cafe/flatlay.webp",
          width: 633,
          height: 948,
          alt: "Overhead arrangement of Flavour Grills Cafe collateral on slate and wood: a navy menu folder, letterhead, business cards, labelled spice jars, a branded coffee pouch and leather tags.",
          // Dark slate photograph with its own environment.
          tone: "bare",
        },
      },
      {
        kind: "note",
        heading: "The brief",
        body: "The one commissioned project here. Flavour Grills is a restaurant, a bar and a special-events venue, so the identity has to work in three registers at once: something you read at the table, something you recognise from outside, and something that leaves with you. The mark is a lidded three-legged cooking pot, drawn plainly enough to hold at business-card scale and to reverse to a single colour where the printing calls for it, which is why it ships in coral-and-navy, all-navy and all-white. The collateral was designed as a set rather than a logo plus applications: menu folder, stationery, spice-jar labels, coffee packaging and leather tags.",
      },
      {
        kind: "logo-suite",
        // Three tones in one block — the finding that made per-lockup tones
        // necessary (TASK-093). Navy on the warm-dark base loses its tagline
        // line entirely; white on a light mat does the same.
        lockups: [
          {
            src: "/images/projects/flavour-grills-cafe/logo-primary.webp",
            width: 600,
            height: 450,
            alt: "Primary Flavour Grills Cafe lockup: the name in coral beside a navy lidded cooking pot, above the line Restaurant, Bar, Special Events.",
            tone: "light",
          },
          {
            src: "/images/projects/flavour-grills-cafe/logo-navy.webp",
            width: 600,
            height: 450,
            alt: "Single-colour navy version of the Flavour Grills Cafe lockup.",
            tone: "light",
          },
          {
            src: "/images/projects/flavour-grills-cafe/logo-white.webp",
            width: 600,
            height: 450,
            alt: "Reversed white version of the Flavour Grills Cafe lockup.",
            tone: "neutral",
          },
        ],
      },
      { kind: "palette", swatches: FLAVOUR_PALETTE },
      {
        kind: "flatlay",
        image: {
          src: "/images/projects/flavour-grills-cafe/flatlay.webp",
          width: 633,
          height: 948,
          alt: "Flavour Grills Cafe collateral photographed from above on slate and wood: navy menu folder, letterhead, business cards, three labelled spice jars, a branded coffee pouch with beans visible through the window, leather tags, cinnamon, cardamom and star anise.",
          caption:
            "Collateral: menu folder, stationery, spice labels, coffee packaging and leather tags.",
        },
      },
      {
        kind: "poster",
        posters: [
          {
            src: "/images/projects/flavour-grills-cafe/poster-pastry.webp",
            width: 634,
            height: 878,
            alt: "Poster showing a stack of sliced spiced pastries on a plate with coffee, cinnamon and cardamom and the logo at the top.",
          },
          {
            // 408x612 native — cannot be shown as large as the other poster.
            src: "/images/projects/flavour-grills-cafe/poster-duotone.webp",
            width: 408,
            height: 612,
            alt: "Poster with a coral duotone food photograph and the Flavour Grills Cafe logo reversed in white over it.",
          },
        ],
      },
    ],
  },
  {
    slug: "provision-finance",
    title: "Provision Finance",
    tagline: "Financial services",
    description:
      "A retail finance identity taken from a constructed mark through to two complete page designs.",
    href: "/work/provision-finance",
    image: "/images/projects/provision-finance/cover.webp",
    disciplines: ["Brand identity", "Web design"],
    credit: "Self-commissioned",
    capability: "design",
    video: clips("provision-finance"),
    blocks: [
      {
        kind: "hero",
        cover: {
          src: "/images/projects/provision-finance/cover.webp",
          width: 898,
          height: 898,
          alt: "Brushed-steel Provision Finance lettering mounted on a dark glass shopfront, warm interior light below.",
          // A photograph carrying its own environment; a mat would fight it.
          tone: "bare",
        },
      },
      {
        kind: "note",
        heading: "The idea",
        body: "Self-commissioned. I gave a retail finance brand a mark with an argument behind it, then pushed far enough to see whether the mark could carry an interface as well as a shopfront. Four attributes (professional, visionary, precise, proficient) resolved into a three-bar device drawn on golden-ratio construction, then reversed for navy and for white. The site design puts borrowing, transacting and saving on the landing page as three equal actions, and keeps a live exchange-rate strip above the fold where a customer checking rates will see it first. Provision Finance is not a real institution, and the copy inside these mockups is placeholder.",
      },
      {
        // Placed early on purpose: this board is the clearest evidence of design
        // reasoning anywhere in the work section.
        kind: "board",
        label: "Rationale",
        sheet: {
          src: "/images/projects/provision-finance/concept-board.webp",
          width: 2000,
          height: 2000,
          alt: "Logo rationale board: a brass telescope beside the words Professional, Visionary, Precise, Proficient, with the three-bar mark constructed on golden-ratio geometry.",
          caption:
            "Rationale board: the mark derived from the attributes, on golden-ratio construction.",
        },
      },
      {
        kind: "logo-suite",
        lockups: [
          {
            src: "/images/projects/provision-finance/logo.svg",
            width: 1440,
            height: 1440,
            alt: "Provision Finance wordmark in navy beneath a red three-bar mark, on a pale topographic contour ground.",
            // Carries its own pale ground, so a mat would frame a frame.
            tone: "bare",
          },
        ],
      },
      { kind: "palette", swatches: PROVISION_PALETTE },
      {
        kind: "board",
        label: "Brand board",
        sheet: {
          src: "/images/projects/provision-finance/brand-board.webp",
          width: 2000,
          height: 2000,
          alt: "Four-part brand board: the shopfront photograph, the logo reversed white on navy and navy on white, and the two brand patterns.",
          caption: "Brand board: reversals and the two pattern treatments.",
        },
      },
      {
        kind: "screens",
        label: "Homepage",
        shot: {
          src: "/images/projects/provision-finance/screen-homepage.webp",
          width: 1920,
          height: 1620,
          alt: "Provision Finance homepage design: red login bar, navy navigation, a sunflower-field hero reading Hello. How can we help?, three circular Borrow, Transact and Save actions, a seven-currency exchange rate strip, and a customer stories row.",
          caption: "Homepage: three equal front doors, with live exchange rates.",
        },
      },
      {
        kind: "screens",
        label: "Products page",
        shot: {
          src: "/images/projects/provision-finance/screen-products.webp",
          width: 1729,
          height: 2000,
          alt: "Provision Finance products page design covering loans and accounts, with comparison cards and a red Visa card render.",
          caption: "Products: loans and accounts, laid out for comparison.",
        },
      },
      {
        kind: "devices",
        mocks: [
          {
            src: "/images/projects/provision-finance/device-laptop.webp",
            width: 849,
            height: 849,
            alt: "Open laptop and a floating phone, both showing the Provision Finance homepage.",
          },
          {
            // 274x573 native. Must never be upscaled (MANIFEST.md).
            src: "/images/projects/provision-finance/device-phone.webp",
            width: 274,
            height: 573,
            alt: "Phone showing the Provision Finance homepage at mobile width.",
          },
          {
            src: "/images/projects/provision-finance/device-desktop.webp",
            width: 1026,
            height: 768,
            alt: "Desktop monitor and phone on a white surface showing the Provision Finance site.",
          },
        ],
      },
      {
        kind: "in-situ",
        scenes: [
          {
            src: "/images/projects/provision-finance/card.webp",
            width: 1500,
            height: 1200,
            alt: "Two red Provision Finance Visa debit cards, dramatically lit against navy.",
          },
        ],
      },
      // provision-finance/pattern.webp is deliberately NOT composed as its own
      // board: both patterns already appear inside brand-board above, so a
      // separate block would show the same artwork twice in one scroll. It is
      // committed as the source for the `texture` SvgTreatment (TASK-095).
    ],
  },
  {
    slug: "ok-pharmacy",
    title: "OK Pharmacy",
    tagline: "Pharmacy & retail",
    description: "A 24-hour pharmacy identity built on a monogram that doubles as a hand gesture.",
    href: "/work/ok-pharmacy",
    image: "/images/projects/ok-pharmacy/cover.webp",
    disciplines: ["Brand identity", "Signage & packaging", "Web design"],
    credit: "Self-commissioned",
    capability: "design",
    video: clips("ok-pharmacy"),
    blocks: [
      {
        kind: "hero",
        cover: {
          src: "/images/projects/ok-pharmacy/cover.webp",
          width: 830,
          height: 830,
          alt: "A woman holding a small child close, both smiling, with the OK monogram overlaid in translucent teal.",
          // Photograph on a white ground: needs a mat to stop it bleeding out.
          tone: "neutral",
        },
      },
      {
        kind: "note",
        heading: "The idea",
        body: "Self-commissioned. The idea is one shape doing two jobs: the O of the wordmark is a hand making an OK sign, so the letter and the reassurance arrive together. A pharmacy mark has to be read from across a mall on lit signage and at avatar size on a social profile, so the monogram was drawn to stand alone, without wordmark or tagline, and the fuller lockups build outward from it. From there it went onto 24-hour signage, retail packaging, print, social and a storefront design with a branch locator.",
      },
      {
        kind: "logo-suite",
        lockups: [
          {
            src: "/images/projects/ok-pharmacy/logo-full.svg",
            width: 665,
            height: 667,
            alt: "Primary OK Pharmacy lockup: the hand-gesture monogram above Pharmacy in green, with the line For Your Wellness.",
            tone: "neutral",
          },
          {
            src: "/images/projects/ok-pharmacy/logo-symbol.svg",
            width: 533,
            height: 320,
            alt: "The OK monogram alone, a hand making an OK gesture forming the letter O beside a K.",
            tone: "sunken",
          },
          {
            src: "/images/projects/ok-pharmacy/logo-wordmark.svg",
            width: 827,
            height: 453,
            alt: "OK Pharmacy lockup without the tagline: monogram above the word Pharmacy.",
            tone: "sunken",
          },
          {
            src: "/images/projects/ok-pharmacy/logo-square.webp",
            width: 1200,
            height: 1077,
            alt: "The full OK Pharmacy lockup on a white square, tagline set lowercase.",
            // Already a white field edge to edge.
            tone: "bare",
          },
        ],
      },
      { kind: "palette", swatches: OK_PALETTE },
      {
        kind: "in-situ",
        scenes: [
          {
            src: "/images/projects/ok-pharmacy/signage.webp",
            width: 1500,
            height: 1000,
            alt: "Illuminated double-sided sign hung from a mall ceiling, showing the OK Pharmacy logo above the words OPEN 24 HOURS.",
            caption: "Suspended signage: the 24-hour promise carried at distance.",
          },
          {
            src: "/images/projects/ok-pharmacy/bag.webp",
            width: 1600,
            height: 1113,
            alt: "White paper retail bag with rope handles carrying the OK Pharmacy logo, on a teal ground.",
          },
        ],
      },
      {
        kind: "poster",
        posters: [
          {
            src: "/images/projects/ok-pharmacy/poster.webp",
            width: 1439,
            height: 830,
            alt: "OK Pharmacy poster: the logo beside a photograph of a woman holding a small child, on white.",
          },
        ],
      },
      {
        kind: "social",
        items: [
          {
            src: "/images/projects/ok-pharmacy/social-facebook.webp",
            width: 1600,
            height: 965,
            alt: "Facebook page mockup with an OK Pharmacy branded cover image and a special offer post.",
          },
          {
            src: "/images/projects/ok-pharmacy/social-linkedin.webp",
            width: 816,
            height: 1200,
            alt: "LinkedIn company page mockup for OK Pharmacy.",
          },
          {
            src: "/images/projects/ok-pharmacy/social-banner.webp",
            width: 1100,
            height: 417,
            alt: "Wide teal social banner with the OK monogram over photographs of smiling people.",
          },
        ],
      },
      {
        kind: "screens",
        label: "Storefront",
        shot: {
          src: "/images/projects/ok-pharmacy/screen-storefront.webp",
          width: 2000,
          height: 1913,
          alt: "OK Pharmacy online storefront design: a New Arrivals hero, a row of stocked brands, a branch locator map, and a pharmacist portrait over teal sections.",
          caption: "Storefront: retail catalogue, stocked brands and branch locator.",
        },
      },
      // The AI-generated dispensary scene is not used: it misdraws the mark and
      // garbles text. The owner is regenerating a clean scene (EPIC-029 TASK-132).
    ],
  },
  {
    slug: "gardenfare-foods",
    title: "Gardenfare Foods",
    tagline: "Food & packaging",
    description:
      "A food brand whose stamp mark had to hold up across four very different pack formats.",
    href: "/work/gardenfare-foods",
    image: "/images/projects/gardenfare-foods/cover.webp",
    disciplines: ["Brand identity", "Packaging design"],
    credit: "Self-commissioned",
    capability: "design",
    video: clips("gardenfare-foods"),
    blocks: [
      {
        kind: "hero",
        cover: {
          src: "/images/projects/gardenfare-foods/cover.webp",
          width: 1280,
          height: 800,
          alt: "The four Gardenfare products lined up on a pale green field: a juice can, an oats pouch, a soy milk bottle and a peanut butter jar, with the stamp mark ghosted behind them.",
          // Pale green field: needs containing on the warm-dark page.
          tone: "neutral",
        },
      },
      {
        kind: "note",
        heading: "The idea",
        body: "Self-commissioned, and the constraint I set myself was format. A can, a gusseted pouch, a bottle and a jar give four different curves, four label shapes and four printing methods, so the mark had to be indifferent to all of them. A circular stamp, a tree and wheat ears inside a scalloped ring, holds its shape on every one and still reads at the size a jar lid allows. Four colourways carry it across the range, so each product reads as its own thing without leaving the family.",
      },
      {
        kind: "logo-suite",
        lockups: [
          {
            src: "/images/projects/gardenfare-foods/logo.svg",
            width: 533,
            height: 533,
            alt: "The Gardenfare Foods mark: a green scalloped ring lettered Gardenfare Foods around a yellow tree flanked by wheat ears.",
            tone: "neutral",
          },
        ],
      },
      {
        kind: "board",
        label: "Colourways",
        sheet: {
          src: "/images/projects/gardenfare-foods/colourways.webp",
          width: 1200,
          height: 1200,
          alt: "Colourway board showing the Gardenfare mark in four versions: deep russet, orange, black outline on white, and yellow.",
          caption: "Colourways: one mark, four grounds to print on.",
        },
      },
      { kind: "palette", swatches: GARDENFARE_PALETTE },
      {
        kind: "packaging",
        items: [
          {
            src: "/images/projects/gardenfare-foods/pack-fruit.webp",
            width: 694,
            height: 694,
            alt: "GardenFruit mixed fruit juice can, beaded with condensation, on a lime gradient.",
            caption: "GardenFruit: mixed fruit juice",
          },
          {
            src: "/images/projects/gardenfare-foods/pack-oats.webp",
            width: 793,
            height: 793,
            alt: "GardenOats gusseted pouch, lightly sweetened with maple sugar, on an orange gradient.",
            caption: "GardenOats: lightly sweetened",
          },
          {
            src: "/images/projects/gardenfare-foods/pack-soy.webp",
            width: 750,
            height: 750,
            alt: "GardenSoy organic soy milk bottle with a yellow cap, on a mint gradient.",
            caption: "GardenSoy: organic soy milk",
          },
          {
            src: "/images/projects/gardenfare-foods/pack-spread.webp",
            width: 600,
            height: 600,
            alt: "GardenSpread creamy peanut butter jar with a brown lid, on a peach gradient.",
            caption: "GardenSpread: creamy peanut butter",
          },
        ],
      },
      {
        kind: "board",
        label: "Applications",
        sheet: {
          src: "/images/projects/gardenfare-foods/logo-applications.webp",
          width: 1225,
          height: 1216,
          alt: "Applications sheet: the green Gardenfare mark on white above three alternate colourways laid over a produce photograph.",
          caption: "Applications: the mark against real product photography.",
        },
      },
    ],
  },
];
