// src/app/dark-roast/page.tsx
import type { Metadata } from "next";
import { DiscoveryLandingLayout } from "@/components/discovery/DiscoveryLandingLayout";
import { generateDiscoveryMetadata } from "@/lib/discovery/generate-metadata";
import { getLandingPageConfig } from "@/lib/discovery/landing-pages";

export async function generateMetadata(): Promise<Metadata> {
  const config = getLandingPageConfig("dark-roast");
  if (!config) {
    return {
      title: "Dark Roast Coffee | Indian Coffee Beans",
    };
  }
  return generateDiscoveryMetadata(config);
}

export default async function DarkRoastPage() {
  const config = getLandingPageConfig("dark-roast");
  if (!config) {
    return <div>Page not found</div>;
  }
  return <DiscoveryLandingLayout config={config} />;
}
