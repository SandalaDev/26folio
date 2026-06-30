/**
 * Minimum project shape for the home page's Featured Work block. EPIC-005 owns
 * the real `/work` data model and case-study pages — this extends the array,
 * it does not re-shape it.
 */
export interface Project {
  slug: string;
  title: string;
  description: string;
  href: string;
}

export const projects: Project[] = [
  {
    slug: "placeholder-one",
    title: "Project one",
    description: "A short description of the problem and the outcome.",
    href: "/work/placeholder-one",
  },
  {
    slug: "placeholder-two",
    title: "Project two",
    description: "A short description of the problem and the outcome.",
    href: "/work/placeholder-two",
  },
];
