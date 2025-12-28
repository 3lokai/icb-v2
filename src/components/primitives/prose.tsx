"use client";

import { cn } from "@/lib/utils";

type ProseProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Prose - Optimized container for long-form text
 * Applies proper measure, typography, and spacing
 */
export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        "text-base leading-relaxed",
        "[&>p]:mb-4",
        "[&>h3]:mb-3 [&>h3]:mt-8",
        "[&>h4]:mb-2 [&>h4]:mt-6",
        "[&>ul]:mb-4 [&>ul]:ml-6 [&>ul]:list-disc",
        "[&>ol]:mb-4 [&>ol]:ml-6 [&>ol]:list-decimal",
        "[&>blockquote]:border-l-2 [&>blockquote]:border-border [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-6",
        className
      )}
    >
      {children}
    </div>
  );
}
