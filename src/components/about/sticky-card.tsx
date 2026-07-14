"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TiltCard } from "@/components/motion/tilt-card";
import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * StickyCard — opens a modal (12-ui-element-map.md §3 About #2a). The trigger
 * is the whole card, wrapped in EPIC-012 TASK-054's shared door-tilt primitive.
 * EPIC-014 follow-up moved stickiness off the individual card onto the column
 * wrapper in the about page (both cards pin together instead of staggering).
 *
 * Layout (horizontal split): on >= sm the trigger is a flex row with the text
 * column on the left and the image panel on the right; on mobile it collapses
 * back to a vertical stack (image above, text below) so the image keeps a
 * readable size on narrow viewports. The image panel uses a fixed left-edge
 * width on desktop instead of the old 16/9 header so the photo sits as a
 * tall side panel beside the copy. The TiltCard only owns the tilt; the sticky
 * position lives on the column wrapper in the about page.
 */
function StickyCard({
  title,
  description,
  cta,
  imageSrc,
  imageAlt = "",
  imageFit = "cover",
  children,
  className,
}: {
  title: string;
  description: string;
  cta?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog>
      <TiltCard tiltY={6} className={className}>
        <DialogTrigger asChild>
          <motion.button
            type="button"
            whileHover={{ y: -4 }}
            transition={{ duration: DURATION.micro, ease: EASE_OUT }}
            className="group flex h-full w-full flex-col overflow-hidden border border-border bg-surface text-left sm:flex-row"
          >
            {/* Text column — left on >= sm, below the image on mobile. */}
            <span className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-muted">{description}</p>
              {cta ? <p className="mt-3 eyebrow text-rose">{cta} →</p> : null}
            </span>
            {imageSrc ? (
              <span className="relative block aspect-[16/9] w-full shrink-0 overflow-hidden border-border bg-background max-sm:border-b sm:aspect-auto sm:h-auto sm:w-2/5 sm:border-l">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(min-width: 768px) 42vw, 92vw"
                  className={
                    imageFit === "cover"
                      ? "object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      : "object-contain p-10"
                  }
                />
              </span>
            ) : null}
          </motion.button>
        </DialogTrigger>
      </TiltCard>
      {children}
    </Dialog>
  );
}

export { StickyCard };
