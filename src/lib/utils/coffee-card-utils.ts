/**
 * Helper utilities for formatting coffee metadata for card display
 * Transforms keys from coffee_directory_mv into human-readable labels
 */

/**
 * Format flavor keys into readable labels
 * E.g., ["citrus", "floral", "honey"] => ["Citrus", "Floral", "Honey"]
 */
export function formatFlavorLabels(
  flavorKeys: string[] | null | undefined,
  maxCount: number = 4
): string[] {
  if (!flavorKeys || flavorKeys.length === 0) {
    return [];
  }

  return flavorKeys.slice(0, maxCount).map((key) => {
    // Capitalize first letter, replace hyphens/underscores with spaces
    return key
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  });
}

/**
 * Format brew method canonical keys into readable labels
 * Maps grind_enum values to common brew method names
 */
export function formatBrewMethodLabels(
  brewMethodKeys: string[] | null | undefined
): string[] {
  if (!brewMethodKeys || brewMethodKeys.length === 0) {
    return [];
  }

  const brewMethodMap: Record<string, string> = {
    // Espresso-based
    espresso: "Espresso",
    moka_pot: "Moka Pot",

    // Pour over
    v60: "V60",
    chemex: "Chemex",
    kalita: "Kalita Wave",

    // Immersion
    french_press: "French Press",
    aeropress: "AeroPress",
    clever: "Clever Dripper",

    // Cold brew
    cold_brew: "Cold Brew",

    // Other
    batch_brew: "Batch Brew",
    siphon: "Siphon",
    turkish: "Turkish",

    // Generic fallback
    whole_bean: "Whole Bean",
    ground: "Ground",
  };

  return brewMethodKeys
    .map(
      (key) => brewMethodMap[key] || key.charAt(0).toUpperCase() + key.slice(1)
    )
    .slice(0, 2); // Limit to 2 brew methods max
}

/**
 * Format roast level for display
 */
export function formatRoastLevel(
  roastLevel: string | null | undefined,
  roastLevelRaw: string | null | undefined,
  roastStyleRaw: string | null | undefined
): string | null {
  // Prefer raw values for more specific display
  if (roastLevelRaw) {
    return capitalizeFirstLetter(roastLevelRaw);
  }
  if (roastStyleRaw) {
    return capitalizeFirstLetter(roastStyleRaw);
  }
  if (roastLevel) {
    return capitalizeFirstLetter(roastLevel);
  }
  return null;
}

/**
 * Format process for display
 */
export function formatProcess(
  process: string | null | undefined,
  processRaw: string | null | undefined
): string | null {
  // Prefer raw values for more specific display
  if (processRaw) {
    return capitalizeFirstLetter(processRaw);
  }
  if (process) {
    return capitalizeFirstLetter(process);
  }
  return null;
}

/**
 * Simple capitalize helper
 */
function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
