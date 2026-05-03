"use client";

import { Icon } from "@/components/common/Icon";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { cn } from "@/lib/utils";

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

type DocumentWithVt = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
    finished?: Promise<void>;
  };
};

function runCircleReveal(
  anchor: DOMRectReadOnly | undefined,
  durationMs: number
): void {
  if (!anchor) {
    return;
  }
  const { top, left, width, height } = anchor;
  const x = left + width / 2;
  const y = top + height / 2;
  const maxRadius = Math.hypot(
    Math.max(left, window.innerWidth - left),
    Math.max(top, window.innerHeight - top)
  );
  try {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: durationMs,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  } catch {
    /* View Transition pseudo-elements are not reliably animatable in all engines */
  }
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  onClick,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    const anchor = buttonRef.current?.getBoundingClientRect();

    const current = resolvedTheme ?? "light";
    const newTheme = current === "dark" ? "light" : "dark";

    const applyTheme = (): void => {
      flushSync(() => {
        setTheme(newTheme);
      });
    };

    const doc = document as DocumentWithVt;

    if (!doc.startViewTransition) {
      applyTheme();
      return;
    }

    try {
      const transition = doc.startViewTransition(applyTheme);

      transition.ready
        .then(() => {
          runCircleReveal(anchor, duration);
        })
        .catch(() => {
          /*
           * Transition may reject (overlap, aborted callback). Theme was still
           * applied synchronously inside startViewTransition’s callback when it ran.
           */
        });

      transition.finished?.catch(() => {});
    } catch {
      applyTheme();
    }
  }, [resolvedTheme, setTheme, duration]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      onClick?.(e);
      if (e.defaultPrevented) {
        return;
      }
      toggleTheme();
    },
    [onClick, toggleTheme]
  );

  if (!mounted) {
    return (
      <button
        type="button"
        {...props}
        aria-label={props["aria-label"] ?? "Toggle theme"}
        className={cn(className)}
        disabled
        ref={buttonRef}
      >
        <Icon className="opacity-0" name="Moon" size={20} />
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      {...props}
      className={cn(className)}
      onClick={handleClick}
      ref={buttonRef}
    >
      {isDark ? <Icon name="Sun" size={20} /> : <Icon name="Moon" size={20} />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
