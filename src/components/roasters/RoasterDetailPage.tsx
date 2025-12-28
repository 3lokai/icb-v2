"use client";

import Link from "next/link";
import type { RoasterDetail } from "@/types/roaster-types";
import { RoasterHero } from "./RoasterHero";
import { RoasterStats } from "./RoasterStats";
import { RoasterCoffeesList } from "./RoasterCoffeesList";
import { RoasterAbout } from "./RoasterAbout";
import { RoasterLocation } from "./RoasterLocation";
import { RoasterSocialLinks } from "./RoasterSocialLinks";
import { cn } from "@/lib/utils";

type RoasterDetailPageProps = {
  roaster: RoasterDetail;
  className?: string;
};

export function RoasterDetailPage({
  roaster,
  className,
}: RoasterDetailPageProps) {
  return (
    <div className={cn("container-default section-spacing", className)}>
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
              href="/roasters"
              className="hover:text-foreground transition-colors"
            >
              Roasters
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{roaster.name}</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <RoasterHero roaster={roaster} />
      </div>

      {/* Stats Section */}
      <div className="mb-8">
        <RoasterStats roaster={roaster} />
      </div>

      {/* Coffees List */}
      <RoasterCoffeesList roaster={roaster} />

      {/* About Section */}
      <RoasterAbout roaster={roaster} />

      {/* Location and Social Links */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <RoasterLocation roaster={roaster} />
        <RoasterSocialLinks roaster={roaster} />
      </div>
    </div>
  );
}
