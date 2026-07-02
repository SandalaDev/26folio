"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useTabbedContent } from "@/lib/use-tabbed-content";
import { services, serviceIds } from "@/lib/services";
import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * ServiceTabs — services section (12-ui-element-map.md §3 Capabilities #1).
 * EPIC-010: reads from the shared services source (src/lib/services.ts, also
 * consumed by the home rail) and renders a real `id=` anchor per service so
 * deep links like /capabilities#mobile-payments land here AND activate the
 * right tab (the hash effect below).
 */
function ServiceTabs() {
  const [initialId, setInitialId] = React.useState<string | undefined>(undefined);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (serviceIds.includes(hash)) setInitialId(hash);
    setReady(true);
    // The anchors below mount AFTER hydration, so the browser's native hash
    // jump has already missed them; scroll explicitly once they exist.
    if (serviceIds.includes(hash)) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      });
    }
  }, []);

  const { activeId, getTabListProps, getTabProps, getTabPanelProps } =
    useTabbedContent(serviceIds, {
      orientation: "vertical",
      initialId,
    });

  if (!ready) return null;

  return (
    <div className="relative grid gap-8 md:grid-cols-[240px_1fr]">
      {/* Anchor targets: the tab machinery owns tab-/tabpanel- ids, so plain
          service ids live on these zero-size spans. scroll-mt clears the
          sticky header when the browser jumps here. */}
      {services.map((service) => (
        <span
          key={service.id}
          id={service.id}
          aria-hidden="true"
          className="absolute top-0 scroll-mt-24"
        />
      ))}

      <div {...getTabListProps()} className="flex flex-row flex-wrap gap-2 md:flex-col">
        {services.map((service) => (
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
        {services.map((service) => (
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
