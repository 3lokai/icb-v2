"use client";

import { useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { DownloadSimple, CircleNotch } from "@phosphor-icons/react";

interface ChartDownloadButtonProps {
  targetId: string;
  fileName: string;
}

export function ChartDownloadButton({
  targetId,
  fileName,
}: ChartDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    const node = document.getElementById(targetId);
    if (!node) return;

    setLoading(true);
    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        backgroundColor: "var(--card)",
        pixelRatio: 2,
        style: {
          padding: "24px",
          borderRadius: "0",
        },
      });
      const link = document.createElement("a");
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Chart export failed:", err);
    } finally {
      setLoading(false);
    }
  }, [targetId, fileName]);

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      aria-label={`Download ${fileName} chart as PNG`}
      className="text-caption inline-flex items-center gap-1.5 rounded-sm border border-border/60 bg-background px-3 py-1.5 font-medium transition-colors hover:border-accent/60 hover:text-accent disabled:opacity-50"
    >
      {loading ? (
        <CircleNotch className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <DownloadSimple className="h-3.5 w-3.5" />
      )}
      Export PNG
    </button>
  );
}
