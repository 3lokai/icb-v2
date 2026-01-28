// src/app/under-500/page.tsx
import type { Metadata } from "next";
import { DiscoveryLandingLayout } from "@/components/discovery/DiscoveryLandingLayout";
import { generateDiscoveryMetadata } from "@/lib/discovery/generate-metadata";
import { getLandingPageConfig } from "@/lib/discovery/landing-pages";

export async function generateMetadata(): Promise<Metadata> {
  const config = getLandingPageConfig("budget-coffee");
  if (!config) {
    return {
      title: "Coffees Under ₹500 | Indian Coffee Beans",
    };
  }
  return generateDiscoveryMetadata(config);
}

export default async function Under500Page() {
  const config = getLandingPageConfig("budget-coffee");
  if (!config) {
    return <div>Page not found</div>;
  }
  return <DiscoveryLandingLayout config={config} />;
}
