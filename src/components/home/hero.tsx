"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { MagneticButton } from "@/components/motion/magnetic-button";
import { ShaderBackground } from "@/components/motion/shader-background";
import { Blob } from "@/components/site/blob";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * Hero: first viewport (12-ui-element-map.md §3 Home #1). Background layers
 * are EPIC-009's and unchanged: an always-present static warm-gradient (the
 * `prefers-reduced-motion` / low-power / SSR fallback) with the WebGL mesh
 * shader mounted above it only when motion is allowed and the pointer is fine.
 *
 * EPIC-011 (owner note 1, adjusted): the h1 is a SINGLE weight and visibly
 * larger (the display token carries the emphasis now, not a heavy/light span
 * mix). The CTA is centered in the viewport; the portrait sits to its right,
 * larger, portrait-aspect, cropped to the face; still blob-masked (§Blob motif).
 * Copy unchanged.
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
    <section className="relative flex min-h-[90dvh] items-center overflow-hidden px-5 py-16 md:px-10 lg:px-16 xl:px-24">
      {/* Always-present static warm gradient: reduced-motion / touch / SSR base. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 100% at 15% 10%, var(--color-caramel) 0%, transparent 55%), radial-gradient(120% 120% at 85% 90%, var(--color-rose) 0%, transparent 60%), var(--color-background)",
        }}
      />
      {/* Additive WebGL shader: only when motion is allowed and pointer is fine. */}
      {canAnimate && <ShaderBackground className="-z-10" />}

      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
        variants={shouldReduceMotion ? undefined : staggerContainer}
        className="flex w-full flex-col gap-8 lg:gap-10"
      >
        {/* h1 sets the column width; everything below aligns to its ends. */}
        <motion.h1
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="text-display font-display text-ink"
        >
          I build the software your business actually needs.
        </motion.h1>

        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="measure text-subhead text-muted"
        >
          Web, custom software, and AI integration from one engineer who
          scopes the problem before he names the stack. No agency theatre, no
          handoff to someone who&apos;s never met you. Just a strategic
          partner who gets to the point.
        </motion.p>

        {/* CTA centered in the viewport (owner note 1, adjusted); portrait kept
            on the right, larger, portrait-aspect, cropped to the face, blob-
            masked with a soft caramel echo (§Blob motif). */}
        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="flex flex-col items-center gap-10 sm:flex-row sm:items-end sm:justify-center"
        >
          <MagneticButton href="/contact" size="lg">
            Let&apos;s talk
          </MagneticButton>

          <div className="relative order-first w-40 shrink-0 sm:ml-16 sm:w-48 md:w-56 lg:w-64">
            <Blob
              variant={3}
              fill="var(--color-caramel)"
              opacity={0.16}
              blur={2}
              className="-left-6 -top-8 w-[130%]"
            />
            {/* Portrait aspect (taller than square) cropped to the face. */}
            <div className="blob-mask-1 blob-morph relative aspect-[4/5] overflow-hidden bg-surface-2">
              <Image
                src="/images/portrait.png"
                alt="Abe Sandala"
                fill
                sizes="(min-width: 1024px) 16rem, (min-width: 640px) 12rem, 10rem"
                priority
                className="object-cover object-[50%_22%]"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export { Hero };
