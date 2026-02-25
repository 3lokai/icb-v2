"use client";

import { motion } from "motion/react";

interface BrewingTableProps {
  value: {
    title?: string;
    rows?: Array<{
      method: string;
      grind: string;
      ratio: string;
      time: string;
      notes?: string;
    }>;
  };
}

export function BrewingTable({ value }: BrewingTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="not-prose my-12 overflow-hidden rounded-2xl border bg-card shadow-lg border-border/40"
    >
      {value.title && (
        <div className="border-b bg-muted/20 px-6 py-4">
          <h4 className="text-title font-bold text-foreground tracking-tight">
            {value.title}
          </h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-6 py-4 text-overline font-bold uppercase tracking-widest text-muted-foreground/80">
                Method
              </th>
              <th className="px-6 py-4 text-overline font-bold uppercase tracking-widest text-muted-foreground/80">
                Grind
              </th>
              <th className="px-6 py-4 text-overline font-bold uppercase tracking-widest text-muted-foreground/80">
                Ratio
              </th>
              <th className="px-6 py-4 text-overline font-bold uppercase tracking-widest text-muted-foreground/80">
                Time
              </th>
              <th className="px-6 py-4 text-overline font-bold uppercase tracking-widest text-muted-foreground/80">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {value.rows?.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-primary/5">
                <td className="px-6 py-5 text-body font-bold text-foreground">
                  {row.method}
                </td>
                <td className="px-6 py-5 text-body text-muted-foreground">
                  {row.grind}
                </td>
                <td className="px-6 py-5 text-body text-muted-foreground">
                  {row.ratio}
                </td>
                <td className="px-6 py-5 text-body text-muted-foreground">
                  {row.time}
                </td>
                <td className="px-6 py-5 text-body italic text-muted-foreground/70 leading-relaxed min-w-[200px]">
                  {row.notes || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
