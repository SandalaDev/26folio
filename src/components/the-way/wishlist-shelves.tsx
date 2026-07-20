"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";

import { Section } from "@/components/site/section";
import { WISHLISTS, WISHLIST_INTRO, type Wishlist, type WishlistItem } from "@/lib/the-way";
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from "@/lib/motion";

/**
 * WishlistShelves - exhibit five (EPIC-018/TASK-070; collapsed into an
 * accordion in TASK-072 to shorten the walk). Collections as a wishlist
 * wing: an intro, then five lists that rest as closed display cases. Each
 * closed row shows its title, description and a teaser strip of small
 * thumbnails; opening it (height auto animation, static under reduced
 * motion) reveals the full grid of bright cases against the dark wall.
 * Hover or focus slides each item's line up over its case; on touch a tap
 * toggles the same drawer (one open per list, aria-expanded).
 */

const TEASER_COUNT = 6;

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

function WishlistRow({ wishlist }: { wishlist: Wishlist }) {
  const shouldReduceMotion = useReducedMotion();
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState<number | null>(null);
  const teaser = wishlist.items.slice(0, TEASER_COUNT);

  return (
    <div className="border-border-2 border-b-2 pb-10">
      <button
        type="button"
        onClick={() => {
          setExpanded((value) => !value);
          setOpen(null);
        }}
        aria-expanded={expanded}
        className="group flex w-full flex-col text-left"
      >
        <span className="flex items-baseline justify-between gap-4">
          <span className="font-display text-xl font-semibold text-ink">{wishlist.title}</span>
          <span className="text-muted group-hover:text-ink flex shrink-0 items-center gap-2 text-sm transition-colors">
            {expanded ? "Close the case" : `Open the case (${wishlist.items.length})`}
            <CaretDown
              aria-hidden="true"
              className={`size-3.5 transition-transform duration-300 motion-reduce:transition-none ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </span>
        </span>
        {wishlist.description.map((paragraph) => (
          <span key={paragraph.slice(0, 32)} className="measure text-muted mt-3 block">
            {paragraph}
          </span>
        ))}

        {/* Closed state: a teaser strip of small cases hints at what's
            inside without paying for the full grid. */}
        {!expanded ? (
          <span className="mt-6 flex items-center gap-2">
            {teaser.map((item, index) => (
              <span
                key={item.name}
                className={`border-border relative block size-12 shrink-0 overflow-hidden border sm:size-14 ${
                  index >= 4 ? "hidden sm:block" : ""
                }`}
              >
                <span className="absolute inset-0 bg-white/95" aria-hidden="true" />
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="3.5rem"
                  className="object-contain p-1.5"
                />
              </span>
            ))}
            <span className="text-muted ml-1 text-sm">
              +{wishlist.items.length - teaser.length} more
            </span>
          </span>
        ) : null}
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key={`${wishlist.id}-grid`}
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: DURATION.page, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 pt-8 sm:grid-cols-3 md:grid-cols-4 md:gap-x-5 xl:grid-cols-5">
              {wishlist.items.map((item, index) => (
                <li key={item.name}>
                  <ItemCase
                    item={item}
                    isOpen={open === index}
                    onToggle={() => setOpen(open === index ? null : index)}
                  />
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
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
          className="mt-14 flex flex-col gap-12"
        >
          {WISHLISTS.map((wishlist) => (
            <WishlistRow key={wishlist.id} wishlist={wishlist} />
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}

export { WishlistShelves };
