export interface CapabilityService {
  id: string;
  index: string;
  title: string;
  summary: string;
  examples: string[];
  startingPoint: string;
  note?: string;
}

export const problemSignals = [
  "Payment screenshots still need matching",
  "The same data is entered in three places",
  "Appointments live across messages and calendars",
  "Nobody trusts the monthly report",
  "Every content update needs a developer",
] as const;

export const capabilityServices: CapabilityService[] = [
  {
    id: "payments",
    index: "01",
    title: "Mobile Money & Online Payment Integration",
    summary:
      "Let customers pay from the website or business system using mobile money, bank cards, payment links, or other supported methods—and let the successful payment move the work forward.",
    examples: [
      "A customer books an appointment, pays the deposit, and receives confirmation without sending a screenshot.",
      "A wholesaler places an order online and the payment is recorded against the correct invoice.",
      "A tenant receives a rent reminder, pays using mobile money, and receives a receipt automatically.",
      "A customer pays in instalments while the system tracks the remaining balance.",
      "A successful payment activates a membership, confirms an order, reserves a booking, or releases a service.",
      "Finance staff can see which payments cleared, failed, or still need to be matched.",
    ],
    note:
      "Receipts, staff notifications, customer-account updates, and the next operational step can all follow automatically.",
    startingPoint:
      "Tell me how customers currently pay you and what your team has to do after the money arrives.",
  },
  {
    id: "memberships",
    index: "02",
    title: "Membership & Subscription Platforms",
    summary:
      "Build a Patreon-style or members-only platform around your own organization, customers, and payment process.",
    examples: [
      "A professional association collects annual fees and tracks active, overdue, and renewal-due members.",
      "A gym lets members join, pay, renew, and check their status online.",
      "A private club gives different membership levels access to different benefits, events, or resources.",
      "A publisher makes premium articles, reports, or downloads available to paying subscribers.",
      "An organization manages applications, approvals, member records, payments, and communication in one place.",
    ],
    note:
      "Members manage their account and access; staff see the complete membership picture without reconciling several spreadsheets.",
    startingPoint:
      "Describe who your members are, what they pay for, and what they should receive after joining.",
  },
  {
    id: "booking",
    index: "03",
    title: "Online Booking & Scheduling Systems",
    summary:
      "Let customers book services, appointments, rooms, vehicles, equipment, or staff online without turning every date into a message thread.",
    examples: [
      "A clinic lets patients choose a service and available time, then sends an automatic reminder.",
      "A consultant collects a deposit before confirming a meeting.",
      "A lodge displays room availability and prevents double-booking.",
      "An equipment-hire company tracks what is available, reserved, collected, or overdue.",
      "A service company assigns bookings by location or availability.",
      "A business accepts recurring appointments without coordinating every date manually.",
    ],
    note:
      "Availability, deposits, confirmations, reminders, cancellations, rescheduling, calendar updates, and internal notifications stay connected.",
    startingPoint:
      "Show me how a booking moves from the first enquiry to the completed service.",
  },
  {
    id: "cms",
    index: "04",
    title: "Bespoke CMS Development with Payload",
    summary:
      "Give your team control over website content without giving them the ability to damage its design, structure, or functionality.",
    examples: [
      "A marketing employee publishes an article without calling a developer.",
      "A hotel updates rooms, rates, amenities, and special offers.",
      "A property company adds listings through consistent fields for price, location, photography, and availability.",
      "A restaurant updates its menu without redesigning the page.",
      "A company manages services, profiles, branches, vacancies, reports, and downloads.",
      "Different employees manage only the content for which they are responsible.",
    ],
    note:
      "Editors change words, images, products, listings, and records while the system preserves typography, spacing, responsiveness, accessibility, and hierarchy. Drafts, previews, approvals, scheduling, version history, reusable sections, media, permissions, languages, SEO, and integrations can be shaped around the organization.",
    startingPoint:
      "Show me what your team needs to update and what you never want them to accidentally break.",
  },
  {
    id: "smart-invoice",
    index: "05",
    title: "ZRA Smart Invoice & Accounting Integration",
    summary:
      "Connect sales, invoicing, POS, accounting, or ERP workflows to ZRA Smart Invoice through the VSDC interface.",
    examples: [
      "Staff create an invoice once in the system they already use instead of entering it again elsewhere.",
      "A completed sale submits the required information and stores the returned receipt data.",
      "Product, customer, purchase, sales, and stock information stay synchronized where applicable.",
      "Finance staff find failed submissions or mismatches before month-end.",
      "A multi-branch business brings transactions from different locations into one operational view.",
      "Management sees commercial and compliance information without combining several exports manually.",
    ],
    note:
      "The work can include the technical integration, a test environment, clear submission errors, and support through the required testing and approval process. ZRA registration, approval, and certification remain subject to ZRA requirements.",
    startingPoint:
      "Show me where invoices are created today and where staff enter the same information twice.",
  },
  {
    id: "ai-automation",
    index: "06",
    title: "AI Integration & Workflow Automation",
    summary:
      "Use AI inside real business processes—not as a chatbot added for decoration.",
    examples: [
      "Documents: extract required information from invoices, forms, delivery notes, or contracts; staff review exceptions.",
      "Enquiries: identify intent, collect missing information, update the lead, and prepare a response for approval.",
      "Proposals: draft from approved prices, templates, prior work, and customer information for a person to review.",
      "Knowledge: answer staff questions from approved internal documents with links back to sources.",
      "Customer service: retrieve relevant customer or order information and prepare a response, escalating uncertain cases.",
      "Meetings: turn calls into summaries, commitments, deadlines, follow-up tasks, and customer-record updates.",
      "Collections: identify overdue invoices, prepare reminders, and alert staff when personal attention is needed.",
    ],
    note:
      "AI handles messy language, documents, classification, and first drafts. Deterministic software handles money, permissions, compliance rules, and final decisions. Human approval stays wherever judgment or risk requires it.",
    startingPoint:
      "Send me the repetitive task that consumes the most staff time.",
  },
  {
    id: "portals",
    index: "07",
    title: "Customer Portals & Self-Service Systems",
    summary:
      "Give customers one secure place to find information, complete tasks, and follow progress without repeatedly contacting staff.",
    examples: [
      "A client follows project progress, reviews invoices, uploads documents, and sees outstanding actions.",
      "A distributor lets approved customers place repeat orders using their agreed pricing.",
      "A property company gives tenants access to statements, receipts, lease documents, and maintenance requests.",
      "A logistics customer follows a delivery and downloads proof of delivery.",
      "A professional-services client submits information, approves work, and retrieves completed documents.",
      "A supplier lets customers request quotations and follow their status.",
    ],
    note:
      "The result is fewer repetitive calls and messages, a clearer customer experience, and a more complete operational record.",
    startingPoint:
      "Tell me the questions customers repeatedly ask your team.",
  },
  {
    id: "integrations",
    index: "08",
    title: "API Integration & Connected Systems",
    summary:
      "A website can send messages, collect payments, create invoices, schedule appointments, update records, generate documents, track deliveries, and trigger work elsewhere.",
    examples: [
      "Connect communication, calendars, maps, delivery, weather, documents, signatures, and controlled storage.",
      "Keep CRM, accounting, ERP, inventory, and helpdesk records synchronized.",
      "Add QR and barcode workflows, identity controls, currency data, or video-meeting creation.",
      "Design for authentication, validation, retries, duplicate prevention, rate limits, audit trails, and clear intervention when another service is unavailable.",
    ],
    startingPoint:
      "Show me the two systems your staff are connecting manually.",
  },
];

export const integrationGroups = [
  {
    title: "Communication",
    items: [
      "SMS confirmations, verification codes, reminders, order updates, and staff alerts",
      "WhatsApp Business service messages linked to customer records",
      "Transactional receipts, invoices, statements, account links, and reports",
      "Push notifications for assignments, approvals, messages, and account activity",
    ],
  },
  {
    title: "Scheduling, location & logistics",
    items: [
      "Calendar availability, meeting links, and synchronized rescheduling",
      "Maps, distance, captured location, branch discovery, and assignment",
      "Delivery status, arrival estimates, attempts, signatures, and proof",
      "Weather data for work whose timing depends on conditions",
    ],
  },
  {
    title: "Documents & approval",
    items: [
      "PDF quotations, invoices, receipts, contracts, certificates, and reports",
      "Electronic signatures with status and controlled storage",
      "Customer uploads and internal files organized in object storage",
      "Document intelligence that extracts data and routes exceptions",
    ],
  },
  {
    title: "Customers, sales & operations",
    items: [
      "CRM leads, assignments, activity, and follow-up",
      "Accounting and ERP orders, payments, refunds, stock, and balances",
      "Inventory availability, pricing, branch stock, and reordering",
      "Helpdesk cases with customer and order context",
      "QR codes, barcodes, identity, two-factor access, and permissions",
      "Currency snapshots and automatically created video meetings",
    ],
  },
] as const;

export const partnershipPhases = [
  {
    index: "01",
    title: "Define the useful problem",
    body: "Map the current process, the people involved, the information moving through it, the constraints, and what a meaningful improvement looks like. The objective is the smallest system that changes the operation—not the longest feature list.",
  },
  {
    index: "02",
    title: "Ship in usable increments",
    body: "Design, build, test, and deploy in focused releases. You review working software throughout, so decisions are based on something real rather than a large specification written months earlier.",
  },
  {
    index: "03",
    title: "Improve from evidence",
    body: "After the first release, customer feedback, operational experience, and system data decide what earns attention next. Priorities can change as the business learns.",
  },
] as const;

export const engineeringStandards = [
  {
    title: "You own the system",
    body: "Code, data, repositories, domains, payment accounts, and infrastructure sit in accounts controlled by your business wherever the provider allows it.",
  },
  {
    title: "Built to be understood",
    body: "Architecture, deployment, important business rules, and external integrations are documented. Automated deployments and reproducible environments reduce dependence on one person's laptop or memory.",
  },
  {
    title: "Critical paths are tested",
    body: "Registration, login, payment, booking, invoicing, and administrative approval receive testing appropriate to their risk.",
  },
  {
    title: "Production is observable",
    body: "Errors, failed integrations, and important operational events are visible through monitoring, structured logs, alerts, and audit trails where the system requires them.",
  },
  {
    title: "Access is deliberate",
    body: "Users receive only the permissions they need. Administrative roles, secrets, sensitive actions, and customer information are handled with appropriate controls.",
  },
  {
    title: "Recovery is architecture",
    body: "Backups, data export, service failure, and handover are considered before they become emergencies.",
  },
] as const;

export interface Technology {
  name: string;
  icon?: string;
}

export interface TechnologyGroup {
  id: string;
  title: string;
  description: string;
  technologies: readonly Technology[];
}

export const technologyGroups: TechnologyGroup[] = [
  {
    id: "product",
    title: "Product Engineering",
    description:
      "Responsive interfaces and full-stack products built on web standards, typed code, reusable components, server rendering, APIs, and maintainable design systems.",
    technologies: [
      { name: "HTML", icon: "/icons/color/html.svg" },
      { name: "CSS", icon: "/icons/color/css.svg" },
      { name: "JavaScript", icon: "/icons/color/js.svg" },
      { name: "TypeScript", icon: "/icons/color/ts.svg" },
      { name: "React", icon: "/icons/color/react.svg" },
      { name: "Next.js", icon: "/icons/color/next.svg" },
      { name: "Node.js", icon: "/icons/color/node.svg" },
      { name: "Hono", icon: "/icons/color/hono.svg" },
      { name: "TanStack", icon: "/icons/color/tanstack.svg" },
      { name: "Tailwind CSS", icon: "/icons/color/tailwind.svg" },
    ],
  },
  {
    id: "motion",
    title: "Interaction & Motion",
    description:
      "Motion for feedback, state transitions, and interface continuity; authored timelines and scroll-driven sequences where animation improves understanding.",
    technologies: [
      { name: "Motion", icon: "/icons/color/motion.svg" },
      { name: "GSAP", icon: "/icons/color/gsap.svg" },
    ],
  },
  {
    id: "data",
    title: "Content & Data",
    description:
      "Structured publishing, relational business data, type-safe schemas, caching, background work, and real-time products where the architecture justifies them.",
    technologies: [
      { name: "Payload", icon: "/icons/color/payload.svg" },
      { name: "PostgreSQL", icon: "/icons/color/postgres.svg" },
      { name: "Drizzle", icon: "/icons/color/drizzle.svg" },
      { name: "Redis", icon: "/icons/color/redis.svg" },
      { name: "Convex", icon: "/icons/color/convex.svg" },
    ],
  },
  {
    id: "ai",
    title: "AI Systems",
    description:
      "Hosted and local models, document processing, structured outputs, retrieval, evaluations, and human-reviewed workflows.",
    technologies: [
      { name: "Hugging Face", icon: "/icons/color/huggingface.svg" },
      { name: "OpenRouter", icon: "/icons/color/openrouter.svg" },
      { name: "Ollama", icon: "/icons/color/ollama.svg" },
    ],
  },
  {
    id: "infrastructure",
    title: "Infrastructure & Delivery",
    description:
      "Managed and self-hosted deployment, containers, reverse proxies, DNS, caching, traffic protection, certificates, storage, and repeatable environments.",
    technologies: [
      { name: "Linux", icon: "/icons/color/linux.svg" },
      { name: "Docker", icon: "/icons/color/docker.svg" },
      { name: "Cloudflare", icon: "/icons/color/cloudflare.svg" },
      { name: "Vercel", icon: "/icons/color/vercel.svg" },
      { name: "Alibaba Cloud" },
      { name: "Dokploy", icon: "/icons/color/dokploy.svg" },
      { name: "Nginx", icon: "/icons/color/nginx.svg" },
      { name: "Traefik", icon: "/icons/color/traefik.svg" },
    ],
  },
  {
    id: "quality",
    title: "Testing, CI/CD & Observability",
    description:
      "Source control, automated builds, browser and integration tests, deployment pipelines, error reporting, metrics, traces, dashboards, and alerts.",
    technologies: [
      { name: "Git", icon: "/icons/color/git.svg" },
      { name: "GitHub" },
      { name: "GitHub Actions", icon: "/icons/color/github%20actions.svg" },
      { name: "Playwright", icon: "/icons/color/playwright.svg" },
      { name: "Vitest", icon: "/icons/color/vitest.svg" },
      { name: "OpenTelemetry", icon: "/icons/color/OpenTelemetry.svg" },
      { name: "Prometheus", icon: "/icons/color/prometheus.svg" },
      { name: "Grafana", icon: "/icons/color/grafana.svg" },
      { name: "Sentry" },
    ],
  },
  {
    id: "platforms",
    title: "Platforms & Integrations",
    description:
      "Payments, transactional communication, regulatory connections, synchronization, signature verification, duplicate prevention, and controlled failure recovery.",
    technologies: [
      { name: "Stripe", icon: "/icons/color/stripe.svg" },
      { name: "Resend", icon: "/icons/color/resend.svg" },
      { name: "Mobile money gateways" },
      { name: "SMS & WhatsApp services" },
      { name: "ZRA Smart Invoice / VSDC" },
      { name: "REST APIs" },
      { name: "Webhooks" },
    ],
  },
  {
    id: "design",
    title: "Product Design & Visual Production",
    description:
      "Interface design, prototyping, design systems, vector assets, image preparation, and the path from early concept to polished implementation.",
    technologies: [
      { name: "Figma", icon: "/icons/color/figma.svg" },
      { name: "Adobe Illustrator", icon: "/icons/color/illustrator.svg" },
      { name: "Adobe Photoshop", icon: "/icons/color/photoshop.svg" },
    ],
  },
  {
    id: "workflow",
    title: "AI-Assisted Engineering Workflow",
    description:
      "Agentic tools accelerate research, implementation, testing, refactoring, and documentation; architectural constraints and direct verification still govern the result.",
    technologies: [
      { name: "OpenCode", icon: "/icons/color/opencode.svg" },
      { name: "Warp", icon: "/icons/color/warp.svg" },
    ],
  },
];

export const stackFlow = [
  "Next.js interface",
  "Node.js or Hono API",
  "PostgreSQL with Drizzle",
  "Redis-backed jobs",
  "Payment, SMS, email, or ZRA integrations",
  "OpenTelemetry and Grafana",
  "Docker on Linux behind Cloudflare",
] as const;

export const fitGuidance = {
  strong: [
    "A repeated process is wasting staff time or leaking revenue.",
    "Customers are waiting on work software could complete or coordinate.",
    "Existing tools do not fit the operation or cannot exchange information.",
    "The business needs control over its customer relationship, content, or data.",
    "A decision-maker can clarify priorities and review working software.",
    "The business wants to improve the system after launch.",
  ],
  weak: [
    "An existing low-cost product already solves the problem cleanly.",
    "The goal is to build software before validating the underlying service or business.",
    "The project depends on content, branding, or operational decisions nobody is prepared to supply.",
    "The only requirement is the lowest possible upfront price.",
  ],
} as const;

export const capabilityFaqs = [
  {
    question: "Do I need a technical specification?",
    answer:
      "No. Start with the business problem, the people affected, and what currently happens. Translating that into a sensible system is part of the work.",
  },
  {
    question: "What if an existing product would be cheaper?",
    answer:
      "I will recommend it. Custom software earns its cost when a generic product creates meaningful operational limits, integration problems, platform fees, fragmented data, or loss of control.",
  },
  {
    question: "Will I own the code and data?",
    answer:
      "Yes. Repositories, infrastructure, domains, databases, and provider accounts are placed under your business's control wherever possible.",
  },
  {
    question: "Can you connect to the software we already use?",
    answer:
      "Often, yes—if the provider offers a suitable API, export, webhook, or supported integration method. I assess access, documentation, limitations, security, and failure handling before committing.",
  },
  {
    question: "Can you work with our internal team?",
    answer:
      "Yes. I can own a focused product or integration, collaborate with an existing engineering or operations team, or provide senior implementation capacity across a defined part of the system.",
  },
  {
    question: "What happens after launch?",
    answer:
      "The usual model is continuous improvement: monitor the system, support the agreed operational scope, and prioritize the next useful changes. The exact support arrangement and response expectations are agreed before work begins.",
  },
] as const;
