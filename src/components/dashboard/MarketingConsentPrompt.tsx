"use client";

import { startTransition, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getStoredPreferences,
  hasStoredConsent,
  savePreferences,
} from "@/hooks/use-cookie-consent";

const DISMISSED_KEY = "icb-marketing-prompt-dismissed";

/**
 * One-time ask for signed-in users who answered the cookie banner without
 * granting marketing. "Not now" is remembered on this device and never shown
 * again; the choice itself goes through savePreferences like the banner's.
 * Hidden while the banner is still unanswered so the two never stack.
 */
export function MarketingConsentPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => {
      let show = false;
      try {
        show =
          hasStoredConsent() &&
          !getStoredPreferences().marketing &&
          localStorage.getItem(DISMISSED_KEY) === null;
      } catch {
        // Storage blocked: nowhere to remember a dismissal, so don't ask.
      }
      startTransition(() => setVisible(show));
    };
    sync();
    // Re-check after Cookie Settings (or another tab) saves a choice.
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Storage blocked; hiding for this page view is the best we can do.
    }
    setVisible(false);
  };

  const accept = () => {
    savePreferences({ ...getStoredPreferences(), marketing: true });
    setVisible(false);
  };

  return (
    <div className="flex flex-col gap-4 rounded-md border border-border p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-medium text-body">Personalised recommendations</p>
        <p className="text-muted-foreground text-caption">
          Allow marketing cookies so we can show you relevant coffees and offers
          on other sites you visit. You can change this anytime in Cookie
          Settings.
        </p>
      </div>
      <div className="flex gap-2 whitespace-nowrap">
        <Button onClick={dismiss} type="button" variant="outline">
          Not now
        </Button>
        <Button onClick={accept} type="button">
          Allow
        </Button>
      </div>
    </div>
  );
}
