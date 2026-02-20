"use client";

import { useEffect, useMemo, useState } from "react";
import { cn, slugifyHeading } from "@/lib/utils";
import { Stack } from "@/components/primitives/stack";
import type { TOCItem } from "@/types/blog-types";

interface TOCEntry {
  title: string;
  id: string;
  level: number;
}

interface TableOfContentsProps {
  body: any[];
  toc?: TOCItem[];
}

function extractHeadings(body: any[]): TOCEntry[] {
  return body
    .filter(
      (block: any) =>
        block._type === "block" &&
        ["h2", "h3"].includes(block.style) &&
        block.children &&
        block.children.length > 0
    )
    .map((block: any) => {
      const title = block.children.map((child: any) => child.text).join("");
      const id = slugifyHeading(title);
      return {
        title,
        id,
        level: parseInt(block.style.replace("h", ""), 10),
      };
    });
}

/** Active zone: heading is "in view" when it's in the top ~25% of the viewport */
const ACTIVE_ZONE_TOP = 140;

/** Picks the heading that should be "active" based on scroll position (in viewport, prefer top) */
function getActiveHeadingId(headings: TOCEntry[]): string {
  const elements = headings
    .map((h) => ({ id: h.id, el: document.getElementById(h.id) }))
    .filter((x): x is { id: string; el: HTMLElement } => x.el != null);
  if (elements.length === 0) return "";

  // Heading that has passed the active zone (top of viewport) — pick the last one that did
  const withTop = elements.map(({ id, el }) => ({
    id,
    top: el.getBoundingClientRect().top,
  }));
  const passed = withTop.filter((x) => x.top <= ACTIVE_ZONE_TOP);
  if (passed.length > 0) {
    const best = passed.sort((a, b) => b.top - a.top)[0];
    return best.id;
  }
  // None passed yet — use first heading (we're at top of article)
  return headings[0]?.id ?? "";
}

export function TableOfContents({ body, toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const headings = useMemo(() => {
    if (toc && toc.length > 0) {
      const flattened: TOCEntry[] = [];
      toc.forEach((item: any) => {
        flattened.push({
          title: item.title,
          id: item.url?.replace("#", "") || slugifyHeading(item.title),
          level: 2,
        });
        if (item.items && item.items.length > 0) {
          item.items.forEach((subItem: any) => {
            flattened.push({
              title: subItem.title,
              id:
                subItem.url?.replace("#", "") || slugifyHeading(subItem.title),
              level: 3,
            });
          });
        }
      });
      return flattened;
    }
    return extractHeadings(body);
  }, [body, toc]);

  useEffect(() => {
    if (headings.length === 0) return;

    const onScroll = () => {
      setActiveId(getActiveHeadingId(headings));
    };

    const observer = new IntersectionObserver(() => onScroll(), {
      root: null,
      rootMargin: "-80px 0px -60% 0px",
      threshold: [0, 0.5, 1],
    });

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block w-full z-10" aria-label="Table of contents">
      <Stack gap="6">
        <h4 className="text-overline text-muted-foreground tracking-widest">
          Table of Contents
        </h4>
        <ul className="space-y-4">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={cn(
                "transition-all duration-200",
                heading.level === 3 ? "pl-4" : ""
              )}
            >
              <a
                href={`#${heading.id}`}
                className={cn(
                  "text-caption block transition-colors hover:text-primary rounded-r-md py-1 pr-2",
                  activeId === heading.id
                    ? "text-primary font-bold border-l-2 border-primary pl-3 -ml-[2px] bg-primary/5"
                    : "text-muted-foreground border-l-2 border-transparent pl-3 -ml-[2px]"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                {heading.title}
              </a>
            </li>
          ))}
        </ul>
      </Stack>
    </nav>
  );
}
