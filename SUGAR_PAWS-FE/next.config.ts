// next.config.ts (hoặc next.config.js nếu em sử dụng JavaScript)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "store.lolitacollective.com",
      "example.com",
      "via.placeholder.com",
      "res.cloudinary.com",
    ],
  },
  // Optimize performance
  reactStrictMode: true,
  swcMinify: true,

  // Optimize production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Optimize page loading
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks", "react-icons"],
    // Disable features that cause RSC overhead
    typedRoutes: false,
    ppr: false, // Disable Partial Prerendering
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // Optimize redirects and rewrites
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
