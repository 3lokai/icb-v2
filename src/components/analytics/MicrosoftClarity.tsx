"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";
import { getStoredPreferences } from "@/hooks/use-cookie-consent";
import { env } from "../../../env";

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
    const projectId = env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (!projectId) return;

    const isProd = process.env.NODE_ENV === "production";
    const enableAnalytics = env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname.startsWith("localhost:") ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("127.0.0.1:");
    const shouldInit = enableAnalytics || (isProd && !isLocalhost);
    if (!shouldInit) return;

    if (!getStoredPreferences().analytics) return;

    Clarity.init(projectId);

    const aiSource = detectAiReferrer();
    if (aiSource) {
      Clarity.setTag("ai_referrer", aiSource);
      Clarity.setTag("traffic_type", "ai");
    }
  }, []);

  return null;
}
