// src/hooks/useImageColor.ts
"use client";

import { useState, useEffect } from "react";

/**
 * Luminance threshold for determining if an image is "light" (needs dark background).
 * Range: 0-255. Higher = stricter (only very white logos trigger dark bg).
 * Tweak this value to tune sensitivity.
 */
const LUMINANCE_THRESHOLD = 180;

type ColorResult = {
  isDark: boolean;
  isLoading: boolean;
  dominantColor: string | null;
};

/**
 * Hook to extract the average color from an image and determine if it's light or dark.
 * Uses canvas to sample pixels directly - no external dependencies.
 *
 * @param imageUrl - URL of the image to analyze
 * @returns ColorResult with isDark boolean (true = light image needing dark bg), loading state, and dominant color hex
 */
export function useImageColor(imageUrl: string | null): ColorResult {
  const [result, setResult] = useState<ColorResult>(() => ({
    isDark: false,
    isLoading: !!imageUrl, // Only loading if we have a URL
    dominantColor: null,
  }));

  useEffect(() => {
    // No URL - nothing to do (initial state already handles this case)
    if (!imageUrl) return;

    let cancelled = false;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (cancelled) return;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.log("[useImageColor] Canvas context failed");
        setResult({ isDark: false, isLoading: false, dominantColor: null });
        return;
      }

      // Sample at small size for performance
      const sampleSize = 64;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

      try {
        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imageData.data;

        let totalLuminance = 0;
        let pixelCount = 0;

        // Sample all pixels
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Skip fully transparent pixels
          if (a < 10) continue;

          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLuminance += luminance;
          pixelCount++;
        }

        if (pixelCount === 0) {
          console.log("[useImageColor] All pixels transparent");
          setResult({ isDark: false, isLoading: false, dominantColor: null });
          return;
        }

        const avgLuminance = totalLuminance / pixelCount;

        // Only consider the image "light" if average luminance exceeds threshold
        const isLightImage = avgLuminance > LUMINANCE_THRESHOLD;

        // Generate approximate hex color from average
        const avgVal = Math.round(avgLuminance);
        const hex = `#${avgVal.toString(16).padStart(2, "0")}${avgVal.toString(16).padStart(2, "0")}${avgVal.toString(16).padStart(2, "0")}`;

        console.log("[useImageColor]", {
          url: imageUrl.slice(-30),
          avgLuminance: Math.round(avgLuminance),
          pixelCount,
          isDark: isLightImage,
        });

        setResult({
          isDark: isLightImage,
          isLoading: false,
          dominantColor: hex,
        });
      } catch (e) {
        console.warn("[useImageColor] Canvas failed (CORS?):", e);
        setResult({ isDark: false, isLoading: false, dominantColor: null });
      }
    };

    img.onerror = () => {
      console.warn("[useImageColor] Image load failed:", imageUrl.slice(-30));
      if (!cancelled) {
        setResult({ isDark: false, isLoading: false, dominantColor: null });
      }
    };

    img.src = imageUrl;

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return result;
}
