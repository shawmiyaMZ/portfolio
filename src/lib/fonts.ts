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
   * Preloaded, and it must stay that way — though not for the reason first
   * recorded here. Dropping the preload was re-measured on 2026-08-05 with
   * three warm runs per configuration rather than one cold one, and it costs
   * first paint above all: FCP 1080ms to 1831ms, LCP 3695ms to 3737ms, CLS 0
   * to 0.050, score 89 to 88. The earlier note claimed 86 to 65 and CLS
   * 0.412; those numbers came from a single cold run and were an artifact of
   * Next's image optimizer generating the avatar layers on first request.
   * The direction was right, the magnitude was noise.
   *
   * So the 121 KB buys a fast first paint on the hero name, not merely a
   * nicer heading.
   */
  variable: "--font-fraunces",
});

/**
 * Body and code come from one family so that a code block reads as
 * designed rather than pasted in from somewhere else.
 */
/**
 * The body face, and the one the hero lede — the LCP element — is set in.
 *
 * No `fallback` array here, deliberately. Passing one *replaces* the
 * metric-matched family `next/font` would otherwise generate rather than
 * sitting behind it, and the build proved it: the emitted CSS resolved
 * `--font-plex-sans` to a plain `system-ui, -apple-system, …` stack with no
 * `@font-face` overrides at all, while Fraunces — which was left alone — got
 * a proper `IBM Plex Sans Fallback`-style face with `size-adjust` and ascent
 * overrides. The face carrying the LCP was the one *without* metric matching.
 *
 * Left to itself, `next/font` looks the family up in its bundled capsize
 * metrics and emits the adjusted face, so the text that paints before the
 * file arrives occupies the same space as the text that replaces it.
 */
export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
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
 * The metric matching matters here too, for the same reason it does on the
 * body face: without it the swap from the system mono to Plex Mono reflows a
 * code block. So there is no `fallback` array — see the note on `plexSans`
 * for why writing one out by hand is what removes the metric matching rather
 * than adding to it.
 */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
  variable: "--font-plex-mono",
});

export const fontVariables = `${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`;
