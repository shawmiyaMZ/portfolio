"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Maximum displacement in px. Four is felt rather than seen. */
const RANGE = 4;

/**
 * Cursor parallax — the only JavaScript in the avatar.
 *
 * Deliberately minimal: one listener on the hero section, coalesced to one
 * rAF per frame, writing two custom properties. It never reads layout inside
 * the frame callback (the element's rect is measured once and on resize), so
 * it cannot cause a forced reflow, and it writes to a wrapper that owns no
 * other transform.
 *
 * It opts itself out entirely on coarse pointers and under reduced motion —
 * on a phone there is no cursor to follow, so the listener is never attached
 * and the cost is zero.
 */
export function AvatarParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    // The hero is the tracking area — the figure itself is too small a
    // target for the movement to feel connected to the pointer.
    const area = node.closest("section") ?? document.body;

    let frame = 0;
    let px = 0;
    let py = 0;
    // Measured outside the frame callback so the handler never reads layout.
    let rect = area.getBoundingClientRect();

    const apply = () => {
      frame = 0;
      node.style.setProperty("--parallax-x", `${px.toFixed(2)}px`);
      node.style.setProperty("--parallax-y", `${py.toFixed(2)}px`);
    };

    const onMove = (event: PointerEvent) => {
      const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      px = Math.max(-1, Math.min(1, dx)) * RANGE;
      py = Math.max(-1, Math.min(1, dy)) * RANGE * 0.6;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      px = 0;
      py = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onResize = () => {
      rect = area.getBoundingClientRect();
    };

    area.addEventListener("pointermove", onMove, { passive: true });
    area.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onResize, { passive: true });

    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="avatar-stage__parallax">
      {children}
    </div>
  );
}
