import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DiscoveryLandingLayout } from "@/components/discovery/DiscoveryLandingLayout";
import { generateDiscoveryMetadata } from "@/lib/discovery/generate-metadata";
import {
  getAllLandingPageSlugs,
  getLandingPageConfig,
} from "@/lib/discovery/landing-pages";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllLandingPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const landing = getLandingPageConfig(slug);
  return landing ? generateDiscoveryMetadata(landing) : {};
}

/**
 * /coffees/[slug] — programmatic discovery landing pages only.
 * Any slug that isn't a known landing config 404s. Canonical coffee detail
 * pages live at /roasters/[roaster]/coffees/[slug].
 */
export default async function CoffeesSlugPage({ params }: Props) {
  const { slug } = await params;

  const landing = getLandingPageConfig(slug);
  if (landing) {
    return <DiscoveryLandingLayout config={landing} />;
  }

  notFound();
}
