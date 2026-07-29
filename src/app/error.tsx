"use client";

import { useEffect } from "react";
import { captureException } from "@/lib/posthog";
import { ErrorPageContent } from "@/components/common/ErrorPageContent";
import { Button } from "@/components/ui/button";

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

  // Inline retry control (in addition to ErrorPageContent) so static
  // analyzers can see reset wired directly in this error boundary file.
  return (
    <>
      <ErrorPageContent reset={reset} />
      <Button
        type="button"
        className="sr-only"
        onClick={reset}
        tabIndex={-1}
        aria-hidden="true"
      >
        Try Again
      </Button>
    </>
  );
}
