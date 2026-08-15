// src/lib/utils/roaster-tags.ts
import { ROAST_LEVELS, PROCESSING_METHODS } from "@/lib/utils/coffee-constants";
import { SPECIES_LABELS } from "@/types/coffee-types";
import type { SpeciesEnum } from "@/types/db-enums";

/**
 * Display helpers for the prefixed tags on the `roaster_similar` materialized view
 * (`focus:`, `roast:`, `process:`, `species:`, `variety:`, `sourcing:`, `cert:`).
 */

export function titleCase(value: string): string {
  return value.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Turn a prefixed similarity tag into something a human reads:
 *   "roast:medium_dark"           -> "Medium Dark roast"
 *   "process:carbonic_maceration" -> "Carbonic Maceration"
 *   "sourcing:direct-trade"       -> "Direct Trade"
 *   "variety:SLN 9"               -> "SLN 9"
 */
export function labelForTag(tag: string): string {
  const separator = tag.indexOf(":");
  if (separator === -1) {
    return titleCase(tag);
  }
  const prefix = tag.slice(0, separator);
  const value = tag.slice(separator + 1);

  if (prefix === "roast") {
    const label = ROAST_LEVELS.find((o) => o.value === value)?.label;
    return `${label ?? titleCase(value)} roast`;
  }
  if (prefix === "process") {
    return (
      PROCESSING_METHODS.find((o) => o.value === value)?.label ??
      titleCase(value)
    );
  }
  if (prefix === "species") {
    // Without this the blend enums render as "Arabica 80 Robusta 20".
    return SPECIES_LABELS[value as SpeciesEnum] ?? titleCase(value);
  }
  return titleCase(value);
}
