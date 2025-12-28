import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { CookieNotice } from "@/components/common/CookieNotice";
import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/header";
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
        <StructuredData schema={organizationSchema} />
        <StructuredData schema={websiteSchema} />
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
                  <div className="surface-0 flex min-h-screen flex-col">
                    <Header />
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
      </body>
    </html>
  );
}
