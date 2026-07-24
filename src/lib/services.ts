/**
 * Services - single source of truth. Consumed by the home CapabilityRail and
 * the capabilities page (EPIC-021: capability explorer), which must never
 * carry duplicated arrays that drift.
 *
 * EPIC-021 TASK-079: the five-service list (web dev / custom software / AI /
 * payments / e-commerce) collapsed into four researched pillars. Strategy and
 * copy source: planning/content/page-copy/Capabilities.md. Payments and
 * commerce fold into `platforms`; the old anchors retired with the ids.
 * `icon` is a key the rail maps to a Phosphor component (icons render
 * client-side only; this module stays pure data).
 */
export type ServiceIcon = "storefront" | "gear" | "robot" | "database";

export interface Service {
  id: string;
  title: string;
  /** One-line card copy (home rail + explorer row). */
  description: string;
  /** Who this pillar serves (explorer panel). */
  audience: string;
  /** The problem, in the buyer's words (explorer panel). */
  problem: string;
  /** Concrete systems this pillar ships (explorer panel). */
  builds: string[];
  /** The tool-sprawl it retires (explorer panel). */
  replaces: string[];
  /** Closing line for the panel. */
  anchor: string;
  icon: ServiceIcon;
}

export const services: Service[] = [
  {
    id: "platforms",
    title: "Platforms you own",
    description:
      "Memberships, courses, and commerce on your own domain, with no platform taking a cut.",
    audience:
      "Creators, coaches, and independent brands who have outgrown Skool, Kajabi, or Substack.",
    problem:
      "The platform charges up to 10% of your revenue, holds your audience data, and can switch you off overnight. You built the audience. Your landlord owns the relationship.",
    builds: [
      "Membership sites with courses, gated content, and community",
      "Newsletters and email lists you control outright",
      "Checkout and subscriptions through your own Stripe account",
      "Commerce stacks with a fallback payment path",
      "Done-for-you migration off the platform you are leaving",
    ],
    replaces: ["Kajabi", "Skool", "Teachable", "Substack", "Patreon"],
    anchor: "You keep the margin, the audience, and the keys.",
    icon: "storefront",
  },
  {
    id: "operations",
    title: "Operations systems",
    description:
      "One system that runs client work: onboarding, delivery, billing, reporting.",
    audience: "Agencies, studios, and service firms between three and fifty people.",
    problem:
      "The business runs across a project tool, spreadsheets, an inbox, and someone's memory. Every handoff between them leaks hours nobody can bill.",
    builds: [
      "Client portals your customers log into on their own",
      "Delivery pipelines from signed proposal to shipped work",
      "Time tracking, billing, and invoicing wired together",
      "Dashboards that show margin per client, not just activity",
      "Automated status reporting, so clients stop asking",
    ],
    replaces: [
      "ClickUp plus spreadsheet glue",
      "Zapier chains nobody maintains",
      "the weekly status-update meeting",
    ],
    anchor: "Admin hours go back to being billable hours.",
    icon: "gear",
  },
  {
    id: "automation",
    title: "Automation & applied AI",
    description:
      "Busywork that completes itself: intake, drafting, qualification, reporting.",
    audience:
      "Teams that re-type the same information into three systems, and operators tired of chatbot demos.",
    problem:
      "Most AI projects die as demos because nobody wired them into real work. The model is the easy part. The integration is the job.",
    builds: [
      "Workflow automation across the tools you already use",
      "AI agents that finish one job start to end, with human handoff where judgment starts",
      "Document drafting, lead qualification, and inbox triage",
      "Middleware connecting your portal to models, CRMs, and databases",
    ],
    replaces: [
      "copy-paste between tabs",
      "a generic chatbot widget",
      "the intern-shaped hole in your process",
    ],
    anchor: "People do the judgment. The system does the rest.",
    icon: "robot",
  },
  {
    id: "data",
    title: "Data & integrations",
    description: "Every system you run, feeding one screen you trust.",
    audience:
      "Businesses with numbers spread across five or ten systems and no single view of what they mean.",
    problem:
      "Decisions get made on exports, gut feel, and a spreadsheet somebody updated last quarter. The data exists. Nobody can see it in one place.",
    builds: [
      "Pipelines that pull every source into one warehouse",
      "A Monday-morning report generated without anyone touching it",
      "API wrappers around awkward third-party systems",
      "Alerts that flag a moving number before it becomes a problem",
    ],
    replaces: [
      "CSV exports",
      "copy-paste reporting",
      "the spreadsheet only one person understands",
    ],
    anchor: "One screen you trust instead of ten you don't.",
    icon: "database",
  },
];

export const serviceIds = services.map((service) => service.id);
