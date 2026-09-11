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
 * Build the ImageKit path-style transform segment (e.g. `tr:w-800,q-75/`).
 */
function buildTransformString(transforms: ImageKitTransform): string {
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

  return params.length > 0 ? `tr:${params.join(",")}/` : "";
}

/**
 * Build ImageKit URL with transformations.
 * Accepts relative paths or absolute URLs under the configured endpoint.
 */
export function getImageKitUrl(
  imagePath: string,
  transforms: ImageKitTransform = {}
): string {
  const endpoint = getImageKitEndpoint();
  if (!(endpoint && imagePath)) {
    return imagePath || "";
  }

  const transformString = buildTransformString(transforms);
  const normalizedEndpoint = endpoint.replace(/\/$/, "");

  // Absolute URL under our ImageKit endpoint — inject transforms after endpoint
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    if (!transformString) {
      return imagePath;
    }
    if (imagePath.startsWith(`${normalizedEndpoint}/`)) {
      const pathAfterEndpoint = imagePath.slice(normalizedEndpoint.length + 1);
      // Avoid double-applying transforms if already present
      if (pathAfterEndpoint.startsWith("tr:")) {
        return imagePath;
      }
      return `${normalizedEndpoint}/${transformString}${pathAfterEndpoint}`;
    }
    // Non-ImageKit absolute URLs stay unchanged
    return imagePath;
  }

  // Relative path
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return `${normalizedEndpoint}/${transformString}${cleanPath}`;
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
 * Shown when a region has no card plate uploaded yet. A shipped asset, not an
 * ImageKit path, so it renders before any image work lands for a new region.
 */
export const REGION_CARD_FALLBACK = "/images/discovery/region-landscape.png";

/**
 * Component-specific image presets
 */
export const coffeeImagePresets = {
  /**
   * CoffeeCard preset
   * Applies width: 400 and quality: 70 transforms
   */
  coffeeCard: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("coffee");
    }
    return getImageKitUrl(imagePath, {
      width: 400,
      quality: 70,
    });
  },

  /**
   * CoffeeCard hero preset
   * Applies width: 840 and quality: 70 transforms
   */
  coffeeCardHero: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("coffee");
    }
    return getImageKitUrl(imagePath, {
      width: 840,
      quality: 70,
    });
  },

  /**
   * RoasterCard preset
   * Applies width: 400 and quality: 70 transforms
   */
  roasterCard: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("roaster");
    }
    return getImageKitUrl(imagePath, {
      width: 400,
      quality: 70,
    });
  },

  /**
   * Region card badge preset (`canon_regions.logo_url`)
   * Width 600, quality 82, no crop — the source plates are 1122x1402 (4:5) and carry
   * their own painted frame, so a forced crop would cut it.
   *
   * Width only — height follows the 4:5 source, and the card takes its ratio from the
   * plate rather than the other way round. That is what removes the need to pad or crop
   * to a square: nothing is added and nothing is lost.
   * No explicit `format`: ImageKit content-negotiates (WebP/AVIF by Accept header),
   * which is why the PNG masters are uploaded unconverted.
   */
  regionCard: (
    imagePath: string | null | undefined,
    /** `stamp` is the 44px thumbnail on RegionCard's compact variant. */
    size: "card" | "stamp" = "card"
  ): string => {
    if (!imagePath) {
      return REGION_CARD_FALLBACK;
    }
    // 440 covers the ~290px card at 4-up with room for a 1.5x display; the plates are
    // flat illustration, so they hold up far better than a photo would at that ratio.
    return getImageKitUrl(imagePath, {
      width: size === "stamp" ? 132 : 440,
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
   * Crop: Force (cropped to fill container, used with object-cover)
   * Quality: 78
   * Focus: Center (ensures important content is centered)
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
      focus: "center",
    });
  },

  /**
   * Coffee detail page main carousel preset
   * Applies width: 800 and quality: 75 transforms
   */
  coffeeDetail: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("coffee");
    }
    return getImageKitUrl(imagePath, {
      width: 800,
      quality: 75,
    });
  },

  /**
   * Coffee detail page thumbnail preset
   * Applies width: 100 and quality: 70 transforms.
   * Consider width: 200 for sharper 2x retina thumbnails.
   */
  coffeeThumbnail: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("coffee");
    }
    return getImageKitUrl(imagePath, {
      width: 100,
      quality: 70,
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
   * Applies width: 320 and quality: 80 transforms
   */
  roasterLogo: (imagePath: string | null | undefined): string => {
    if (!imagePath) {
      return getPlaceholderImage("roaster");
    }
    return getImageKitUrl(imagePath, {
      width: 320,
      quality: 80,
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
