import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/indiancoffeebeans/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // For fallback images
      },
    ],
    qualities: [75, 80, 85, 90],
  },
  // Enable compression (Vercel handles this automatically, but explicit for clarity)
  compress: true,
  // Note: swcMinify is enabled by default in Next.js 15+ and cannot be disabled
  async redirects() {
    return [
      {
        source: "/under-500",
        destination: "/budget-coffee",
        permanent: true, // 301 redirect
      },
      {
        source: "/500-1000",
        destination: "/mid-range-coffee",
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;
