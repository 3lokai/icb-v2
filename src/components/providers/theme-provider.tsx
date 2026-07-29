"use client";

import { useEffect } from "react";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

/**
 * Global dark-mode shortcut: press `d` to toggle theme.
 * Ignored while typing in form fields or contenteditable nodes.
 */
function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "d" && event.key !== "D") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (
        isTypingTarget(event.target) ||
        isTypingTarget(document.activeElement)
      ) {
        return;
      }

      event.preventDefault();
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [resolvedTheme, setTheme]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  );
}
