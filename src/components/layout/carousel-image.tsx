"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { coffeeImagePresets, generateBlurPlaceholder } from "@/lib/imagekit";
import type { CoffeeImage } from "@/types/coffee-component-types";

type CoffeeImageCarouselProps = {
  images: CoffeeImage[];
  className?: string;
  coffeeName?: string;
};

export default function CoffeeImageCarousel({
  images,
  className,
  coffeeName = "Coffee",
}: CoffeeImageCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!api) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        api.scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        api.scrollNext();
      } else if (event.key === "Home") {
        event.preventDefault();
        api.scrollTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        api.scrollTo(count - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [api, count]);

  const handleThumbClick = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  // Handle empty or single image cases
  if (images.length === 0) {
    return (
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-lg",
          className
        )}
      >
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <span className="text-muted-foreground">No images available</span>
        </div>
      </div>
    );
  }

  const hasMultipleImages = images.length > 1;

  return (
    <div className={cn("w-full", className)}>
      {/* Main Carousel */}
      <Carousel
        setApi={setApi}
        className="w-full"
        aria-label={`${coffeeName} image carousel`}
      >
        <CarouselContent>
          {images.map((image, index) => {
            const imageUrl = image.imagekit_url || null;
            const altText = image.alt || `${coffeeName} - Image ${index + 1}`;
            const processedUrl = coffeeImagePresets.coffeeDetail(imageUrl);
            const blurDataUrl = imageUrl
              ? generateBlurPlaceholder(imageUrl)
              : undefined;

            return (
              <CarouselItem key={image.id}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <Image
                    alt={altText}
                    className="object-cover"
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
                    src={processedUrl}
                    {...(blurDataUrl && {
                      placeholder: "blur",
                      blurDataURL: blurDataUrl,
                    })}
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {hasMultipleImages && (
          <>
            <CarouselPrevious aria-label="Previous image" />
            <CarouselNext aria-label="Next image" />
          </>
        )}
      </Carousel>

      {/* Thumbnail Carousel - Only show if multiple images */}
      {hasMultipleImages && (
        <Carousel className="mt-4 w-full" aria-label="Image thumbnails">
          <CarouselContent className="flex my-1">
            {images.map((image, index) => {
              const imageUrl = image.imagekit_url || null;
              const altText =
                image.alt || `${coffeeName} - Thumbnail ${index + 1}`;
              const isActive = current === index + 1;

              return (
                <CarouselItem
                  key={image.id}
                  className={cn(
                    "basis-1/6 cursor-pointer",
                    isActive ? "opacity-100" : "opacity-50 hover:opacity-75"
                  )}
                  onClick={() => handleThumbClick(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleThumbClick(index);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${altText}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <Card className="aspect-square p-0 overflow-hidden">
                    <CardContent className="p-0 relative h-full w-full">
                      <Image
                        alt={altText}
                        className="object-cover"
                        fill
                        loading="lazy"
                        sizes="100px"
                        src={coffeeImagePresets.coffeeThumbnail(imageUrl)}
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
}
