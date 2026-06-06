"use client";

import { motion, useReducedMotion } from "motion/react";

type RevealProps = {
  children: React.ReactNode;
  /** Stagger delay in seconds. */
  delay?: number;
  className?: string;
};

/**
 * Reveal - Scroll-into-view fade/rise for a section block (Layer 2).
 *
 * Isolated client leaf so server sections can opt into motion without going
 * `"use client"` wholesale. Collapses to static instantly under
 * `prefers-reduced-motion`. Animates only transform + opacity.
 *
 * @example
 * <Reveal><ExpensiveServerContent /></Reveal>
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
