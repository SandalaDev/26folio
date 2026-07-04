import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Cursor } from "@/components/motion/cursor";
import { FlashlightCursor } from "@/components/site/flashlight-cursor";

// Global chrome for the public site route group (EPIC-003 TASK-012).
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* §7 #2 custom cursor — self-gates to pointer-fine, motion-allowed clients. */}
      <Cursor />
      {/* §7 ambient flashlight — global fixed overlay (EPIC-012 TASK-049),
          z-0 beneath the z-[1] main content, like the preview's .flashlight. */}
      <FlashlightCursor />
      <SiteHeader />
      <main className="relative z-[1]">{children}</main>
      <SiteFooter />
    </>
  );
}
