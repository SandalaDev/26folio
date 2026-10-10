"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useTransform } from "framer-motion";

import { useDoorTilt } from "@/components/motion/tilt-card";
import { PreviewVideo } from "@/components/work/preview-video";
import type { Project } from "@/lib/projects";

/**
 * WorkCard - large media card with the baunfire hover treatment (EPIC-010
 * TASK-041, 12-ui-element-map.md §3 Home #2). EPIC-012 TASK-054: the tilt is
 * rebuilt on the shared door-tilt primitive after the original never reached
 * the DOM (motion values were added to `style` post-mount — see tilt-card.tsx
 * for both engineering rules). The card hinges at its left edge and eases
 * open toward the viewer; the image zooms on the same hover spring so door
 * swing + zoom read as one motion (EPIC-011 owner note 5). Fine pointers
 * with motion allowed get the tilt; everyone else keeps a plain CSS zoom.
 * Projects without an image keep the gradient text-card treatment. EPIC-029:
 * every card states its credit (Client, Own venture or Self-commissioned) and
 * disciplines, and plays its preview loop on hover or focus.
 */
function WorkCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const { frameRef, frameProps, cardStyle, hover } = useDoorTilt({
    tiltY: featured ? 8 : 6,
    tiltX: 2.5,
  });
  // Coordinated zoom off the same spring (design lane §3.B: never useState).
  const imageScale = useTransform(hover, [0, 1], [1, 1.06]);
  // Drives the card's preview loop (EPIC-029 TASK-136); hover or keyboard focus.
  const [active, setActive] = React.useState(false);

  /* Imageless fallback - the pre-EPIC-010 text card, for a project with no cover yet. */
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
        <p className="mt-3 text-soft">{project.description}</p>
      </Link>
    );
  }

  return (
    <div ref={frameRef} {...frameProps}>
      <motion.div style={cardStyle} className="will-change-transform">
        <Link
          href={project.href}
          onPointerEnter={() => setActive(true)}
          onPointerLeave={() => setActive(false)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          className={`group relative flex flex-col justify-end overflow-hidden border border-border bg-surface transition-colors hover:border-border-2 ${
            featured ? "min-h-[26rem] md:min-h-[34rem]" : "aspect-[4/3]"
          }`}
        >
          {/* Spring-driven zoom, synchronized with the door swing. The motion
              transform is inline, so a CSS group-hover zoom fallback would be
              overridden anyway ("transform: none" at identity beats the
              class); non-tilt clients get the border-2 elevation hover on the
              Link instead. The `absolute inset-0` wrapper keeps next/image's
              `fill` stable. */}
          <motion.div
            aria-hidden="true"
            style={{ scale: imageScale }}
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-cover"
            />
            {project.video?.card ? (
              <PreviewVideo clip={project.video.card} trigger="hover" active={active} />
            ) : null}
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
            <p className="mt-3 text-sm text-soft">
              <span className="text-ink">{project.credit}</span>
              {project.disciplines.length > 0 && <> · {project.disciplines.join(", ")}</>}
            </p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

export { WorkCard };
