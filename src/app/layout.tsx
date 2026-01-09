import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieNotice } from "@/components/common/CookieNotice";
import { Analytics as GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { env } from "../../env";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import dynamic from "next/dynamic";
import StructuredData from "@/components/seo/StructuredData";
import { Toaster } from "@/components/ui/sonner";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { SearchProvider } from "@/providers/SearchProvider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/Footer";

// Lazy load SearchCommand to reduce initial bundle size
// Only loads when search modal is opened (cmdk is ~50-100KB)
// Note: No ssr: false needed - SearchCommand is already client-only
const SearchCommand = dynamic(() =>
  import("@/components/search/SearchCommand").then((mod) => ({
    default: mod.SearchCommand,
  }))
);

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"], // Reduced from 4 weights to 2 for faster FCP (removed 600, 900)
  variable: "--font-display",
  display: "optional", // Use optional to prevent FOIT and improve FCP
  preload: true, // Preload critical font
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Kept 500 as font-medium is used 208+ times
  variable: "--font-sans",
  display: "optional", // Use optional to prevent FOIT and improve FCP
  preload: true, // Preload critical font
});

export const metadata: Metadata = {
  title: {
    default: "IndianCoffeeBeans.com",
    template: "%s | Indian Coffee Beans",
  },
  description:
    "India's first specialty coffee directory – discover roasters, beans, and brewing tips.",
  metadataBase: new URL("https://indiancoffeebeans.com"),
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  keywords: [
    "indian coffee",
    "specialty coffee india",
    "indian roasters",
    "coffee directory",
    "filter coffee",
    "brew guides",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://indiancoffeebeans.com",
    siteName: "Indian Coffee Beans",
    images: [
      {
        url: "https://indiancoffeebeans.com/api/og?title=Indian%20Coffee%20Beans&type=website&image=https://indiancoffeebeans.com/logo-icon.svg",
        width: 1200,
        height: 630,
        alt: "Indian Coffee Beans - India's First Specialty Coffee Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@indcoffeebeans",
    creator: "@indcoffeebeans",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4eee2",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  width: "device-width",
  height: "device-height",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${playfair.variable} ${dmSans.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <div className="bg-noise" />
        <StructuredData schema={[organizationSchema, websiteSchema]} />
        {/* Google Analytics - Inline initialization script runs BEFORE external script loads */}
        {/* This ensures dataLayer and gtag are ready immediately, eliminating race conditions */}
        {/* Uses GOOGLE_TAG_ID (GT-XXXX) for script loader, GA_MEASUREMENT_ID (G-XXXX) for config */}
        {(env.NEXT_PUBLIC_GOOGLE_TAG_ID ||
          env.NEXT_PUBLIC_GA_MEASUREMENT_ID) && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    // Check if we should initialize GA (production check)
                    var isProd = ${process.env.NODE_ENV === "production" ? "true" : "false"};
                    var enableAnalytics = ${process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" ? "true" : "false"};
                    var hostname = typeof window !== "undefined" ? window.location.hostname : "";
                    var shouldInit = enableAnalytics || (isProd && hostname !== "localhost" && hostname !== "127.0.0.1" && !hostname.startsWith("localhost:") && !hostname.startsWith("127.0.0.1:"));
                    
                    if (!shouldInit) return;
                    
                    // Initialize dataLayer early (before external script loads)
                    window.dataLayer = window.dataLayer || [];
                    
                    // Define gtag function early (before external script loads)
                    // This ensures commands are queued if script hasn't loaded yet
                    if (!window.gtag) {
                      window.gtag = function gtag() {
                        window.dataLayer.push(Array.from(arguments));
                      };
                      window.gtag("js", new Date());
                    }
                    
                    // Set default consent to granted (opt-out model)
                    // This must be set BEFORE any config calls
                    window.gtag("consent", "default", {
                      analytics_storage: "granted",
                      ad_storage: "denied",
                    });
                    
                    // Check for explicit rejection and update if user rejected
                    var shouldTrack = true;
                    try {
                      var consent = localStorage.getItem("icb-cookie-consent");
                      if (consent) {
                        var parsed = JSON.parse(consent);
                        // If analytics is explicitly false, deny consent
                        if (parsed.analytics === false) {
                          window.gtag("consent", "update", {
                            analytics_storage: "denied",
                          });
                          shouldTrack = false;
                        }
                      }
                      // If no consent stored, default remains "granted" (opt-out model)
                    } catch (e) {
                      // Silently fail if consent check fails, default remains "granted"
                    }
                    
                    // Initialize GA config (standard Google pattern)
                    // Use GA_MEASUREMENT_ID (G-XXXX) for config, NOT GOOGLE_TAG_ID (GT-XXXX)
                    // Only track if consent is granted (opt-out model - default is granted)
                    var measurementId = ${env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? `"${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}"` : "null"};
                    if (shouldTrack && measurementId) {
                      window.gtag("config", measurementId, {
                        page_path: window.location.pathname,
                      });
                    }
                  })();
                `,
              }}
            />
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GOOGLE_TAG_ID || ""}`}
              strategy="afterInteractive"
            />
          </>
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <QueryProvider>
            <AuthProvider>
              <SearchProvider>
                <ModalProvider>
                  <div className="surface-0 relative flex min-h-screen flex-col">
                    <Header />
                    <GoogleAnalytics />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <SearchCommand />
                  <Toaster />
                  <CookieNotice />
                </ModalProvider>
              </SearchProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
