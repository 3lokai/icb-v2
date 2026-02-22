import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/image";
import { motion } from "motion/react";

interface RegionSpotlightProps {
  value: {
    regionId?: string;
    regionName?: string;
    // Legacy support
    image?: any;
    name?: string;
    description?: string;
    link?: string;
  };
}

export function RegionSpotlight({ value }: RegionSpotlightProps) {
  const name = value.regionName || value.name || "Coffee Region";
  const regionId = value.regionId;
  const description =
    value.description ||
    "Discover the unique terroir and profile of this Indian coffee growing region.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="not-prose group my-12 overflow-hidden rounded-2xl border border-border/40 bg-card shadow-lg transition-all hover:shadow-2xl hover:border-border/80"
    >
      <div className="flex flex-col gap-8 p-6 md:flex-row md:items-center lg:p-10">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-emerald-500/5 md:w-48 lg:w-56 shadow-inner border border-emerald-500/10">
          {value.image ? (
            <Image
              src={urlFor(value.image).width(600).height(600).url()}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Icon
                name="MapPin"
                size={48}
                className="text-emerald-500/20 group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 to-transparent" />
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h4 className="text-title font-bold text-foreground leading-tight tracking-tight">
                {name}
              </h4>
              <Badge
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              >
                Region
              </Badge>
            </div>
            <p className="text-body-large font-medium text-muted-foreground/80 italic font-serif">
              Indian Growing Region
            </p>
          </div>

          <p className="text-body text-muted-foreground leading-relaxed line-clamp-2 lg:line-clamp-3">
            {description}
          </p>

          <div className="pt-4">
            {(regionId || value.link) && (
              <Button
                asChild
                variant="default"
                size="lg"
                className="rounded-xl shadow-md transition-all hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0 bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href={value.link || `/regions/${regionId}`}>
                  Explore Region{" "}
                  <Icon name="MapPin" size={18} className="ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
