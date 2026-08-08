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
  /**
   * Whether this read is allowed to fail quietly.
   *
   * Off by default, because for almost every read on this site an empty
   * result is a lie: "no projects" and "the content backend is unreachable"
   * look identical to a visitor, and the second one should not be presented
   * as the first. Set it only where absence is a real state the design
   * already handles — previous/next links on the first and last post.
   */
  optional?: boolean;
};

/**
 * The single entry point for reading content.
 *
 * There are two different reasons a read can produce nothing, and they are
 * deliberately not treated the same:
 *
 * - **Sanity is not configured.** A fresh clone has no project yet, so the
 *   fallback (seed content) is returned and the site renders. Not an error.
 * - **The query failed.** Sanity is configured and unreachable, or the query
 *   is wrong. This throws, so the route's `error.tsx` renders its designed
 *   500 with a retry.
 *
 * It used to swallow the second case into the first. The fallback for a
 * configured site is `null`/`[]`, so an outage rendered a portfolio with no
 * projects and a journal with no posts — a silent, plausible-looking lie,
 * and the one runtime failure this site is most likely to hit. The designed
 * error page was unreachable for the exact case it was built for.
 */
export async function sanityFetch<T>(
  query: string,
  {
    params = {},
    fallback,
    tags = [],
    revalidate = 3600,
    optional = false,
  }: { params?: QueryParams; fallback: T } & FetchOptions,
): Promise<T> {
  if (!isSanityConfigured) return fallback;

  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate, tags },
    });
  } catch (error) {
    // Logged either way, so a quiet degrade is still visible in the logs.
    console.error(`[sanity] query failed: ${query.slice(0, 80)}…`, error);
    if (optional) return fallback;
    throw error;
  }
}
