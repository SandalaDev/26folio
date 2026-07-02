"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import type { Project } from "@/lib/projects";

/**
 * WorkCard - large media card with the baunfire hover treatment (EPIC-010
 * TASK-041, 12-ui-element-map.md §3 Home #2). EPIC-011 (owner note 5) retuned
 * the tilt to read as a DOOR opening: a single dominant axis (rotateY, the
 * vertical hinge) swings toward the pointer with a small rotateX for depth,
 * while the background image zooms on the same enter so tilt + zoom read as
 * one smooth motion. The spring is softened (no snap). Tilt is driven by
 * motion values + springs (never useState - design lane §3.B), on fine
 * pointers with motion allowed only; otherwise the card is a plain link with a
 * plain zoom. Projects without an image (placeholders) keep the previous
 * gradient text-card treatment.
 */
const TILT_Y = 9; // door-hinge degrees at the card's horizontal edge (rotateY)
const TILT_X = 3; // small depth tilt at the vertical edge (rotateX)

function WorkCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [tiltEnabled, setTiltEnabled] = React.useState(false);

  const px = useMotionValue(0); // pointer position within card, -0.5 … 0.5
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [TILT_X, -TILT_X]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [TILT_Y, -TILT_Y]), {
    stiffness: 120,
    damping: 18,
  });

  // Coordinated zoom: the image scales from the same hover signal as the tilt,
  // so the door-swing and the zoom read as one motion (owner note 5). Driven by
  // a spring, never useState (design lane §3.B). The scale lives on a wrapper
  // div (not on next/image directly) to keep `fill` positioning stable.
  const hovered = useSpring(0, { stiffness: 120, damping: 18 });
  const imageScale = useTransform(hovered, [0, 1], [1, 1.06]);

  React.useEffect(() => {
    if (shouldReduceMotion) {
      setTiltEnabled(false);
      return;
    }
    setTiltEnabled(window.matchMedia("(pointer: fine)").matches);
  }, [shouldReduceMotion]);

  function handleMove(event: React.MouseEvent<HTMLElement>) {
    if (!tiltEnabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleEnter() {
    hovered.set(1);
  }

  function handleLeave() {
    px.set(0);
    py.set(0);
    hovered.set(0);
  }

  /* Imageless fallback - the pre-EPIC-010 text card (placeholders on /work). */
  if (!project.image) {
    return (
      <Link
        href={project.href}
        className="group relative block overflow-hidden border border-border bg-surface p-8"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-br from-rose/15 via-transparent to-caramel/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <h3 className="font-display text-2xl font-semibold text-ink transition-transform group-hover:translate-x-1">
          {project.title}
        </h3>
        <p className="mt-3 text-muted">{project.description}</p>
      </Link>
    );
  }

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        style={tiltEnabled ? { rotateX, rotateY } : undefined}
        className="will-change-transform"
      >
        <Link
          href={project.href}
          onMouseEnter={handleEnter}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className={`group relative flex flex-col justify-end overflow-hidden border border-border bg-surface ${
            featured ? "min-h-[26rem] md:min-h-[34rem]" : "aspect-[4/3]"
          }`}
        >
          {/* Image zoom. When tilt is active the scale is spring-driven (motion),
              synchronized with the door-swing so the two read as one motion.
              On coarse/reduced-motion the wrapper keeps a plain CSS zoom. The
              `absolute inset-0` wrapper keeps next/image's `fill` stable. */}
          <motion.div
            aria-hidden="true"
            style={tiltEnabled ? { scale: imageScale } : undefined}
            className={`absolute inset-0 will-change-transform ${
              tiltEnabled
                ? "motion-reduce:scale-100"
                : "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            }`}
          >
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-cover"
            />
          </motion.div>
          {/* Warm scrim keeps title/tagline at AA contrast over any image. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent"
          />
          <div className="relative p-7 md:p-9">
            {project.tagline && (
              <p className="eyebrow text-soft">{project.tagline}</p>
            )}
            <h3 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
              {project.title}
            </h3>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

export { WorkCard };
