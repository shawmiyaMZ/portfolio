"use client";

import { useEffect } from "react";
import { ErrorBody } from "@/components/content/ErrorBody";
import { StudioField } from "@/components/field/StudioField";

/**
 * The designed 500 for any page in the (site) group.
 *
 * Rendered in place of a page when its render throws. It inherits the (site)
 * layout — header, footer and fonts — so the fallback looks like the same
 * website, not a stock abuse page. `unstable_retry` re-fetches and re-renders
 * the failed segment, which fixes most transient errors with one click.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // The digest ties this to the server log entry for the same failure.
    console.error(`[page error] ${error.digest ?? ""}`, error.message);
  }, [error]);

  return (
    <section
      data-chapter="hero"
      className="relative u-top-clear pb-[var(--space-2xl)]"
    >
      <StudioField />
      <ErrorBody onRetry={unstable_retry} />
    </section>
  );
}