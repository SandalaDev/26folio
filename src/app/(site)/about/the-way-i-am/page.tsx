import type { Metadata } from "next";

import { WayProgress, WayToc } from "@/components/the-way/way-nav";
import { WayHero } from "@/components/the-way/way-hero";
import { CuriosityTable } from "@/components/the-way/curiosity-table";
import { HobbiesWall } from "@/components/the-way/hobbies-wall";
import { MusicHall } from "@/components/the-way/music-hall";
import { PracticeLine } from "@/components/the-way/practice-line";
import { CollectionShelves } from "@/components/the-way/collection-shelves";
import { PrinciplesGallery } from "@/components/the-way/principles-gallery";
import { Bookshelf } from "@/components/the-way/bookshelf";
import { WayCta } from "@/components/the-way/way-cta";
import { WayPager } from "@/components/the-way/way-pager";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "The Way I Am | sandala.dev",
  description:
    "The person behind the projects: the curiosities, music, collections and principles that shape how Abe Sandala builds software.",
};

/**
 * /about/the-way-i-am (EPIC-016/TASK-064) - "The Way I Am" promoted from an
 * about-page modal to a first-class page. Composed as a museum walk: every
 * section is its own exhibit with its own layout family, threaded together
 * by the progress hairline and the floating table of contents. Section
 * order and content follow the owner's blueprint
 * (planning/content/page-copy/TheWay.md).
 */
export default function TheWayIAmPage() {
  return (
    <>
      <WayProgress />
      <WayToc />
      <WayHero />
      <CuriosityTable />
      <HobbiesWall />
      <MusicHall />
      <PracticeLine />
      <CollectionShelves />
      <PrinciplesGallery />
      <Bookshelf />
      <WayCta />
      <WayPager />
    </>
  );
}
