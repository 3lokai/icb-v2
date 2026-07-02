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
  // Server Actions configuration
  // Allow 3MB body size to support 2MB image uploads (base64 encoding adds ~33% overhead)
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
    // Rewrite barrel imports to deep imports for these (Next doesn't optimize
    // them by default). Note: this does NOT help Icon.tsx — that uses an explicit
    // registry because its access was dynamic and untouchable by this option.
    optimizePackageImports: ["@phosphor-icons/react", "motion"],
  } as NextConfig["experimental"],
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
        hostname: "images.unsplash.com", // For collection placeholders
      },
      {
        protocol: "https",
        hostname: "www.redditstatic.com", // For Reddit logo/favicons
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io", // Sanity CDN for blog/learn images
      },
    ],
    qualities: [75, 80, 85, 90],
  },
  // Enable compression (Vercel handles this automatically, but explicit for clarity)
  compress: true,
  skipTrailingSlashRedirect: true,
  // Note: swcMinify is enabled by default in Next.js 15+ and cannot be disabled
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/under-500",
        destination: "/coffees/budget",
        permanent: true, // 301 redirect
      },
      {
        source: "/budget-coffee",
        destination: "/coffees/budget",
        permanent: true, // 301 redirect
      },
      {
        source: "/500-1000",
        destination: "/coffees/mid-range",
        permanent: true, // 301 redirect
      },
      {
        source: "/aeropress-coffee",
        destination: "/coffees/aeropress",
        permanent: true,
      },
      {
        source: "/v60-coffee",
        destination: "/coffees/v60",
        permanent: true,
      },
      {
        source: "/french-press-coffee",
        destination: "/coffees/french-press",
        permanent: true,
      },
      {
        source: "/light-roast",
        destination: "/coffees/light-roast",
        permanent: true,
      },
      {
        source: "/medium-roast",
        destination: "/coffees/medium-roast",
        permanent: true,
      },
      {
        source: "/dark-roast",
        destination: "/coffees/dark-roast",
        permanent: true,
      },
      {
        source: "/budget-coffee",
        destination: "/coffees/budget",
        permanent: true,
      },
      {
        source: "/mid-range-coffee",
        destination: "/coffees/mid-range",
        permanent: true,
      },
    ];
  },
  async headers() {
    // Lottie animation JSON and hero video files are content-stable and
    // versioned with the deploy — cache them aggressively so they paint
    // instantly after the first visit.
    const immutableAssets = [
      {
        source: "/animations/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];

    if (process.env.VERCEL_ENV !== "production") {
      return [
        {
          source: "/:path*",
          headers: [{ key: "X-Robots-Tag", value: "noindex" }],
        },
        ...immutableAssets,
      ];
    }

    return immutableAssets;
  },
  // Webpack config for bundle-analyzer builds (npm run analyze uses --webpack).
  // The catch-all vendor group has been intentionally removed — it was bundling
  // every node_module into a single 15 MB shared chunk loaded on every page.
  // Next.js's default smart splitting handles vendor deduplication correctly:
  // route-scoped packages stay in their route chunks, and only modules used
  // across 3+ chunks get promoted to a shared bundle.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            // React and React-DOM into a stable named chunk (good for long-term caching)
            react: {
              name: "react",
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
            },
            // Next.js framework code
            framework: {
              name: "framework",
              test: /[\\/]node_modules[\\/](next|@next)[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
            },
            // Radix UI — used across many routes, worth a shared chunk
            radix: {
              name: "radix-ui",
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              priority: 20,
              minChunks: 2,
              reuseExistingChunk: true,
            },
            // TanStack Query — used across many routes
            tanstack: {
              name: "tanstack",
              test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
              priority: 20,
              minChunks: 2,
              reuseExistingChunk: true,
            },
            // Default: only share a module when it appears in 3+ chunks
            default: {
              minChunks: 3,
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
