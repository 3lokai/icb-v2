"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { capture } from "@/lib/posthog";

type Props = Record<string, string | number | null>;

/** Captures clicks on any link inside — lets server-rendered cards (PostCard, SeriesCard) stay server components. */
export function TrackClicks({
  event,
  props,
  children,
  className,
}: {
  event: string;
  props?: Props;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest("a")) capture(event, props);
      }}
    >
      {children}
    </div>
  );
}

export function CopyText({
  text,
  descriptionKey,
}: {
  text: string;
  descriptionKey: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          toast.success("Description copied");
          capture("press_description_copied", { description: descriptionKey });
        } catch {
          toast.error("Couldn't copy — select the text and copy it manually");
        }
      }}
    >
      <Icon icon={copied ? CheckIcon : CopyIcon} size={14} />
      {/* aria-live so screen readers hear the state change */}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
