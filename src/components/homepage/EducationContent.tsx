// src/components/homepage/EducationContent.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon, IconName } from "@/components/common/Icon";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type EducationColor = "primary" | "accent";

const educationItems: {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  color: EducationColor;
}[] = [
  {
    id: "varieties",
    title: "Bean Varieties",
    description:
      "Learn about India's Arabica and Robusta varieties and what makes them special.",
    icon: "CoffeeBean",
    color: "primary",
  },
  {
    id: "brewing",
    title: "Brewing Guides",
    description:
      "Master brewing techniques specifically tailored to bring out the best in Indian coffees.",
    icon: "Coffee",
    color: "accent",
  },
  {
    id: "glossary",
    title: "Coffee Glossary",
    description:
      "Decode coffee terminology with our comprehensive glossary of industry terms.",
    icon: "BookOpen",
    color: "primary",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function EducationSection() {
  return (
    <Section id="learn" spacing="loose">
      <div className="relative mx-auto max-w-6xl w-full">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          />
          <motion.div
            className="absolute -right-20 bottom-1/4 h-48 w-48 rounded-full bg-accent/5 blur-3xl"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          />
        </div>

        <Stack gap="12">
          {/* Two-column layout: Content left, Image right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Header + List */}
            <div className="order-1">
              <Stack gap="12">
                {/* Header Section - Left aligned */}
                <div className="relative">
                  <Stack gap="6">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      className="inline-flex items-center gap-4"
                    >
                      <span className="h-px w-8 md:w-12 bg-primary/70" />
                      <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
                        Knowledge Base
                      </span>
                    </motion.div>

                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="text-title text-balance leading-[1.1] tracking-tight"
                    >
                      Unlock the World of{" "}
                      <span className="text-accent italic font-serif">
                        Indian Coffee
                      </span>
                    </motion.h2>

                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="max-w-xl text-pretty text-body-large text-muted-foreground leading-relaxed font-light"
                    >
                      From the misty plantations of the Western Ghats to your
                      cup — dive into the heritage, science, and craft behind
                      India&apos;s finest coffee.
                    </motion.p>
                  </Stack>
                </div>

                {/* Simple List with Icons */}
                <motion.ul
                  className="flex flex-col gap-5"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {educationItems.map((item, index) => (
                    <motion.li
                      key={item.id}
                      variants={itemVariants}
                      className="flex items-start gap-4"
                    >
                      {/* Animated Icon */}
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          duration: 3,
                          ease: "easeInOut" as const,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                        className={cn(
                          "h-10 w-10 flex-center rounded-lg flex-shrink-0",
                          item.color === "accent"
                            ? "bg-accent/10 text-accent"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon name={item.icon} size={20} color={item.color} />
                      </motion.div>

                      {/* Text Content */}
                      <div className="pt-0.5">
                        <h3
                          className={cn(
                            "text-subheading tracking-tight mb-1",
                            item.color === "accent"
                              ? "text-accent"
                              : "text-primary"
                          )}
                        >
                          {item.title}
                        </h3>
                        <p className="text-body text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <Button asChild size="lg" variant="default">
                    <Link href="/learn">
                      Explore Educational Content
                      <Icon className="ml-2" name="ArrowRight" size={16} />
                    </Link>
                  </Button>
                </motion.div>
              </Stack>
            </div>

            {/* Right Column: Image with floating card (hidden on mobile) */}
            <div className="relative order-2 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative mx-auto aspect-square max-w-[480px]"
              >
                {/* Main Image */}
                <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    alt="Open coffee education journal on wooden café table"
                    className="h-full w-full object-cover"
                    height={480}
                    priority
                    src="/images/home/open-book-cafe.avif"
                    width={480}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Floating "Did You Know" Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  animate={{ y: [0, -8, 0] }}
                  className="absolute -bottom-6 -left-6 z-20 hidden max-w-xs lg:block"
                >
                  <div className="surface-1 p-4 shadow-xl rounded-xl border border-border/50">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 flex-center flex-shrink-0 rounded-full border border-accent/30 bg-accent/10 text-accent">
                        <Icon name="Coffee" size={16} color="accent" />
                      </div>
                      <div>
                        <p className="mb-1 font-medium text-foreground text-caption">
                          Did You Know?
                        </p>
                        <p className="text-muted-foreground text-overline leading-relaxed">
                          India&apos;s famed Monsooned Malabar gets its unique
                          flavour from monsoon winds.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative floating elements */}
                <div className="absolute top-6 right-6 h-16 w-16 animate-pulse rounded-full bg-accent/10 blur-xl" />
              </motion.div>
            </div>
          </div>
        </Stack>
      </div>
    </Section>
  );
}
