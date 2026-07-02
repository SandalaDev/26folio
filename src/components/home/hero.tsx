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
 * EPIC-010: asymmetric composition on the full-viewport width. Hierarchy is
 * deliberate: h1 (heavy/light weight contrast) → subhead + CTA → portrait.
 * The portrait is small and blob-masked (§Blob motif): present, not dominant.
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
        className="grid w-full items-end gap-10 lg:grid-cols-12"
      >
        <div className="flex flex-col gap-8 lg:col-span-8">
          <motion.h1
            variants={shouldReduceMotion ? undefined : fadeUp}
            className="text-display font-display font-extralight text-ink"
          >
            I build the <span className="font-semibold">software</span> your
            business <span className="font-semibold">actually needs.</span>
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
          <motion.div variants={shouldReduceMotion ? undefined : fadeUp}>
            <MagneticButton href="/contact" size="lg">
              Let&apos;s talk
            </MagneticButton>
          </motion.div>
        </div>

        {/* Portrait: third in the hierarchy: small, offset low-right, blob-
            masked with a soft caramel echo behind (§Blob motif). */}
        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="order-first flex justify-start lg:order-none lg:col-span-4 lg:justify-end lg:pb-6"
        >
          <div className="relative w-28 md:w-40 lg:w-52">
            <Blob
              variant={3}
              fill="var(--color-caramel)"
              opacity={0.16}
              blur={2}
              className="-left-6 -top-6 w-[130%]"
            />
            <div className="blob-mask-1 blob-morph relative aspect-square overflow-hidden bg-surface-2">
              <Image
                src="/images/portrait.png"
                alt="Abe Sandala"
                fill
                sizes="(min-width: 1024px) 13rem, (min-width: 768px) 10rem, 7rem"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export { Hero };
