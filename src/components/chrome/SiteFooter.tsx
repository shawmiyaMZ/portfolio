import Link from "next/link";

/**
 * LinkedIn is the only external personal link the site carries — here, on
 * Home, on About, and in Connect. No email, no phone, no location, no
 * resume, no other socials.
 */
export function SiteFooter({
  name = "Shawmiya Zarook",
  linkedinUrl,
}: {
  name?: string;
  linkedinUrl?: string;
}) {
  return (
    <footer style={{ borderTop: "1px solid var(--line-hairline)" }}>
      {/* Two compositions, not one that wraps.

          A single flex row with `justify-between` collapses on a phone into
          two left-aligned lines with the copyright leading — which puts the
          quietest thing in the page's last, most prominent position and
          leaves the links looking like an afterthought beneath it.

          So below 768 the order is deliberate: links first as a proper row,
          copyright beneath as a footnote, with a hairline between them. From
          768 it becomes the two-ended bar it should be. */}
      <div className="site-footer u-wrap">
        <div className="site-footer__links">
          <Link
            href="/journal"
            className="u-tap link-underline text-sm no-underline"
            style={{ color: "var(--ink-primary)" }}
          >
            Journal
          </Link>
          <Link
            href="/rss.xml"
            className="u-tap link-underline text-sm no-underline"
            style={{ color: "var(--ink-primary)" }}
          >
            RSS
          </Link>
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="u-tap link-underline text-sm no-underline"
              style={{ color: "var(--ink-link)" }}
            >
              LinkedIn
            </a>
          )}
        </div>

        <span className="u-caption site-footer__mark">
          © {new Date().getFullYear()} {name}
        </span>
      </div>
    </footer>
  );
}
