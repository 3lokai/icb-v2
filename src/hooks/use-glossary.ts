// src/hooks/use-glossary.ts

import { readFileSync } from "node:fs";
import path from "node:path";
import { GlossaryTerm, parseGlossaryMarkdown } from "@/lib/glossary/parser";

let cachedTerms: GlossaryTerm[] | null = null;

export function getGlossaryTerms(): GlossaryTerm[] {
  if (cachedTerms) {
    return cachedTerms;
  }

  try {
    const glossaryPath = path.join(process.cwd(), "glossary.md");
    const glossaryContent = readFileSync(glossaryPath, "utf-8");
    cachedTerms = parseGlossaryMarkdown(glossaryContent);
    return cachedTerms;
  } catch {
    return [];
  }
}
