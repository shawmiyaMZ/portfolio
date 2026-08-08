import { Button } from "@/components/ui/Button";

/**
 * The 500 copy and layout.
 *
 * A designed fallback for the rare case a page throws during render — the
 * browser-safe sibling of `NotFoundBody`. Same vocabulary, same hierarchy:
 * an eyebrow that names the state, a short headline that does not pretend,
 * one honest sentence, and actions that get the reader moving again.
 *
 * `onRetry` is the error boundary's recovery hook (`unstable_retry`), which
 * re-fetches and re-renders the segment. It is optional so the body can also
 * be rendered from contexts without a retry — but the default error screen
 * always has one.
 */
export function ErrorBody({
  onRetry,
}: {
  onRetry?: () => void;
}) {
  return (
    <div className="u-wrap relative z-10">
      <span className="u-eyebrow block mb-4" style={{ color: "var(--ink-technical)" }}>
        Something went wrong
      </span>

      <h1 className="u-h1 max-w-(--measure-title)">
        This page hit a snag
      </h1>

      <p
        className="mt-6 text-(length:--text-prose)/[1.7]"
        style={{ maxWidth: "var(--measure-default)", color: "var(--ink-secondary)" }}
      >
        The rest of the site is still standing. This is usually a transient
        blip. Retrying is safe and often enough; if it keeps happening, it
        would help to hear about it.
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        {onRetry && (
          <Button href="/" magnetic onClick={onRetry}>
            Try again
          </Button>
        )}
        <Button href="/" variant={onRetry ? "ghost" : "primary"} magnetic={!onRetry}>
          Back to the start
        </Button>
      </div>
    </div>
  );
}
