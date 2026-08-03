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
  variable: "--font-fraunces",
});

/**
 * Body and code come from one family so that a code block reads as
 * designed rather than pasted in from somewhere else.
 */
export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex-sans",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const fontVariables = `${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`;
