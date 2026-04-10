"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Stack } from "@/components/primitives/stack";

type CurationGalleryProps = {
  images: string[];
};

export function CurationGallery({ images }: CurationGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl w-full px-4 md:px-6 lg:px-8">
        {/* Mobile: Simple stacked layout */}
        <Stack gap="3" className="md:hidden">
          <div className="grid grid-cols-2 gap-3">
            {images.slice(0, 4).map((image, i) => (
              <div
                key={i}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-2xl bg-muted grayscale hover:grayscale-0 transition-all duration-500",
                  i === 0 && "col-span-2 aspect-[16/9]"
                )}
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
        </Stack>

        {/* Desktop: Elegant Bento grid layout */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-12 md:gap-4 lg:gap-6 auto-rows-[280px]">
          {images.slice(0, 5).map((image, i) => (
            <div
              key={i}
              className={cn(
                "relative overflow-hidden rounded-[2rem] border-border/10 bg-muted grayscale hover:grayscale-0 transition-all duration-1000 group",
                i === 0 && "md:col-span-2 lg:col-span-6 md:row-span-2",
                i === 1 && "md:col-span-2 lg:col-span-3 md:row-span-1",
                i === 2 && "md:col-span-2 lg:col-span-3 md:row-span-2",
                i === 3 && "md:col-span-2 lg:col-span-3 md:row-span-1",
                i === 4 && "md:col-span-2 lg:col-span-3 md:row-span-1"
              )}
            >
              <Image
                src={image}
                alt={`Atmospheric shot ${i + 1}`}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
