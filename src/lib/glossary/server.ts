// src/lib/glossary/server.ts

import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { GlossaryTerm, parseGlossaryMarkdown } from "@/lib/glossary/parser";

type CachedGlossary = {
  terms: GlossaryTerm[];
  timestamp: number;
  fileModified: number;
};

let cachedGlossary: CachedGlossary | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function getGlossaryTermsServer(): GlossaryTerm[] {
  try {
    const glossaryPath = path.join(process.cwd(), "glossary.md");
    const stats = statSync(glossaryPath);
    const fileModified = stats.mtime.getTime();
    const now = Date.now();

    // Check if we have valid cached data
    if (
      cachedGlossary &&
      now - cachedGlossary.timestamp < CACHE_DURATION &&
      cachedGlossary.fileModified === fileModified
    ) {
      return cachedGlossary.terms;
    }

    // Read and parse file
    const content = readFileSync(glossaryPath, "utf-8");
    const terms = parseGlossaryMarkdown(content);

    // Cache the results
    cachedGlossary = {
      terms,
      timestamp: now,
      fileModified,
    };

    return terms;
  } catch {
    return cachedGlossary?.terms || [];
  }
}

// Optional: Pre-warm the cache at startup
export function preloadGlossary() {
  try {
    getGlossaryTermsServer();
  } catch {
    // Silent fail - cache will be populated on first request
  }
}
