import Image from "next/image";
import { Stack } from "@/components/primitives/stack";

type PageHeaderProps = {
  title: React.ReactNode;
  description?: string;
  overline?: string;
  rightSideContent?: React.ReactNode;
  backgroundImage?: string;
  backgroundImageAlt?: string;
};

/**
 * Page Header Component
 * Editorial page header with background image and overlay
 * Used for directory pages and other content pages
 * Follows the format from CoffeeDirectory header
 */
export function PageHeader({
  title,
  description,
  overline,
  rightSideContent,
  backgroundImage = "/images/hero-bg.avif",
  backgroundImageAlt = "Coffee beans background",
}: PageHeaderProps) {
  return (
    <section className="relative flex min-h-[80vh] w-screen max-w-none items-center justify-center overflow-hidden md:min-h-[65vh] ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]">
      {/* Background Image - full bleed, contain so image isn't over-cropped */}
      <div className="absolute inset-0 z-0 bg-black/80">
        <Image
          alt={backgroundImageAlt}
          className="object-cover object-center"
          fill
          priority
          sizes="100vw"
          src={backgroundImage}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Content aligned with PageShell (max-w-7xl + same horizontal padding) */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <Stack gap="6">
                {overline && (
                  <div className="inline-flex items-center gap-4">
                    <span className="h-px w-8 md:w-12 bg-accent/60" />
                    <span className="text-overline text-white/70 tracking-[0.15em]">
                      {overline}
                    </span>
                  </div>
                )}
                <h1 className="text-hero text-white text-balance leading-[1.1] tracking-tight">
                  {title}
                </h1>
                {description && (
                  <p className="max-w-2xl text-pretty text-body-large text-white/80 leading-relaxed">
                    {description}
                  </p>
                )}
              </Stack>
            </div>
            {rightSideContent && (
              <div className="md:col-span-4 flex justify-start md:justify-end pb-2">
                {rightSideContent}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
