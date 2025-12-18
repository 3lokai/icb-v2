// components/common/CookieSettings.tsx
"use client";

import { useEffect, startTransition, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Switch } from "@/components/ui/switch";
import {
  type CookiePreferences,
  getStoredPreferences,
  savePreferences as persistPreferences,
  STORAGE_KEY,
} from "@/hooks/use-cookie-consent";

export function CookieSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
  });

  useEffect(() => {
    // Check if preferences have been saved before
    const stored = getStoredPreferences();
    const hasConsent = localStorage.getItem(STORAGE_KEY) !== null;

    // Only show if no consent has been given yet
    startTransition(() => {
      if (hasConsent) {
        setPreferences(stored);
      } else {
        setIsOpen(true);
      }
    });
  }, []);

  const savePreferences = () => {
    persistPreferences(preferences);
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 bg-black/50 p-4 pb-6">
      <div className="mx-auto max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg border border-border bg-card shadow-xl">
        <div className="p-6">
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
              onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
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
    </div>
  );
}

export function CookieSettingsButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="text-muted-foreground text-overline hover:text-foreground hover:underline"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Cookie Settings
      </button>
      {isOpen && <CookieSettings />}
    </>
  );
}
