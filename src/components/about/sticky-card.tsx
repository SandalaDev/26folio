"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TiltCard } from "@/components/motion/tilt-card";
import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * StickyCard — opens a modal, stays sticky within its column
 * (12-ui-element-map.md §3 About #2a). The trigger itself is the whole card.
 * EPIC-012 TASK-054: door-tilt on the shared primitive; `sticky` lives on the
 * TiltCard frame (the un-transformed element), so the stick position never
 * wobbles while the card inside swings.
 */
function StickyCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog>
      <TiltCard tiltY={6} className={`sticky top-24 ${className ?? ""}`}>
        <DialogTrigger asChild>
          <motion.button
            type="button"
            whileHover={{ y: -4 }}
            transition={{ duration: DURATION.micro, ease: EASE_OUT }}
            className="block h-full w-full border border-border bg-surface p-8 text-left transition-colors hover:border-border-2 hover:bg-surface-2"
          >
            <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
            {/* soft = tertiary caption text (§2). */}
            <p className="mt-3 text-soft">{description}</p>
          </motion.button>
        </DialogTrigger>
      </TiltCard>
      {children}
    </Dialog>
  );
}

export { StickyCard };
