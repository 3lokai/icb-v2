// src/app/light-roast/page.tsx
import type { Metadata } from "next";
import { DiscoveryLandingLayout } from "@/components/discovery/DiscoveryLandingLayout";
import { generateDiscoveryMetadata } from "@/lib/discovery/generate-metadata";
import { getLandingPageConfig } from "@/lib/discovery/landing-pages";

export async function generateMetadata(): Promise<Metadata> {
  const config = getLandingPageConfig("light-roast");
  if (!config) {
    return {
      title: "Light Roast Coffee | Indian Coffee Beans",
    };
  }
  return generateDiscoveryMetadata(config);
}

export default async function LightRoastPage() {
  const config = getLandingPageConfig("light-roast");
  if (!config) {
    return <div>Page not found</div>;
  }
  return <DiscoveryLandingLayout config={config} />;
}
