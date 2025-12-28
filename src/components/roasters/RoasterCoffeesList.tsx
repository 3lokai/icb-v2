"use client";

import Link from "next/link";
import type { RoasterDetail } from "@/types/roaster-types";
import CoffeeCard from "@/components/cards/CoffeeCard";

type RoasterCoffeesListProps = {
  roaster: RoasterDetail;
};

export function RoasterCoffeesList({ roaster }: RoasterCoffeesListProps) {
  if (!roaster.coffees || roaster.coffees.length === 0) {
    return null;
  }

  const displayedCoffees = roaster.coffees.slice(0, 12);
  const hasMore = roaster.coffees.length > 12;

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-title">
          Coffees ({roaster.coffee_count || roaster.coffees.length})
        </h2>
        {hasMore && (
          <Link
            href={`/coffees?roasterIds=${roaster.id}`}
            className="text-body text-primary hover:underline"
          >
            View All →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayedCoffees.map((coffee) => {
          if (!coffee.coffee_id || !coffee.slug || !coffee.name) {
            return null;
          }
          return <CoffeeCard key={coffee.coffee_id} coffee={coffee} />;
        })}
      </div>
    </div>
  );
}
