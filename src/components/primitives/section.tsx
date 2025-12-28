"use client";

import { cn } from "@/lib/utils";
import { PageShell } from "./page-shell";

type SectionProps = {
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  spacing?: "tight" | "default" | "loose";
  contained?: boolean; // Whether to wrap in PageShell
  className?: string;
};

/**
 * Section - Vertical spacing primitive with optional header
 * Use for major page sections with consistent spacing
 */
export function Section({
  children,
  eyebrow,
  title,
  spacing = "default",
  contained = true,
  className,
}: SectionProps) {
  const spacingClasses = {
    tight: "py-8 md:py-12 lg:py-16",
    default: "py-12 md:py-16 lg:py-24",
    loose: "py-16 md:py-24 lg:py-32",
  };

  const content = (
    <>
      {(eyebrow || title) && (
        <div className="mb-12">
          {eyebrow && <p className="text-label mb-3">{eyebrow}</p>}
          {title && <h2 className="text-title">{title}</h2>}
        </div>
      )}
      {children}
    </>
  );

  if (contained) {
    return (
      <section className={cn(spacingClasses[spacing], className)}>
        <PageShell>{content}</PageShell>
      </section>
    );
  }

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {content}
    </section>
  );
}
