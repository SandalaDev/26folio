// Layout for the public site route group. The global header/footer (EPIC-002/003)
// will live here; for now it just provides the <main> landmark every page shares.
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main>{children}</main>;
}
