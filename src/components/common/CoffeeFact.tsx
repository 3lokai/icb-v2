"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { getRandomCoffeeFact } from "@/lib/coffee-facts";
import { cn } from "@/lib/utils";

type CoffeeFactProps = {
  className?: string;
};

export default function CoffeeFact({ className = "" }: CoffeeFactProps) {
  const [fact, setFact] = useState<{
    title: string;
    fact: string;
    source: string;
  } | null>(null);

  useEffect(() => {
    setFact(getRandomCoffeeFact());
  }, []);

  if (!fact) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-muted/50 bg-background/90 p-4 shadow-lg backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 shrink-0">
          <div className="rounded-full bg-accent/10 p-2">
            <Icon className="text-accent" name="Coffee" size={18} />
          </div>
        </div>
        <div>
          <h4 className="mb-1 font-semibold text-sm">{fact.title}</h4>
          <p className="mb-2 text-muted-foreground text-sm">{fact.fact}</p>
          {fact.source && (
            <p className="text-muted-foreground/70 text-xs italic">
              — {fact.source}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
