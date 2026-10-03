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
    note: "Receipts, staff notifications, customer-account updates, and the next operational step can all follow automatically.",
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
    note: "Members manage their account and access; staff see the complete membership picture without reconciling several spreadsheets.",
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
    note: "Availability, deposits, confirmations, reminders, cancellations, rescheduling, calendar updates, and internal notifications stay connected.",
    startingPoint: "Show me how a booking moves from the first enquiry to the completed service.",
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
    note: "Editors change words, images, products, listings, and records while the system preserves typography, spacing, responsiveness, accessibility, and hierarchy. Drafts, previews, approvals, scheduling, version history, reusable sections, media, permissions, languages, SEO, and integrations can be shaped around the organization.",
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
    note: "The work can include the technical integration, a test environment, clear submission errors, and support through the required testing and approval process. ZRA registration, approval, and certification remain subject to ZRA requirements.",
    startingPoint:
      "Show me where invoices are created today and where staff enter the same information twice.",
  },
  {
    id: "ai-automation",
    index: "06",
    title: "AI Integration & Workflow Automation",
    summary: "Use AI inside real business processes—not as a chatbot added for decoration.",
    examples: [
      "Documents: extract required information from invoices, forms, delivery notes, or contracts; staff review exceptions.",
      "Enquiries: identify intent, collect missing information, update the lead, and prepare a response for approval.",
      "Proposals: draft from approved prices, templates, prior work, and customer information for a person to review.",
      "Knowledge: answer staff questions from approved internal documents with links back to sources.",
      "Customer service: retrieve relevant customer or order information and prepare a response, escalating uncertain cases.",
      "Meetings: turn calls into summaries, commitments, deadlines, follow-up tasks, and customer-record updates.",
      "Collections: identify overdue invoices, prepare reminders, and alert staff when personal attention is needed.",
    ],
    note: "AI handles messy language, documents, classification, and first drafts. Deterministic software handles money, permissions, compliance rules, and final decisions. Human approval stays wherever judgment or risk requires it.",
    startingPoint: "Send me the repetitive task that consumes the most staff time.",
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
    note: "The result is fewer repetitive calls and messages, a clearer customer experience, and a more complete operational record.",
    startingPoint: "Tell me the questions customers repeatedly ask your team.",
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
    startingPoint: "Show me the two systems your staff are connecting manually.",
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
  note: string;
  icon?: string;
  iconShape?: "square" | "wide";
  iconTone?: "original" | "white";
}

export interface TechnologyGroup {
  id: string;
  title: string;
  intro?: string;
  outro?: string;
  technologies: readonly Technology[];
}

export const technologyGroups: TechnologyGroup[] = [
  {
    id: "product",
    title: "Product Engineering",
    technologies: [
      {
        name: "HTML",
        icon: "/icons/color/html.svg",
        note: "The structure behind every interface I build. HTML is simple, durable, and still the foundation everything else in the browser is built around.",
      },
      {
        name: "CSS",
        icon: "/icons/color/css.svg",
        note: "The visual language of the web. I use it to turn an interface from a collection of elements into an intentional experience, from layout and typography to responsive behaviour and interaction states.",
      },
      {
        name: "JavaScript",
        icon: "/icons/color/js.svg",
        note: "The language at the centre of my web development work. I use it across the browser, servers, tooling and increasingly AI-powered applications.",
      },
      {
        name: "TypeScript",
        icon: "/icons/color/ts.svg",
        note: "My default language for serious JavaScript development. Static typing gives me better tooling, safer refactoring, and a clearer way to reason about increasingly complex applications without giving up JavaScript's flexibility.",
      },
      {
        name: "React",
        icon: "/icons/color/react.svg",
        note: "My primary UI library. I use React's component model to build interfaces that can grow from individual interactive elements into complete application experiences.",
      },
      {
        name: "Next.js",
        icon: "/icons/color/next.svg",
        note: "My primary full-stack React framework. I use it when I want the frontend, server-side application logic, routing, rendering, APIs and deployment workflow to live within one cohesive application.",
      },
      {
        name: "Node.js",
        icon: "/icons/color/node.svg",
        iconShape: "wide",
        note: "The runtime behind a huge part of the JavaScript ecosystem and an important primitive for any full-stack JavaScript engineer. I use it when the surrounding ecosystem requires it, particularly where compatibility with established tooling or frameworks makes it the practical choice.",
      },
      {
        name: "Express",
        icon: "/icons/color/expressjs.svg",
        note: "One of the foundational Node.js web frameworks and something I consider essential knowledge for a full-stack JavaScript engineer. I don't necessarily reach for it first anymore, but understanding Express means understanding a significant part of the Node backend ecosystem.",
      },
      {
        name: "Hono",
        icon: "/icons/color/hono.svg",
        note: "A small, portable web framework for building APIs and backend applications across modern JavaScript runtimes. I am particularly interested in it alongside Bun and Cloudflare Workers because it gives me backend primitives without imposing a large application architecture.",
      },
      {
        name: "Bun",
        icon: "/icons/color/bun.svg",
        note: "My preferred JavaScript runtime and development toolkit. I like having the runtime, package manager, bundler and test runner in one toolchain, and when a project supports it, Bun is usually where I start.",
      },
      {
        name: "TanStack Start",
        icon: "/icons/color/tanstack.svg",
        note: "A full-stack framework I'm actively evaluating because of its relatively unopinionated approach to application architecture. Its combination of TanStack Router, Vite and full-stack capabilities is particularly interesting to me as I explore alternatives to more prescriptive application frameworks.",
      },
      {
        name: "Tailwind CSS",
        icon: "/icons/color/tailwind.svg",
        note: "My preferred way of building interfaces with CSS. Its utility-first approach lets me work directly at the component level while keeping responsive behaviour, spacing, typography and visual states close to the markup they affect.",
      },
    ],
  },
  {
    id: "motion",
    title: "Interaction & Motion",
    technologies: [
      {
        name: "Motion",
        icon: "/icons/color/motion.svg",
        note: "My go-to library for interface animation. I use it when motion needs to communicate state, hierarchy or interaction rather than simply decorate the page. Springs, layout transitions and gestures become part of the component rather than a separate animation system.",
      },
      {
        name: "GSAP",
        icon: "/icons/color/gsap.svg",
        note: "The heavier artillery when an interface needs choreography rather than simple component animation. I reach for it for complex timelines, scroll-driven experiences, SVG animation and interactions where precise sequencing matters.",
      },
      {
        name: "Remotion",
        icon: "/icons/color/remotion.svg",
        note: "React for programmatic video. I use it when video itself becomes something that can be generated from data, components and code rather than manually edited as a static asset.",
      },
      {
        name: "Three.js",
        icon: "/icons/color/threejs.svg",
        note: "A JavaScript 3D graphics library that brings WebGL and WebGPU capabilities into the browser. I use it when a project benefits from interactive 3D rather than treating 3D as something that belongs exclusively in a traditional rendering application.",
      },
    ],
  },
  {
    id: "data",
    title: "Content & Data",
    technologies: [
      {
        name: "Payload",
        icon: "/icons/color/payload.svg",
        note: "Imagine a full-stack Next.js application whose content can be safely managed by its owners without handing every edit back to a developer. That's the way I think about Payload. Its code-first approach gives me control over the application and database while providing the admin experience needed to make the resulting system usable by non-developers.",
      },
      {
        name: "PostgreSQL",
        icon: "/icons/color/postgres.svg",
        note: "My relational database of choice when I want strong transactional guarantees, expressive SQL and direct control over application data. I like PostgreSQL because it gives me a serious database without forcing the application architecture to revolve around an abstraction hiding the database underneath it.",
      },
      {
        name: "Cloudflare D1",
        icon: "/icons/color/cloudflare.svg",
        note: "Cloudflare's serverless SQL database built on SQLite. I'm interested in D1 for applications where keeping the database within the Cloudflare ecosystem makes more sense than introducing a separate database service, particularly when the rest of the application is already running on Workers.",
      },
      {
        name: "Drizzle ORM",
        icon: "/icons/color/drizzle.svg",
        note: "My preferred TypeScript ORM. I like its SQL-oriented approach and strong typing, and my extensive exposure to it through the Payload ecosystem has made it a natural choice when I want application-level type safety without losing sight of the SQL underneath.",
      },
      {
        name: "Redis",
        icon: "/icons/color/redis.svg",
        note: "My choice for fast, ephemeral application data when a relational database isn't the right tool. On self-managed applications I primarily see it as a caching and coordination layer rather than trying to make it the application's source of truth.",
      },
      {
        name: "Convex",
        icon: "/icons/color/convex.svg",
        note: "A reactive backend platform built around a document-relational database and TypeScript functions. I'm evaluating it because the combination of database, backend functions and automatic real-time synchronisation represents a very different approach to building application backends from the traditional API-plus-database model.",
      },
      {
        name: "Neon",
        icon: "/icons/color/neon.svg",
        note: "Managed PostgreSQL with a developer experience built around serverless applications and database branching. I use it when managed Postgres makes more sense for a project than operating the database myself; for other applications, I prefer the control and learning that comes with self-hosting PostgreSQL.",
      },
    ],
  },
  {
    id: "ai",
    title: "AI Platforms",
    technologies: [
      {
        name: "Hugging Face",
        icon: "/icons/color/huggingface.svg",
        note: "One of the central ecosystems for open machine-learning models, datasets and tooling. I'm building familiarity with it as I move deeper into AI systems, particularly around open-weight models and the infrastructure surrounding them.",
      },
      {
        name: "OpenRouter",
        icon: "/icons/color/openrouter.svg",
        note: "My model inference abstraction layer. I use it extensively because I don't want an application to become unnecessarily coupled to one model provider. Being able to evaluate different models and providers against the actual job is increasingly important as the model landscape changes.",
      },
      {
        name: "Ollama",
        icon: "/icons/color/ollama.svg",
        iconTone: "white",
        note: "A practical way to run open models locally. I've used it with the Vercel AI SDK for embedded AI experiments, and I'm interested in it as an option whenever local or self-hosted inference makes more sense than another hosted API.",
      },
      {
        name: "LangChain",
        icon: "/icons/color/langchain.svg",
        note: "A major framework in the LLM application ecosystem, particularly around tools, retrieval, agents and model orchestration. It isn't currently one of my primary AI frameworks, but I keep it in my toolbox because understanding the abstractions around modern AI applications is increasingly useful.",
      },
      {
        name: "Vercel AI SDK",
        icon: "/icons/color/vercel.svg",
        note: "The layer I use to put AI inside applications rather than building isolated chatbot demos. It gives me primitives for model integration, streaming, structured output and tool use while allowing the AI experience to remain part of the application's normal interface.",
      },
      {
        name: "Cloudflare Workers AI",
        icon: "/icons/color/cloudflare.svg",
        iconShape: "wide",
        note: "Cloudflare's inference platform for running AI models through the Workers ecosystem. I'm interested in it primarily because it brings inference closer to the same infrastructure I increasingly want to use for the rest of an application.",
      },
      {
        name: "Alibaba Cloud Model Studio",
        icon: "/icons/color/alibaba%20model%20studio.svg",
        note: "Alibaba's managed environment for working with foundation models and AI applications. I've used its sandbox and inference APIs and keep it in my toolbox as another model and infrastructure ecosystem worth understanding.",
      },
    ],
    outro:
      "My interest in all of these tools is ultimately the same: I want to build useful AI into ordinary software. The interesting problem isn't putting a chatbot in a corner of an application. It's finding places where models, agents and automation can make the underlying business system materially more capable.",
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    technologies: [
      {
        name: "AWS",
        icon: "/icons/color/aws.svg",
        note: "The reference point I use for understanding modern cloud infrastructure. I haven't built my career around operating AWS directly, but its compute, networking, storage, database and orchestration primitives are useful to understand because so many higher-level platforms are abstractions over the same fundamental ideas.",
      },
      {
        name: "Linux",
        icon: "/icons/color/linux.svg",
        note: "The operating system underneath much of the infrastructure I work with. Servers, containers, development environments and deployment platforms all become easier to reason about when I understand what is happening beneath the application layer.",
      },
      {
        name: "Docker",
        icon: "/icons/color/docker.svg",
        note: "My standard way of packaging applications and their dependencies into reproducible environments. I use containers to make applications easier to move between development, deployment and self-hosted infrastructure.",
      },
      {
        name: "Cloudflare",
        icon: "/icons/color/cloudflare.svg",
        note: "The infrastructure platform I'm increasingly building around. DNS, CDN, security, Workers, R2, D1, edge compute and AI inference make it possible to push a surprising amount of an application into one ecosystem. I'm particularly interested in how far a complete product can be taken on Cloudflare before traditional cloud infrastructure becomes necessary.",
      },
      {
        name: "Vercel",
        icon: "/icons/color/vercel.svg",
        note: "The platform that got me comfortable shipping modern Next.js applications quickly. I've used it extensively and still appreciate how much infrastructure it removes from the path between a Git repository and production. At the same time, I've become increasingly interested in understanding and controlling the infrastructure underneath those abstractions.",
      },
      {
        name: "Alibaba Cloud",
        icon: "/icons/color/alibabacloud.svg",
        note: "A hyperscale cloud platform I have explored through its developer credits and services. I'm particularly interested in understanding how its infrastructure and AI offerings fit into the broader cloud landscape.",
      },
      {
        name: "Dokploy",
        icon: "/icons/color/dokploy.svg",
        note: "A self-hosted deployment platform that gives me a convenient control plane for applications running on my own infrastructure. I use it to get some of the deployment ergonomics of managed platforms while retaining ownership of the underlying VPS and containers.",
      },
      {
        name: "Nginx",
        icon: "/icons/color/nginx.svg",
        note: "A foundational piece of web infrastructure that I use for reverse proxying and serving applications in self-managed environments. It is one of those tools where understanding what happens between the internet and the application is more valuable than memorising configuration files.",
      },
      {
        name: "Kubernetes",
        icon: "/icons/color/k8s.svg",
        note: "The standard for orchestrating containerised workloads at serious scale. I'm actively studying Kubernetes because I want to understand the architecture behind distributed container platforms even though it isn't currently something I operate as a production administrator.",
      },
    ],
  },
  {
    id: "quality",
    title: "Quality",
    technologies: [
      {
        name: "Git",
        icon: "/icons/color/git.svg",
        note: "The foundation of my development workflow. I use it to track changes, experiment safely, work across branches and preserve the history of how an application evolved.",
      },
      {
        name: "GitHub",
        icon: "/icons/color/github.svg",
        note: "My home for source code, collaboration and the public record of what I build. Issues, pull requests, Actions and repository history are part of how I manage software rather than just where I store it.",
      },
      {
        name: "GitHub Actions",
        icon: "/icons/color/github%20actions.svg",
        note: "My CI/CD layer when a project lives on GitHub. I use event-driven workflows to automate things such as testing, builds and deployment so that shipping becomes a repeatable process rather than a manual ritual.",
      },
      {
        name: "Playwright",
        icon: "/icons/color/playwright.svg",
        note: "I use Playwright to test applications the way users actually interact with them: navigating pages, authenticating, submitting forms and completing real workflows in real browsers.",
      },
      {
        name: "Vitest",
        icon: "/icons/color/vitest.svg",
        note: "My preferred testing framework for TypeScript projects where I need fast unit and integration tests without introducing a completely separate toolchain from the application itself.",
      },
      {
        name: "OpenTelemetry",
        icon: "/icons/color/OpenTelemetry.svg",
        note: "The instrumentation standard I use as my mental model for application observability. It gives me a vendor-neutral way to think about traces, metrics and logs before deciding where that telemetry should ultimately go.",
      },
      {
        name: "Prometheus",
        icon: "/icons/color/prometheus.svg",
        note: "A metrics and monitoring system I use when I need a dedicated time-series view of application or infrastructure behaviour. Its pull-based model and PromQL make it particularly useful for understanding systems over time rather than only reacting to individual errors.",
      },
      {
        name: "Grafana",
        icon: "/icons/color/grafana.svg",
        note: "The visual layer I use for turning operational data into something humans can actually reason about. It is particularly useful when metrics, logs and traces from different systems need to be viewed together.",
      },
      {
        name: "Sentry",
        icon: "/icons/color/sentry.svg",
        note: "When something breaks in production, I want evidence rather than a user telling me that \u201cthe website isn't working.\u201d Sentry gives me the errors, traces, context and release information needed to understand what actually happened.",
      },
      {
        name: "CodeRabbit",
        icon: "/icons/color/code%20rabbit.svg",
        note: "An AI code-review tool I am adopting as part of an increasingly AI-assisted development workflow. I am interested in tools that can review changes with more context than a traditional linter while still leaving the final engineering judgement with me.",
      },
    ],
  },
  {
    id: "platforms",
    title: "Platforms & Integrations",
    technologies: [
      {
        name: "Lenco / BroadPay",
        icon: "/icons/color/lenco.svg",
        note: "A Zambian payments platform I selected after researching the local payments landscape. I'm interested in it as a way to work with local payment rails through a modern API rather than building every integration from scratch.",
      },
      {
        name: "MTN MoMo",
        icon: "/icons/color/mtn%20momo.svg",
        note: "A direct mobile-money integration for collections and disbursements. I am working toward using the underlying payment rail directly where the application needs that level of control rather than automatically introducing a regional aggregator.",
      },
      {
        name: "Zamtel Kwacha",
        icon: "/icons/color/zamtel%20kwacha.svg",
        note: "Zamtel's mobile-money payment rail. I am interested in direct integration for the same reason as MTN MoMo: understanding the actual payment lifecycle instead of treating payments as an opaque third-party abstraction.",
      },
      {
        name: "Airtel Money",
        icon: "/icons/color/airtel%20money.svg",
        note: "Another core Zambian mobile-money rail I am working toward integrating directly. For business software, the interesting part isn't simply accepting a payment; it is handling the surrounding transaction state, callbacks, reconciliation and settlement correctly.",
      },
      {
        name: "ZRA Smart Invoice / VSDC",
        icon: "/icons/color/smartinvoice.svg",
        iconShape: "wide",
        note: "Zambia's fiscalisation infrastructure for electronic invoicing. I'm interested in the integration layer between ordinary business software and the tax authority rather than treating compliance as something that happens outside the application.",
      },
      {
        name: "REST & GraphQL APIs",
        icon: "/icons/color/graphql.svg",
        note: "The boundaries through which applications communicate. I use REST when straightforward resource-oriented APIs make sense and keep GraphQL in the toolbox when clients genuinely benefit from querying the shape of data they need.",
      },
      {
        name: "Webhooks",
        icon: "/icons/color/webhooks.svg",
        note: "One of the simplest and most useful ways for systems to tell each other that something happened. I use them for asynchronous events such as payment updates and other external system notifications, with authentication, fast acknowledgement and background processing where appropriate.",
      },
      {
        name: "Africa's Talking",
        icon: "/icons/color/africaistaliking.svg",
        note: "A communications API platform covering services such as SMS, USSD, voice and payments across African markets. I keep it in my toolbox while also being interested in self-hosted alternatives where owning more of the communication infrastructure makes economic or architectural sense.",
      },
    ],
  },
  {
    id: "design",
    title: "Design",
    technologies: [
      {
        name: "Paper",
        icon: "/icons/color/paper.svg",
        note: "My current design canvas. I like working with a tool that sits closer to the realities of the web and can participate in the same AI-assisted workflows as the rest of my development process. For me, design isn't a separate phase that hands a specification to an engineer; it is part of building the product.",
      },
      {
        name: "Figma Make",
        icon: "/icons/color/figmamake.svg",
        iconShape: "wide",
        note: "AI-assisted prototyping inside the Figma ecosystem. I use it as a way to move quickly from an idea or visual reference to something functional that can be evaluated, challenged and refined.",
      },
      {
        name: "Adobe Illustrator",
        icon: "/icons/color/illustrator.svg",
        note: "My vector design tool for precision work, typography, illustration and production assets. I came to software engineering through design, so I still approach SVG and interface graphics with a designer's eye rather than treating them as assets someone else will eventually provide.",
      },
      {
        name: "Adobe Photoshop",
        icon: "/icons/color/photoshop.svg",
        note: "My raster image and compositing tool. I use it when an interface or product needs photographic manipulation, image preparation or more detailed pixel-level work.",
      },
    ],
  },
  {
    id: "workflow",
    title: "Workflow",
    intro:
      "I don't have one sacred development environment.\n\nEconomic constraints forced me to become comfortable moving between models, agents, editors, terminals and harnesses. If a tool gives me access to a better model, a useful workflow or an allocation I can actually afford, I'll use it. The useful consequence is that I'm less attached to any particular vendor or interface. I learn the underlying workflow and adapt to the tool.",
    technologies: [
      {
        name: "OpenCode",
        icon: "/icons/color/opencode.svg",
        iconShape: "wide",
        note: "An open-source coding agent that gives me another route into agentic development and, importantly, lets me choose from different model providers. I use it particularly when its model selection makes economic or technical sense.",
      },
      {
        name: "Cursor",
        icon: "/icons/color/cursor.svg",
        note: "An AI-first development environment and an important part of the wider AI coding ecosystem even though it isn't my primary editor. I keep familiar with tools like Cursor because I don't want my ability to work effectively with AI agents tied to a single interface.",
      },
      {
        name: "Pi",
        icon: "/icons/color/pi.svg",
        note: "A deliberately minimal agent harness that takes a different approach from full-featured AI coding environments. I find it interesting precisely because it exposes the underlying mechanics of an agent rather than trying to hide them behind an elaborate IDE.",
      },
      {
        name: "Warp",
        icon: "/icons/color/warp.svg",
        note: "My terminal of choice. I use it for ordinary development work as well as agentic workflows, and I like having the shell, command history and AI assistance in the same environment.",
      },
      {
        name: "T3 Code",
        icon: "/icons/color/t3%20code.svg",
        note: "A newer addition to my toolkit that I'm particularly interested in because it treats models, agents, harnesses, subscriptions and remote machines as things that can be orchestrated rather than locked to one development environment. That direction is important to me as more of my development workflow becomes distributed.",
      },
      {
        name: "Hermes Agent",
        icon: "/icons/color/hermes.svg",
        note: "A persistent, extensible autonomous agent that fits the direction I want my development workflow to move in: agents that can maintain context, develop capabilities and continue working beyond a single interactive coding session.",
      },
      {
        name: "Herdr",
        icon: "/icons/color/herdr.svg",
        note: "An agent multiplexer for persistent remote development. I'm interested in it for the same reason developers use tmux: the work should continue even when I disconnect, and I should be able to reconnect to the same running environment from somewhere else.",
      },
    ],
  },
];

export const stackFlow = [
  {
    label: "Next.js interface",
    detail: "Customer and staff interaction",
    icon: "interface",
  },
  {
    label: "Node.js or Hono API",
    detail: "Rules, access, and orchestration",
    icon: "api",
  },
  {
    label: "PostgreSQL with Drizzle",
    detail: "Durable business records",
    icon: "data",
  },
  {
    label: "Redis-backed jobs",
    detail: "Scheduled and resilient work",
    icon: "jobs",
  },
  {
    label: "Payments, messages, and ZRA",
    detail: "Controlled external services",
    icon: "integrations",
  },
  {
    label: "OpenTelemetry and Grafana",
    detail: "Production evidence",
    icon: "observability",
  },
  {
    label: "Docker, Linux, and Cloudflare",
    detail: "Repeatable delivery",
    icon: "delivery",
  },
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
