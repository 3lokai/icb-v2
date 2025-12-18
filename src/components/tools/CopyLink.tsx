// src/components/tools/CopyLink.tsx
"use client";

import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";

type CopyLinkProps = {
  method: string | null;
  strength: string;
  roast: string;
  drink: number; // Changed from 'water' to 'drink'
};

export function CopyLink({ method, strength, roast, drink }: CopyLinkProps) {
  const pathname = usePathname();

  const handleCopyLink = async () => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams();
    if (method) {
      params.set("method", method);
    }
    params.set("strength", strength);
    params.set("roast", roast);
    params.set("drink", drink.toString()); // Changed from 'water' to 'drink'

    const url = `${window.location.origin}${pathname}?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link Copied!", {
        description:
          "The current calculator settings link has been copied to your clipboard.",
      });
    } catch {
      toast.error("Failed to copy link", {
        description: "Something went wrong.",
      });
    }
  };

  return (
    <Button
      className="group border-border/50 bg-background/50 text-muted-foreground text-overline backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-background/70 hover:text-foreground"
      onClick={handleCopyLink}
      size="sm"
      variant="outline"
    >
      <Icon
        className="mr-1 h-3 w-3 transition-transform duration-300 group-hover:scale-110"
        name="Link"
      />
      <span className="font-medium">Copy Link</span>
    </Button>
  );
}
