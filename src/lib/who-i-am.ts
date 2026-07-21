/**
 * "Who I am" biography content (EPIC-017). The copy is the owner's canonical
 * bio from planning/content/page-copy/About.md, carried over verbatim from the
 * EPIC-014/015 BioModal. This module only adds reading structure: chapters,
 * lede/pull-quote annotations, and the epoch accent mapping. Accents follow
 * the timeline's EPIC-015 mapping (Foundation = amber, Convergence = peach,
 * Awakening = rose) so the modal speaks the about page's epoch language.
 *
 * Editing rule: the paragraph strings are owner-approved text. Structure may
 * change; the words may not.
 */

interface BioParagraph {
  text: string;
  /** Render as a display interlude (chapter accent, display type) instead of body copy. */
  emphasis?: boolean;
}

interface BioChapter {
  /** Anchor id used by the chapter rail and section targets. */
  id: string;
  /** Quiet label above the title, e.g. "Epoch I" (normal case, no caps). */
  label: string;
  /** Roman numeral for the rail marker and the oversized backdrop. */
  numeral: string;
  title: string;
  /** Accent utility classes; stored literally so Tailwind can see them. */
  accentText: string;
  accentBox: string;
  accentBar: string;
  /** Chapter body. The first paragraph renders as the lede. */
  paragraphs: BioParagraph[];
  /** Magazine pull quote: a line quoted from this chapter, shown after `after` (paragraph index). */
  pullQuote?: { text: string; after: number };
}

/** Masthead copy (mirrors the about card and the old modal header). */
const BIO_TITLE = "Who I am";
const BIO_TAGLINE = "“There's no knowledge that is not power.” ~ Ultimate Mortal Kombat 3";

/** Opening section, before the epochs. */
const BIO_INTRO: string[] = [
  "I'm Abraham Sandala, a self-taught software engineer and designer based in Lusaka, Zambia. I build custom software for businesses that want the flexibility of bespoke applications without giving up the ability to own and manage them themselves.",
  "I'm interested in how software is changing in the age of AI, why ownership matters more than ever, and how to build systems that empower people instead of locking them into platforms.",
  "My path here runs through three defining epochs.",
];

const BIO_CHAPTERS: BioChapter[] = [
  {
    id: "foundation",
    label: "Epoch I",
    numeral: "I",
    title: "Foundation",
    accentText: "text-amber",
    accentBox: "border-amber bg-amber text-background",
    accentBar: "bg-amber",
    paragraphs: [
      {
        text: "My fascination with technology goes back to 2002, when I first had access to a computer. It opened up a whole new world I couldn't stop exploring.",
      },
      {
        text: "After studying electrical and electronics engineering, I joined Celtel in 2007 as an assistant technician. Celtel (Airtel today) was the largest mobile network operator in Zambia. I assisted the engineers, did tower rigging work, and planned and supervised the maintenance of diesel gensets carried out by contractors across Southern Province and parts of Western Province.",
      },
      {
        text: "What made Celtel formative wasn't the job description. It was the engineers around me. They were generous with their knowledge and eager to teach, and the relationships I built with them exposed me to technologies far beyond my official responsibilities. That learning earned me a promotion to technician and a place on the roster of people who responded to faults and outages around the clock, on top of everything else I was doing.",
      },
      {
        text: "It was also where I began noticing common threads running through seemingly unrelated technologies. I worked on remote controlled genset AMF panels, 48V DC rectifiers and battery banks, BSS hardware, microwave transmission, and the software needed to interact with all of it. To most people these are separate disciplines. The deeper I went, the more they revealed the same underlying principles. I didn't have a name for it then, but I was learning to think in systems.",
      },
      {
        text: "Still, as much as I was growing, telecom was never enough. I was searching for work that could tap into everything I had in me. That search led me to build a music and video production studio. Work pressures meant I never recorded anything in it, but the studio was never really about music. It was another attempt to find work that tapped into more of my natural talents, like my creativity, and that restlessness never went away.",
      },
    ],
    pullQuote: {
      text: "I didn't have a name for it then, but I was learning to think in systems.",
      after: 2,
    },
  },
  {
    id: "convergence",
    label: "Epoch II",
    numeral: "II",
    title: "Convergence",
    accentText: "text-peach",
    accentBox: "border-peach bg-peach text-background",
    accentBar: "bg-peach",
    paragraphs: [
      {
        text: "In 2013, I joined IHS Towers as one of its first quality assurance engineers. On the operator side, solar had been rolled out around us without any training or involvement for those of us in the field. IHS was different. The company invested heavily in solar training, and since the deployment teams reported to me as regional QA, I could join installations and learn directly from the contractors doing the work. That's where my interest in solar was born, and it eventually led me to start Dauntless Energy, exploring ways to make solar affordable and accessible to more people.",
      },
      {
        text: "Ironically, the biggest lesson from that venture had nothing to do with solar. Trying to build the company showed me how hard it was to find quality branding, design and web development services, hard enough that I ended up doing the work myself. So I went deep into the craft: typography, layout, grids, visual hierarchy, color theory, identity systems. The work I produced for Dauntless started attracting requests from friends and acquaintances, and before long I was designing brands, company profiles and websites for people from all over the country.",
      },
      {
        text: "The tools I used tell their own story. I started with Adobe Muse shortly after leaving IHS, hoping the familiar Adobe interface would ease me in, but its limitations pushed me to WordPress. I tried to build my portfolio and a family member's business website with it and found it clunky beyond tolerance. The final insult came from a backup plugin that advertised itself as free, then held both projects hostage behind a paywall the moment I tried to move them. I ripped both projects up and rebuilt them in Webflow.",
      },
      {
        text: "Webflow changed the direction of my life more than any tool before it. Seeing the HTML and CSS behind everything I built shattered a belief I had carried for years, that programming was inaccessible without a computer science degree from a top US or European university. The developers publishing videos to test Webflow's claims deepened that shift, introducing me to coding bootcamps and full-stack courses. But Webflow had problems of its own. Clients pushed back hard on hosting costs, and there was no way to host the sites elsewhere. So I moved again, this time to WordPress with Elementor, which had just been released. It offered far more flexibility than traditional WordPress themes, but advanced functionality still meant wrestling with the same clunky plugin ecosystem.",
      },
      {
        text: "Then telecom pulled me back. In 2017, I joined Huawei as a QA engineer on one of Zambia's largest rural connectivity projects, installing solar power systems on more than 1,500 Zamtel towers. The work took me across the country, routinely driving thousands of KMs, and freelancing went on hiatus. When I later returned to mobile network maintenance, a more conventional job, I took on a new client and reached for Elementor again. The same WordPress problems were waiting for me. But by then I had seen how accessible code really was. I paused freelancing entirely and, in 2021, enrolled in a full stack JavaScript developer course.",
      },
    ],
    pullQuote: {
      text: "Webflow changed the direction of my life more than any tool before it.",
      after: 2,
    },
  },
  {
    id: "awakening",
    label: "Epoch III",
    numeral: "III",
    title: "Awakening",
    accentText: "text-rose",
    accentBox: "border-rose bg-rose text-background",
    accentBar: "bg-rose",
    paragraphs: [
      {
        text: "Learning software engineering while working a telecom job that kept me on call around the clock was one of the hardest things I've ever done. The hardest part wasn't JavaScript or React. It was believing that all the tutorials and practice projects would eventually translate into the work I actually wanted to do, and having no idea how many years it would take to get there. I burned out. I got disillusioned.",
      },
      {
        text: "That changed the day I discovered Payload CMS.",
        emphasis: true,
      },
      {
        text: "Payload solved a problem I'd been running into for years. It finally gave me a way to build software as complex as the project demanded without taking ownership away from the client. Every ceiling I had hit as a designer, every compromise between flexibility and ownership, suddenly had an answer. It reinvigorated me. I filled the remaining gaps in my knowledge: database design, Next.js, deployment strategies, software architecture. Then I got to work.",
      },
      {
        text: "Today my client work covers the full range: websites for businesses that need a clean presence online, Payload builds for content heavy projects, AI integrations and ecommerce. But the work I'm most excited about is Cassandra OS. It's the first project where I'm putting my own opinions about where the industry should go into something real.",
      },
      {
        text: "I'm convinced the SaaS model is incompatible with the agentic age of software. As AI drives down the cost of building and maintaining custom software, the economics that made SaaS inevitable are coming apart. Cassandra OS is my answer to a future where AI makes custom software dramatically cheaper to build and maintain. It aims to combine the accessibility of SaaS with the ownership, flexibility and longevity of bespoke software.",
      },
      {
        text: "When I want to think out loud, I write at Scrumtrulescent, my playground for sharing ideas with people who are curious about the same things I am.",
      },
      {
        text: "Everything before this was the training. The next epoch is...",
        emphasis: true,
      },
    ],
  },
];

export { BIO_TITLE, BIO_TAGLINE, BIO_INTRO, BIO_CHAPTERS };
export type { BioChapter, BioParagraph };
