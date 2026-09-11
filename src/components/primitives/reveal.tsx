"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Hidden-state offset the block animates in from. */
  from?: "up" | "left" | "scale" | "fade";
  className?: string;
};

const HIDDEN: Record<NonNullable<RevealProps["from"]>, string> = {
  up: "translate-y-6",
  left: "-translate-x-5",
  scale: "scale-95",
  fade: "",
};

/** useLayoutEffect on the client, useEffect on the server (where it is a no-op). */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Fires once when the element scrolls into view (20% visible), then
 * disconnects. For custom reveal markup that can't use <Reveal>.
 *
 * **Fails open.** The initial state is `shown`, and the content is hidden again
 * in a layout effect — before first paint, so there is no flash. If JS never
 * runs, or an error anywhere upstream stops effects from running, the content
 * stays readable instead of sitting at `opacity-0` forever. Readable content
 * must never depend on an IntersectionObserver firing.
 */
export function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(true);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    setShown(false);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, shown };
}

/**
 * Reveal - Scroll-into-view fade/rise for a section block (Layer 2).
 *
 * Isolated client leaf so server sections can opt into motion without going
 * `"use client"` wholesale. Collapses to static instantly under
 * `prefers-reduced-motion` (CSS `motion-reduce`, no JS branch). Animates only
 * transform + opacity.
 *
 * Implemented with IntersectionObserver + CSS transition (not motion/react)
 * so statically-imported sections don't pull the motion bundle into the
 * eager route chunk.
 *
 * @example
 * <Reveal><ExpensiveServerContent /></Reveal>
 */
export function Reveal({
  children,
  delay = 0,
  from = "up",
  className,
}: RevealProps) {
  const { ref, shown } = useInViewOnce<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        shown ? "opacity-100" : cn("opacity-0", HIDDEN[from]),
        className
      )}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
