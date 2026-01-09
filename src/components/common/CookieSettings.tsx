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

export function CookieSettings({
  forceOpen = false,
  onClose,
}: {
  forceOpen?: boolean;
  onClose?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true, // Default to enabled (opt-out model)
  });

  useEffect(() => {
    // Check if preferences have been saved before
    const stored = getStoredPreferences();
    const hasConsent = localStorage.getItem(STORAGE_KEY) !== null;

    // Only show if no consent has been given yet, or if forceOpen is true
    startTransition(() => {
      if (hasConsent) {
        setPreferences(stored);
        if (forceOpen) {
          setIsOpen(true);
        }
      } else {
        setIsOpen(true);
      }
    });
  }, [forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const savePreferences = () => {
    persistPreferences(preferences);
    handleClose();
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
              onClick={handleClose}
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
              onClick={handleClose}
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
        className="text-micro text-muted-foreground/60 uppercase tracking-widest font-medium transition-colors hover:text-accent"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Cookie Settings
      </button>
      {isOpen && (
        <CookieSettings forceOpen={true} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
