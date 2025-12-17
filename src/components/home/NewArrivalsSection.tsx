// src/components/home/NewArrivalsSection.tsx
import Link from "next/link";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { Icon } from "@/components/common/Icon";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useNewArrivalCoffees } from "@/hooks/useHomePageQueries";

export default function NewArrivalsSection() {
  const { data: coffees = [], isLoading } = useNewArrivalCoffees(6);
  if (isLoading) {
    return (
      <section className="mb-20 bg-muted/30 py-16">
        <div className="container-default">
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (coffees.length === 0) {
    return (
      <section className="mb-20 bg-muted/30 py-16">
        <div className="container-default">
          <div className="py-16 text-center">
            <h2 className="mb-4 text-heading text-primary">New Arrivals</h2>
            <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
            <p className="text-body text-muted-foreground">
              New arrivals coming soon...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-20 bg-muted/30 py-16">
      <div className="container-default">
        <div className="mb-8 flex-between">
          <div>
            <h2 className="mb-4 text-heading text-primary">New Arrivals</h2>
            <div className="mb-6 h-1 w-16 rounded-full bg-accent" />
            <p className="text-body text-muted-foreground">
              The latest additions to our roster of exceptional Indian coffee
              beans, featuring freshly roasted delights.
            </p>
          </div>
          <Link className="hidden md:block" href="/coffees">
            <Button className="group" variant="outline">
              Browse All Coffees
              <Icon
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                name="ArrowRight"
              />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coffees.map((coffee) => (
            <CoffeeCard coffee={coffee} key={coffee.id} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/coffees">
            <Button className="group w-full sm:w-auto" variant="outline">
              Browse All Coffees
              <Icon
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                name="ArrowRight"
              />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
