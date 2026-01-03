// src/lib/imagekit/index.ts
// Zero-dependency ImageKit integration for optimized image delivery

type ImageKitTransform = {
  width?: number;
  height?: number;
  crop?: "force" | "maintain_ratio" | "at_least" | "at_max" | "at_max_enlarge";
  quality?: number;
  format?: "webp" | "avif" | "jpg" | "png";
  progressive?: boolean;
  focus?: "auto" | "center" | "top" | "left" | "bottom" | "right" | "face";
};

/**
 * Get ImageKit URL endpoint from environment
 */
function getImageKitEndpoint(): string {
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  if (!endpoint) {
    console.warn(
      "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not set. ImageKit URLs will not work."
    );
    return "";
  }
  return endpoint;
}

/**
 * Build ImageKit URL with transformations
 */
export function getImageKitUrl(
  imagePath: string,
  transforms: ImageKitTransform = {}
): string {
  const endpoint = getImageKitEndpoint();
  if (!(endpoint && imagePath)) {
    return imagePath || "";
  }

  // If imagePath is already a full URL, return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Remove leading slash if present
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

  // Build transformation query string
  const params: string[] = [];

  if (transforms.width) {
    params.push(`w-${transforms.width}`);
  }
  if (transforms.height) {
    params.push(`h-${transforms.height}`);
  }
  if (transforms.crop) {
    params.push(`c-${transforms.crop}`);
  }
  if (transforms.quality !== undefined) {
    params.push(`q-${transforms.quality}`);
  }
  if (transforms.format) {
    params.push(`f-${transforms.format}`);
  }
  if (transforms.progressive) {
    params.push("pr-true");
  }
  if (transforms.focus) {
    params.push(`fo-${transforms.focus}`);
  }

  const transformString = params.length > 0 ? `tr:${params.join(",")}/` : "";

  return `${endpoint}/${transformString}${cleanPath}`;
}

/**
 * Generate blur placeholder URL for progressive loading
 */
export function generateBlurPlaceholder(imagePath: string): string {
  return getImageKitUrl(imagePath, {
    width: 20,
    height: 20,
    quality: 20,
    format: "webp",
  });
}

/**
 * Get placeholder image URL
 */
export function getPlaceholderImage(
  type: "coffee" | "roaster" = "coffee"
): string {
  // Fallback to placeholder service or local placeholder
  return type === "coffee"
    ? "/placeholder-coffee.jpg"
    : "/placeholder-roaster.jpg";
}

/**
 * Check if ImageKit is configured
 */
export function isImageKitConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT);
}

/**
 * Component-specific image presets
 */
export const coffeeImagePresets = {
  /**
   * CoffeeCard preset
   * Size: 600x336px (optimized for 3-column grid on large screens)
   * On 1920px screen: 33vw ≈ 634px, so 600px covers most cases
   * Crop: Force
   * Quality: 80
   */
  coffeeCard: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("coffee");
    }
    return getImageKitUrl(imagePath, {
      width: 600,
      height: 336,
      crop: "force",
      quality: 80,
    });
  },

  /**
   * RoasterCard preset
   * Size: 600x240px (optimized for 3-column grid on large screens)
   * On 1920px screen: 33vw ≈ 634px, so 600px covers most cases
   * Crop: Maintain ratio (don't distort logos)
   * Quality: 85
   */
  roasterCard: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("roaster");
    }
    return getImageKitUrl(imagePath, {
      width: 600,
      height: 240,
      crop: "maintain_ratio",
      quality: 85,
    });
  },

  /**
   * RegionCard preset
   * Size: 600x450px (aspect-[4/3], optimized for grid layouts)
   * Crop: Force
   * Quality: 82
   */
  regionCard: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("coffee");
    }
    return getImageKitUrl(imagePath, {
      width: 600,
      height: 450,
      crop: "force",
      quality: 82,
    });
  },

  /**
   * Hero background preset
   * Size: 1920x800px
   * Crop: Force, center focus
   * Quality: 85
   * Progressive: Enabled
   */
  heroBackground: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("coffee");
    }
    return getImageKitUrl(imagePath, {
      width: 1920,
      height: 800,
      crop: "force",
      quality: 85,
      progressive: true,
      focus: "center",
    });
  },

  /**
   * Blog card preset
   * Size: 400x225px (16:9 aspect)
   * Crop: Force
   * Quality: 78
   */
  blogCard: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("coffee");
    }
    return getImageKitUrl(imagePath, {
      width: 400,
      height: 225,
      crop: "force",
      quality: 78,
    });
  },

  /**
   * Coffee detail page main carousel preset
   * Size: 800x600px (4:3 aspect)
   * Crop: At max enlarge (fit within dimensions without cropping, allows enlargement)
   * Quality: 90
   */
  coffeeDetail: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("coffee");
    }
    return getImageKitUrl(imagePath, {
      width: 800,
      height: 600,
      crop: "at_max_enlarge",
      quality: 90,
    });
  },

  /**
   * Coffee detail page thumbnail preset
   * Size: 150x150px (square)
   * Crop: At max enlarge (fit within dimensions without cropping, allows enlargement)
   * Quality: 75
   */
  coffeeThumbnail: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("coffee");
    }
    return getImageKitUrl(imagePath, {
      width: 150,
      height: 150,
      crop: "at_max_enlarge",
      quality: 75,
    });
  },

  /**
   * Open Graph image preset
   * Size: 1200x630px (OG standard)
   * Crop: Force, center focus
   * Quality: 85
   * Progressive: Enabled
   */
  coffeeOG: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("coffee");
    }
    return getImageKitUrl(imagePath, {
      width: 1200,
      height: 630,
      crop: "force",
      quality: 85,
      progressive: true,
      focus: "center",
    });
  },
};

/**
 * Roaster-specific image presets
 */
export const roasterImagePresets = {
  /**
   * Roaster logo preset
   * Size: 300x300px (square)
   * Crop: Maintain ratio (don't distort logos)
   * Quality: 90
   *
   * NOTE:
   * v=1 is a one-time cache buster to defeat Vercel _next/image cache.
   * Leave it forever. It will not affect other roasters.
   */
  roasterLogo: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("roaster");
    }

    // 👇 one-time cache bust
    const pathWithVersion = `${imagePath}?v=1`;

    return getImageKitUrl(pathWithVersion, {
      width: 320,
      quality: 90,
      format: "png",
    });
  },

  /**
   * Roaster Open Graph image preset
   * Size: 1200x630px (OG standard)
   * Crop: Force, center focus
   * Quality: 85
   * Progressive: Enabled
   */
  roasterOG: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("roaster");
    }
    return getImageKitUrl(imagePath, {
      width: 1200,
      height: 630,
      crop: "force",
      quality: 85,
      progressive: true,
      focus: "center",
    });
  },
};
