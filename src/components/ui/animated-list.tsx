"use client";
import { AnimatePresence, motion } from "motion/react";
import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{ scale: 1, opacity: 1, originY: 0 }}
      className="mx-auto w-full"
      exit={{ scale: 0, opacity: 0 }}
      initial={{ scale: 0, opacity: 0 }}
      layout
      transition={{ type: "spring" as const, stiffness: 350, damping: 40 }}
    >
      {children}
    </motion.div>
  );
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  delay?: number;
  maxItems?: number; // Add this to control how many items show at once
}

export const AnimatedList = React.memo(
  ({
    children,
    className,
    delay = 1000,
    maxItems = 6,
    ...props
  }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    );

    useEffect(() => {
      // Remove the condition to make it continuous
      const timeout = setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
      }, delay);
      return () => clearTimeout(timeout);
    }, [delay, childrenArray.length]);

    const itemsToShow = useMemo(() => {
      // Show a sliding window of items instead of accumulating
      const startIndex = Math.max(0, index - maxItems + 1);
      const endIndex = index + 1;
      const result = childrenArray.slice(startIndex, endIndex).reverse();
      return result;
    }, [index, childrenArray, maxItems]);

    return (
      <div
        className={cn("flex flex-col items-center gap-4", className)}
        {...props}
      >
        <AnimatePresence>
          {itemsToShow.map((item, itemIndex) => (
            <AnimatedListItem
              key={`${(item as React.ReactElement).key}-${index - itemIndex}`}
            >
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedList.displayName = "AnimatedList";
