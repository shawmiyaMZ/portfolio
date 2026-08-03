import Link from "next/link";
import type { ReactNode } from "react";

/** Section header: eyebrow, title, optional lede. Used on every page. */
export function SectionHead({
  eyebrow,
  title,
  lede,
  action,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 mb-[var(--space-md)]">
      <div className="grid gap-4">
        {/* The chapter's accent, inherited from the section's data-chapter.
            Falls back to the ordinary eyebrow ink outside a chapter, so this
            component still works anywhere. */}
        {eyebrow && (
          <span
            className="u-eyebrow section-head__eyebrow"
            style={{ color: "var(--chapter-accent-ink, var(--ink-secondary))" }}
          >
            {eyebrow}
          </span>
        )}
        <h2 className="u-h2 max-w-[20ch]">{title}</h2>
        {lede && (
          <p
            className="text-(length:--text-prose)/[1.7]"
            style={{
              maxWidth: "var(--measure-default)",
              color: "var(--ink-secondary)",
            }}
          >
            {lede}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Tag({
  children,
  tone = "cobalt",
}: {
  children: ReactNode;
  tone?: "cobalt" | "sage";
}) {
  const styles =
    tone === "sage"
      ? { color: "#4E5647", background: "rgba(139,150,131,.20)" }
      : { color: "var(--color-cobalt)", background: "rgba(62,92,118,.09)" };

  return (
    <span
      className="text-[12.5px] tracking-[.03em] px-3 py-1.5 rounded-full font-medium whitespace-nowrap"
      style={styles}
    >
      {children}
    </span>
  );
}

/**
 * The empty state.
 *
 * Shown when Sanity has no content yet — which on a fresh clone is the
 * normal case, not an error. It says what to do next instead of looking
 * broken.
 */
export function EmptyState({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div
      className="rounded-md px-7 py-9 grid gap-3"
      style={{
        background: "var(--surface-raised)",
        boxShadow: "var(--shadow-e1)",
        maxWidth: "var(--measure-default)",
      }}
    >
      <h3 className="u-h3">{title}</h3>
      <p style={{ color: "var(--ink-secondary)" }}>{body}</p>
      {href && cta && (
        <Link
          href={href}
          className="link-underline font-medium no-underline justify-self-start mt-1"
          style={{ color: "var(--ink-link)" }}
        >
          {cta}
        </Link>
      )}
    </div>
  );
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
