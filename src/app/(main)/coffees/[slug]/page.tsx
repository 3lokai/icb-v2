import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { DiscoveryLandingLayout } from "@/components/discovery/DiscoveryLandingLayout";
import { generateDiscoveryMetadata } from "@/lib/discovery/generate-metadata";
import {
  getAllLandingPageSlugs,
  getLandingPageConfig,
} from "@/lib/discovery/landing-pages";
import { fetchCoffeesBySlugOnly } from "@/lib/data/fetch-coffee-by-slug";
import { coffeeDetailHref } from "@/lib/utils/coffee-url";
import { Button } from "@/components/ui/button";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import StructuredData from "@/components/seo/StructuredData";
import {
  generateFAQSchema,
  generateBreadcrumbSchema,
  breadcrumbUrl,
} from "@/lib/seo/schema";

type Props = {
  params: Promise<{ slug: string }>;
};

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

export async function generateStaticParams() {
  return getAllLandingPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const landing = getLandingPageConfig(slug);
  if (landing) {
    return generateDiscoveryMetadata(landing);
  }
  return generateSEOMetadata({
    title: "Coffee Disambiguation | Indian Coffee Beans",
    description:
      "Multiple roasters have a coffee with this name. Choose a roaster to view the coffee.",
    canonical: `${baseUrl}/coffees/${slug}`,
    noIndex: true,
  });
}

/**
 * /coffees/[slug]
 * - Known discovery slugs → discovery landing layout
 * - Otherwise legacy coffee slug: redirect or disambiguate when multiple roasters share a coffee slug
 */
export default async function CoffeesSlugPage({ params }: Props) {
  const { slug } = await params;

  const landing = getLandingPageConfig(slug);
  if (landing) {
    const faqSchema = generateFAQSchema(landing.faqs);
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: "Home", url: breadcrumbUrl("/") },
      { name: "Coffees", url: breadcrumbUrl("/coffees") },
      { name: landing.h1, url: breadcrumbUrl(`/coffees/${landing.slug}`) },
    ]);
    return (
      <>
        <StructuredData schema={[faqSchema, breadcrumbSchema]} />
        <DiscoveryLandingLayout config={landing} />
      </>
    );
  }

  const coffees = await fetchCoffeesBySlugOnly(slug);

  if (coffees.length === 0) {
    notFound();
  }

  if (coffees.length === 1) {
    const coffee = coffees[0];
    if (coffee.roaster?.slug && coffee.slug) {
      permanentRedirect(coffeeDetailHref(coffee.roaster.slug, coffee.slug));
    }
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-display mb-2 font-serif italic">
        Multiple roasters have a coffee with this name
      </h1>
      <p className="text-body mb-8 text-muted-foreground">
        Choose the roaster to view the coffee.
      </p>
      <ul className="space-y-3">
        {coffees.map((coffee) => (
          <li key={coffee.id}>
            {coffee.roaster?.slug && coffee.slug ? (
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link
                  href={coffeeDetailHref(coffee.roaster.slug, coffee.slug)}
                  className="inline-flex flex-col items-start gap-0.5 py-3"
                >
                  <span className="font-medium">{coffee.name}</span>
                  <span className="text-caption text-muted-foreground">
                    {coffee.roaster?.name}
                  </span>
                </Link>
              </Button>
            ) : (
              <span className="text-muted-foreground">
                {coffee.name} — {coffee.roaster?.name}
              </span>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Button asChild variant="outline">
          <Link href="/coffees">Browse All Coffees</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/roasters">Browse Roasters</Link>
        </Button>
      </div>
    </div>
  );
}
