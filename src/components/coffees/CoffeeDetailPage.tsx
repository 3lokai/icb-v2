"use client";

import Link from "next/link";
import type { CoffeeDetail } from "@/types/coffee-types";
import CoffeeImageCarousel from "@/components/carousel-image";
import { CoffeeCoreDetails } from "./CoffeeCoreDetails";
import { CoffeePricing } from "./CoffeePricing";
import { CoffeeBuyButton } from "./CoffeeBuyButton";
import { cn } from "@/lib/utils";

type CoffeeDetailPageProps = {
  coffee: CoffeeDetail;
  className?: string;
};

export function CoffeeDetailPage({ coffee, className }: CoffeeDetailPageProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-caption text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href="/coffees"
              className="hover:text-foreground transition-colors"
            >
              Coffees
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{coffee.name}</li>
        </ol>
      </nav>

      {/* Main Content - Amazon-like layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Image Carousel */}
        <div>
          <CoffeeImageCarousel
            coffeeName={coffee.name}
            images={coffee.images}
          />
        </div>

        {/* Right: Product Details */}
        <div className="stack-lg">
          <CoffeeCoreDetails coffee={coffee} />
          <CoffeePricing coffee={coffee} />
          <CoffeeBuyButton coffee={coffee} />
        </div>
      </div>
    </div>
  );
}
