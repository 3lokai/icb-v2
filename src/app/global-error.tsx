"use client";

import { DM_Sans, Fraunces } from "next/font/google";
import { useEffect } from "react";
import posthog from "posthog-js";
import { ErrorPageContent } from "@/components/common/ErrorPageContent";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    posthog.captureException(error);
  }, [error]);

  return (
    <html
      className={`${fraunces.variable} ${dmSans.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ErrorPageContent minHeightClassName="min-h-screen" reset={reset} />
      </body>
    </html>
  );
}
