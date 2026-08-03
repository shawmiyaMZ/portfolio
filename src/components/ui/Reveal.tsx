"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * One IntersectionObserver for the entire page, shared by every reveal.
 *
 * The naive version creates an observer per component, which on a page with
 * thirty reveals means thirty observers all doing the same intersection maths
 * on every scroll frame. This module keeps exactly one and hands out
 * subscriptions.
 */
let observer: IntersectionObserver | null = null;

function ensureObserver() {
  if (observer || typeof window === "undefined") return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.revealed = "true";
        observer?.unobserve(entry.target);
      }
    },
    // Fire slightly before the element is fully on screen, so the motion has
    // finished by the time it reaches comfortable reading position.
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
  );

  return observer;
}

export type RevealProps = {
  children: ReactNode;
  /** Position within its group. Staggers by 60ms, capped at 5. */
  index?: number;
  /**
   * How much the thing weighs. Heavier blocks travel further and settle
   * slower — uniform motion across every size is what makes a staggered
   * sequence read as mechanical.
   */
  weight?: "light" | "default" | "heavy";
  as?: ElementType;
  className?: string;
};

export function Reveal({
  children,
  index = 0,
  weight = "default",
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced motion never subscribes at all — the CSS has already made the
    // element visible, and observing it would be pure overhead.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.dataset.revealed = "true";
      return;
    }

    const io = ensureObserver();
    io?.observe(node);

    return () => {
      io?.unobserve(node);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal${className ? ` ${className}` : ""}`}
      data-weight={weight === "default" ? undefined : weight}
      style={{ transitionDelay: `${Math.min(index, 4) * 60}ms` }}
    >
      {children}
    </Tag>
  );
}
