import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";
import * as React from "react";

function Spinner({
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"svg">, "size" | "name" | "color"> & {
  className?: string;
}) {
  return (
    <Icon
      aria-label="Loading"
      className={cn("animate-spin", className)}
      name="Spinner"
      role="status"
      size={16}
      {...props}
    />
  );
}

export { Spinner };
