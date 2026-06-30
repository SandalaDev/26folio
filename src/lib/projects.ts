/**
 * Minimum project shape for the home page's Featured Work block (EPIC-003)
 * and the full `/work` grid + detail pages (EPIC-005). `problem`/`outcome`
 * are additive — `FeaturedWork`'s existing `description` usage is unaffected.
 * Real entries are not invented here; Abe supplies the actual project list
 * (11-content-strategy.md §5 content inventory) — these are clearly fictional
 * placeholders, not unlabeled real client work.
 */
export interface Project {
  slug: string;
  title: string;
  description: string;
  problem: string;
  outcome: string;
  href: string;
}

export const projects: Project[] = [
  {
    slug: "placeholder-one",
    title: "Project one",
    description: "A short description of the problem and the outcome.",
    problem: "Placeholder: the problem this project solved.",
    outcome: "Placeholder: the outcome it delivered.",
    href: "/work/placeholder-one",
  },
  {
    slug: "placeholder-two",
    title: "Project two",
    description: "A short description of the problem and the outcome.",
    problem: "Placeholder: the problem this project solved.",
    outcome: "Placeholder: the outcome it delivered.",
    href: "/work/placeholder-two",
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
