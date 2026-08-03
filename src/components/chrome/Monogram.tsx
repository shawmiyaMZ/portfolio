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
    /*
     * The accessible name has to contain the visible text.
     *
     * With `aria-label="Shawmiya Zarook — home"` over a mark reading "SZ",
     * the two disagreed: a screen-reader user heard one thing, and a voice
     * control user saying "click SZ" — the only label they can see — matched
     * nothing. Lighthouse flags this as label-content-name-mismatch.
     *
     * Building the name from the visible initials plus screen-reader-only
     * text keeps both audiences pointing at the same control, and the chip
     * stays decorative because the text inside it is now the real label.
     */
    <Link href="/" className="monogram">
      <span className="monogram__chip">
        <span className="monogram__mark">{initials}</span>
      </span>
      <span className="sr-only">{`, ${name} — home`}</span>
    </Link>
  );
}
