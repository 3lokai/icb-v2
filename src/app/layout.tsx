import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import { Analytics as GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { env } from "../../env";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import StructuredData from "@/components/seo/StructuredData";
import { Toaster } from "@/components/ui/sonner";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { SearchProvider } from "@/providers/SearchProvider";

// Lazy load SearchCommand to reduce initial bundle size
// Only loads when search modal is opened (cmdk is ~50-100KB)
// Note: No ssr: false needed - SearchCommand is already client-only

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "optional",
  preload: true,
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
        alt: "India's First Specialty Coffee Directory",
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
  maximumScale: 5,
  userScalable: true,
  width: "device-width",
  height: "device-height",
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${fraunces.variable} ${dmSans.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <div className="bg-noise" />
        <StructuredData schema={[organizationSchema, websiteSchema]} />
        {/* Google Analytics Consent Mode - Must run before Next.js GoogleAnalytics component */}
        {/* This script ONLY initializes dataLayer, gtag, and consent - NO config call */}
        {env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <Script
            id="ga-consent-init"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  // Check if we should initialize GA (production check)
                  var isProd = ${process.env.NODE_ENV === "production" ? "true" : "false"};
                  var enableAnalytics = ${env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" ? "true" : "false"};
                  var hostname = typeof window !== "undefined" ? window.location.hostname : "";
                  var shouldInit = enableAnalytics || (isProd && hostname !== "localhost" && hostname !== "127.0.0.1" && !hostname.startsWith("localhost:") && !hostname.startsWith("127.0.0.1:"));
                  
                  if (!shouldInit) return;
                  
                  // Initialize dataLayer early (before Next.js component loads)
                  window.dataLayer = window.dataLayer || [];
                  
                  // Define gtag function early (before Next.js component loads)
                  // This ensures commands are queued if script hasn't loaded yet
                  if (!window.gtag) {
                    window.gtag = function gtag() {
                      window.dataLayer.push(Array.from(arguments));
                    };
                    window.gtag("js", new Date());
                  }
                  
                  // Set default consent to granted (opt-out model)
                  // This must be set BEFORE Next.js component runs its config
                  window.gtag("consent", "default", {
                    analytics_storage: "granted",
                    ad_storage: "denied",
                  });
                  
                  // Check localStorage for previous consent preference
                  // Matches STORAGE_KEY from use-cookie-consent.ts hook
                  try {
                    var consent = localStorage.getItem("icb-cookie-consent");
                    if (consent) {
                      var parsed = JSON.parse(consent);
                      // If analytics is explicitly false, deny consent
                      if (parsed.analytics === false) {
                        window.gtag("consent", "update", {
                          analytics_storage: "denied",
                        });
                      }
                      // If analytics is true or not set, default remains "granted" (opt-out model)
                    }
                    // If no consent stored, default remains "granted" (opt-out model)
                  } catch (e) {
                    // Silently fail if consent check fails, default remains "granted"
                  }
                  
                  // NO config call here - Next.js GoogleAnalytics component handles config
                })();
              `,
            }}
          />
        )}
        {/* Next.js Google Analytics Component - Handles script loading and automatic pageview tracking */}
        {env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <NextGoogleAnalytics gaId={env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
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
                  {children}
                  <GoogleAnalytics />
                  <Toaster />
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
