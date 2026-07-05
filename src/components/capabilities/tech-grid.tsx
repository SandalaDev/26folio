"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { TiltCard } from "@/components/motion/tilt-card";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/motion";

// Real, documented stack (06-project-technical-plan.md §2) — a starting list
// for Abe to confirm/expand, not invented tools.
const TECHNOLOGIES = [
  { name: "Next.js", usage: "App Router framework — static generation for every page on this site." },
  { name: "TypeScript", usage: "Strict-mode typing across the whole codebase." },
  { name: "Tailwind CSS", usage: "Utility-first styling; every token on this page comes from it." },
  { name: "Framer Motion", usage: "Component-level transitions, hover states, and tab/page animation." },
  { name: "GSAP", usage: "Scroll-driven sequences — e.g. the home page's pinned capability rail." },
  { name: "Resend", usage: "Contact form email delivery — no submissions stored." },
  { name: "Node.js", usage: "Runtime for the Next.js server and its API routes." },
  { name: "Dokploy", usage: "Docker-based deployment with zero-downtime releases." },
] as const;

const VISIBLE_COUNT = 6;
const SWAP_INTERVAL_MS = 4000;

/** TechGrid — fixed, non-scrolling grid that swaps its visible set over time. */
function TechGrid() {
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setOffset((prev) => (prev + 1) % TECHNOLOGIES.length);
    }, SWAP_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const visible = Array.from({ length: VISIBLE_COUNT }, (_, i) => TECHNOLOGIES[(offset + i) % TECHNOLOGIES.length]);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {visible.map((tech) => (
          <motion.div
            key={tech.name}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.component, ease: EASE_OUT }}
          >
            {/* Small surface → reduced door amplitude (TASK-054, §3 restraint). */}
            <TiltCard tiltY={4} tiltX={1.5}>
              <HoverCard>
                {/* peach mono/tech accent + surface-2/border-2 elevation on
                    hover (§2, the preview's swatch-hover pattern) — rose no
                    longer carries every state change. */}
                <HoverCardTrigger asChild>
                  <button
                    type="button"
                    className="flex h-20 w-full items-center justify-center border border-border bg-surface px-4 text-center font-display text-sm font-semibold text-ink/80 transition-colors hover:border-border-2 hover:bg-surface-2 hover:text-peach"
                  >
                    {tech.name}
                  </button>
                </HoverCardTrigger>
                <HoverCardContent>
                  {/* caramel label + peach usage accent — the preview's mtable
                      th/code pairing. */}
                  <p className="eyebrow text-caramel">{tech.name}</p>
                  <p className="mt-2 text-muted">{tech.usage}</p>
                </HoverCardContent>
              </HoverCard>
            </TiltCard>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export { TechGrid };
