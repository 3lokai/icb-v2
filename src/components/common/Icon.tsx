// src/components/common/Icon.tsx
import type { IconProps } from "@phosphor-icons/react";
// Import icons from SSR module for Next.js Server Components compatibility
// Using namespace import pattern as documented in Phosphor Icons docs
// Note: Dynamic access is required for this generic icon component pattern
import * as PhosphorIcons from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties } from "react";

export type IconName = keyof typeof PhosphorIcons;

type IconColor = "primary" | "muted" | "accent" | "destructive" | "glass";

type CustomIconProps = {
  name: IconName;
  size?: IconProps["size"];
  className?: string;
  color?: IconColor;
};

export const Icon = ({
  name,
  size = 20,
  className = "inline-block",
  color = "primary",
}: CustomIconProps) => {
  // Dynamic icon access is required for this generic component pattern
  // This allows users to pass icon names as strings/props
  // Accessing the icon component from the namespace
  const IconComponent = (
    PhosphorIcons as unknown as Record<string, React.ComponentType<IconProps>>
  )[name];

  if (!IconComponent) {
    console.error(
      `Icon "${name}" not found in PhosphorIcons. Available icons:`,
      Object.keys(PhosphorIcons).slice(0, 10)
    );
    return <span>❌</span>; // Fallback
  }

  // Map color prop to your design token variables for duotone icons
  const colorMap: Record<IconColor, { primary: string; secondary: string }> = {
    primary: {
      primary: "var(--primary)",
      secondary: "var(--primary-foreground)",
    },
    muted: {
      primary: "var(--muted-foreground)",
      secondary: "var(--muted)",
    },
    accent: {
      primary: "var(--accent)",
      secondary: "var(--accent-foreground)",
    },
    destructive: {
      primary: "var(--destructive)",
      secondary: "var(--destructive-foreground, var(--primary-foreground))",
    },
    glass: {
      primary: "var(--foreground)",
      secondary: "var(--foreground)/60",
    },
  };

  const selectedColor = color ?? "primary";

  // Always use duotone weight with CSS variables for duotone colors
  const style = {
    "--ph-primary": colorMap[selectedColor].primary,
    "--ph-secondary": colorMap[selectedColor].secondary,
  } as CSSProperties;

  return (
    <IconComponent
      className={className}
      size={size}
      style={style}
      weight="duotone"
    />
  );
};
