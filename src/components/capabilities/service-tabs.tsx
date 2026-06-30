"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useTabbedContent } from "@/lib/use-tabbed-content";
import { DURATION, EASE_OUT } from "@/lib/motion";

// Verbatim from 11-content-strategy.md §4 /capabilities point 1. Ids match
// CapabilityRail's anchor ids (EPIC-003) so home page deep links resolve.
const SERVICES = [
  {
    id: "web-development",
    title: "Web development",
    subtitle: "Beyond a website",
    items: [
      'Payload CMS builds ("I build it, you control it")',
      "Landing pages",
      "Dashboards",
      "Internal tools",
    ],
  },
  {
    id: "custom-software",
    title: "Custom software",
    subtitle: "",
    items: [
      "Booking systems / CRMs",
      "Mobile-money & payment-gateway integration",
      "E-commerce",
    ],
  },
  {
    id: "ai-integration",
    title: "AI integration",
    subtitle: "",
    items: [
      "Customer-care voice & chatbots",
      "Receptionist bot",
      "Custom integrations",
      "Local/on-prem AI",
    ],
  },
] as const;

const IDS = SERVICES.map((s) => s.id);

/** ServiceTabs — services section (12-ui-element-map.md §3 Capabilities #1). */
function ServiceTabs() {
  const [initialId, setInitialId] = React.useState<string | undefined>(undefined);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (IDS.includes(hash as (typeof IDS)[number])) setInitialId(hash);
    setReady(true);
  }, []);

  const { activeId, getTabListProps, getTabProps, getTabPanelProps } =
    useTabbedContent(IDS as unknown as string[], {
      orientation: "vertical",
      initialId,
    });

  if (!ready) return null;

  return (
    <div className="grid gap-8 md:grid-cols-[200px_1fr]">
      <div {...getTabListProps()} className="flex flex-row gap-2 md:flex-col">
        {SERVICES.map((service) => (
          <button
            key={service.id}
            type="button"
            {...getTabProps(service.id)}
            className={`eyebrow border-l-2 px-4 py-3 text-left transition-colors ${
              service.id === activeId
                ? "border-rose text-rose"
                : "border-border text-ink/70 hover:text-ink"
            }`}
          >
            {service.title}
          </button>
        ))}
      </div>

      <div>
        {SERVICES.map((service) => (
          <div key={service.id} {...getTabPanelProps(service.id)}>
            {service.id === activeId && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DURATION.component, ease: EASE_OUT }}
                  className="border border-border bg-surface p-8"
                >
                  <h3 className="font-display text-2xl font-semibold text-ink">
                    {service.title}
                  </h3>
                  {service.subtitle && (
                    <p className="mt-1 text-muted">{service.subtitle}</p>
                  )}
                  <ul className="mt-6 flex flex-col gap-2 text-ink/80">
                    {service.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export { ServiceTabs };
