"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * Hero — first viewport (12-ui-element-map.md §3 Home #1). Static warm-gradient
 * background: this is the documented `prefers-reduced-motion`/low-power fallback
 * for the eventual WebGL shader (epic decision #3), not a placeholder on top of one.
 */
function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[90dvh] items-center overflow-hidden px-6 md:px-12 lg:px-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 100% at 15% 10%, var(--color-caramel) 0%, transparent 55%), radial-gradient(120% 120% at 85% 90%, var(--color-rose) 0%, transparent 60%), var(--color-background)",
        }}
      />
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
        variants={shouldReduceMotion ? undefined : staggerContainer}
        className="mx-auto flex max-w-4xl flex-col gap-8"
      >
        <motion.h1
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="text-display font-display text-ink"
        >
          I build the software your business actually needs.
        </motion.h1>
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="measure text-lg text-muted"
        >
          Web, custom software, and AI integration from one engineer who
          scopes the problem before he names the stack. No agency theatre, no
          handoff to someone who&apos;s never met you. Just a strategic
          partner who gets to the point.
        </motion.p>
        <motion.div variants={shouldReduceMotion ? undefined : fadeUp}>
          <Button asChild size="lg">
            <Link href="/contact">Let&apos;s talk</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

export { Hero };
