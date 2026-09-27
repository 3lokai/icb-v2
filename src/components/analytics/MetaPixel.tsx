"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getStoredPreferences } from "@/lib/consent";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Same gate as MicrosoftClarity / the layout consent-init: production on a real
// hostname, or anywhere with NEXT_PUBLIC_ENABLE_ANALYTICS=true.
function shouldInit() {
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true") return true;
  const host = window.location.hostname;
  return (
    process.env.NODE_ENV === "production" &&
    host !== "localhost" &&
    host !== "127.0.0.1"
  );
}

// Meta's base snippet, de-minified: a queueing fbq stub plus fbevents.js.
function loadPixel(id: string) {
  const w = window as any;
  const n: any = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  };
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  w.fbq = n;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  n("init", id);
}

/**
 * Meta Pixel for retargeting. Meta ignores Google Consent Mode, so the script is
 * not requested at all without marketing (opt-in) consent. A grant made later
 * arrives as the `storage` event savePreferences dispatches; a revoke is handled
 * by updateMarketingConsent (fbq "consent", "revoke").
 */
export function MetaPixel() {
  const pathname = usePathname();
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    if (!PIXEL_ID || !shouldInit()) return;
    const sync = () => setGranted(getStoredPreferences().marketing);
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // One PageView per client-side route change — the SPA never reloads.
  useEffect(() => {
    if (!(granted && PIXEL_ID)) return;
    if (!window.fbq) loadPixel(PIXEL_ID);
    window.fbq?.("track", "PageView");
  }, [granted, pathname]);

  return null;
}
