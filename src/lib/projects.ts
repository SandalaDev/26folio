/**
 * Project shape for the home page's Featured Work block (EPIC-003 → EPIC-010)
 * and the full `/work` grid + detail pages (EPIC-005).
 *
 * EPIC-010: the first two entries are REAL projects (owner brief, 2026-07-02)
 * with owner-supplied images. Their `tagline`/`description`/`problem`/`outcome`
 * strings are neutral DRAFTS awaiting owner confirmation — deliberately free of
 * invented outcomes, metrics, or claims (11-content-strategy.md §5). The
 * remaining entries are clearly fictional placeholders until the owner's full
 * project list lands.
 */
export interface Project {
  slug: string;
  title: string;
  /** Short category descriptor shown on cards. */
  tagline?: string;
  description: string;
  problem: string;
  outcome: string;
  href: string;
  /** Card background image (public path). Cards without one fall back to the
      gradient treatment. */
  image?: string;
}

export const projects: Project[] = [
  {
    slug: "provision-finance",
    title: "Provision Finance",
    tagline: "Financial services",
    description: "A build for a financial services company.",
    problem:
      "Draft: the owner supplies the real brief for this engagement; nothing is invented here.",
    outcome:
      "Draft: the owner supplies the real result for this engagement; nothing is invented here.",
    href: "/work/provision-finance",
    image: "/images/projects/provision.png",
  },
  {
    slug: "ok-pharmacy",
    title: "OK Pharmacy",
    tagline: "Pharmacy & retail",
    description: "A build for a retail pharmacy.",
    problem:
      "Draft: the owner supplies the real brief for this engagement; nothing is invented here.",
    outcome:
      "Draft: the owner supplies the real result for this engagement; nothing is invented here.",
    href: "/work/ok-pharmacy",
    image: "/images/projects/ok-pharmacy.jpg",
  },
  {
    slug: "placeholder-three",
    title: "Project three",
    description: "A short description of the problem and the outcome.",
    problem: "Placeholder: the problem this project solved.",
    outcome: "Placeholder: the outcome it delivered.",
    href: "/work/placeholder-three",
  },
  {
    slug: "placeholder-four",
    title: "Project four",
    description: "A short description of the problem and the outcome.",
    problem: "Placeholder: the problem this project solved.",
    outcome: "Placeholder: the outcome it delivered.",
    href: "/work/placeholder-four",
  },
];
