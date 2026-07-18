"use client";

import { motion } from "motion/react";

interface DataTableProps {
  value: {
    title?: string;
    headers?: string[];
    rows?: Array<{ cells?: string[] }>;
  };
}

// Generic tabular block with arbitrary columns. Unlike BrewingTable (fixed
// Method/Grind/Ratio/Time/Notes columns), headers and cells are data-driven.
export function DataTable({ value }: DataTableProps) {
  const headers = value.headers ?? [];

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
          <h2 className="text-title font-bold text-foreground tracking-tight">
            {value.title}
          </h2>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="border-b bg-muted/40">
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-overline font-bold uppercase tracking-widest text-muted-foreground/80"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {value.rows?.map((row, ri) => (
              <tr key={ri} className="transition-colors hover:bg-primary/5">
                {(row.cells ?? []).map((cell, ci) => (
                  <td
                    key={ci}
                    className={
                      ci === 0
                        ? "px-6 py-5 text-body font-bold text-foreground"
                        : "px-6 py-5 text-body text-muted-foreground"
                    }
                  >
                    {cell || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
