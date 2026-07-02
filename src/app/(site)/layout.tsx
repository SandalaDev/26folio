import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Cursor } from "@/components/motion/cursor";

// Global chrome for the public site route group (EPIC-003 TASK-012).
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* §7 #2 custom cursor — self-gates to pointer-fine, motion-allowed clients. */}
      <Cursor />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
