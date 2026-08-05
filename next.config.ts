import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /**
     * Two root layouts — `(site)` and `(studio)` — mean Next has no single
     * layout to build a 404 from for unmatched URLs, which is the documented
     * reason this flag exists. Without it those URLs fall back to the stock
     * white Next page, which belongs to no design system at all.
     */
    globalNotFound: true,

    /**
     * Turns route navigations into React Transitions, which is what actually
     * fires the browser's View Transitions API. Without it the
     * `::view-transition-old(root)` and `::view-transition-new(root)`
     * animations in motion.css are inert — the CSS was written and never ran.
     *
     * Unsupported browsers navigate normally; there is nothing to fall back
     * to because nothing is added to the page.
     */
    viewTransition: true,

    /**
     * `inlineCss` is deliberately NOT enabled, though not for the reason
     * first recorded here. Re-measured on 2026-08-05 with three warm runs
     * per configuration: cumulative layout shift stays at exactly 0, so the
     * 0.354 originally blamed on it was a cold-run artifact. What it really
     * costs is the two metrics either side of it — LCP 3695ms to 3842ms and
     * blocking time 68ms to 157ms, from parsing 60 KB of CSS inline on every
     * page load. Score 89 to 87.
     *
     * The Next docs do recommend it for this shape of site (small Tailwind
     * CSS, first-time visitors). It simply does not win here: the stylesheet
     * is already served over one warm connection, so removing the request
     * saves less than parsing it inline costs.
     */
  },

  images: {
    /**
     * Next 16 allowlists quality values. Anything not listed is ignored and
     * silently falls back to the default — so the avatar's `quality={92}`
     * was doing nothing at all, and the premium render was being served at
     * 75. 75 stays for ordinary content imagery; 90 and 92 exist purely for
     * the avatar, which is the one asset where the extra bytes are the point.
     */
    qualities: [75, 90, 92],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
