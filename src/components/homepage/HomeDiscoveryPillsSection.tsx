"use client";

import { DiscoveryPillGrid } from "@/components/discovery/DiscoveryPillGrid";
import { Section } from "@/components/primitives/section";

/**
 * Homepage-ready wrapper around discovery pills.
 * Reuses the premium DiscoveryPillGrid but adds site-standard section spacing.
 */
export function HomeDiscoveryPillsSection() {
  return (
    <Section
      spacing="default"
      className="border-t border-border/40 pb-16 pt-12"
    >
      <DiscoveryPillGrid
        overline="Find Your Flavor"
        title={
          <>
            Explore by <span className="text-accent italic">Style.</span>
          </>
        }
        description="Fast-track your discovery by jumping directly into curated lists based on roast, brewing preference, or India's diverse growing regions."
      />
    </Section>
  );
}
