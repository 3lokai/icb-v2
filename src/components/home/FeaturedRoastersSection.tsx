import Link from "next/link";
import RoasterCard from "@/components/cards/RoasterCard";
import { Icon } from "@/components/common/Icon";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useFeaturedRoasters } from "@/hooks/useHomePageQueries";

// Remove the props interface - no longer needed
export default function FeaturedRoastersSection() {
  // Use the hook instead of props
  const { data: roasters = [], isLoading } = useFeaturedRoasters(6);

  // Add loading state
  if (isLoading) {
    return (
      <section className="mb-20">
        <div className="glass-panel card-padding rounded-2xl">
          <div className="container-default">
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Add empty state
  if (roasters.length === 0) {
    return (
      <section className="mb-20">
        <div className="glass-panel card-padding rounded-2xl">
          <div className="container-default">
            <div className="py-16 text-center">
              <h2 className="mb-4 text-heading text-primary">
                Featured Roasters
              </h2>
              <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
              <p className="text-body text-muted-foreground">
                Featured roasters coming soon...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-20">
      <div className="glass-panel card-padding rounded-2xl">
        <div className="container-default">
          <div className="mb-8 flex-between">
            <div>
              <h2 className="mb-4 text-heading text-primary">
                Featured Roasters
              </h2>
              <div className="mb-6 h-1 w-16 rounded-full bg-accent" />
              <p className="text-body text-muted-foreground">
                Discover India&apos;s finest specialty coffee roasters, each
                bringing a unique perspective and passion to their craft.
              </p>
            </div>
            <Link className="hidden md:block" href="/roasters">
              <Button className="group" variant="outline">
                View All Roasters
                <Icon
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  name="ArrowRight"
                />
              </Button>
            </Link>
          </div>

          <div className="grid-cards">
            {roasters.map((roaster) => (
              <RoasterCard key={roaster.id} roaster={roaster} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/roasters">
              <Button className="group w-full sm:w-auto" variant="outline">
                View All Roasters
                <Icon
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  name="ArrowRight"
                />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
