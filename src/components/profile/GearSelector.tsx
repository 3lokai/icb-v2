"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useGearSearch } from "@/hooks/use-gear";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";

interface GearSelectorProps {
  category?: "grinder" | "brewer" | "accessory";
  onSelect: (gearId: string, gearName: string) => void;
  onCreateNew: () => void;
}

export function GearSelector({
  category,
  onSelect,
  onCreateNew,
}: GearSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: gearItems = [], isLoading } = useGearSearch(
    debouncedQuery,
    category
  );

  // Group gear by category
  const groupedGear = useMemo(() => {
    const groups: Record<string, typeof gearItems> = {
      grinder: [],
      brewer: [],
      accessory: [],
    };

    gearItems.forEach((item) => {
      if (groups[item.category]) {
        groups[item.category].push(item);
      }
    });

    return groups;
  }, [gearItems]);

  const handleSelect = (gearId: string, gearName: string) => {
    onSelect(gearId, gearName);
    setOpen(false);
    setSearchQuery("");
  };

  const categoryLabels: Record<string, string> = {
    grinder: "Grinders",
    brewer: "Brewers",
    accessory: "Accessories",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background/50 border-border/40 font-normal hover:border-accent/40 transition-colors"
        >
          <span className="truncate">
            {searchQuery || "Search gear catalog..."}
          </span>
          <Icon
            name="CaretUpDown"
            size={14}
            className="opacity-50 shrink-0 ml-2"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 surface-2" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search gear..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading && debouncedQuery.length >= 2 && (
              <div className="py-6 text-center text-caption text-muted-foreground">
                Searching...
              </div>
            )}
            {!isLoading && debouncedQuery.length < 2 && (
              <div className="py-6 text-center text-caption text-muted-foreground">
                Type at least 2 characters to search
              </div>
            )}
            {!isLoading &&
              debouncedQuery.length >= 2 &&
              gearItems.length === 0 && (
                <CommandEmpty>
                  No gear found. Try a different search.
                </CommandEmpty>
              )}
            {!isLoading && gearItems.length > 0 && (
              <>
                {(["grinder", "brewer", "accessory"] as const).map((cat) => {
                  const items = groupedGear[cat];
                  if (items.length === 0) return null;

                  return (
                    <CommandGroup key={cat} heading={categoryLabels[cat]}>
                      {items.map((item) => {
                        const displayName = item.brand
                          ? `${item.brand} ${item.model || item.name}`
                          : item.name;

                        return (
                          <CommandItem
                            key={item.id}
                            value={`${item.id}-${displayName}`}
                            onSelect={() => handleSelect(item.id, displayName)}
                            className="flex items-center justify-between gap-2"
                          >
                            <span className="truncate">{displayName}</span>
                            {item.is_verified && (
                              <Badge
                                variant="secondary"
                                className="shrink-0 text-micro px-1.5 py-0"
                              >
                                Verified
                              </Badge>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  );
                })}
              </>
            )}
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  onCreateNew();
                }}
                className="text-accent cursor-pointer"
              >
                <Icon name="Plus" size={14} className="mr-2" />
                Create new gear item
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
