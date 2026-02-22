"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ensureAnonId } from "@/lib/reviews/anon-id";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";

const TRIED_KEY = "icb_anon_profile_tried";

export function EnsureAnonIdAndRefresh() {
  const router = useRouter();
  const hasRun = useRef(false);
  const [showCookiesMessage, setShowCookiesMessage] = useState(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const tried =
      typeof window !== "undefined" && sessionStorage.getItem(TRIED_KEY);
    if (tried) {
      queueMicrotask(() => setShowCookiesMessage(true));
      return;
    }

    ensureAnonId();
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(TRIED_KEY, "1");
    }
    router.refresh();
  }, [router]);

  if (showCookiesMessage) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">
          Enable cookies to view your anonymous profile and save your ratings.
        </p>
        <Button asChild variant="secondary">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <LoadingSpinner size="lg" text="Loading your profile..." />
    </div>
  );
}
