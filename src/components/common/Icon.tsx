// src/components/common/Icon.tsx
// Thin styling wrapper around a directly-imported Phosphor icon. Import icons
// from "@phosphor-icons/react/dist/ssr" at the call site and pass the component:
//   <Icon icon={FireIcon} size={16} />
// This keeps each chunk carrying only the icons it renders. Do NOT reintroduce a
// name-string registry — a dynamic-key lookup defeats tree-shaking (the old
// 150-icon map shipped on every page). For data-driven icon names, use a small
// local map of only the names the data can actually contain.
import type { IconProps } from "@phosphor-icons/react";
import type {
  ComponentPropsWithoutRef,
  ComponentType,
  CSSProperties,
} from "react";

type IconColor =
  | "primary"
  | "muted"
  | "accent"
  | "destructive"
  | "glass"
  | "white";

type CustomIconProps = {
  // ComponentType (not phosphor's stricter Icon type) so tables typed either way assign
  icon: ComponentType<IconProps>;
  size?: IconProps["size"];
  className?: string;
  color?: IconColor;
  /** Phosphor weight. Defaults to `duotone`. Use `fill` for solid icons (e.g. wishlist). */
  weight?: IconProps["weight"];
} & Omit<
  ComponentPropsWithoutRef<"svg">,
  "className" | "size" | "color" | "weight"
>;

export const Icon = ({
  icon: IconComponent,
  size = 20,
  className = "inline-block",
  color = "primary",
  weight = "duotone",
  style,
  ...props
}: CustomIconProps) => {
  // Map color prop → Phosphor `color` (sets SVG `fill`). Phosphor does not read
  // --ph-* vars; duotone secondary is the same fill at 0.2 opacity.
  const colorMap: Record<IconColor, string> = {
    primary: "var(--primary)",
    muted: "var(--muted-foreground)",
    accent: "var(--accent)",
    destructive: "var(--destructive)",
    glass: "var(--foreground)",
    white: "#fff",
  };

  const fill = colorMap[color ?? "primary"];

  return (
    <IconComponent
      className={className}
      size={size}
      color={fill}
      weight={weight}
      style={
        {
          "--ph-primary": fill,
          "--ph-secondary": fill,
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  );
};
