import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface SeriesNavigationProps {
  value: {
    title?: string;
    seriesSlug?: string;
    currentSlug?: string;
  };
}

export function SeriesNavigation({ value }: SeriesNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="not-prose group my-12 overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/5 via-accent/[0.02] to-transparent p-8 lg:p-12 shadow-sm transition-all hover:shadow-xl hover:border-accent/40"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <Icon name="ListBullets" size={24} />
            </div>
            <h4 className="text-title font-bold text-foreground">
              Series: {value.title || "Continue Learning"}
            </h4>
          </div>
          <p className="text-body-large text-muted-foreground/90 leading-relaxed font-serif italic">
            Part of our curated deep-dive series. Explore more articles in this
            collection to master your coffee knowledge.
          </p>
        </div>

        <div className="shrink-0">
          <Button
            asChild
            variant="default"
            size="lg"
            className="rounded-xl bg-accent hover:bg-accent/90 shadow-md transition-all hover:translate-y-[-2px] px-8"
          >
            <Link href="/learn" className="font-bold">
              View Collection{" "}
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 rounded-full bg-accent/5 blur-3xl" />
    </motion.div>
  );
}
