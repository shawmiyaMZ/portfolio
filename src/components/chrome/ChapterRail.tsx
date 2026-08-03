"use client";

import { useEffect, useState } from "react";
import { CHAPTERS } from "@/lib/chapters";

/**
 * The chapter index.
 *
 * A long scroll without a spine reads as endless rather than authored. This
 * reinterprets the persistent-anchor idea from the reference sites: instead
 * of pinning an identity card, it pins your position in the story.
 *
 * Rendered only on Home, and only where there is a gutter wide enough to
 * hold it without stealing from the measure.
 */
export function ChapterRail() {
  const [active, setActive] = useState<string>(CHAPTERS[0].id);

  // All five chapters render unconditionally — the empty ones show a
  // designed empty state rather than disappearing — so the rail no longer
  // needs to be told which exist.
  const chapters = CHAPTERS.map((c, index) => ({ ...c, number: index + 1 }));

  useEffect(() => {
    const nodes = chapters
      .map((c) => document.getElementById(c.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;

    // One observer for every section, with the set of intersecting ids held
    // ACROSS callbacks.
    //
    // An observer callback only reports entries whose intersection changed.
    // Reading `entries` alone means that when one section leaves and no other
    // enters in the same batch, the active chapter never updates and the rail
    // silently points at a section you scrolled past minutes ago. The set has
    // to persist; the batch only mutates it.
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Topmost in document order, not in callback order.
        const current = chapters.find((c) => visible.has(c.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      className="chapter-rail"
      aria-label="Chapters"
      data-over-dark={
        chapters.find((c) => c.id === active)?.dark ? "true" : "false"
      }
    >
      <ol className="chapter-rail__list">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              className="chapter-rail__link"
              aria-current={active === chapter.id ? "true" : undefined}
            >
              <span className="chapter-rail__tick" aria-hidden="true" />
              <span className="sr-only">{`Chapter ${chapter.number}: `}</span>
              <span aria-hidden="true">
                {String(chapter.number).padStart(2, "0")}
              </span>
              <span className="chapter-rail__label">{chapter.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
