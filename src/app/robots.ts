import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The Studio is an authenticated editing surface, not content.
      // `/design-system` is a reference page for building the site, linked
      // from the README so a reader can find it deliberately. It stays
      // reachable, but it is not one of the pages this site wants ranked
      // against its own work and writing.
      disallow: ["/studio", "/api/", "/design-system"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
