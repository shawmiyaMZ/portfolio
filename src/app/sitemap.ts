import type { MetadataRoute } from "next";
import { getAllPosts, getAllProjects } from "@/sanity/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Rendered per request instead of prerendered.
 *
 * As a cached metadata route this froze at build time. The deployed sitemap
 * still carried its build timestamp — `lastmod 2026-08-05T20:03:41Z` — 62
 * hours later, and a project published from the Studio in between never
 * appeared in it, while `/work` (same query, same `project` cache tag) had
 * updated. So the declared one-hour revalidate was not reaching this route,
 * and the only thing that would have refreshed it was a redeploy.
 *
 * That defeats the point of publishing through the CMS: the brief asks for
 * both a sitemap and for publishing to reach the live site without a
 * redeploy, and a stale sitemap is the failure a crawler sees rather than a
 * visitor, so nothing surfaces it. `rss.xml` renders per request already and
 * stayed correct throughout, which is the pattern being matched here.
 *
 * The cost is two GROQ queries per request against a URL crawlers fetch a
 * handful of times a day. Correctness is worth more than that.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([
    getAllPosts(),
    getAllProjects(),
  ]);

  const staticRoutes = ["", "/work", "/journal", "/connect"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    }),
  );

  return [
    ...staticRoutes,
    ...posts.map((p) => ({
      url: `${siteUrl}/journal/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projects.map((p) => ({
      url: `${siteUrl}/work/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
