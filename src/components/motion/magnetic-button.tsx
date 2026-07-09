"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * MagneticButton - the §7 #4 signature interaction (baunfire), reserved as a note in
 * button.tsx ("magnetic pull, cursor-origin fill sweep, text-mask reveal: a separate
 * motion component"). It reuses the design-system `buttonVariants` (hard corners, token
 * fills) so styling stays canonical, and layers three effects:
 *
 *   1. Magnetic pull  - GSAP `quickTo` translates the button toward the cursor (§6:
 *      ease-out, no overshoot). GSAP owns the imperative transform (one library/job).
 *   2. Fill sweep     - a peach field scales up from the cursor's entry point.
 *   3. Text-mask reveal - the label rolls to a duplicate (CSS, `motion-reduce` safe).
 *
 * Degrades to a plain styled button/link under `prefers-reduced-motion` or on
 * touch/coarse pointers; the native focus ring (globals.css §10) is never removed.
 */
interface MagneticButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  href?: string;
  className?: string;
  strength?: number;
  onClick?: () => void;
  /** Button-only attrs (ignored when `href` renders a link). */
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
}

export function MagneticButton({
  children,
  href,
  variant,
  size,
  className,
  strength = 0.35,
  onClick,
  ...rest
}: MagneticButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const [enabled, setEnabled] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const magnetRef = React.useRef<HTMLDivElement>(null);
  const fillRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (shouldReduceMotion) {
      setEnabled(false);
      return;
    }
    setEnabled(
      typeof window !== "undefined" &&
        window.matchMedia("(pointer: fine)").matches,
    );
  }, [shouldReduceMotion]);

  React.useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const magnet = magnetRef.current;
    const fill = fillRef.current;
    if (!wrap || !magnet || !fill) return;

    const ctx = gsap.context(() => {
      const xTo = gsap.quickTo(magnet, "x", {
        duration: 0.5,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(magnet, "y", {
        duration: 0.5,
        ease: "power3.out",
      });

      const placeFill = (event: MouseEvent) => {
        const box = magnet.getBoundingClientRect();
        gsap.set(fill, {
          left: event.clientX - box.left,
          top: event.clientY - box.top,
        });
      };
      const onEnter = (event: MouseEvent) => {
        placeFill(event);
        gsap.to(fill, { scale: 1, duration: 0.5, ease: "power3.out" });
      };
      const onMove = (event: MouseEvent) => {
        // Magnetic delta from the STATIC wrapper rect (magnet is the one moving).
        const box = wrap.getBoundingClientRect();
        xTo((event.clientX - (box.left + box.width / 2)) * strength);
        yTo((event.clientY - (box.top + box.height / 2)) * strength);
      };
      const onLeave = (event: MouseEvent) => {
        xTo(0);
        yTo(0);
        placeFill(event);
        gsap.to(fill, { scale: 0, duration: 0.4, ease: "power3.out" });
      };

      wrap.addEventListener("mouseenter", onEnter);
      wrap.addEventListener("mousemove", onMove);
      wrap.addEventListener("mouseleave", onLeave);

      return () => {
        wrap.removeEventListener("mouseenter", onEnter);
        wrap.removeEventListener("mousemove", onMove);
        wrap.removeEventListener("mouseleave", onLeave);
      };
    }, wrap);

    return () => ctx.revert();
  }, [enabled, strength]);

  const classes = cn(
    buttonVariants({ variant, size }),
    "group relative isolate overflow-hidden",
    className,
  );

  const inner = (
    <>
      {/* Cursor-origin fill sweep (hard-cornered, §3). Behind the label, clipped. */}
      <span
        ref={fillRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-0 block h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 scale-0 bg-peach"
      />
      {/* Text-mask reveal: label rolls up to an identical copy on hover. */}
      <span className="relative z-10 block overflow-hidden">
        <span className="block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 motion-reduce:hidden"
        >
          {children}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <div ref={wrapRef} className="inline-block">
        <div ref={magnetRef} className="inline-block will-change-transform">
          <Link href={href} className={classes} onClick={onClick} {...rest}>
            {inner}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="inline-block">
      <div ref={magnetRef} className="inline-block will-change-transform">
        <button type="button" className={classes} onClick={onClick} {...rest}>
          {inner}
        </button>
      </div>
    </div>
  );
}
