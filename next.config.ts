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
