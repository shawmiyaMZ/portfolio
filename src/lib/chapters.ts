/**
 * The chapters of the home page, in order.
 *
 * Single source of truth: the header nav, the chapter rail, and the section
 * headings all read from here, so a number or an id can never drift out of
 * sync with the thing it points at.
 *
 * Five chapters, not eight. Philosophy folded into the hero — a belief
 * statement reads as conviction when it sits under your name, and as filler
 * when it needs a section of its own. Journey and Skills live on the About
 * page, where someone who wants that detail will go looking for it.
 */
export type Chapter = {
  id: string;
  /** Shown in the rail. */
  label: string;
  /** Shown in the header nav. Absent means the chapter is not in the nav. */
  nav?: string;
  /** Rendered on a Graphite band — the rail must invert over these. */
  dark?: boolean;
};

export const CHAPTERS: Chapter[] = [
  { id: "hero", label: "Introduction" },
  { id: "work", label: "Selected work", nav: "Work" },
  { id: "journal", label: "Journal", nav: "Journal" },
  { id: "about", label: "About", nav: "About" },
  { id: "connect", label: "Connect", nav: "Connect", dark: true },
];

/** The four that appear in the header. */
export const NAV_CHAPTERS = CHAPTERS.filter((c) => c.nav);

/**
 * Scroll to a chapter without going through the router.
 *
 * Next's App Router resets scroll on history changes, which swallows hash
 * navigation: measured on the home page, setting `location.hash` left
 * scrollY at 0 while the target sat at 3411 — `scrollIntoView` reached it
 * fine. A plain anchor cannot win that race, so chapter links move the page
 * themselves and write the hash afterwards.
 *
 * `scrollIntoView` inherits `scroll-behavior: smooth` and the 96px
 * `scroll-padding-top` from the root, so this stays consistent with the
 * chapter rail and still flattens under prefers-reduced-motion.
 */
export function scrollToChapter(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ block: "start" });
  history.replaceState(null, "", `#${id}`);
}
