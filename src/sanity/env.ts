/**
 * Sanity environment.
 *
 * These are deliberately NOT asserted at module load. A fresh clone of this
 * repo has no Sanity project yet, and a build that explodes before the user
 * has finished setup is a bad first five minutes. Instead the site treats an
 * unconfigured Sanity as "no content yet": queries short-circuit to empty
 * results and pages render their empty states. `isSanityConfigured` is the
 * single switch that decides which world we are in.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-01";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const isSanityConfigured = projectId.length > 0;

/** Server-only. Grants draft access; never expose to the client. */
export const readToken = process.env.SANITY_API_READ_TOKEN ?? "";

/** Shared secret for the publish webhook. Server-only. */
export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET ?? "";
