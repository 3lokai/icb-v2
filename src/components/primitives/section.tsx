"use client";

import { cn } from "@/lib/utils";
import { Accent } from "./accent";
import { Decor } from "./decor";
import { PageShell } from "./page-shell";

type SectionProps = {
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  /** Word(s) within/after the title to emphasise with the coffee-smear <Accent>. Ration ≤1 per page. */
  accentWord?: string;
  /**
   * Supporting copy rendered under the title, inside the header block. Lets a
   * section express eyebrow + title + description without hand-rolling the
   * header (the reason pages used to bypass this primitive). Capped at the
   * prose measure (max-w-2xl).
   */
  description?: React.ReactNode;
  /** Header alignment. */
  align?: "left" | "center";
  spacing?: "tight" | "default" | "loose";
  contained?: boolean; // Whether to wrap in PageShell
  /**
   * Section ground. Drives the homepage's alternating band rhythm so a long
   * scroll reads as a designed magazine spread, not one flat wash.
   * - `cream` (default): the page ground (surface-0); renders transparent.
   * - `warm`: a warm-paper band (surface-1) with hairline border-y separators.
   * Keep adjacent sections on different grounds.
   */
  ground?: "cream" | "warm";
  /** Full-bleed decorative layer painted behind the content (rationed — a few feature grounds only). */
  decor?: {
    texture?: "dots" | "grain" | "grain-coarse";
    wash?: boolean;
    stripe?: boolean;
  };
  className?: string;
  id?: string;
};

/**
 * Section - Vertical spacing primitive with optional header.
 * Use for major page sections with consistent spacing.
 *
 * Spacing scale:
 * - tight: py-6/10/14 — compact sections
 * - default: py-10/14/20 — standard section rhythm (most homepage sections)
 * - loose: py-14/20/28 — extra breathing room (e.g. HowItWorks, FAQ on homepage)
 *
 * Homepage note: Hero does not use Section (full-viewport) but uses the same
 * horizontal padding scale as PageShell (px-4 md:px-6 lg:px-8).
 * Use default for most sections; loose for key content sections that need more space.
 */
export function Section({
  children,
  eyebrow,
  title,
  accentWord,
  description,
  align = "left",
  spacing = "default",
  contained = true,
  ground = "cream",
  decor,
  className,
  id,
}: SectionProps) {
  const spacingClasses = {
    tight: "py-6 md:py-10 lg:py-14",
    default: "py-10 md:py-14 lg:py-20",
    loose: "py-14 md:py-20 lg:py-28",
  };

  // Warm bands sit a tonal step above the cream page ground (surface-1),
  // fenced by hairline separators; cream sections stay transparent on it.
  const groundClasses =
    ground === "warm" ? "bg-card border-y border-border/60" : undefined;

  const hasDecor = Boolean(
    decor && (decor.texture || decor.wash || decor.stripe)
  );
  const needsLayer = ground === "warm" || hasDecor;

  // Check if className explicitly overrides padding (py-0 or similar)
  const hasPaddingOverride =
    className?.includes("py-0") || className?.includes("!py-0");

  const content = (
    <>
      {(eyebrow || title || description) && (
        <div className={cn("mb-12", align === "center" && "text-center")}>
          {eyebrow && (
            <p className="text-overline mb-3 font-semibold uppercase tracking-[0.18em] text-accent">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-title text-balance">
              {title}
              {accentWord && (
                <>
                  {" "}
                  <Accent>{accentWord}</Accent>
                </>
              )}
            </h2>
          )}
          {description && (
            <p
              className={cn(
                "text-body-large text-muted-foreground mt-4 max-w-2xl text-pretty",
                align === "center" && "mx-auto"
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </>
  );

  const sectionClassName = hasPaddingOverride
    ? cn(groundClasses, needsLayer && "relative overflow-hidden", className)
    : cn(
        spacingClasses[spacing],
        groundClasses,
        needsLayer && "relative overflow-hidden",
        className
      );

  const decorLayer = hasDecor ? (
    <Decor texture={decor?.texture} wash={decor?.wash} stripe={decor?.stripe} />
  ) : null;

  // When a ground/decor layer is present, lift the content above it (both are
  // positioned, so later-in-DOM relative content paints over absolute Decor).
  const body = contained ? <PageShell>{content}</PageShell> : content;
  const layeredBody = needsLayer ? (
    <div className="relative">{body}</div>
  ) : (
    body
  );

  return (
    <section className={sectionClassName} id={id}>
      {decorLayer}
      {layeredBody}
    </section>
  );
}
