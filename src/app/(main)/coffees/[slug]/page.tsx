import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { fetchCoffeesBySlugOnly } from "@/lib/data/fetch-coffee-by-slug";
import { coffeeDetailHref } from "@/lib/utils/coffee-url";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Legacy coffee detail route: /coffees/[slug]
 * - 0 matches → notFound()
 * - 1 match → 301 redirect to /roasters/{roasterSlug}/coffees/{coffeeSlug}
 * - 2+ matches → disambiguation page
 */
export default async function LegacyCoffeeSlugPage({ params }: Props) {
  const { slug } = await params;
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

  // Disambiguation: multiple roasters have a coffee with this slug
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-display font-serif italic mb-2">
        Multiple roasters have a coffee with this name
      </h1>
      <p className="text-body text-muted-foreground mb-8">
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
