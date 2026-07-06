"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * StickyCard — opens a modal, stays sticky within its column
 * (12-ui-element-map.md §3 About #2a). The trigger itself is the whole card.
 */
function StickyCard({
  title,
  description,
  cta,
  children,
  className,
}: {
  title: string;
  description: string;
  cta?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          type="button"
          whileHover={{ y: -4 }}
          transition={{ duration: DURATION.micro, ease: EASE_OUT }}
          className={`sticky top-24 block w-full border border-border bg-surface p-8 text-left ${className ?? ""}`}
        >
          <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
          <p className="mt-3 text-muted">{description}</p>
          {cta ? <p className="mt-4 eyebrow text-rose">{cta} →</p> : null}
        </motion.button>
      </DialogTrigger>
      {children}
    </Dialog>
  );
}

export { StickyCard };
