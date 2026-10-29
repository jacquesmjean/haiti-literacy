import type { NextConfig } from "next";
import { legacyRedirects } from "./src/lib/routes";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    // Every old WordPress URL lands on its new home so no inbound link,
    // bookmark or search result breaks.
    return [
      ...Object.entries(legacyRedirects).map(([source, destination]) => ({
        source,
        destination: `/en${destination}`,
        permanent: true,
      })),
      // Addresses donors guess. The bare path goes to /give so the locale
      // proxy can send each visitor to the page in their own language.
      {
        source: "/:alias(donate|donation|donations|give-now)",
        destination: "/give",
        permanent: true,
      },
      {
        source: "/:locale(en|ht|fr|es)/:alias(donate|donation|donations|give-now)",
        destination: "/:locale/give",
        permanent: true,
      },
      // The reports page folded into the transparency page.
      {
        source: "/:locale(en|ht|fr|es)/reports",
        destination: "/:locale/transparency",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
