"use client";

import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/lib/headings";

/**
 * Reading progress, as a hairline.
 *
 * Driven by CSS scroll-driven animation where supported, so the common case
 * costs no JavaScript at all. The rAF fallback below only runs where it must.
 */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Where the browser supports scroll-driven animations, CSS already owns
    // this bar and JavaScript stays out of it entirely.
    const hasNative =
      typeof CSS !== "undefined" &&
      CSS.supports?.("animation-timeline: scroll()");
    if (hasNative) return;

    // Fallback path only. The transform is written straight to the node
    // rather than held in state: a scroll-linked bar updating through React
    // would re-render on every frame to change one number.
    node.dataset.native = "false";

    let frame = 0;
    const update = () => {
      frame = 0;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      node.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Rendered as native on the server so there is no hydration mismatch; the
  // effect downgrades it only if the browser cannot drive it from CSS.
  return (
    <div ref={ref} className="reading-progress" role="presentation" data-native="true" />
  );
}

/**
 * Sticky table of contents, desktop only.
 *
 * The active heading is tracked with one IntersectionObserver over all
 * headings — not a scroll handler recomputing offsets on every frame.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(
    headings[0]?.id ?? null,
  );

  useEffect(() => {
    if (headings.length === 0) return;

    const nodes = headings
      .map((h) => document.getElementById(h.id))
      .filter((n): n is HTMLElement => Boolean(n));

    // The intersecting set must persist across callbacks — an observer only
    // reports entries that CHANGED, so reading the batch alone leaves the
    // active heading stale whenever one leaves without another entering.
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = headings.find((h) => visible.has(h.id));
        if (current) setActive(current.id);
      },
      // A band across the upper third: the heading a reader is "at" is the
      // one just above their eyeline, not the one at the very top.
      { rootMargin: "-88px 0px -66% 0px", threshold: 0 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="grid gap-3">
      <span className="u-eyebrow">On this page</span>
      <ul className="list-none m-0 p-0 grid gap-2.5">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? "0.85rem" : 0 }}>
            <a
              href={`#${h.id}`}
              className="text-[13.5px] leading-snug no-underline transition-colors block"
              style={{
                color:
                  active === h.id
                    ? "var(--ink-link)"
                    : "var(--ink-secondary)",
                fontWeight: active === h.id ? 500 : 400,
              }}
              aria-current={active === h.id ? "location" : undefined}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
