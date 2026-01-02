// components/common/CookieNotice.tsx
"use client";

import Link from "next/link";
import { useEffect, startTransition, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/common/Icon";
import { Switch } from "@/components/ui/switch";
import {
  type CookiePreferences,
  getStoredPreferences,
  savePreferences as persistPreferences,
  STORAGE_KEY,
} from "@/hooks/use-cookie-consent";

export function CookieNotice() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
  });

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });

    return () => {
      // Cleanup container on unmount
      const container = document.getElementById("cookie-notice-root");
      container?.parentNode?.removeChild(container);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasConsent = localStorage.getItem(STORAGE_KEY) !== null;
      if (hasConsent) {
        const stored = getStoredPreferences();
        setPreferences(stored);
        setVisible(false);
      } else {
        setVisible(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const acceptAllCookies = () => {
    setIsExiting(true);
    const allAccepted: CookiePreferences = { necessary: true, analytics: true };
    setTimeout(() => {
      persistPreferences(allAccepted);
      setPreferences(allAccepted);
      setVisible(false);
    }, 400);
  };

  const savePreferences = () => {
    setIsExiting(true);
    setTimeout(() => {
      persistPreferences(preferences);
      setVisible(false);
    }, 400);
  };

  if (!(mounted && visible)) {
    return null;
  }

  const content = showManage ? (
    <div
      className={`fixed right-0 bottom-0 left-0 z-9999 border-border/30 border-t bg-card shadow-2xl transition-all duration-500 ${isExiting ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
    >
      <div className="container-default px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-subheading">
            <Icon
              className="text-accent"
              color="accent"
              name="Cookie"
              size={20}
            />
            Cookie Preferences
          </h3>
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setShowManage(false)}
            type="button"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
        <p className="mb-4 text-muted-foreground">
          Manage your cookie preferences. Essential cookies are always active
          and necessary for the website to function properly.
        </p>
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <p className="font-medium">Necessary Cookies</p>
              <p className="text-muted-foreground text-caption">
                Required for the website to function. Cannot be disabled.
              </p>
            </div>
            <Switch checked disabled />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <p className="font-medium">Analytics Cookies</p>
              <p className="text-muted-foreground text-caption">
                Help us understand how visitors interact with our website.
              </p>
            </div>
            <Switch
              checked={preferences.analytics}
              onCheckedChange={() =>
                setPreferences((p: CookiePreferences) => ({
                  ...p,
                  analytics: !p.analytics,
                }))
              }
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="btn-secondary px-4 py-2 text-caption"
            onClick={() => setShowManage(false)}
            type="button"
          >
            Cancel
          </button>
          <button
            className="btn-primary px-4 py-2 text-caption"
            onClick={savePreferences}
            type="button"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`fixed right-0 bottom-0 left-0 z-9999 border-border/20 border-t bg-card shadow-2xl transition-all duration-500 ${isExiting ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
    >
      <div className="h-1 w-full bg-gradient-to-r from-chart-1 via-chart-3 to-chart-5" />
      <div className="container-default flex flex-col items-center justify-between gap-4 px-6 py-4 md:flex-row">
        <div className="flex items-center gap-3">
          <Icon
            className="hidden text-accent md:block"
            color="accent"
            name="Cookie"
            size={24}
          />
          <p className="max-w-3xl text-foreground text-caption">
            We use cookies to brew up a better experience. Essential cookies are
            always active. By clicking &quot;Accept All&quot;, you agree to the
            storing of cookies on your device to enhance navigation and analyze
            site usage. See our{" "}
            <Link className="text-primary hover:underline" href="/privacy">
              Privacy Policy
            </Link>{" "}
            for more information.
          </p>
        </div>
        <div className="flex gap-2 whitespace-nowrap">
          <button
            className="btn-secondary px-4 py-2 text-caption"
            onClick={() => setShowManage(true)}
            type="button"
          >
            Manage Cookies
          </button>
          <button
            className="btn-primary px-4 py-2 text-caption"
            onClick={acceptAllCookies}
            type="button"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  // Create a simple container div appended directly to documentElement (html)
  // This bypasses body's transform: translateZ(0) which creates a containing block
  const containerId = "cookie-notice-root";
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    // Simple container with no positioning or transforms
    // The content itself handles all positioning with position: fixed
    document.documentElement.appendChild(container);
  }

  return createPortal(content, container);
}
