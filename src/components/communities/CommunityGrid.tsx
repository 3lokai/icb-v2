"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/common/Icon";
import { CommunityCard } from "@/components/cards/CommunityCard";
import type { CommunityDTO } from "@/types/community-types";

type CommunityGridProps = {
  communities: CommunityDTO[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  },
};

export function CommunityGrid({ communities }: CommunityGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCommunities = useMemo(() => {
    if (!searchQuery.trim()) return communities;

    const query = searchQuery.toLowerCase();
    return communities.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.tags.some((t) => t.toLowerCase().includes(query)) ||
        c.moderators.some((m) => m.toLowerCase().includes(query))
    );
  }, [communities, searchQuery]);

  return (
    <Section spacing="default">
      <Stack gap="12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <Stack gap="3">
            <div className="inline-flex items-center gap-4">
              <span className="h-px w-8 md:w-12 bg-accent/60" />
              <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
                DIRECTORY
              </span>
            </div>
            <h2 className="text-title text-balance leading-none">
              Explore coffee{" "}
              <span className="text-accent italic">Circles.</span>
            </h2>
          </Stack>

          <div className="relative w-full max-w-sm">
            <Icon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              name="MagnifyingGlass"
              size={18}
            />
            <Input
              className="pl-10 h-11 bg-muted/30 border-border/40 focus:bg-background transition-colors"
              placeholder="Search by name, tags, or mods..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredCommunities.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-20 text-center"
              >
                <Stack gap="4" className="items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Icon name="Ghost" size={32} color="muted" />
                  </div>
                  <p className="text-body-large text-muted-foreground">
                    No communities found matching &quot;{searchQuery}&quot;
                  </p>
                  <button
                    className="text-accent hover:underline text-label"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </button>
                </Stack>
              </motion.div>
            ) : (
              filteredCommunities.map((community) => (
                <motion.div
                  key={community.id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <CommunityCard community={community} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </Stack>
    </Section>
  );
}
