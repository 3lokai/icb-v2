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
 * Homepage note: Hero does not use Section (full-viewport with custom padding).
 * Use default for most sections; loose for key content sections that need more space.
 */
export function Section({
  children,
  eyebrow,
  title,
  spacing = "default",
  contained = true,
  className,
  id,
}: SectionProps) {
  const spacingClasses = {
    tight: "py-6 md:py-10 lg:py-14",
    default: "py-10 md:py-14 lg:py-20",
    loose: "py-14 md:py-20 lg:py-28",
  };

  // Check if className explicitly overrides padding (py-0 or similar)
  const hasPaddingOverride =
    className?.includes("py-0") || className?.includes("!py-0");

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

  const sectionClassName = hasPaddingOverride
    ? className
    : cn(spacingClasses[spacing], className);

  if (contained) {
    return (
      <section className={sectionClassName} id={id}>
        <PageShell>{content}</PageShell>
      </section>
    );
  }

  return (
    <section className={sectionClassName} id={id}>
      {content}
    </section>
  );
}
