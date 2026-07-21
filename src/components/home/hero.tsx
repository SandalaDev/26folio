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
    <section className="relative flex min-h-[90dvh] items-center overflow-hidden px-5 py-8 md:px-10 lg:px-16 xl:px-24">
      {/* Always-present static warm gradient: reduced-motion / touch / SSR base.
          EPIC-012 TASK-050: low-alpha multi-stop washes (§3 — "never a tight
          two-stop ramp"). Full-strength accent-to-transparent ramps banded
          visibly on the dark base; alphas now cap near the preview's ~10-14%
          ceiling with an intermediate stop so the falloff is long and soft.
          Same composition: caramel upper-left, rose lower-right, espresso base. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 100% at 15% 10%, color-mix(in srgb, var(--color-caramel) 14%, transparent) 0%, color-mix(in srgb, var(--color-caramel) 6%, transparent) 32%, transparent 62%), radial-gradient(120% 120% at 85% 90%, color-mix(in srgb, var(--color-rose) 12%, transparent) 0%, color-mix(in srgb, var(--color-rose) 5%, transparent) 34%, transparent 66%), var(--color-background)",
        }}
      />
      {/* Additive WebGL shader: only when motion is allowed and pointer is fine. */}
      {canAnimate && <ShaderBackground className="-z-10" />}

      {/* EPIC-020: centered editorial manifesto matching the /about/the-way-i-am
          hero. Title, then the blob-masked portrait, the subhead, and the CTA
          all stacked centered. The h1 spans the full width so a long headline
          stays two lines; the supporting column stays measured. */}
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
        variants={shouldReduceMotion ? undefined : staggerContainer}
        className="relative z-10 flex w-full flex-col items-center gap-5 text-center"
      >
        {/* ink→soft gradient fill — the preview h1 signature (TASK-053). */}
        <motion.h1
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="text-display font-display display-gradient"
        >
          I build the software your business actually needs.
        </motion.h1>

        {/* Portrait under the title (matches WayHero), blob-masked with a soft
            caramel echo (§Blob motif). */}
        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="relative w-32 sm:w-36 md:w-40"
        >
          <Blob
            variant={3}
            fill="var(--color-caramel)"
            opacity={0.16}
            blur={8}
            className="-left-6 -top-8 w-[130%]"
          />
          <div className="blob-mask-1 blob-morph relative aspect-[4/5] overflow-hidden bg-surface-2">
            <Image
              src="/images/abe.png"
              alt="Abe Sandala"
              fill
              sizes="(min-width: 768px) 10rem, 8rem"
              priority
              className="object-cover object-[50%_22%]"
            />
          </div>
        </motion.div>

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
      </motion.div>
    </section>
  );
}

export { Hero };
