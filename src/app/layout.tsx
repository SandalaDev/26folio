import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // Placeholder metadata — real SEO/OG handled in EPIC-010.
  title: "sandala.dev",
  description: "Portfolio of Abe Sandala — strategic engineering partner.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // No fonts here: design system §4 mandates self-hosted faces only (no
  // next/font/google). Fonts are wired in EPIC-002.
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
