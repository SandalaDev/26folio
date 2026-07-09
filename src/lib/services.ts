/**
 * Services — single source of truth (EPIC-010 TASK-042). Consumed by BOTH the
 * home page's CapabilityRail and the capabilities page's ServiceTabs, which
 * previously carried duplicated arrays that could drift.
 *
 * The first three entries are ported verbatim from the previous components
 * (11-content-strategy.md §4). `mobile-payments` and `e-commerce` are promoted
 * from custom-software's item list to standalone services (owner brief,
 * 2026-07-02); their descriptions/items are DRAFTS for owner review — neutral,
 * no invented claims. `icon` is a key the rail maps to a Phosphor component
 * (icons render client-side only; this module stays pure data).
 */
export type ServiceIcon = "globe" | "wrench" | "robot" | "device" | "storefront";

export interface Service {
  id: string;
  title: string;
  /** One-line card copy (home rail). */
  description: string;
  /** Optional strapline (capabilities tabs). */
  subtitle: string;
  /** Offer bullets (capabilities tabs). */
  items: string[];
  icon: ServiceIcon;
}

export const services: Service[] = [
  {
    id: "web-development",
    title: "Web development",
    description: "A site that loads fast, reads clearly, and actually converts.",
    subtitle: "Beyond a website",
    items: [
      'Payload CMS builds ("I build it, you control it")',
      "Landing pages",
      "Dashboards",
      "Internal tools",
    ],
    icon: "globe",
  },
  {
    id: "custom-software",
    title: "Custom software",
    description: "Internal tools built around how your team already works.",
    subtitle: "",
    items: ["Booking systems / CRMs", "Workflow automation"],
    icon: "wrench",
  },
  {
    id: "ai-integration",
    title: "AI integration",
    description: "Automation that earns its place, not a chatbot bolted on.",
    subtitle: "",
    items: [
      "Customer-care voice & chatbots",
      "Receptionist bot",
      "Custom integrations",
      "Local/on-prem AI",
    ],
    icon: "robot",
  },
  {
    id: "mobile-payments",
    title: "Mobile money & online payments",
    description:
      "Mobile money and card payments wired into your product, so getting paid is the easy part.",
    subtitle: "",
    items: [
      "Mobile money integration",
      "Card & payment-gateway setup",
      "Checkout & billing flows",
    ],
    icon: "device",
  },
  {
    id: "e-commerce",
    title: "E-commerce",
    description:
      "A store you control end to end: catalog, checkout, orders, delivery.",
    subtitle: "",
    items: [
      "Online storefronts",
      "Catalog & inventory",
      "Checkout & order management",
    ],
    icon: "storefront",
  },
];

export const serviceIds = services.map((service) => service.id);
