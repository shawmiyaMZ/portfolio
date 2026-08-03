import Link from "next/link";

/**
 * The "go deeper" affordance.
 *
 * Home chapters carry a condensed version of what their dedicated page holds
 * in full; this is how a reader crosses over. Deliberately distinct from the
 * header nav, which only skips between chapters — two intents should never
 * look like the same control.
 */
export function ChapterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="u-tap link-underline font-medium no-underline whitespace-nowrap"
      style={{ color: "var(--ink-link)" }}
    >
      {children}
    </Link>
  );
}
