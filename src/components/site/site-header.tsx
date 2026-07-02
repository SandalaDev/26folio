"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MobileNav, NAV_LINKS } from "@/components/site/mobile-nav";
import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * SiteHeader — sticky global nav (12-ui-element-map.md §2). EPIC-010: fully
 * transparent — no border, background, or blur; just the logo and nav text over
 * the page. Hides on scroll-down, shows on scroll-up (Framer), disabled entirely
 * under `prefers-reduced-motion` (header simply stays put).
 */
function SiteHeader() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 96);
  });

  return (
    <motion.header
      animate={shouldReduceMotion ? undefined : { y: hidden ? "-100%" : "0%" }}
      transition={{ duration: DURATION.component, ease: EASE_OUT }}
      className="sticky top-0 z-40 bg-transparent"
    >
      <div className="flex h-16 items-center justify-between px-5 md:px-10 lg:px-16 xl:px-24">
        <Link href="/" className="font-display text-lg font-bold text-ink">
          Sandala
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {NAV_LINKS.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild data-active={pathname === link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <MobileNav />
      </div>
    </motion.header>
  );
}

export { SiteHeader };
