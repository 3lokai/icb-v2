// components/common/CookieNotice.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CookieIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { Switch } from "@/components/ui/switch";
import {
  type CookiePreferences,
  getStoredPreferences,
  hasStoredConsent,
  savePreferences as persistPreferences,
} from "@/hooks/use-cookie-consent";
import { PageShell } from "@/components/primitives/page-shell";

export function CookieNotice() {
  // Created detached, so this is not a DOM mutation during render — it only
  // becomes a document change in the effect below, which is what appends it.
  const [container] = useState<HTMLElement | null>(() => {
    if (typeof document === "undefined") return null;
    const el = document.createElement("div");
    el.id = "cookie-notice-root";
    el.className = "ph-no-capture";
    return el;
  });
  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true, // Opt-out model
    marketing: false, // Opt-in model
  });

  // Own the portal container outright: this instance appends the exact node it
  // created above and removes that same node on unmount. It used to be created
  // and appended *during render* (document.body.appendChild in the render body)
  // after a lookup by id — a render-phase DOM mutation, illegal under React 19's
  // concurrent rendering, where a render can be interrupted or discarded.
  // The failure that shape produces is precisely the `NotFoundError` detach this
  // component was already the named suspect for: if the by-id node is removed and
  // a later render recreates a *different* node under the same id, the committed
  // portal fiber still points at the old one, and React's deletion pass calls
  // removeChild on a node that no longer holds the children. With no id lookup
  // and no shared node, that swap is unrepresentable.
  // The server/client gate is `container === null` on the server plus `visible`,
  // which stays false until the idle callback below — so the hydration render
  // still returns null, exactly as the old `mounted` flag arranged.
  useEffect(() => {
    if (!container) return;
    document.body.appendChild(container);

    return () => {
      container.remove();
    };
  }, [container]);

  useEffect(() => {
    let cancelled = false;
    const showIfNeeded = () => {
      if (cancelled) return;
      const hasConsent = hasStoredConsent();
      if (hasConsent) {
        const stored = getStoredPreferences();
        setPreferences(stored);
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    // Defer non-critical consent UI until browser is idle so its mount work stays
    // off the critical hydration path. (Measured: this does NOT drive the banner's
    // LCP time — under CPU throttle the banner can't paint until the page's ~600KB
    // bundle hydrates ~5.7s anyway, which is ~when idle fires. Removing the defer
    // moved nothing and only added main-thread contention during load, so it stays.
    // The real fix for "banner is LCP on hero-less pages" is giving those pages real
    // above-fold content — see the LCP workstream notes.)
    const idleCallback =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? window.requestIdleCallback(showIfNeeded, { timeout: 1000 })
        : null;
    const timer = idleCallback === null ? setTimeout(showIfNeeded, 1000) : null;

    return () => {
      cancelled = true;
      if (idleCallback !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallback);
      }
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, []);

  const acceptAllCookies = () => {
    setIsExiting(true);
    // "Accept All" is genuine affirmative action, so it does grant marketing.
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
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

  if (!(container && visible)) {
    return null;
  }

  const content = showManage ? (
    <div
      className={`ph-no-capture fixed right-0 bottom-0 left-0 z-9999 border-border/30 border-t bg-card shadow-2xl transition-all duration-500 ${isExiting ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
    >
      <PageShell className="px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-subheading">
            <Icon
              className="text-accent"
              color="accent"
              icon={CookieIcon}
              size={20}
            />
            Cookie Preferences
          </h3>
          <button
            aria-label="Close cookie preferences"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setShowManage(false)}
            type="button"
          >
            <Icon icon={XIcon} size={18} />
            <span className="sr-only">Close</span>
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
            <Switch checked disabled aria-label="Necessary Cookies" />
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
              aria-label="Analytics Cookies"
              onCheckedChange={() =>
                setPreferences((p: CookiePreferences) => ({
                  ...p,
                  analytics: !p.analytics,
                }))
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <p className="font-medium">Marketing Cookies</p>
              <p className="text-muted-foreground text-caption">
                Used to measure and personalise advertising. Off unless you turn
                it on.
              </p>
            </div>
            <Switch
              checked={preferences.marketing}
              aria-label="Marketing Cookies"
              onCheckedChange={() =>
                setPreferences((p: CookiePreferences) => ({
                  ...p,
                  marketing: !p.marketing,
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
      </PageShell>
    </div>
  ) : (
    <div
      className={`ph-no-capture fixed right-0 bottom-0 left-0 z-9999 border-border/20 border-t bg-card shadow-2xl transition-all duration-500 ${isExiting ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
    >
      <div className="h-1 w-full bg-gradient-to-r from-chart-1 via-chart-3 to-chart-5" />
      <PageShell className="flex flex-col items-center justify-between gap-4 px-6 py-4 md:flex-row">
        <div className="flex items-center gap-3">
          <Icon
            className="hidden text-accent md:block"
            color="accent"
            icon={CookieIcon}
            size={24}
          />
          <p className="max-w-3xl text-foreground text-caption">
            We use cookies to brew up a better experience. Essential cookies are
            always active. By clicking &quot;Accept All&quot;, you agree to the
            storing of cookies on your device to enhance navigation, analyze
            site usage, and measure marketing. Choose &quot;Manage Cookies&quot;
            to decide for yourself. See our{" "}
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
      </PageShell>
    </div>
  );

  // Portal to body so fixed positioning works and PostHog autocapture stays in the
  // normal element tree (portals on documentElement walk up to Document and crash).
  return createPortal(content, container);
}
