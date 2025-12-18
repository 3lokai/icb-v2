import Image from "next/image";
import { Icon, type IconName } from "@/components/common/Icon";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: IconName;
  iconLabel?: string;
};

/**
 * Page Header Component
 * A smaller, less prominent version of the homepage hero section
 * Used for directory pages and other content pages
 */
export function PageHeader({
  title,
  description,
  icon,
  iconLabel,
}: PageHeaderProps) {
  return (
    <section className="relative -mx-4 -mt-8 flex min-h-[40vh] items-center justify-center overflow-hidden md:-mx-6 md:-mt-12 lg:-mx-8 lg:-mt-16 md:min-h-[50vh]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          alt="Coffee beans background"
          className="object-cover"
          fill
          priority
          src="/images/hero-bg.png"
        />
      </div>

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content">
        {/* Optional badge */}
        {icon && iconLabel && (
          <div className="mb-4 inline-flex animate-fade-in-scale items-center">
            <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-caption">
                <Icon className="text-accent" name={icon} size={16} />
                <span className="text-white/90">{iconLabel}</span>
                <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              </div>
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className="mb-4 animate-fade-in-scale text-display text-white text-balance delay-100">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="mx-auto max-w-2xl animate-fade-in-scale text-white/90 text-body-large leading-relaxed delay-200">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
