"use client";

import { Accent } from "@/components/primitives/accent";
import { useEffect } from "react";
import { useSettingsForm } from "@/hooks/use-settings-form";
import {
  useCoffeePreferences,
  useUpdateCoffeePreferences,
} from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TagsInput } from "@/components/ui/tags-input";
import { Stack } from "@/components/primitives/stack";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import {
  ROAST_LEVELS,
  PROCESSING_METHODS,
  popularFlavorProfiles,
  popularRegions,
  popularProcessingMethods,
} from "@/lib/utils/coffee-constants";
import { coffeePreferencesUpdateSchema } from "@/lib/validations/profile";
import type { CoffeePreferencesUpdateFormData } from "@/lib/validations/profile";
import type { Database } from "@/types/supabase-types";

type CoffeePreferences =
  Database["public"]["Tables"]["user_coffee_preferences"]["Row"];

type PreferencesFormClientProps = {
  initialPreferences: CoffeePreferences | null;
};

export function PreferencesFormClient({
  initialPreferences,
}: PreferencesFormClientProps) {
  const updatePreferences = useUpdateCoffeePreferences();

  // Use hook with server-fetched initialData
  const { data: preferences } = useCoffeePreferences(initialPreferences);

  const {
    formData,
    setFormData,
    updateField: updateFormData,
    isSaving,
    error,
    setError,
    fieldErrors,
    handleSubmit,
  } = useSettingsForm({
    initial: {
      roastLevels: [],
      flavorProfiles: [],
      processingMethods: [],
      regions: [],
      withMilkPreference: false,
      decafOnly: false,
      organicOnly: false,
    } satisfies Partial<CoffeePreferencesUpdateFormData>,
    schema: coffeePreferencesUpdateSchema,
    save: (data) => updatePreferences.mutateAsync(data),
    messages: {
      success: "Coffee preferences updated successfully!",
      errorTitle: "Failed to update preferences",
      fallback: "Failed to update preferences. Please try again.",
    },
  });

  // Initialize form data from preferences
  useEffect(() => {
    if (preferences) {
      setFormData({
        roastLevels: preferences.roast_levels || [],
        flavorProfiles: preferences.flavor_profiles || [],
        processingMethods: preferences.processing_methods || [],
        regions: preferences.regions || [],
        withMilkPreference: preferences.with_milk_preference ?? false,
        decafOnly: preferences.decaf_only ?? false,
        organicOnly: preferences.organic_only ?? false,
      });
    }
  }, [preferences, setFormData]);

  const toggleArrayItem = (
    key: keyof CoffeePreferencesUpdateFormData,
    value: string
  ) => {
    setFormData((prev) => {
      const current = (prev[key] as string[] | undefined) ?? [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return {
        ...prev,
        [key]: updated as CoffeePreferencesUpdateFormData[typeof key],
      };
    });
    setError(null);
  };

  return (
    <Stack gap="8">
      <DashboardPageHeader
        eyebrow="Personalization"
        title={
          <>
            Coffee <Accent>Preferences.</Accent>
          </>
        }
        description="Customize your coffee preferences to discover beans that match your taste profile."
      />

      <Stack gap="6">
        {error && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-destructive text-caption">
            {error}
          </div>
        )}

        <FieldGroup>
          <Stack gap="8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8 md:items-start">
              <FieldLabel>Roast Levels</FieldLabel>
              <div className="flex flex-col gap-2">
                <FieldDescription>
                  Select your preferred roast levels
                </FieldDescription>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {ROAST_LEVELS.map((roast) => (
                    <div className="flex items-center gap-2" key={roast.value}>
                      <Checkbox
                        checked={
                          formData.roastLevels?.includes(roast.value) ?? false
                        }
                        id={`roast-${roast.value}`}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            toggleArrayItem("roastLevels", roast.value);
                          } else {
                            toggleArrayItem("roastLevels", roast.value);
                          }
                        }}
                      />
                      <Label
                        className="cursor-pointer font-normal"
                        htmlFor={`roast-${roast.value}`}
                      >
                        {roast.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {fieldErrors.roastLevels && (
                  <FieldError>{fieldErrors.roastLevels}</FieldError>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8 md:items-start">
              <FieldLabel>Flavor Profiles</FieldLabel>
              <div className="flex flex-col gap-2">
                <FieldDescription>
                  Select your preferred flavor profiles
                </FieldDescription>
                <TagsInput
                  value={formData.flavorProfiles || []}
                  onChange={(value) => updateFormData("flavorProfiles", value)}
                  suggestions={popularFlavorProfiles.map((flavor) => ({
                    value: flavor,
                    label: flavor,
                  }))}
                  popularSuggestions={popularFlavorProfiles}
                  placeholder="Add flavor profiles..."
                  maxTags={20}
                  disabled={isSaving}
                />
                {fieldErrors.flavorProfiles && (
                  <FieldError>{fieldErrors.flavorProfiles}</FieldError>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8 md:items-start">
              <div className="flex flex-col gap-1">
                <FieldLabel>Processing & Regions</FieldLabel>
                <FieldDescription>
                  Select your preferred methods and regions
                </FieldDescription>
              </div>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <FieldLabel className="text-body font-medium">
                      Processing Methods
                    </FieldLabel>
                    <TagsInput
                      value={formData.processingMethods || []}
                      onChange={(value) =>
                        updateFormData("processingMethods", value)
                      }
                      suggestions={PROCESSING_METHODS}
                      popularSuggestions={popularProcessingMethods}
                      placeholder="Add processing methods..."
                      maxTags={15}
                      disabled={isSaving}
                    />
                    {fieldErrors.processingMethods && (
                      <FieldError>{fieldErrors.processingMethods}</FieldError>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <FieldLabel className="text-body font-medium">
                      Regions
                    </FieldLabel>
                    <TagsInput
                      value={formData.regions || []}
                      onChange={(value) => updateFormData("regions", value)}
                      suggestions={popularRegions.map((region) => ({
                        value: region,
                        label: region,
                      }))}
                      popularSuggestions={popularRegions}
                      placeholder="Add regions..."
                      maxTags={20}
                      disabled={isSaving}
                    />
                    {fieldErrors.regions && (
                      <FieldError>{fieldErrors.regions}</FieldError>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8 md:items-start">
              <div className="flex flex-col gap-1">
                <FieldLabel>Brew Preferences</FieldLabel>
                <FieldDescription>Optional preferences</FieldDescription>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Label
                      className="cursor-pointer font-normal"
                      htmlFor="with-milk"
                    >
                      I prefer coffee with milk
                    </Label>
                    <Switch
                      checked={formData.withMilkPreference ?? false}
                      id="with-milk"
                      onCheckedChange={(checked) =>
                        updateFormData("withMilkPreference", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      className="cursor-pointer font-normal"
                      htmlFor="decaf-only"
                    >
                      Decaf only
                    </Label>
                    <Switch
                      checked={formData.decafOnly ?? false}
                      id="decaf-only"
                      onCheckedChange={(checked) =>
                        updateFormData("decafOnly", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      className="cursor-pointer font-normal"
                      htmlFor="organic-only"
                    >
                      Organic only
                    </Label>
                    <Switch
                      checked={formData.organicOnly ?? false}
                      id="organic-only"
                      onCheckedChange={(checked) =>
                        updateFormData("organicOnly", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button disabled={isSaving} onClick={handleSubmit} type="button">
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </Stack>
        </FieldGroup>
      </Stack>
    </Stack>
  );
}
