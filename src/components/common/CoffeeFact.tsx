"use client";

import { useEffect, startTransition, useState } from "react";
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
    startTransition(() => {
      setFact(getRandomCoffeeFact());
    });
  }, []);

  if (!fact) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-accent/20 border-l-4 border-l-accent bg-accent/5 p-6 md:p-8",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 shrink-0">
          <div className="rounded-xl bg-accent/10 p-2.5">
            <Icon className="text-accent" name="Coffee" size={24} />
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-heading text-primary font-serif italic">
            {fact.title}
          </h4>
          <p className="mb-4 text-muted-foreground leading-relaxed italic">
            &quot;{fact.fact}&quot;
          </p>
          {fact.source && (
            <p className="text-micro font-bold uppercase tracking-widest text-accent/70">
              — {fact.source}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
