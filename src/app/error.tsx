"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { ErrorPageContent } from "@/components/common/ErrorPageContent";

export default function Error({
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

  return <ErrorPageContent reset={reset} />;
}
