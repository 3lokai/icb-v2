"use client";

import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/image";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

interface CoffeeSpotlightProps {
  value: {
    coffeeId?: string;
    // Legacy support
    image?: any;
    name?: string;
    description?: string;
    tags?: string[];
    link?: string;
  };
}

function SpotlightCard({
  data,
  isLegacy = false,
}: {
  data: any;
  isLegacy?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="not-prose group my-12 overflow-hidden rounded-2xl border border-border/40 bg-card shadow-lg transition-all hover:shadow-2xl hover:border-border/80"
    >
      <div className="flex flex-col gap-8 p-6 md:flex-row md:items-center lg:p-10">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-muted/50 md:w-48 lg:w-56 shadow-inner">
          <Image
            src={
              isLegacy
                ? urlFor(data.image).width(600).height(600).url()
                : data.image_url
            }
            alt={data.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h4 className="text-title font-bold text-foreground leading-tight tracking-tight">
                {data.name}
              </h4>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20"
              >
                Coffee
              </Badge>
            </div>
            <p className="text-body-large font-medium text-muted-foreground/80 italic font-serif">
              {isLegacy ? "Specialty Coffee" : data.roaster_name}
            </p>
          </div>

          <p className="text-body text-muted-foreground leading-relaxed line-clamp-2 lg:line-clamp-3">
            {isLegacy
              ? data.description
              : `Experience the unique flavor profile of ${data.name}. This ${data.process || "carefully processed"} coffee offers a balanced and distinctive cup.`}
          </p>

          <div className="flex flex-wrap gap-2">
            {(isLegacy ? data.tags : data.flavor_notes_canonical)
              ?.slice(0, 4)
              .map((note: string) => (
                <Badge
                  key={note}
                  variant="outline"
                  className="text-micro font-bold uppercase tracking-widest bg-muted/30 border-border/50 text-muted-foreground/80"
                >
                  {note}
                </Badge>
              ))}
          </div>

          <div className="pt-4">
            <Button
              asChild
              variant="default"
              size="lg"
              className="rounded-xl shadow-md transition-all hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0"
            >
              <Link
                href={
                  isLegacy
                    ? data.link || "#"
                    : `/roasters/${data.roaster_slug}/coffees/${data.slug}`
                }
              >
                View Beans <Icon name="Coffee" size={18} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CoffeeSpotlight({ value }: CoffeeSpotlightProps) {
  const { data: coffee, isLoading } = useQuery({
    queryKey: ["coffee-spotlight", value.coffeeId],
    queryFn: async () => {
      if (!value.coffeeId) return null;
      const res = await fetch(`/api/coffees/${value.coffeeId}`);
      if (!res.ok) throw new Error("Failed to fetch coffee");
      return res.json();
    },
    enabled: !!value.coffeeId,
  });

  if (value.coffeeId && isLoading) {
    return (
      <div className="h-64 w-full animate-pulse rounded-2xl bg-muted/50 border border-border/20" />
    );
  }

  // Handle studio-icb (dynamic fetch)
  if (value.coffeeId && coffee) {
    return <SpotlightCard data={coffee} />;
  }

  // Legacy support for filled-in data
  if (!value.coffeeId && value.name) {
    return <SpotlightCard data={value} isLegacy />;
  }

  return null;
}
