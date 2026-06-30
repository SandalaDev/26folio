"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

/** Inline menu glyph — avoids pulling in an icon library for one icon. */
function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

/**
 * MobileNav — shadcn `Sheet` drawer for the below-desktop-breakpoint nav
 * (12-ui-element-map.md §2). Closes on link click; Radix `Dialog` handles
 * `Escape` + focus trap.
 */
function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open navigation menu"
        className="inline-flex size-10 items-center justify-center text-ink md:hidden"
      >
        <MenuIcon className="size-6" />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <SheetClose key={link.href} asChild>
              <Link
                href={link.href}
                className={cn(
                  "eyebrow text-ink/80 transition-colors hover:text-rose",
                  pathname === link.href && "text-rose",
                )}
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export { MobileNav, NAV_LINKS };
