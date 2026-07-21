"use client";

import {
  CheckCircleIcon,
  InfoIcon,
  SpinnerIcon,
  WarningIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <Icon className="size-4" icon={CheckCircleIcon} size={16} />,
        info: <Icon className="size-4" icon={InfoIcon} size={16} />,
        warning: <Icon className="size-4" icon={WarningIcon} size={16} />,
        error: <Icon className="size-4" icon={XCircleIcon} size={16} />,
        loading: (
          <Icon className="size-4 animate-spin" icon={SpinnerIcon} size={16} />
        ),
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
