"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

type Variant = "primary" | "ghost";

/** Maximum pull in px. Six is enough to feel; twelve reads as a gimmick. */
const MAGNET_STRENGTH = 6;

export type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  magnetic?: boolean;
  external?: boolean;
  className?: string;
  /** When provided the button renders as a native <button>, for actions
      that are not navigation — e.g. an error boundary's retry. */
  onClick?: () => void;
};

const base =
  "inline-flex items-center gap-2.5 rounded-sm font-medium no-underline px-[22px] py-[13px]";

export function Button({
  href,
  children,
  variant = "primary",
  magnetic = false,
  external = false,
  className = "",
  onClick,
}: ButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    const node = ref.current;
    if (!node || !magnetic) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = node.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    node.style.setProperty("--magnet-x", `${(dx * MAGNET_STRENGTH).toFixed(2)}px`);
    node.style.setProperty("--magnet-y", `${(dy * MAGNET_STRENGTH).toFixed(2)}px`);
  };

  const onLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--magnet-x", "0px");
    node.style.setProperty("--magnet-y", "0px");
  };

  const style =
    variant === "primary"
      ? { background: "var(--color-madder)", color: "#fff", boxShadow: "var(--shadow-e2)" }
      : {
          background: "transparent",
          color: "var(--ink-primary)",
          boxShadow: "inset 0 0 0 1px var(--line-hairline)",
        };

  const cls = `${base} ${magnetic ? "magnetic" : ""} ${className}`.trim();

  // An action, not a link — used by the error boundary's retry.
  if (onClick) {
    return (
      <button
        type="button"
        ref={ref as React.RefObject<HTMLButtonElement>}
        className={cls}
        style={style}
        data-variant={variant}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={cls}
        style={style}
        data-variant={variant}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href ?? "/"}
      ref={ref as React.RefObject<HTMLAnchorElement>}
      className={cls}
      style={style}
      data-variant={variant}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </Link>
  );
}