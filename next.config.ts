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
  },
};

export default nextConfig;
