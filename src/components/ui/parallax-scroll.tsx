"use client";

import {
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useRef } from "react";
import { motion } from "motion/react";

import { useIsLg } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type ParallaxScrollImagesProps = {
  images: string[];
  className?: string;
};

type ParallaxScrollItemsProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  scrollTarget?: "container" | "viewport";
  distribution?: "sequential" | "roundRobin";
  getItemKey?: (item: T) => string | number;
};

export function ParallaxScroll<T>(
  props: ParallaxScrollImagesProps | ParallaxScrollItemsProps<T>
) {
  const gridRef = useRef<HTMLDivElement>(null);

  const isItemsMode = "items" in props && "renderItem" in props;
  const items = isItemsMode ? props.items : [];
  const scrollTarget =
    isItemsMode && props.scrollTarget ? props.scrollTarget : "container";
  const distribution =
    isItemsMode && props.distribution ? props.distribution : "sequential";
  const getItemKey =
    isItemsMode && props.getItemKey ? props.getItemKey : undefined;

  const isLg = useIsLg();
  const prefersReducedMotion = useReducedMotion();
  const inViewRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(inViewRef, { amount: "some" });
  const parallaxEnabled =
    isItemsMode &&
    (scrollTarget === "container" ||
      (scrollTarget === "viewport" &&
        isLg &&
        !prefersReducedMotion &&
        isInView));

  const { scrollYProgress } = useScroll(
    scrollTarget === "viewport"
      ? {}
      : {
          container: gridRef,
          offset: ["start start", "end start"],
        }
  );

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const translateFirst = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    [0, -30, -60, 0]
  );
  const translateSecond = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    [0, -80, -160, 0]
  );
  const translateThird = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    [0, -50, -100, 0]
  );

  const columnTransforms = [translateFirst, translateSecond, translateThird];

  if (isItemsMode) {
    const columns: T[][] = [[], [], []];
    if (distribution === "roundRobin") {
      items.forEach((item, index) => {
        columns[index % 3].push(item);
      });
    } else {
      const third = Math.ceil(items.length / 3);
      columns[0] = items.slice(0, third);
      columns[1] = items.slice(third, 2 * third);
      columns[2] = items.slice(2 * third);
    }

    return (
      <div
        className={cn(
          scrollTarget === "viewport" &&
            "overflow-visible lg:pb-[200px] lg:-mb-[200px] pt-4",
          scrollTarget === "container" &&
            "h-[40rem] items-start overflow-y-auto w-full",
          props.className
        )}
        ref={scrollTarget === "container" ? gridRef : undefined}
      >
        <div
          ref={scrollTarget === "viewport" ? inViewRef : gridRef}
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-6",
            scrollTarget === "container" &&
              "max-w-5xl mx-auto gap-10 py-40 px-10"
          )}
        >
          {columns.map((colItems, colIndex) => (
            <motion.div
              key={`col-${colIndex}`}
              style={{ y: parallaxEnabled ? columnTransforms[colIndex] : 0 }}
              className={cn(
                "flex flex-col gap-6 will-change-transform transform-gpu",
                colIndex === 1 && "lg:mt-16"
              )}
            >
              {colItems.map((item, idx) => (
                <div key={getItemKey ? getItemKey(item) : `${colIndex}-${idx}`}>
                  {props.renderItem(item, idx)}
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Images mode (original behavior)
  const images = props.images;
  const third = Math.ceil(images.length / 3);
  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  return (
    <div
      className={cn(
        "h-[40rem] items-start overflow-y-auto w-full",
        props.className
      )}
      ref={gridRef}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 py-40 px-10">
        <div className="grid gap-10">
          {firstPart.map((el, idx) => (
            <motion.div style={{ y: translateFirst }} key={"grid-1" + idx}>
              <img
                src={el}
                className="h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((el, idx) => (
            <motion.div style={{ y: translateSecond }} key={"grid-2" + idx}>
              <img
                src={el}
                className="h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {thirdPart.map((el, idx) => (
            <motion.div style={{ y: translateThird }} key={"grid-3" + idx}>
              <img
                src={el}
                className="h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
