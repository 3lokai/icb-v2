"use client";

import { PortableText } from "@portabletext/react";
import { Icon, type IconName } from "@/components/common/Icon";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface CalloutProps {
  value: {
    type?: string;
    title?: string;
    content: any[];
  };
}

export function Callout({ value }: CalloutProps) {
  const types: Record<
    string,
    {
      icon: IconName;
      class: string;
      iconColor: "primary" | "accent" | "destructive";
    }
  > = {
    info: {
      icon: "Info",
      class:
        "bg-blue-50/30 border-blue-200/50 text-blue-900 dark:bg-blue-900/10 dark:border-blue-800/40 dark:text-blue-100",
      iconColor: "primary",
    },
    warning: {
      icon: "Warning",
      class:
        "bg-amber-50/30 border-amber-200/50 text-amber-900 dark:bg-amber-900/10 dark:border-amber-800/40 dark:text-amber-100",
      iconColor: "primary",
    },
    tip: {
      icon: "Lightbulb",
      class:
        "bg-emerald-50/30 border-emerald-200/50 text-emerald-900 dark:bg-emerald-900/10 dark:border-emerald-800/40 dark:text-emerald-100",
      iconColor: "accent",
    },
    success: {
      icon: "CheckCircle",
      class:
        "bg-emerald-50/30 border-emerald-200/50 text-emerald-900 dark:bg-emerald-900/10 dark:border-emerald-800/40 dark:text-emerald-100",
      iconColor: "accent",
    },
    error: {
      icon: "XCircle",
      class:
        "bg-red-50/30 border-red-200/50 text-red-900 dark:bg-red-900/10 dark:border-red-800/40 dark:text-red-100",
      iconColor: "destructive",
    },
  };

  const config = types[value.type as keyof typeof types] || types.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      className={cn(
        "not-prose my-8 flex gap-5 rounded-2xl border p-6 shadow-sm backdrop-blur-[2px]",
        config.class
      )}
    >
      <div className="mt-0.5">
        <Icon
          name={config.icon}
          size={24}
          className="shrink-0"
          color={config.iconColor}
        />
      </div>
      <div className="flex-1">
        {value.title && (
          <h4 className="mb-2 font-bold uppercase tracking-widest text-overline opacity-80">
            {value.title}
          </h4>
        )}
        <div className="prose-sm prose-slate max-w-none leading-relaxed text-current/90">
          <PortableText value={value.content} />
        </div>
      </div>
    </motion.div>
  );
}
