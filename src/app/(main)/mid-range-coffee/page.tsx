// src/app/500-1000/page.tsx
import type { Metadata } from "next";
import { DiscoveryLandingLayout } from "@/components/discovery/DiscoveryLandingLayout";
import { generateDiscoveryMetadata } from "@/lib/discovery/generate-metadata";
import { getLandingPageConfig } from "@/lib/discovery/landing-pages";

export async function generateMetadata(): Promise<Metadata> {
  const config = getLandingPageConfig("mid-range-coffee");
  if (!config) {
    return {
      title: "Coffees ₹500-₹1000 | Indian Coffee Beans",
    };
  }
  return generateDiscoveryMetadata(config);
}

export default async function Price500To1000Page() {
  const config = getLandingPageConfig("mid-range-coffee");
  if (!config) {
    return <div>Page not found</div>;
  }
  return <DiscoveryLandingLayout config={config} />;
}
