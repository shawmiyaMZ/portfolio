"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { NAV_CHAPTERS } from "@/lib/chapters";

/**
 * The phone's navigation — a control, not a compressed desktop bar.
 *
 * Four inline links need 265px beside a 40px monogram, inside a 342px
 * content column at 390px. That leaves roughly 37px of slack for gaps,
 * padding and breathing room, which is why the inline slab read as crowded
 * and edge-bound on a phone: it was not composed for the space, it was the
 * desktop bar surviving in it.
 *
 * So below 640 the links move into a panel and the header keeps two small
 * objects with real air between them. The panel is the same porcelain slab
 * as everything else in the chrome — frosted, soft-cornered, lit from the
 * upper left — so this reads as the same object family opening, rather than
 * as a mobile menu bolted on.
 *
 * This is the site's first piece of interactive machinery, and it is kept
 * deliberately thin: open state, Escape, outside click, and focus returned
 * to the button on close. No scroll lock, no focus trap, no transition
 * choreography — the panel is four links, and treating it like a modal
 * would be machinery for its own sake.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      // Escape must put focus back where it started, or a keyboard user is
      // dropped at the top of the document with no idea what happened.
      buttonRef.current?.focus();
    };

    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    // `pointerdown` rather than `click`, so the panel closes before the
    // underlying element reacts to the same gesture.
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div className="nav-mobile" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="nav-mobile__button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-mobile__mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {/* Rendered only when open. Kept out of the DOM otherwise so its links
          are never reachable by tab while invisible. */}
      {open && (
        <nav
          id={panelId}
          className="nav-mobile__panel"
          aria-label="Primary"
        >
          <ul className="nav-mobile__list">
            {NAV_CHAPTERS.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`/#${chapter.id}`}
                  className="nav-mobile__link"
                  onClick={() => setOpen(false)}
                >
                  {chapter.nav}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
