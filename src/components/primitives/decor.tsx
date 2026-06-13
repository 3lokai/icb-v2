import { cn } from "@/lib/utils";

type DecorProps = {
  /**
   * Paper texture layer:
   * - `dots`: a fine dot grid.
   * - `grain` / `grain-coarse`: the brand's native film grain (cf. `.bg-noise`),
   *   scoped to the band. The two grains differ in scale so adjacent textured
   *   sections don't read identically.
   */
  texture?: "dots" | "grain" | "grain-coarse";
  /** Soft blurred colour washes in opposite corners. */
  wash?: boolean;
  /** Magazine accent: a full-width gradient rule along the top edge. */
  stripe?: boolean;
  className?: string;
};

/**
 * Decor - Decorative texture/wash/stripe layer (Layer 2).
 *
 * Owns the decorative language that was previously inlined across homepage
 * sections. Renders an absolutely-positioned, aria-hidden layer inside a
 * `relative overflow-hidden` parent. Each decoration has exactly ONE
 * implementation (see effects.css).
 *
 * `stripe` is the "magazine accent" — a full-width gradient rule on the TOP
 * edge (reworked from a left side-stripe, which is a banned anti-pattern).
 *
 * NOTE: deliberately NOT named `Surface` — `.surface-0/1/2` in components.css
 * already owns the semantic depth system.
 *
 * @example
 * <div className="relative overflow-hidden rounded-3xl">
 *   <Decor texture="dots" wash stripe />
 *   <div className="relative">...content...</div>
 * </div>
 */
export function Decor({ texture, wash, stripe, className }: DecorProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {stripe && <div className="decor-stripe" />}
      {texture === "dots" && <div className="decor-dots" />}
      {texture === "grain" && <div className="decor-grain" />}
      {texture === "grain-coarse" && (
        <div className="decor-grain decor-grain-coarse" />
      )}
      {wash && (
        <>
          <div className="decor-wash decor-wash-a" />
          <div className="decor-wash decor-wash-b" />
        </>
      )}
    </div>
  );
}
