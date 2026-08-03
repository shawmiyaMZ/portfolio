import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  // CDN off: this site is statically generated and revalidated by webhook,
  // so a stale CDN read would show old content after a publish for no gain.
  useCdn: false,
  perspective: "published",
});

type FetchOptions = {
  /** Cache tags, so the publish webhook can invalidate precisely. */
  tags?: string[];
  /**
   * Seconds. Only a safety net — the webhook is the real invalidation
   * path. An hour keeps the site self-healing if a webhook is ever missed.
   */
  revalidate?: number;
};

/**
 * The single entry point for reading content.
 *
 * When Sanity is not configured yet it returns the supplied fallback rather
 * than throwing, so a fresh clone builds and renders empty states instead of
 * failing. Every caller passes a fallback that is valid for its own shape.
 */
export async function sanityFetch<T>(
  query: string,
  {
    params = {},
    fallback,
    tags = [],
    revalidate = 3600,
  }: { params?: QueryParams; fallback: T } & FetchOptions,
): Promise<T> {
  if (!isSanityConfigured) return fallback;

  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate, tags },
    });
  } catch (error) {
    // A content backend being briefly unreachable should degrade the page,
    // not take down the whole site. Logged so it is never silent.
    console.error(`[sanity] query failed: ${query.slice(0, 80)}…`, error);
    return fallback;
  }
}
