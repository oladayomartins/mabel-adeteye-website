import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ik.imagekit.io", pathname: "/digit/Mabel/**" },
      { protocol: "https", hostname: "ik.imagekit.io", pathname: "/b492iukcb/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  compress: true,
  async redirects() {
    // Continuity for links to the previous WordPress site.
    return [
      { source: "/contact-mabel", destination: "/bookings", permanent: true },
      { source: "/contact", destination: "/bookings", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
