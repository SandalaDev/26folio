import Link from "next/link";

/**
 * WayPager - museum wayfinding at the page foot (EPIC-016/TASK-064).
 * Previous/next between the two About exhibits: "Who I Am" lives on /about,
 * "The Way I Am" is this page, marked as the current stop. Server component;
 * the hover language is plain CSS.
 */
function WayPager() {
  return (
    <nav
      aria-label="About exhibits"
      className="grid border-t border-border sm:grid-cols-2"
    >
      <Link
        href="/about"
        className="group flex flex-col gap-2 border-b border-border p-8 transition-colors hover:bg-surface sm:border-b-0 sm:border-r md:p-10"
      >
        <span className="eyebrow text-muted">Previous</span>
        <span className="font-display text-2xl font-semibold text-ink transition-colors group-hover:text-rose">
          Who I Am
        </span>
        <span className="text-sm text-muted">
          The full story, back on the About page.
        </span>
      </Link>
      <div aria-current="page" className="flex flex-col gap-2 p-8 md:p-10">
        <span className="eyebrow text-muted">You are here</span>
        <span className="font-display text-2xl font-semibold text-soft">
          The Way I Am
        </span>
        <span className="text-sm text-muted">The person behind the projects.</span>
      </div>
    </nav>
  );
}

export { WayPager };
