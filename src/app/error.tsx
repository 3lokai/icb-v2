"use client";

import { useEffect } from "react";
import { captureException } from "@/lib/posthog";
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
    captureException(error);
  }, [error]);

  return <ErrorPageContent reset={reset} />;
}
