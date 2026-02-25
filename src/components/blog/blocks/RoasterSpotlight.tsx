"use client";

import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/image";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

interface RoasterSpotlightProps {
  value: {
    roasterId?: string;
    // Legacy support
    image?: any;
    name?: string;
    description?: string;
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
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-white p-6 md:w-48 lg:w-56 shadow-sm border border-border/10">
          <Image
            src={
              isLegacy
                ? urlFor(data.image).width(400).height(400).url()
                : data.logo_url
            }
            alt={data.name}
            fill
            className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h4 className="text-title font-bold text-foreground leading-tight tracking-tight">
                {data.name}
              </h4>
              <Badge
                variant="secondary"
                className="bg-accent/10 text-accent border-accent/20"
              >
                Roaster
              </Badge>
            </div>
            <p className="text-body-large font-medium text-muted-foreground/80 italic font-serif">
              Professional Coffee Roasters
            </p>
          </div>

          <p className="text-body text-muted-foreground leading-relaxed line-clamp-2 lg:line-clamp-3">
            {data.description ||
              "Discover the passion and craft behind every roast from this exceptional Indian roaster."}
          </p>

          <div className="pt-4">
            <Button
              asChild
              variant="default"
              size="lg"
              className="rounded-xl shadow-md transition-all hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0"
            >
              <Link
                href={isLegacy ? data.link || "#" : `/roasters/${data.slug}`}
              >
                Visit Roaster{" "}
                <Icon name="ArrowRight" size={18} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function RoasterSpotlight({ value }: RoasterSpotlightProps) {
  const { data: roaster, isLoading } = useQuery({
    queryKey: ["roaster-spotlight", value.roasterId],
    queryFn: async () => {
      if (!value.roasterId) return null;
      const res = await fetch(`/api/roasters/${value.roasterId}`);
      if (!res.ok) throw new Error("Failed to fetch roaster");
      return res.json();
    },
    enabled: !!value.roasterId,
  });

  if (value.roasterId && isLoading) {
    return (
      <div className="h-64 w-full animate-pulse rounded-2xl bg-muted/50 border border-border/20" />
    );
  }

  // Handle studio-icb (dynamic fetch)
  if (value.roasterId && roaster) {
    return <SpotlightCard data={roaster} />;
  }

  // Legacy support for filled-in data
  if (!value.roasterId && value.name) {
    return <SpotlightCard data={value} isLegacy />;
  }

  return null;
}
