"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Stack } from "@/components/primitives/stack";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { Cluster } from "../primitives/cluster";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfile, useProfile } from "@/hooks/use-profile";
import type { CoffeePreferences } from "@/types/profile-types";
import { ROAST_LEVELS, PROCESSING_METHODS } from "@/lib/utils/coffee-constants";

type ProfileHeaderProps = {
  name: string;
  avatarUrl?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
  isOwner?: boolean;
  isAnonymous?: boolean;
  coffeePreferences?: CoffeePreferences | null;
};

// Helper to get label from value
function getLabel(
  value: string,
  options: { value: string; label: string }[]
): string {
  return options.find((o) => o.value === value)?.label || value;
}

// Format preference value for display (capitalize, replace underscores)
function formatPreferenceValue(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function ProfileHeader({
  name,
  avatarUrl,
  city,
  state,
  country,
  bio,
  isOwner = false,
  isAnonymous = false,
  coffeePreferences,
}: ProfileHeaderProps) {
  const [editingField, setEditingField] = useState<
    "name" | "bio" | "location" | null
  >(null);
  const [tempValue, setTempValue] = useState("");
  const updateProfile = useUpdateProfile();
  const { data: profile } = useProfile();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingField]);

  const handleStartEdit = (
    field: "name" | "bio" | "location",
    initialValue: string
  ) => {
    if (!isOwner || isAnonymous) return;
    setEditingField(field);
    setTempValue(initialValue);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleSave = async () => {
    if (!editingField) return;

    const fieldToUpdate = editingField;
    const value = tempValue.trim();

    // Optimistically close edit mode
    setEditingField(null);

    try {
      if (fieldToUpdate === "name") {
        await updateProfile.mutateAsync({ fullName: value });
      } else if (fieldToUpdate === "bio") {
        await updateProfile.mutateAsync({ fullName: name, bio: value });
      } else if (fieldToUpdate === "location") {
        await updateProfile.mutateAsync({ fullName: name, city: value });
      }
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  // Format display location
  const locationParts = [];
  if (city) locationParts.push(city);
  if (state) locationParts.push(state);
  if (country) locationParts.push(country);
  const displayLocation = locationParts.join(", ");

  // Check if preferences strip will be shown
  const hasPreferencesToShow =
    coffeePreferences &&
    !isAnonymous &&
    ((coffeePreferences.roast_levels &&
      coffeePreferences.roast_levels.length > 0) ||
      (coffeePreferences.flavor_profiles &&
        coffeePreferences.flavor_profiles.length > 0) ||
      (coffeePreferences.processing_methods &&
        coffeePreferences.processing_methods.length > 0) ||
      (coffeePreferences.regions && coffeePreferences.regions.length > 0));

  return (
    <div
      className={`relative group ${hasPreferencesToShow ? "pb-16 mb-4" : "pb-12"}`}
    >
      <Stack gap="6">
        <Stack
          gap="6"
          className="md:flex-row md:items-center md:justify-between"
        >
          <Cluster gap="6" align="center">
            {isOwner ? (
              <AvatarUpload
                currentAvatarUrl={avatarUrl}
                name={name}
                userId={profile?.id}
                size="lg"
                className="grayscale group-hover:grayscale-0 transition-all duration-700"
                disabled={!isOwner || isAnonymous}
              />
            ) : (
              <AvatarUpload
                currentAvatarUrl={avatarUrl}
                name={isAnonymous ? "Anonymous User" : name}
                size="lg"
                className="grayscale group-hover:grayscale-0 transition-all duration-700"
                disabled={true}
              />
            )}

            <Stack gap="2">
              {editingField === "name" ? (
                <Input
                  ref={inputRef as any}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  className="text-display font-serif italic h-auto py-0 px-1 border-none bg-transparent focus-visible:ring-0 focus-visible:bg-surface-1"
                />
              ) : (
                <h1
                  className={`text-display font-serif italic text-balance ${isOwner && !isAnonymous ? "hover:bg-surface-0 cursor-text px-1 -mx-1 rounded transition-colors" : ""}`}
                  onClick={() => handleStartEdit("name", name)}
                >
                  {isAnonymous ? "This could be you" : name}
                </h1>
              )}

              <div
                className={`flex items-center gap-2 group/loc ${isOwner && !isAnonymous ? "cursor-pointer" : ""} transition-colors w-fit`}
                onClick={() => handleStartEdit("location", city || "")}
              >
                {editingField === "location" ? (
                  <Input
                    ref={inputRef as any}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="text-label h-auto py-0 px-1 border-none bg-transparent focus-visible:ring-0 focus-visible:bg-surface-1 min-w-[200px]"
                    placeholder="Add location (City, State...)"
                  />
                ) : (
                  <>
                    <span className="text-label text-muted-foreground whitespace-nowrap">
                      {isAnonymous
                        ? "Somewhere in the coffee-verse"
                        : displayLocation || (isOwner ? "Add location" : "")}
                    </span>
                    {isOwner && !isAnonymous && (
                      <Icon
                        name="PencilSimple"
                        size={12}
                        className="opacity-0 group-hover/loc:opacity-100 transition-opacity text-muted-foreground"
                      />
                    )}
                  </>
                )}
              </div>
            </Stack>
          </Cluster>
        </Stack>

        <div
          className={`max-w-xl group/bio ${isOwner && !isAnonymous ? "cursor-text" : ""}`}
        >
          {editingField === "bio" ? (
            <Textarea
              ref={inputRef as any}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="text-body-large leading-relaxed min-h-[100px] border-none bg-transparent focus-visible:ring-0 focus-visible:bg-surface-1 p-0"
              placeholder="Add a short bio about your coffee journey..."
            />
          ) : (
            <p
              className="text-body-large text-muted-foreground leading-relaxed"
              onClick={() => handleStartEdit("bio", bio || "")}
            >
              {isAnonymous
                ? "Save your ratings permanently and share your journey with the community."
                : bio ||
                  (isOwner ? "Add a short bio about your coffee journey" : "")}
              {isOwner && !isAnonymous && (
                <span className="inline-block ml-2 opacity-0 group-hover/bio:opacity-100 transition-opacity">
                  <Icon
                    name="PencilSimple"
                    size={14}
                    className="text-muted-foreground"
                  />
                </span>
              )}
            </p>
          )}
        </div>
      </Stack>

      {/* Action Bar */}
      {isOwner && !isAnonymous && (
        <div className="absolute top-0 right-0">
          <Cluster gap="2">
            <Link href="/dashboard/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-micro text-muted-foreground hover:text-foreground"
              >
                <Icon name="GearSix" size={14} className="mr-2" />
                Settings
              </Button>
            </Link>
          </Cluster>
        </div>
      )}

      {isAnonymous && (
        <div className="absolute top-0 right-0">
          <Link href="/login">
            <Button size="sm" className="rounded-full shadow-lg hover-lift">
              <Icon name="UserPlus" size={14} className="mr-2" />
              Create Profile
            </Button>
          </Link>
        </div>
      )}

      {/* Coffee Preferences Strip */}
      {coffeePreferences && !isAnonymous && (
        <PreferencesStrip preferences={coffeePreferences} />
      )}
    </div>
  );
}

// Preferences strip component
function PreferencesStrip({ preferences }: { preferences: CoffeePreferences }) {
  const {
    roast_levels,
    flavor_profiles,
    processing_methods,
    regions,
    decaf_only,
    organic_only,
    with_milk_preference,
  } = preferences;

  // Check if there are any preferences to display
  const hasPreferences =
    (roast_levels && roast_levels.length > 0) ||
    (flavor_profiles && flavor_profiles.length > 0) ||
    (processing_methods && processing_methods.length > 0) ||
    (regions && regions.length > 0) ||
    decaf_only ||
    organic_only ||
    with_milk_preference !== null;

  if (!hasPreferences) {
    return null;
  }

  // Format preferences for display
  const roastLabels = roast_levels?.map((v) => getLabel(v, ROAST_LEVELS)) || [];
  const processingLabels =
    processing_methods?.map((v) => getLabel(v, PROCESSING_METHODS)) || [];
  const flavorLabels =
    flavor_profiles?.map((v) => formatPreferenceValue(v)) || [];
  const regionLabels = regions?.map((v) => formatPreferenceValue(v)) || [];

  // Build preference groups
  const groups: { icon: string; label: string; items: string[] }[] = [];

  if (roastLabels.length > 0) {
    groups.push({
      icon: "Fire",
      label: "ROAST",
      items: roastLabels.slice(0, 3),
    });
  }
  if (flavorLabels.length > 0) {
    groups.push({
      icon: "Cookie",
      label: "FLAVORS",
      items: flavorLabels.slice(0, 3),
    });
  }
  if (processingLabels.length > 0) {
    groups.push({
      icon: "Drop",
      label: "PROCESS",
      items: processingLabels.slice(0, 2),
    });
  }
  if (regionLabels.length > 0) {
    groups.push({
      icon: "MapPin",
      label: "REGIONS",
      items: regionLabels.slice(0, 2),
    });
  }

  // Traits group (Milk, Decaf, Organic)
  const traits: string[] = [];
  if (decaf_only) traits.push("Decaf Only");
  if (organic_only) traits.push("Organic Only");
  if (with_milk_preference === true) traits.push("With Milk");
  if (with_milk_preference === false) traits.push("No Milk");

  if (traits.length > 0) {
    groups.push({ icon: "Sparkle", label: "TRAITS", items: traits });
  }

  return (
    <div className="absolute -bottom-6 left-0 right-0">
      <div className="inline-flex items-center flex-wrap gap-y-4 gap-x-8 py-4 px-1 border-t border-border/10 w-full">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 opacity-50">
              <Icon
                name={group.icon as any}
                size={10}
                className="text-muted-foreground"
              />
              <span className="text-overline text-micro tracking-widest text-muted-foreground">
                {group.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-caption font-serif italic text-foreground/90">
                {group.items.join(", ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
