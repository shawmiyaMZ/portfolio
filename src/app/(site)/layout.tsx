import type { Metadata, Viewport } from "next";
import { PageTransition } from "@/components/chrome/PageTransition";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { fontVariables } from "@/lib/fonts";
import { getProfile } from "@/sanity/lib/content";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shawmiya Zarook — Software Engineer",
    template: "%s · Shawmiya Zarook",
  },
  description:
    "Software engineer working on AI-powered systems. Projects, case studies, and a journal about learning in public.",
  openGraph: { type: "website", siteName: "Shawmiya Zarook", locale: "en" },
  /* `summary_large_image` so the generated 1200x630 card renders full-width
     rather than as a thumbnail. Without a twitter block X falls back to the
     Open Graph tags but still defaults to the small card. */
  twitter: {
    card: "summary_large_image",
    title: "Shawmiya Zarook — Software Engineer",
    description:
      "Software engineer working on AI-powered systems. Projects, case studies, and a journal about learning in public.",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: siteUrl,
    types: { "application/rss+xml": `${siteUrl}/rss.xml` },
  },
};

export const viewport: Viewport = {
  // Matches --color-porcelain. The browser chrome should belong to the same
  // lit surface as the page.
  themeColor: "#f6f3ee",
  colorScheme: "light",
};

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await getProfile();

  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-sm focus:px-4 focus:py-2"
          style={{ background: "var(--color-graphite)", color: "#fff" }}
        >
          Skip to content
        </a>

        <SiteHeader name={profile?.name} />
        <main id="main" className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter name={profile?.name} linkedinUrl={profile?.linkedinUrl} />
      </body>
    </html>
  );
}
