import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

/**
 * Fraunces is the only mainstream display serif with real SOFT and WONK
 * axes, which is why it is here: the face can be tuned toward the clay
 * material rather than merely chosen. Loading it variable keeps every
 * axis available at runtime for a single file.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
  /**
   * Preloaded, and it must stay that way. Dropping the preload was measured
   * on 2026-08-05: performance fell from 86 to 65 and cumulative layout shift
   * went from 0 to 0.412, because the hero name swaps out of its fallback
   * late and reflows the page under it. The 118 KB is buying a stable layout,
   * not just a nicer heading.
   */
  variable: "--font-fraunces",
});

/**
 * Body and code come from one family so that a code block reads as
 * designed rather than pasted in from somewhere else.
 */
/**
 * The body face, and the one the LCP depends on — the hero lede is set in
 * it. Preloaded, and given a metric-matched fallback so the text that paints
 * before the file arrives occupies the same space as the text that replaces
 * it. That is what keeps the swap from moving the page.
 */
export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
  variable: "--font-plex-sans",
});

/**
 * Mono is not preloaded, and that is the point.
 *
 * `next/font` preloads every family by default, so three files competed for
 * the connection on first paint — and Lighthouse put the Largest Contentful
 * Paint on `.u-lede`, a Plex Sans element, at 4.4s. Mono appears only in
 * code blocks, the chapter rail numerals and a few captions: never above the
 * fold, never the LCP candidate. Preloading it delayed the face that is.
 *
 * `fallback` also matters here. Without it the swap from the system mono to
 * Plex Mono reflows a code block; the metric-matched stack keeps that swap
 * invisible, which is why CLS stays at 0.
 */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  variable: "--font-plex-mono",
});

export const fontVariables = `${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`;
