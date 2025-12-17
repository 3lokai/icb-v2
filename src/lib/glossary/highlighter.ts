// src/lib/glossary/highlighter.ts

import { GlossaryTerm } from "./parser";

export function highlightGlossaryTerms(
  htmlContent: string,
  terms: GlossaryTerm[]
): string {
  if (!terms.length) {
    return htmlContent;
  }

  const termMap = new Map<string, GlossaryTerm>();
  for (const term of terms) {
    termMap.set(term.term.toLowerCase(), term);
    if (term.aliases) {
      for (const alias of term.aliases) {
        termMap.set(alias.toLowerCase(), term);
      }
    }
  }

  const sortedTerms = Array.from(termMap.keys()).sort(
    (a, b) => b.length - a.length
  );

  let result = htmlContent;

  for (const termText of sortedTerms) {
    const term = termMap.get(termText)!;

    // Better regex that avoids HTML tags and existing highlights
    const regex = new RegExp(
      `(?<!<[^>]*?)\\b(${escapeRegex(termText)})\\b(?![^<]*?>)(?![^<]*?</span>)`,
      "gi"
    );

    result = result.replace(
      regex,
      (match) =>
        `<span class="glossary-term" data-term="${escapeHtml(term.term)}" data-definition="${escapeHtml(term.definition)}" title="${escapeHtml(term.definition)}">${match}</span>`
    );
  }

  return result;
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
