import * as React from "react";
import type { ReactNode } from "react";

/**
 * The page transition boundary.
 *
 * `ViewTransition` is React's binding to the browser's View Transitions API.
 * It ships in the canary React that Next vendors for the App Router, and
 * `experimental.viewTransition` in next.config.ts aliases `react` to that
 * build — so the component exists at build time even though the installed
 * `react` package does not declare it. That is also why it is reached through
 * a cast rather than a named import: the published types have not caught up.
 *
 * Wrapping here rather than per-page means every route change animates, and
 * the styling stays where the rest of the motion lives, in motion.css.
 *
 * Without browser support nothing is added to the page and navigation simply
 * happens instantly, which is the fallback the brief asks for. Reduced motion
 * is handled globally at the bottom of motion.css.
 */
const ViewTransition = (
  React as unknown as {
    ViewTransition?: React.ComponentType<{ children: ReactNode }>;
  }
).ViewTransition;

export function PageTransition({ children }: { children: ReactNode }) {
  if (!ViewTransition) return <>{children}</>;
  return <ViewTransition>{children}</ViewTransition>;
}
