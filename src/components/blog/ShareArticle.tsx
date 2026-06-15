"use client";

import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ShareArticleProps {
  title: string;
  url: string;
  className?: string;
  vertical?: boolean;
}

export function ShareArticle({
  title,
  url,
  className,
  vertical = false,
}: ShareArticleProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      name: "Twitter",
      icon: "TwitterLogo" as const,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:text-[#1DA1F2]",
    },
    {
      name: "Facebook",
      icon: "FacebookLogo" as const,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:text-[#4267B2]",
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4",
        vertical && "flex-col",
        className
      )}
    >
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex size-10 items-center justify-center rounded-full border border-border bg-card transition-all hover:scale-110 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            link.color
          )}
          title={`Share on ${link.name}`}
          aria-label={`Share on ${link.name}`}
        >
          <Icon name={link.icon} size={20} color="muted" />
        </a>
      ))}
      <button
        type="button"
        onClick={copyToClipboard}
        className="flex size-10 items-center justify-center rounded-full border border-border bg-card transition-all hover:scale-110 hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        title="Copy link"
        aria-label="Copy link to this article"
      >
        <Icon name="Link" size={20} color="muted" />
      </button>
    </div>
  );
}
