// src/components/contactus/SectionHeader.tsx
import { Stack } from "../primitives/stack";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  title,
  eyebrow,
  align = "left",
  className,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <Stack
      gap="6"
      className={cn(
        "w-full",
        isCenter ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <div className="flex items-center gap-4">
          {!isCenter && <span className="h-px w-8 md:w-12 bg-accent/60" />}
          <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
            {eyebrow}
          </span>
          {isCenter && <span className="h-px w-8 md:w-12 bg-accent/60" />}
        </div>
      )}

      <h2 className="text-title text-balance leading-[1.1] tracking-tight">
        {title.split(" ").map((word, i, arr) => (
          <span key={i}>
            {word === "Us." ||
            word === "Us" ||
            word === "Legacy." ||
            word === "Ecosystem" ||
            (i === arr.length - 1 && !word.endsWith(".")) ? (
              <span className="text-accent italic">{word}</span>
            ) : (
              word
            )}
            {i < arr.length - 1 ? " " : ""}
          </span>
        ))}
      </h2>

      {!isCenter && <div className="h-px w-16 bg-accent/30" />}
    </Stack>
  );
}
