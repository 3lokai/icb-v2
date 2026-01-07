// src/app/medium-roast/page.tsx
import type { Metadata } from "next";
import { DiscoveryLandingLayout } from "@/components/discovery/DiscoveryLandingLayout";
import { generateDiscoveryMetadata } from "@/lib/discovery/generate-metadata";
import { getLandingPageConfig } from "@/lib/discovery/landing-pages";

export async function generateMetadata(): Promise<Metadata> {
  const config = getLandingPageConfig("medium-roast");
  if (!config) {
    return {
      title: "Medium Roast Coffee | Indian Coffee Beans",
    };
  }
  return generateDiscoveryMetadata(config);
}

export default async function MediumRoastPage() {
  const config = getLandingPageConfig("medium-roast");
  if (!config) {
    return <div>Page not found</div>;
  }
  return <DiscoveryLandingLayout config={config} />;
}
