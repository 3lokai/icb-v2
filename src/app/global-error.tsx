"use client";

import { useEffect } from "react";
import { captureException } from "@/lib/posthog";
import { ErrorPageContent } from "@/components/common/ErrorPageContent";
import "./globals.css";

const SITE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:wght@400;500;600;700&display=swap";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    captureException(error);
  }, [error]);

  return (
    <html className="global-error-shell" lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link href={SITE_FONTS_URL} rel="stylesheet" />
      </head>
      <body>
        <ErrorPageContent minHeightClassName="min-h-screen" reset={reset} />
      </body>
    </html>
  );
}
