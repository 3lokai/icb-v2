import type { NextConfig } from "next";

// Bundle analyzer - only load when ANALYZE env var is set
let withBundleAnalyzer = (config: NextConfig) => config;

if (process.env.ANALYZE === "true") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bundleAnalyzer = require("@next/bundle-analyzer");
  withBundleAnalyzer = bundleAnalyzer({
    enabled: true,
  });
}

const nextConfig: NextConfig = {
  // Target modern browsers - avoid unnecessary transpilation
  // Modern browsers support ES2020+ features natively
  compiler: {
    // SWC compiler options for modern browser support
    // This prevents transpiling features that modern browsers already support
    // Baseline features (ES2020+) are supported by:
    // - Chrome 80+, Edge 80+, Firefox 75+, Safari 14+
    // - Covers 95%+ of global browser usage
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"], // Keep error and warn logs in production
          }
        : false,
  },
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
      {
        protocol: "https",
        hostname: "placehold.co", // For collection placeholders
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
  // Optimize webpack to prevent duplicate JS bundles
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize client-side bundle splitting
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            // Separate React and React-DOM into a shared chunk
            react: {
              name: "react",
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
            },
            // Separate Next.js framework code
            framework: {
              name: "framework",
              test: /[\\/]node_modules[\\/](next|@next)[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
            },
            // Separate Radix UI components (many are used together)
            radix: {
              name: "radix-ui",
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Separate TanStack Query
            tanstack: {
              name: "tanstack",
              test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common vendor libraries
            vendor: {
              name: "vendor",
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              reuseExistingChunk: true,
            },
            // Default chunk splitting
            default: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
