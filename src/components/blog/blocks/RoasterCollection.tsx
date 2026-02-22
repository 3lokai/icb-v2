import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import RoasterCard from "@/components/cards/RoasterCard";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface RoasterCollectionProps {
  value: {
    title?: string;
    description?: string;
    type?: "dynamic" | "manual";
    roasterIds?: string[];
    // Filters
    states?: string[];
    cities?: string[];
    hasPhysicalStore?: boolean;
    hasSubscription?: boolean;
    isVerified?: boolean;
    isFeatured?: boolean;
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

export function RoasterCollection({ value }: RoasterCollectionProps) {
  const {
    title,
    description,
    type = "dynamic",
    roasterIds,
    limit = 3,
    columns = 3,
    showMoreButton = true,
    moreUrl,
    moreText = "Explore Roasters",
  } = value;

  const { data, isLoading } = useQuery({
    queryKey: ["roaster-collection", value],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("limit", limit.toString());

      if (type === "manual" && roasterIds?.length) {
        params.set("roasterIds", roasterIds.join(","));
      } else {
        if (value.states?.length) params.set("states", value.states.join(","));
        if (value.cities?.length) params.set("cities", value.cities.join(","));
        if (value.hasPhysicalStore) params.set("hasPhysicalStore", "1");
        if (value.hasSubscription) params.set("hasSubscription", "1");
        if (value.isFeatured) params.set("isFeatured", "1");
        if (value.tags?.length) params.set("tags", value.tags.join(","));
      }

      const res = await fetch(`/api/roasters?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch roasters");
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
            <h4 className="text-title font-bold text-foreground tracking-tight underline decoration-accent/20 decoration-4 underline-offset-8">
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
              <motion.div
                key={i}
                variants={itemVariants}
                className="h-64 w-full animate-pulse rounded-2xl bg-muted/50 border border-border/20"
              />
            ))
          : data?.items?.map((roaster: any) => (
              <motion.div key={roaster.id} variants={itemVariants}>
                <RoasterCard roaster={roaster} />
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
            className="rounded-xl border-accent/20 text-accent hover:bg-accent/5 px-8"
          >
            <Link href={moreUrl || "/roasters"} className="font-bold">
              {moreText} <Icon name="ArrowRight" size={18} className="ml-2" />
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
