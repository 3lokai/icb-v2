// src/components/tools/CopyLink.tsx
"use client";

import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { LinkIcon } from "@phosphor-icons/react/dist/ssr";
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
      className="group border-border/50 bg-background text-caption text-muted-foreground transition-colors duration-200 hover:bg-muted/50 hover:text-foreground"
      onClick={handleCopyLink}
      size="sm"
      variant="outline"
    >
      <Icon className="mr-1 h-3 w-3" icon={LinkIcon} />
      <span className="font-medium">Copy Link</span>
    </Button>
  );
}
