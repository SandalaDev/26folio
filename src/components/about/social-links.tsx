import Link from "next/link";

// Placeholder handles — same shape as SiteFooter's list (EPIC-003); real
// profile URLs are an owner-confirmed follow-up. Deliberately no LinkedIn.
const SOCIAL_LINKS = [
  { label: "TikTok", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "X", href: "#" },
  { label: "Bluesky", href: "#" },
  { label: "GitHub", href: "#" },
];

/** SocialLinks — (12-ui-element-map.md §3 About #4). */
function SocialLinks() {
  return (
    <nav aria-label="Social links" className="flex flex-wrap gap-6">
      {SOCIAL_LINKS.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow text-ink/80 transition-colors hover:text-rose"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export { SocialLinks };
