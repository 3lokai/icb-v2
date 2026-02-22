import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface RegionCollectionProps {
  value: {
    title?: string;
    description?: string;
    type?: "dynamic" | "manual";
    regionIds?: string[];
    // Filters
    states?: string[];
    climate?: string[];
    mainVarieties?: string[];
    isFeatured?: boolean;
    isPopular?: boolean;
    limit?: number;
    columns?: number;
    showMoreButton?: boolean;
    moreUrl?: string;
    moreText?: string;
  };
}

export function RegionCollection({ value }: RegionCollectionProps) {
  const {
    title,
    description,
    showMoreButton = true,
    moreUrl,
    moreText = "Explore All Regions",
  } = value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="not-prose group my-16 overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-emerald-500/[0.02] to-transparent p-8 lg:p-12 text-center transition-all hover:shadow-xl hover:border-emerald-500/40"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
          <Icon name="MapPin" size={32} />
        </div>
      </motion.div>

      <h4 className="font-bold text-title mb-4 text-foreground tracking-tight underline decoration-emerald-500/20 decoration-4 underline-offset-8">
        {title || "Coffee Regions"}
      </h4>

      <p className="text-body-large text-muted-foreground/90 mb-8 max-w-xl mx-auto italic font-serif leading-relaxed">
        {description ||
          "Explore the unique terroirs and flavors from across India's coffee-growing states, from Baba Budangiri to Araku Valley."}
      </p>

      {showMoreButton && (
        <Button
          asChild
          variant="default"
          size="lg"
          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all hover:translate-y-[-2px] px-10"
        >
          <Link href={moreUrl || "/regions"} className="font-bold">
            {moreText} <Icon name="ArrowRight" size={18} className="ml-2" />
          </Link>
        </Button>
      )}

      <div className="absolute top-0 left-0 -ml-16 -mt-16 size-64 rounded-full bg-emerald-500/5 blur-3xl" />
    </motion.div>
  );
}
