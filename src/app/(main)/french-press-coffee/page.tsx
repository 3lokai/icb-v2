// src/app/french-press-coffee/page.tsx
import type { Metadata } from "next";
import { DiscoveryLandingLayout } from "@/components/discovery/DiscoveryLandingLayout";
import { generateDiscoveryMetadata } from "@/lib/discovery/generate-metadata";
import { getLandingPageConfig } from "@/lib/discovery/landing-pages";

export async function generateMetadata(): Promise<Metadata> {
  const config = getLandingPageConfig("french-press-coffee");
  if (!config) {
    return {
      title: "French Press Coffee | Indian Coffee Beans",
    };
  }
  return generateDiscoveryMetadata(config);
}

export default async function FrenchPressCoffeePage() {
  const config = getLandingPageConfig("french-press-coffee");
  if (!config) {
    return <div>Page not found</div>;
  }
  return <DiscoveryLandingLayout config={config} />;
}
