import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { CoffeeCardSkeleton } from "@/components/cards/CoffeeCardSkeleton";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface CoffeeCollectionProps {
  value: {
    title?: string;
    description?: string;
    type?: "dynamic" | "manual";
    coffeeIds?: string[];
    // Filters
    roastLevel?: string[];
    beanType?: string[];
    processingMethod?: string[];
    regions?: string[];
    roasters?: string[];
    isSingleOrigin?: boolean;
    isFeatured?: boolean;
    isSeasonal?: boolean;
    tags?: string[];
    limit?: number;
    columns?: number;
    showMoreButton?: boolean;
    moreUrl?: string;
    moreText?: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function CoffeeCollection({ value }: CoffeeCollectionProps) {
  const {
    title,
    description,
    type = "dynamic",
    coffeeIds,
    limit = 3,
    columns = 3,
    showMoreButton = true,
    moreUrl,
    moreText = "Explore Collection",
  } = value;

  const { data, isLoading } = useQuery({
    queryKey: ["coffee-collection", value],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("limit", limit.toString());

      if (type === "manual" && coffeeIds?.length) {
        params.set("coffeeIds", coffeeIds.join(","));
      } else {
        if (value.roastLevel?.length)
          params.set("roastLevels", value.roastLevel.join(","));
        if (value.beanType?.length)
          params.set("beanSpecies", value.beanType.join(","));
        if (value.processingMethod?.length)
          params.set("processes", value.processingMethod.join(","));
        if (value.regions?.length)
          params.set("regions", value.regions.join(","));
        if (value.roasters?.length)
          params.set("roasters", value.roasters.join(","));
        if (value.isSingleOrigin) params.set("isSingleOrigin", "1");
        if (value.isFeatured) params.set("isFeatured", "1");
        if (value.isSeasonal) params.set("isSeasonal", "1");
        if (value.tags?.length) params.set("tags", value.tags.join(","));
      }

      const res = await fetch(`/api/coffees?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch coffees");
      return res.json();
    },
  });

  const columnClass =
    {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    }[columns] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="not-prose my-16 w-full">
      {(title || description) && (
        <div className="mb-12 text-center space-y-3">
          {title && (
            <h4 className="text-title font-bold text-foreground tracking-tight underline decoration-primary/20 decoration-4 underline-offset-8">
              {title}
            </h4>
          )}
          {description && (
            <p className="mx-auto max-w-2xl text-body-large text-muted-foreground/80 italic font-serif">
              {description}
            </p>
          )}
        </div>
      )}

      <motion.div
        className={cn("grid gap-8", columnClass)}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {isLoading
          ? Array.from({ length: limit }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <CoffeeCardSkeleton />
              </motion.div>
            ))
          : data?.items?.map((coffee: any) => (
              <motion.div key={coffee.coffee_id} variants={itemVariants}>
                <CoffeeCard coffee={coffee} variant="compact" />
              </motion.div>
            ))}
      </motion.div>

      {showMoreButton && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 px-8"
          >
            <Link href={moreUrl || "/coffees"} className="font-bold">
              {moreText} <Icon name="ArrowRight" size={18} className="ml-2" />
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
