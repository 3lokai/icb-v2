"use client";

import { motion } from "motion/react";

export function ComingSoonBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
      whileInView={{ opacity: 0.85, scale: 1, rotate: 12 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" as const }}
      className="pointer-events-none absolute -right-4 -top-4 md:-right-8 md:-top-8 select-none mix-blend-multiply dark:mix-blend-screen z-20"
    >
      <svg
        viewBox="0 0 140 140"
        className="h-28 w-28 md:h-32 md:w-32 text-muted-foreground"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="textPath-edu"
          d="M70 15 A 55 55 0 1 1 70 125 A 55 55 0 1 1 70 15"
          stroke="transparent"
        />
        <text className="fill-current text-caption font-bold uppercase tracking-[0.25em]">
          <textPath href="#textPath-edu" startOffset="50%" textAnchor="middle">
            • Coming Soon • Coming Soon
          </textPath>
        </text>

        <circle
          cx="70"
          cy="70"
          r="40"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 4"
          className="opacity-40"
        />
        <circle
          cx="70"
          cy="70"
          r="34"
          stroke="currentColor"
          strokeWidth="0.5"
          className="opacity-20"
        />

        <image
          href="/logo-icon.svg"
          x="40"
          y="40"
          width="60"
          height="60"
          className="opacity-25"
        />
      </svg>
    </motion.div>
  );
}
