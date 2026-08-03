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
      <div className="u-wrap py-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <span className="u-caption">
          © {new Date().getFullYear()} {name}
        </span>

        <div className="flex items-center gap-6">
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
      </div>
    </footer>
  );
}
