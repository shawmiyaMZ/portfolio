"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/chrome/MobileNav";
import { Monogram } from "@/components/chrome/Monogram";
import { NAV_CHAPTERS, scrollToChapter } from "@/lib/chapters";

/**
 * Floating chrome — two small objects resting above the page, not a bar
 * across it.
 *
 * A full-width header is a structural claim: it says the page is a website
 * with a top edge. Two compact slabs floating in whitespace say the page is
 * a document, and these are the controls that happen to sit over it. The
 * story keeps the full width; the navigation only takes what it needs.
 *
 * No sticky/unsticky state and no hide-on-scroll. Both add machinery and
 * motion to something whose entire job is to stay calm and stay put.
 *
 * Every item points at a chapter (`/#work`), never a page — from anywhere on
 * the site, so it always returns you to the narrative. The full Work,
 * Journal and About pages are reached from inside each chapter instead.
 */
export function SiteHeader({ name }: { name?: string }) {
  const pathname = usePathname();
  const onHome = pathname === "/";

  return (
    <div className="site-chrome">
      <div className="site-chrome__inner">
        <Monogram name={name} />

        <nav className="nav-slab" aria-label="Primary">
          <ul className="nav-slab__list">
            {NAV_CHAPTERS.map((chapter) => (
              <li key={chapter.id}>
                {/* On home these must be bare fragments. Next's <Link>
                    treats `/#about` as a navigation to `/`, runs its
                    scroll-to-top and discards the fragment — the hash
                    lands in the URL and the page stays at the top. A
                    plain anchor lets the browser scroll natively, which
                    is what the chapter rail has always done. Off home,
                    <Link> keeps the client-side transition. */}
                {onHome ? (
                  <a
                    href={`#${chapter.id}`}
                    className="nav-slab__link"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToChapter(chapter.id);
                    }}
                  >
                    {chapter.nav}
                  </a>
                ) : (
                  <Link href={`/#${chapter.id}`} className="nav-slab__link">
                    {chapter.nav}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Holds the third grid column, which balances the slab so it centres
            against the content column rather than against the space left over
            by the monogram. Below 640 the slab is hidden and this column
            carries the menu button instead — so the same three columns serve
            both compositions. */}
        <MobileNav />
      </div>
    </div>
  );
}
