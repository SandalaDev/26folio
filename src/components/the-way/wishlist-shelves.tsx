"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/site/section";
import { WISHLISTS, WISHLIST_INTRO, type WishlistItem } from "@/lib/the-way";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * WishlistShelves - exhibit five (EPIC-018/TASK-070, replacing EPIC-016's
 * icon shelves). Collections as a wishlist wing: an intro, then five
 * described lists whose items stand in bright display cases against the
 * dark wall. Hover or focus slides each item's line up over the case;
 * on touch screens a tap toggles the same drawer (one open per list,
 * aria-expanded). Personal-voice lines are drafts pending owner review.
 */

function ItemCase({
  item,
  isOpen,
  onToggle,
}: {
  item: WishlistItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="group flex w-full flex-col text-left"
    >
      <span
        className={`relative block aspect-square w-full overflow-hidden border transition-all duration-300 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 ${
          isOpen
            ? "-translate-y-1.5 border-rose"
            : "border-border group-hover:border-border-2"
        }`}
      >
        <span className="absolute inset-0 bg-white/95" aria-hidden="true" />
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 1280px) 15vw, (min-width: 768px) 22vw, 45vw"
          className="object-contain p-3"
        />
        {/* The item's line rides up over the case on hover, focus or tap. */}
        <span
          className={`absolute inset-0 flex flex-col justify-end overflow-y-auto bg-background/90 p-3 backdrop-blur-sm transition-all duration-300 ease-out motion-reduce:transition-none ${
            isOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          }`}
        >
          <span className="text-sm leading-relaxed text-soft">{item.note}</span>
        </span>
      </span>
      <span className="mt-3 block truncate text-sm text-soft">{item.name}</span>
    </button>
  );
}

function WishlistRow({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: WishlistItem[];
}) {
  const [open, setOpen] = React.useState<number | null>(null);

  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      <p className="measure mt-3 text-muted">{description}</p>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 border-b-2 border-border-2 pb-8 sm:grid-cols-3 md:grid-cols-4 md:gap-x-5 xl:grid-cols-5">
        {items.map((item, index) => (
          <li key={item.name}>
            <ItemCase
              item={item}
              isOpen={open === index}
              onToggle={() => setOpen(open === index ? null : index)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function WishlistShelves() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section id="collections" data-way-section="collections">
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.05 }}
        variants={shouldReduceMotion ? undefined : staggerContainer}
      >
        <motion.h2
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="font-display text-heading text-ink"
        >
          Collections
        </motion.h2>
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="measure mt-4 text-muted"
        >
          {WISHLIST_INTRO}
        </motion.p>
        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="mt-14 flex flex-col gap-20"
        >
          {WISHLISTS.map((wishlist) => (
            <WishlistRow
              key={wishlist.id}
              title={wishlist.title}
              description={wishlist.description}
              items={wishlist.items}
            />
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}

export { WishlistShelves };
