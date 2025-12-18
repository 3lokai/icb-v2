"use client";

import { Icon } from "@/components/common/Icon";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <Icon className="size-4" name="CheckCircle" size={16} />,
        info: <Icon className="size-4" name="Info" size={16} />,
        warning: <Icon className="size-4" name="Warning" size={16} />,
        error: <Icon className="size-4" name="XCircle" size={16} />,
        loading: <Icon className="size-4 animate-spin" name="Spinner" size={16} />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      theme={theme as ToasterProps["theme"]}
      {...props}
    />
  );
};

export { Toaster };
