import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
