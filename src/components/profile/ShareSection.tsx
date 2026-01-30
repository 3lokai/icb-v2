"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ShareSectionProps = {
  section: "selections" | "gear-station";
  username: string | null;
};

export function ShareSection({ section, username }: ShareSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!username) {
    return null;
  }

  const getShareUrl = () => {
    if (typeof window === "undefined") {
      return "";
    }
    return `${window.location.origin}/profile/${username}#${section}`;
  };

  const getSectionTitle = () => {
    return section === "selections" ? "My Selections" : "My Gear Station";
  };

  const getShareText = () => {
    const sectionTitle = getSectionTitle();
    return `Check out ${username}'s ${sectionTitle} on Indian Coffee Beans`;
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!", {
        description: "The link has been copied to your clipboard.",
      });
      setIsOpen(false);
    } catch {
      toast.error("Failed to copy link", {
        description: "Something went wrong.",
      });
    }
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();
    const text = getShareText();
    const title = `${username}'s ${getSectionTitle()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        setIsOpen(false);
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== "AbortError") {
          toast.error("Failed to share", {
            description: "Something went wrong.",
          });
        }
      }
    } else {
      // Fallback to copy if native share not available
      handleCopyLink();
    }
  };

  const handleShareTwitter = () => {
    const url = getShareUrl();
    const text = getShareText();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const handleShareWhatsApp = () => {
    const url = getShareUrl();
    const text = getShareText();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const handleShareReddit = () => {
    const url = getShareUrl();
    const title = getShareText();
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(redditUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-muted-foreground hover:text-foreground"
        >
          <Icon name="Share" size={16} className="mr-1.5" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Icon name="Link" size={16} className="mr-2" />
          Copy link
        </DropdownMenuItem>
        {typeof navigator !== "undefined" &&
          "share" in navigator &&
          typeof navigator.share === "function" && (
            <DropdownMenuItem onClick={handleNativeShare}>
              <Icon name="ShareNetwork" size={16} className="mr-2" />
              Share...
            </DropdownMenuItem>
          )}
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors"
              aria-label="Share on WhatsApp"
            >
              <Icon name="WhatsappLogo" size={20} />
            </button>
            <button
              onClick={handleShareTwitter}
              className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors"
              aria-label="Share on X"
            >
              <Icon name="XLogo" size={20} />
            </button>
            <button
              onClick={handleShareReddit}
              className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors"
              aria-label="Share on Reddit"
            >
              <Icon name="RedditLogo" size={20} />
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
