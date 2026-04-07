"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/primitives/page-shell";
import { cn } from "@/lib/utils";

export const PROFILE_SCROLL_SECTIONS: { id: string; label: string }[] = [
  { id: "insights", label: "Insights" },
  { id: "selections", label: "Selections" },
  { id: "ratings", label: "Ratings" },
  { id: "gear-station", label: "Gear" },
];

export const PROFILE_SCROLL_SECTION_IDS = PROFILE_SCROLL_SECTIONS.map(
  (s) => s.id
);

type ProfileScrollspyTabBarProps = {
  activeId: string;
};

export function ProfileScrollspyTabBar({
  activeId,
}: ProfileScrollspyTabBarProps) {
  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className="sticky top-20 z-30 border-b border-border/40 bg-background/80 backdrop-blur-md"
      aria-label="Profile sections"
    >
      <PageShell>
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar py-1">
          {PROFILE_SCROLL_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => handleClick(section.id)}
              className={cn(
                "relative px-4 py-2.5 text-caption font-medium rounded-full transition-all whitespace-nowrap shrink-0",
                activeId === section.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </PageShell>
    </nav>
  );
}

export function useProfileSectionScrollspy(
  sectionIds: string[] = PROFILE_SCROLL_SECTION_IDS
) {
  const [activeSection, setActiveSection] = useState(
    sectionIds[0] ?? "insights"
  );

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && sectionIds.includes(hash)) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [sectionIds]);

  return activeSection;
}
