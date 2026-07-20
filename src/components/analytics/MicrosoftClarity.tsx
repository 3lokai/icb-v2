"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";
import { getStoredPreferences } from "@/hooks/use-cookie-consent";

// Referrer hostname / utm_source values that identify traffic arriving via a
// gen-AI assistant citing the site, so sessions can be filtered in Clarity.
const AI_REFERRER_SOURCES: Record<string, string> = {
  "chatgpt.com": "chatgpt",
  "chat.openai.com": "chatgpt",
  "perplexity.ai": "perplexity",
  "copilot.microsoft.com": "copilot",
  "gemini.google.com": "gemini",
  "claude.ai": "claude",
  "chat.deepseek.com": "deepseek",
  "grok.com": "grok",
  "you.com": "you",
};

function detectAiReferrer(): string | undefined {
  const utmSource = new URLSearchParams(window.location.search).get(
    "utm_source"
  );
  if (utmSource && AI_REFERRER_SOURCES[utmSource]) {
    return AI_REFERRER_SOURCES[utmSource];
  }

  try {
    const referrerHost = new URL(document.referrer).hostname;
    return AI_REFERRER_SOURCES[referrerHost];
  } catch {
    return undefined;
  }
}

export function MicrosoftClarity() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (!projectId) return;

    const isProd = process.env.NODE_ENV === "production";
    const enableAnalytics = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname.startsWith("localhost:") ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("127.0.0.1:");
    const shouldInit = enableAnalytics || (isProd && !isLocalhost);
    if (!shouldInit) return;

    // ponytail: Clarity is best-effort — ad-block scriptlets neuter window.clarity;
    // a throw here must not surface (consent/setTag call window.clarity bare).
    const init = () => {
      try {
        Clarity.init(projectId);
        Clarity.consent(getStoredPreferences().analytics);

        const aiSource = detectAiReferrer();
        if (aiSource) {
          Clarity.setTag("ai_referrer", aiSource);
          Clarity.setTag("traffic_type", "ai");
        }
      } catch {
        // Clarity unavailable (blocked or neutered) — nothing to do.
      }
    };

    // Defer past first paint so the Clarity script fetch doesn't compete with LCP.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(init, { timeout: 5000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(init, 2000);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
