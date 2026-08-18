"use client";
// src/components/common/CopyToClipboardButton.tsx
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type CopyToClipboardButtonProps = {
  /** Text written to the clipboard when pressed. */
  value: string;
  label: string;
  toastTitle: string;
  toastDescription?: string;
  className?: string;
};

/**
 * A copy button as its own island, so a page of otherwise static prose does not
 * have to become a Client Component for one clipboard call.
 */
export function CopyToClipboardButton({
  value,
  label,
  toastTitle,
  toastDescription,
  className,
}: CopyToClipboardButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(toastTitle, { description: toastDescription });
    } catch {
      // Clipboard is permission-gated and unavailable on insecure origins —
      // say so rather than silently doing nothing.
      toast.error("Couldn't copy", {
        description: "Copy the text manually instead.",
      });
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      className={className}
      onClick={handleCopy}
    >
      {label}
    </Button>
  );
}
