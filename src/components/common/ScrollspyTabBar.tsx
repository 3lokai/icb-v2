"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type ScrollspySection = { id: string; label: string };

/**
 * Sticky section nav for detail pages. Client island: tracks the active section
 * via IntersectionObserver and smooth-scrolls on click. Rendered by a Server
 * Component parent, so the page body stays server-rendered (no CLS from a giant
 * client component reflowing after hydration).
 */
export function ScrollspyTabBar({
  sections,
}: {
  sections: ScrollspySection[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className="sticky top-20 z-30 bg-background/80 backdrop-blur-md border-b border-border/40"
      aria-label="Page sections"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              aria-current={activeId === section.id ? "true" : undefined}
              onClick={() => handleClick(section.id)}
              className={cn(
                "relative px-4 py-2.5 text-caption font-medium rounded-full transition-all whitespace-nowrap",
                activeId === section.id
                  ? "text-primary-foreground bg-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
