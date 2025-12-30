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
  // Optimize production builds
  swcMinify: true,
};

export default nextConfig;
