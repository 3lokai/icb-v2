"use client";

import { useEffect, useState } from "react";
import { Fragment } from "react";
import Link from "next/link";

type Group = { anchor: string; label: string };

/**
 * The jump nav for the regions grid, with the current state marked as you scroll.
 *
 * A client component only for the scroll-spy; the links themselves are plain anchors and
 * work without JS, which is why the whole nav is not gated on `current` being resolved.
 */
export function StateJumpNav({ groups }: { groups: Group[] }) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const headings = groups
      .map((group) => document.getElementById(group.anchor))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    /*
      Top-biased rootMargin: a heading counts as current once it reaches the upper eighth
      of the viewport and stops counting when it leaves the top. Without the negative
      bottom margin every group below the fold is "intersecting" on first paint and the
      last one wins, which marks the bottom of the page as current before any scrolling.
    */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -80% 0px" }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [groups]);

  return (
    <nav
      aria-label="Jump to a state"
      className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/60 pt-4"
    >
      {groups.map((group, index) => {
        const isCurrent = current === group.anchor;
        return (
          <Fragment key={group.anchor}>
            {index > 0 ? (
              <span aria-hidden="true" className="text-micro opacity-40">
                ·
              </span>
            ) : null}
            <Link
              aria-current={isCurrent ? "true" : undefined}
              className={
                isCurrent
                  ? "text-label rounded-xs px-1 py-1 font-medium text-accent underline underline-offset-4 transition-colors motion-reduce:transition-none"
                  : "text-label rounded-xs px-1 py-1 text-muted-foreground transition-colors motion-reduce:transition-none hover:text-accent"
              }
              href={`#${group.anchor}`}
            >
              {group.label}
            </Link>
          </Fragment>
        );
      })}
    </nav>
  );
}
