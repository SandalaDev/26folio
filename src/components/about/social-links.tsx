import Link from "next/link";

// Placeholder handles — same shape as SiteFooter's list (EPIC-003); real
// profile URLs are an owner-confirmed follow-up. Deliberately no LinkedIn.
// Icons are the owner's monochrome marks from public/icons, tinted to the
// text color via CSS mask (same technique as the timeline's IconGlyph).
const SOCIAL_LINKS = [
  { label: "TikTok", href: "#", icon: "/icons/social/tiktok.svg" },
  { label: "YouTube", href: "#", icon: "/icons/social/youtube.svg" },
  { label: "X", href: "#", icon: "/icons/social/x.svg" },
  { label: "Bluesky", href: "#", icon: "/icons/social/bluesky.svg" },
  { label: "GitHub", href: "#", icon: "/icons/gitHub.svg" },
];

function maskStyle(src: string): React.CSSProperties {
  return {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };
}

/** SocialLinks — (12-ui-element-map.md §3 About #4). */
function SocialLinks() {
  return (
    <nav aria-label="Social links" className="flex flex-wrap gap-4">
      {SOCIAL_LINKS.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-11 items-center justify-center border border-border text-ink/80 transition-colors hover:border-rose hover:text-rose"
        >
          <span aria-hidden="true" className="size-5 bg-current" style={maskStyle(link.icon)} />
          <span className="sr-only">{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export { SocialLinks };
