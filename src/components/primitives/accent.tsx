import { cn } from "@/lib/utils";

type AccentProps = {
  children: React.ReactNode;
  /** Smear opacity. Locked default 0.6; override only for a deliberate exception. */
  intensity?: number;
  /** Smear height (rises into the lower part of the glyphs). Locked default "0.6em". */
  coverage?: string;
  className?: string;
};

/**
 * Accent - Coffee brush-smear emphasis (LOCKED treatment).
 *
 * A real brush stroke (stain-smear.png) used as an alpha mask, recoloured to the
 * accent token, sitting low as an underline that covers the bottom ~third of the
 * text. Stretches edge-to-edge so it fits 1-, 2-, or 3-word phrases.
 *
 * Ration to ≤1 per page. The visual cousin of the `.glossary-term` underline in
 * components.css — together they read as one accent family.
 *
 * @example
 * <h2 className="text-title">Find Indian coffee <Accent>worth</Accent> brewing.</h2>
 */
export function Accent({
  children,
  intensity,
  coverage,
  className,
}: AccentProps) {
  const style: React.CSSProperties = {};
  if (intensity !== undefined)
    (style as Record<string, string>)["--ints"] = String(intensity);
  if (coverage !== undefined)
    (style as Record<string, string>)["--cov"] = coverage;

  return (
    <span className={cn("accent-smear", className)} style={style}>
      {children}
    </span>
  );
}
