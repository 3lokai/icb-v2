import { PortableText } from "@portabletext/react";
import { Icon, type IconName } from "@/components/common/Icon";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface StepListProps {
  value: {
    variant?: "default" | "brewing" | "process";
    steps?: Array<{
      title?: string;
      content: any[];
      icon?: string;
      time?: string;
    }>;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function StepList({ value }: StepListProps) {
  const isBrewing = value.variant === "brewing";

  return (
    <motion.div
      className="not-prose my-12 space-y-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {value.steps?.map((step, i) => (
        <motion.div key={i} variants={itemVariants} className="flex gap-6">
          <div className="relative shrink-0">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-2xl font-bold text-body shadow-md border-2 border-white/10 dark:border-black/10 transition-transform hover:scale-105",
                isBrewing ? "bg-primary text-white" : "bg-accent text-white"
              )}
            >
              {i + 1}
            </div>
            {i !== (value.steps?.length || 0) - 1 && (
              <div className="absolute left-5 top-12 bottom-[-40px] w-px bg-gradient-to-b from-border/50 via-border/20 to-transparent" />
            )}
          </div>

          <div className="pt-1 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              {step.title && (
                <h4 className="text-heading font-bold text-foreground tracking-tight">
                  {step.title}
                </h4>
              )}
              {step.icon && (
                <Icon
                  name={step.icon as IconName}
                  size={18}
                  className="text-muted-foreground opacity-60"
                />
              )}
              {step.time && (
                <span className="flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1 text-micro font-medium text-muted-foreground border border-border/40">
                  <Icon name="Timer" size={12} />
                  {step.time}
                </span>
              )}
            </div>
            <div className="prose-sm prose-slate max-w-none text-muted-foreground leading-relaxed">
              <PortableText value={step.content} />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
