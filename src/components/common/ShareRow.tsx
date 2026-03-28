"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/common/Icon";
import { Cluster } from "@/components/primitives/cluster";

type ShareRowProps = {
  entityType: "coffee" | "roaster";
  name: string;
  slug: string;
};

export function ShareRow({ entityType, name, slug }: ShareRowProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const path = entityType === "coffee" ? "coffees" : "roasters";
  const pageUrl = `${baseUrl}/${path}/${slug}`;
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedMessage = encodeURIComponent(
    `I just rated ${name} on Indian Coffee Beans! Check it out: ${pageUrl}`
  );

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank", "noopener");
  };

  const handleXShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      "_blank",
      "noopener"
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      "_blank",
      "noopener"
    );
  };

  return (
    <Cluster gap="2" className="pt-3 flex-nowrap items-center">
      <span className="text-caption text-muted-foreground mr-1 whitespace-nowrap">
        Share:
      </span>
      <button
        type="button"
        onClick={handleWhatsAppShare}
        className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:scale-110 hover:text-[#25D366] shadow-sm"
        title="Share on WhatsApp"
      >
        <Icon name="WhatsappLogo" size={16} />
      </button>
      <button
        type="button"
        onClick={handleXShare}
        className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:scale-110 hover:text-foreground shadow-sm"
        title="Share on X"
      >
        <Icon name="TwitterLogo" size={16} />
      </button>
      <button
        type="button"
        onClick={handleFacebookShare}
        className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:scale-110 hover:text-[#4267B2] shadow-sm"
        title="Share on Facebook"
      >
        <Icon name="FacebookLogo" size={16} />
      </button>
      <button
        type="button"
        onClick={handleCopyLink}
        className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:scale-110 hover:text-foreground shadow-sm"
        title="Copy link"
      >
        <Icon name={copied ? "Check" : "Link"} size={16} />
      </button>
    </Cluster>
  );
}
