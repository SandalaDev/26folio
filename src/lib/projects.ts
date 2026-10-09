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
            "Collateral — menu folder, stationery, spice labels, coffee packaging and leather tags.",
        },
      },
      {
        kind: "poster",
        posters: [
          {
            src: "/images/projects/flavour-grills-cafe/poster-pastry.webp",
            width: 634,
            height: 950,
            alt: "Poster showing a stack of sliced spiced pastries on a plate with coffee, cinnamon and cardamom, the logo at the top and contact details in a coral band at the foot.",
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
        body: "A self-initiated exercise: give a retail finance brand a mark with an argument behind it, then push far enough to see whether the mark can carry an interface and not just a shopfront. Four attributes — professional, visionary, precise, proficient — resolved into a three-bar device drawn on golden-ratio construction, then reversed for navy and for white. The site design puts borrowing, transacting and saving on the landing page as three equal actions rather than burying them in a product menu, and keeps a live exchange-rate strip above the fold instead of on a page of its own. Provision Finance is not a real institution and the copy inside these mockups is placeholder.",
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
            "Rationale board — the mark derived from the attributes, on golden-ratio construction.",
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
          caption: "Brand board — reversals and the two pattern treatments.",
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
          caption: "Homepage — three equal front doors, with live exchange rates.",
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
          caption: "Products — loans and accounts, laid out for comparison.",
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
        body: "Self-initiated. The whole idea is one shape doing two jobs: the O of the wordmark is a hand making an OK sign, so the letter and the reassurance arrive together. A pharmacy mark has to survive being read from across a mall on lit signage and at avatar size on a social profile, so the monogram was drawn to stand alone — no wordmark, no tagline — and the fuller lockups build outward from it. From there it went onto 24-hour signage, retail packaging, print, social and a storefront design with a branch locator.",
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
            caption: "Suspended signage — the 24-hour promise carried at distance.",
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
          caption: "Storefront — retail catalogue, stocked brands and branch locator.",
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
        body: "Self-initiated, and the constraint I set myself was format. A can, a gusseted pouch, a bottle and a jar give you four different curves, four label shapes and four printing methods, so the mark had to be indifferent to all of them. A circular stamp — tree and wheat ears inside a scalloped ring — holds its shape on every one and still reads at the size a jar lid allows. Four colourways carry it across the range so each product reads as its own thing without leaving the family.",
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
          caption: "Colourways — one mark, four grounds to print on.",
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
            caption: "GardenFruit — mixed fruit juice",
          },
          {
            src: "/images/projects/gardenfare-foods/pack-oats.webp",
            width: 793,
            height: 793,
            alt: "GardenOats gusseted pouch, lightly sweetened with maple sugar, on an orange gradient.",
            caption: "GardenOats — lightly sweetened",
          },
          {
            src: "/images/projects/gardenfare-foods/pack-soy.webp",
            width: 750,
            height: 750,
            alt: "GardenSoy organic soy milk bottle with a yellow cap, on a mint gradient.",
            caption: "GardenSoy — organic soy milk",
          },
          {
            src: "/images/projects/gardenfare-foods/pack-spread.webp",
            width: 600,
            height: 600,
            alt: "GardenSpread creamy peanut butter jar with a brown lid, on a peach gradient.",
            caption: "GardenSpread — creamy peanut butter",
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
          caption: "Applications — the mark against real product photography.",
        },
      },
    ],
  },
  /* Placeholders from EPIC-005, retired by TASK-102 once the grid and routes are
     rebuilt. Kept until then so nothing breaks mid-epic; they carry empty
     compositions rather than fabricated ones. */
  {
    slug: "placeholder-three",
    title: "Project three",
    description: "Placeholder, retired by TASK-102.",
    href: "/work/placeholder-three",
    disciplines: [],
    credit: "Self-commissioned",
    blocks: [],
  },
  {
    slug: "placeholder-four",
    title: "Project four",
    description: "Placeholder, retired by TASK-102.",
    href: "/work/placeholder-four",
    disciplines: [],
    credit: "Self-commissioned",
    blocks: [],
  },
];
