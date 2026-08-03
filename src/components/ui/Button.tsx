"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

type Variant = "primary" | "ghost";

/** Maximum pull in px. Six is enough to feel; twelve reads as a gimmick. */
const MAGNET_STRENGTH = 6;

export type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  magnetic?: boolean;
  external?: boolean;
  className?: string;
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
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
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

  const props = {
    ref,
    className: `${base} ${magnetic ? "magnetic" : ""} ${className}`.trim(),
    style,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    "data-variant": variant,
  };

  if (external) {
    return (
      <a {...props} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link {...props} href={href}>
      {children}
    </Link>
  );
}
