import type { Metadata } from "next";

import { WayProgress, WayToc } from "@/components/the-way/way-nav";
import { WayHero } from "@/components/the-way/way-hero";
import { CuriosityTable } from "@/components/the-way/curiosity-table";
import { PracticeLine } from "@/components/the-way/practice-line";
import { WishlistShelves } from "@/components/the-way/wishlist-shelves";
import { PrinciplesGallery } from "@/components/the-way/principles-gallery";
import { Bookshelf } from "@/components/the-way/bookshelf";
import { WayCta } from "@/components/the-way/way-cta";
import { WayPager } from "@/components/the-way/way-pager";

export const metadata: Metadata = {
  title: "The Way I Am | sandala.dev",
  description:
    "The person behind the projects: the curiosities, collections and principles that shape how Abe Sandala builds software.",
};

/**
 * /about/the-way-i-am (EPIC-016/TASK-064, recomposed in EPIC-018) - "The
 * Way I Am" as a first-class page. Composed as a museum walk: every section
 * is its own exhibit with its own layout family, threaded together by the
 * progress hairline and the floating table of contents. EPIC-018 removed
 * the Hobbies exhibit and gave the walk its real artifacts (portrait,
 * covers, wishlists) per the owner's 2026-07-17 brief. Walk
 * order per the owner's 2026-07-21 brief: intro, principles, sources of
 * inspiration, curiosity, creative pursuits, collections. The Music
 * exhibit was removed at the owner's direction on 2026-10-03.
 */
export default async function TheWayIAmPage() {
  return (
    <>
      <WayProgress />
      <WayToc />
      <WayHero />
      <PrinciplesGallery />
      <Bookshelf />
      <CuriosityTable />
      <PracticeLine />
      <WishlistShelves />
      <WayCta />
      <WayPager />
    </>
  );
}
