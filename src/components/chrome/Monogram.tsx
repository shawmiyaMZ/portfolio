import Link from "next/link";

/**
 * The signature mark.
 *
 * Not a logo, not a badge, not an app icon. It is a small sculpted object
 * made of the same clay as everything else on this site: a soft-cornered
 * porcelain surface, one contact shadow falling the same direction as every
 * other shadow, and initials set in the same display face as the headlines.
 *
 * The restraint is the point. It has no border, no fill contrast, no hover
 * lift — a mark that announces itself competes with the name in the hero,
 * and the name in the hero is the thing that should be remembered.
 */
export function Monogram({
  name = "Shawmiya Zarook",
  initials = "SZ",
}: {
  name?: string;
  initials?: string;
}) {
  return (
    <Link href="/" className="monogram" aria-label={`${name} — home`}>
      <span className="monogram__chip" aria-hidden="true">
        <span className="monogram__mark">{initials}</span>
      </span>
    </Link>
  );
}
