import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieNotice } from "@/components/common/CookieNotice";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SearchCommand } from "@/components/search/SearchCommand";
import StructuredData from "@/components/seo/StructuredData";
import { Toaster } from "@/components/ui/sonner";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { SearchProvider } from "@/providers/SearchProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"], // Add the heavy weights
  variable: "--font-display",
  display: "swap", // Add this for better performance
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
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
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
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
                  <ConditionalLayout>{children}</ConditionalLayout>
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
