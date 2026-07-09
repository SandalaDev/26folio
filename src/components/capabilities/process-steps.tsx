"use client";

import { motion, AnimatePresence } from "framer-motion";

import { useTabbedContent } from "@/lib/use-tabbed-content";
import { DURATION, EASE_OUT } from "@/lib/motion";

// Stages decided in 12-ui-element-map.md §3 Capabilities #3. Descriptions are
// generic process copy, not invented specifics about past engagements.
const STEPS = [
  {
    id: "inquiry",
    title: "Inquiry",
    description: "You tell me what you're trying to build. I tell you straight whether I'm the right fit.",
  },
  {
    id: "contract",
    title: "Contract & deposit",
    description: "We agree scope and terms in writing, and the project starts with a signed contract and a down payment.",
  },
  {
    id: "delivery",
    title: "Delivery",
    description: "I build, you see progress along the way — no disappearing for weeks at a time.",
  },
  {
    id: "handover",
    title: "Handover",
    description: "You get the finished project and everything you need to run it without me.",
  },
] as const;

const IDS = STEPS.map((s) => s.id);

/** ProcessSteps — engagement process (12-ui-element-map.md §3 Capabilities #3). */
function ProcessSteps() {
  const { activeId, getTabListProps, getTabProps, getTabPanelProps } =
    useTabbedContent(IDS as unknown as string[], { orientation: "horizontal" });

  return (
    <div className="flex flex-col gap-8">
      <div {...getTabListProps()} className="flex flex-wrap gap-2">
        {STEPS.map((step, i) => (
          <button
            key={step.id}
            type="button"
            {...getTabProps(step.id)}
            className={`eyebrow border px-4 py-3 transition-colors ${
              step.id === activeId
                ? "border-rose text-rose"
                : "border-border text-ink/70 hover:border-border-2 hover:text-ink"
            }`}
          >
            {/* caramel step number — the preview's `.num` label role (§2);
                the active tab's rose still owns the selected state. */}
            <span
              className={step.id === activeId ? undefined : "text-caramel"}
            >
              {i + 1}.
            </span>{" "}
            {step.title}
          </button>
        ))}
      </div>

      {STEPS.map((step) => (
        <div key={step.id} {...getTabPanelProps(step.id)}>
          {step.id === activeId && (
            <AnimatePresence mode="wait">
              <motion.p
                key={step.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.component, ease: EASE_OUT }}
                className="measure text-lg text-ink"
              >
                {step.description}
              </motion.p>
            </AnimatePresence>
          )}
        </div>
      ))}
    </div>
  );
}

export { ProcessSteps };
