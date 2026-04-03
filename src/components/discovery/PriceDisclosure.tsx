import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";

type PriceDisclosureProps = {
  className?: string;
};

export function PriceDisclosure({ className }: PriceDisclosureProps) {
  return (
    <div
      className={cn("mx-auto max-w-6xl w-full px-4 md:px-0 pb-6", className)}
    >
      <div
        className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md"
        role="note"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.2]"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 border-l-4 border-l-accent/40 pl-5 pr-4 py-4 sm:pl-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <Icon className="text-accent" name="Info" size={22} />
          </div>
          <p className="text-caption sm:text-body text-muted-foreground leading-relaxed">
            Prices normalized to 250g equivalent across all pack sizes.
          </p>
        </div>
      </div>
    </div>
  );
}
