"use client";

import { motion, useReducedMotion } from "framer-motion";

import { fadeUp, staggerContainer } from "@/lib/motion";

/* Two beats, rendered side by side rather than behind clicks: with only two
   phases, disclosure would hide half the model to save no space. Copy source:
   planning/content/page-copy/Capabilities.md §3. No numeric pricing here by
   owner decision; the structure holds ranges if that changes. */
const PHASES = [
  {
    id: "build",
    title: "Build",
    accent: "border-caramel/50",
    lead: "A fixed scope, a fixed price, and a working system in weeks. It ends with something you own outright, running in production.",
    points: [
      "Scope and price agreed in writing before work starts",
      "You watch it come together, no disappearing for weeks",
      "Handover includes everything needed to run it without me",
    ],
  },
  {
    id: "evolve",
    title: "Evolve",
    accent: "border-rose/50",
    lead: "A monthly partnership after launch. The system keeps absorbing work: new automations, new integrations, refinements steered by what your business learns.",
    points: [
      "A steady cadence of improvements, not a support queue",
      "Priorities reset monthly around what the numbers say",
      "Each month builds on what shipped the month before",
    ],
  },
] as const;

/**
 * EngagementModel (EPIC-021 TASK-080): the Build / Evolve working model plus
 * the ownership guarantee; replaces ProcessSteps' four transactional stages,
 * which contradicted the relationship positioning. Entrance is the shared
 * fadeUp stagger on scroll, reduced-motion gated; no other choreography, the
 * section is a reading moment.
 */
function EngagementModel() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "show"}
      viewport={{ once: true, amount: 0.2 }}
      variants={shouldReduceMotion ? undefined : staggerContainer}
      className="flex flex-col gap-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {PHASES.map((phase) => (
          <motion.article
            key={phase.id}
            variants={shouldReduceMotion ? undefined : fadeUp}
            className={`border border-border border-t-2 bg-surface p-8 ${phase.accent} md:p-10`}
          >
            <h3 className="font-display text-2xl font-semibold text-ink md:text-3xl">
              {phase.title}
            </h3>
            <p className="mt-4 text-muted">{phase.lead}</p>
            <ul className="mt-6 flex flex-col gap-2 text-ink/80">
              {phase.points.map((point) => (
                <li key={point} className="border-l border-border pl-4">
                  {point}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>

      {/* The risk-reversal moment gets its own full-width band: the one
          claim that separates this model from agency lock-in and platform
          rent, so it closes the section alone. */}
      <motion.aside
        variants={shouldReduceMotion ? undefined : fadeUp}
        className="border border-rose/40 bg-surface p-8 md:p-10"
      >
        <h3 className="font-display text-2xl font-semibold text-ink">
          You own everything.
        </h3>
        <p className="measure mt-4 text-muted">
          Code, data, infrastructure, accounts: all of it sits in your name
          from day one. Cancel anytime and everything keeps running.
        </p>
      </motion.aside>
    </motion.div>
  );
}

export { EngagementModel };
