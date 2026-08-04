import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { NotFoundBody } from "@/components/content/NotFoundBody";
import { StudioField } from "@/components/field/StudioField";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Not found · Shawmiya Zarook",
  description: "There is nothing at this address.",
};

export const viewport: Viewport = {
  themeColor: "#f6f3ee",
  colorScheme: "light",
};

/**
 * The 404 for URLs that match no route at all.
 *
 * This app has two root layouts — `(site)` and `(studio)` — so there is no
 * single layout Next can compose a global 404 from, which is exactly the case
 * `global-not-found` exists for. It bypasses rendering entirely, so it has to
 * supply its own document, styles, fonts and chrome.
 *
 * The header and footer are rendered here without their usual props so that a
 * visitor who mistypes a URL sees the same page as one who follows a dead link
 * to a post. They are the only two 404s on the site and they should not look
 * like two different websites. No profile is fetched: the chrome degrades to
 * the site name and its navigation, which is all a lost visitor needs, and a
 * page reached by accident should not wait on the CMS.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh flex flex-col">
        <SiteHeader />
        <main className="flex-1 relative u-top-clear pb-[var(--space-2xl)]">
          <StudioField />
          <NotFoundBody />
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
