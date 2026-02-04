"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { CurationPartner } from "./types";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Icon } from "@/components/common/Icon";
import { Card } from "@/components/ui/card";

type CurationGalleryProps = {
  images: string[];
  partner: CurationPartner;
};

export function CurationGallery({ images, partner }: CurationGalleryProps) {
  return (
    <>
      {/* Mobile: Simple stacked layout */}
      <Stack gap="1" className="md:hidden">
        {/* Mobile: Simple stacked layout */}
        {/* Curated By Card */}
        <Card className="bg-card border-border/40 rounded-2xl p-5 flex flex-col justify-center">
          <Cluster gap="4" align="center">
            <div className="relative h-14 w-14 overflow-hidden rounded-full border border-border/40 flex-shrink-0">
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-cover"
              />
            </div>
            <Stack gap="1" className="flex-1 min-w-0">
              <span className="text-overline text-accent">CURATED BY</span>
              <h2 className="text-subheading">{partner.name}</h2>
              <Cluster gap="2" align="center">
                <Icon
                  name="MapPin"
                  size={12}
                  className="text-muted-foreground"
                />
                <span className="text-caption">{partner.location}</span>
              </Cluster>
            </Stack>
          </Cluster>

          <Cluster
            gap="3"
            align="center"
            className="mt-4 pt-4 border-t border-border/40"
          >
            {partner.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label={link.platform}
              >
                <Icon
                  name={
                    link.platform === "instagram"
                      ? "InstagramLogo"
                      : link.platform === "twitter"
                        ? "XLogo"
                        : "Globe"
                  }
                  size={18}
                />
              </a>
            ))}
            {partner.tags.length > 0 && (
              <>
                <span className="h-3 w-px bg-border" />
                {partner.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-label">
                    {tag}
                  </span>
                ))}
              </>
            )}
          </Cluster>
        </Card>

        {/* Mobile: 2-column image grid */}
        <div className="grid grid-cols-2 gap-3">
          {images.slice(0, 2).map((image, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted"
            >
              <Image
                src={image}
                alt={`Atmospheric shot ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Partner Story */}
        <Card className="bg-card border-border/40 rounded-2xl p-5">
          <Icon
            name="Quotes"
            size={24}
            className="text-accent/20 rotate-180 mb-2"
          />
          <p className="text-body text-muted-foreground font-serif italic line-clamp-4">
            {partner.story}
          </p>
        </Card>
      </Stack>

      {/* Desktop: Bento grid layout */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[260px]">
        {/* Curated By Card */}
        <Card className="md:col-span-2 lg:col-span-2 bg-card border-border/40 rounded-3xl p-8 flex flex-col justify-center overflow-hidden relative">
          <Cluster gap="4" align="center" className="relative z-10">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border/40 flex-shrink-0">
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <Stack gap="2" className="flex-1 min-w-0">
              <Stack gap="1">
                <span className="text-overline text-accent">CURATED BY</span>
                <h2 className="text-heading">{partner.name}</h2>
                <Cluster gap="2" align="center">
                  <Icon
                    name="MapPin"
                    size={12}
                    className="text-muted-foreground"
                  />
                  <span className="text-caption">{partner.location}</span>
                </Cluster>
              </Stack>

              <Cluster gap="3" align="center">
                {partner.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-accent transition-colors"
                    aria-label={link.platform}
                  >
                    <Icon
                      name={
                        link.platform === "instagram"
                          ? "InstagramLogo"
                          : link.platform === "twitter"
                            ? "XLogo"
                            : "Globe"
                      }
                      size={16}
                    />
                  </a>
                ))}
                {partner.tags.length > 0 && (
                  <>
                    <span className="h-3 w-px bg-border" />
                    {partner.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-label">
                        {tag}
                      </span>
                    ))}
                  </>
                )}
              </Cluster>
            </Stack>
          </Cluster>
        </Card>

        {/* Atmospheric Images */}
        {images.slice(0, 3).map((image, i) => (
          <Card
            key={i}
            className={cn(
              "relative overflow-hidden rounded-3xl border-none bg-muted grayscale hover:grayscale-0 transition-all duration-700 group",
              i === 0 && "md:col-span-1 lg:col-span-2",
              i === 1 && "md:col-span-1 md:row-span-2",
              i === 2 && "md:col-span-2 lg:col-span-1"
            )}
          >
            <Image
              src={image}
              alt={`Atmospheric shot ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Card>
        ))}

        {/* Partner Story */}
        <Card className="md:col-span-2 lg:col-span-3 bg-card border-border/40 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <Icon
              name="Quotes"
              size={32}
              className="text-accent/20 rotate-180 mb-3"
            />
            <p className="text-body-large text-muted-foreground font-serif italic">
              {partner.story}
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
