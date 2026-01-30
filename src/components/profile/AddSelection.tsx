"use client";

import { useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRoasters } from "@/hooks/use-roasters";
import { useCoffees } from "@/hooks/use-coffees";
import { useModal } from "@/components/providers/modal-provider";
import { QuickRating } from "@/components/reviews";
import type { CoffeeFilters } from "@/types/coffee-types";
import type { RoasterFilters } from "@/types/roaster-types";

export function AddSelection() {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedRoasterId, setSelectedRoasterId] = useState<string | null>(
    null
  );
  const [selectedRoasterName, setSelectedRoasterName] = useState("");
  const [isRoasterOpen, setIsRoasterOpen] = useState(false);
  const { openModal } = useModal();

  // Fetch Roasters (simple list for dropdown)
  const { data: roasterData } = useRoasters({
    filters: {} as RoasterFilters,
    page: 1,
    limit: 100,
    sort: "name_asc",
  });

  // Fetch Coffees for selected roaster
  const { data: coffeeData } = useCoffees(
    {
      filters: {
        roaster_ids: selectedRoasterId ? [selectedRoasterId] : undefined,
      } as CoffeeFilters,
      page: 1,
      limit: 100,
      sort: "name_asc",
    },
    {
      enabled: !!selectedRoasterId,
    }
  );

  const handleCoffeeSelect = (coffeeId: string) => {
    openModal({
      type: "custom",
      component: QuickRating,
      props: {
        entityType: "coffee",
        entityId: coffeeId,
        onClose: () => {},
      },
    });
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-8 bg-muted/20 border border-dashed border-border/60 rounded-[2rem] transition-all duration-500 min-h-[200px] overflow-hidden group",
        isHovered || selectedRoasterId
          ? "bg-muted/30 border-accent/20"
          : "hover:bg-muted/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() =>
        !isRoasterOpen && !selectedRoasterId && setIsHovered(false)
      }
    >
      {!(isHovered || selectedRoasterId) ? (
        <div className="flex flex-col items-center justify-center group pointer-events-none">
          <Icon
            name="PlusCircle"
            size={24}
            className="text-muted-foreground/40 group-hover:text-accent/60 transition-colors mb-2"
          />
          <span className="text-label group-hover:text-foreground transition-colors">
            Add to my selections
          </span>
        </div>
      ) : (
        <Stack
          gap="4"
          className="w-full max-w-[240px] animate-in fade-in zoom-in duration-300"
        >
          <div className="space-y-2">
            <label className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60">
              1. Select Roaster
            </label>
            <Popover open={isRoasterOpen} onOpenChange={setIsRoasterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isRoasterOpen}
                  className="w-full justify-between bg-background/50 border-border/40 font-normal hover:border-accent/40 transition-colors"
                >
                  <span className="truncate">
                    {selectedRoasterName || "Select a roaster..."}
                  </span>
                  <Icon
                    name="CaretUpDown"
                    size={14}
                    className="opacity-50 shrink-0 ml-2"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[240px] p-0 surface-2" align="start">
                <Command>
                  <CommandInput placeholder="Search roasters..." />
                  <CommandList>
                    <CommandEmpty>No roaster found.</CommandEmpty>
                    <CommandGroup>
                      {roasterData?.items.map((roaster) => (
                        <CommandItem
                          key={roaster.id}
                          value={roaster.name}
                          onSelect={() => {
                            setSelectedRoasterId(roaster.id);
                            setSelectedRoasterName(roaster.name);
                            setIsRoasterOpen(false);
                          }}
                        >
                          {roaster.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60">
              2. Select Coffee
            </label>
            <Select
              disabled={!selectedRoasterId}
              onValueChange={handleCoffeeSelect}
            >
              <SelectTrigger className="w-full bg-background/50 border-border/40 font-normal h-10 hover:border-accent/40 transition-colors">
                <SelectValue
                  placeholder={
                    selectedRoasterId
                      ? "Choose coffee..."
                      : "Pick roaster first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {coffeeData?.items.map((coffee) => (
                  <SelectItem key={coffee.coffee_id} value={coffee.coffee_id!}>
                    {coffee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRoasterId && (
            <Button
              variant="ghost"
              size="sm"
              className="text-micro text-muted-foreground hover:text-accent self-end h-auto p-0"
              onClick={() => {
                setSelectedRoasterId(null);
                setSelectedRoasterName("");
              }}
            >
              Clear selection
            </Button>
          )}
        </Stack>
      )}
    </div>
  );
}
