"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { MagneticButton } from "@/components/motion/magnetic-button";
import { ShaderBackground } from "@/components/motion/shader-background";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * Hero — first viewport (12-ui-element-map.md §3 Home #1). Two background layers:
 * an always-present static warm-gradient (the documented `prefers-reduced-motion` /
 * low-power / SSR fallback, EPIC-009 decision #1) and, above it, the live WebGL mesh
 * shader (`ShaderBackground`) mounted only when motion is allowed and the pointer is
 * fine. The shader is additive — it never load-bears the hero's legibility.
 */
function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setCanAnimate(false);
      return;
    }
    setCanAnimate(
      typeof window !== "undefined" &&
        window.matchMedia("(pointer: fine)").matches,
    );
  }, [shouldReduceMotion]);

  return (
    <section className="relative flex min-h-[90dvh] items-center overflow-hidden px-6 md:px-12 lg:px-24">
      {/* Always-present static warm gradient — reduced-motion / touch / SSR base. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 100% at 15% 10%, var(--color-caramel) 0%, transparent 55%), radial-gradient(120% 120% at 85% 90%, var(--color-rose) 0%, transparent 60%), var(--color-background)",
        }}
      />
      {/* Additive WebGL shader — only when motion is allowed and pointer is fine. */}
      {canAnimate && <ShaderBackground className="-z-10" />}

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
          <MagneticButton href="/contact" size="lg">
            Let&apos;s talk
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}

export { Hero };
