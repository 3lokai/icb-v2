import { cn } from "@/lib/utils";
import { Decor } from "@/components/primitives/decor";
import { PageShell } from "@/components/primitives/page-shell";

export type BandProps = {
  id?: string;
  ground?: "cream" | "warm";
  texture?: "grain" | "grain-coarse";
  maxWidth?: "5xl" | "6xl" | "7xl";
  className?: string;
  children: React.ReactNode;
} & Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children" | "className" | "id"
>;

/**
 * Band - Full-bleed tonal section (homepage-style alternating grounds).
 *
 * Breaks out of the parent route PageShell so the band reaches the viewport
 * edges. Use for long-scroll detail pages (roaster, coffee, profile).
 */
export function Band({
  id,
  ground = "cream",
  texture,
  maxWidth = "5xl",
  className,
  children,
  ...rest
}: BandProps) {
  const warm = ground === "warm";
  return (
    <section
      id={id}
      {...rest}
      className={cn(
        // Full-bleed: break out of the parent route PageShell (max-w-7xl) so the
        // tonal band reaches the viewport edges like the homepage bands. <main>
        // has overflow-x-clip, so the 100vw breakout never adds a scrollbar.
        "relative left-1/2 w-screen -translate-x-1/2 scroll-mt-40 py-12 md:py-16",
        warm && "overflow-hidden bg-card border-y border-border/60",
        className
      )}
    >
      {warm && texture && <Decor texture={texture} />}
      <div className="relative">
        <PageShell maxWidth={maxWidth}>{children}</PageShell>
      </div>
    </section>
  );
}
