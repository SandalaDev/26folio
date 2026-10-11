import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // Placeholder metadata — real SEO/OG handled in EPIC-010.
  title: "sandala.dev",
  description: "Portfolio of Abe Sandala — strategic engineering partner.",
  icons: { icon: "/images/logo/favicon.svg" },
  /**
   * EPIC-026 TASK-099: the project pages are the first on the site to declare
   * OpenGraph images, and their `url` values are site-relative. Without a
   * `metadataBase` Next resolves them against `http://localhost:3000` and warns at
   * build time, which would ship share cards pointing at localhost. Overridable so
   * preview deployments can set their own origin.
   */
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://sandala.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // No fonts here: design system §4 mandates self-hosted faces only (no
  // next/font/google). Fonts are wired in EPIC-002.
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
