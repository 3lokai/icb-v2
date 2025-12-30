"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
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
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import {
  ROAST_LEVELS,
  PROCESSING_METHODS,
  popularFlavorProfiles,
  popularRegions,
  popularProcessingMethods,
} from "@/lib/utils/coffee-constants";
import { coffeePreferencesUpdateSchema } from "@/lib/validations/profile";
import type { CoffeePreferencesUpdateFormData } from "@/lib/validations/profile";
import { Skeleton } from "@/components/ui/skeleton";

export default function PreferencesPage() {
  const { data: preferences, isLoading } = useCoffeePreferences();
  const updatePreferences = useUpdateCoffeePreferences();

  const [formData, setFormData] = useState<
    Partial<CoffeePreferencesUpdateFormData>
  >({
    roastLevels: [],
    flavorProfiles: [],
    processingMethods: [],
    regions: [],
    withMilkPreference: false,
    decafOnly: false,
    organicOnly: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
  }, [preferences]);

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

  const updateFormData = <K extends keyof CoffeePreferencesUpdateFormData>(
    key: K,
    value: CoffeePreferencesUpdateFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    setFieldErrors({});

    // Validate with Zod
    const validationResult = coffeePreferencesUpdateSchema.safeParse(formData);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });
      setFieldErrors(errors);
      setError("Please correct the errors below.");
      setIsSaving(false);
      return;
    }

    try {
      const result = await updatePreferences.mutateAsync(validationResult.data);

      if (result.success) {
        toast.success("Coffee preferences updated successfully!", {
          description: "Your changes have been saved.",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update preferences. Please try again.";
      setError(errorMessage);
      toast.error("Failed to update preferences", {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Section spacing="default" contained={false}>
        <Stack gap="6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96" />
        </Stack>
      </Section>
    );
  }

  return (
    <Section spacing="default" contained={false}>
      <Stack gap="8">
        {/* Magazine-style header */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <Stack gap="6">
                <div className="inline-flex items-center gap-4">
                  <span className="h-px w-8 md:w-12 bg-accent/60" />
                  <span className="text-overline text-muted-foreground tracking-[0.15em]">
                    Personalization
                  </span>
                </div>
                <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                  Coffee{" "}
                  <span className="text-accent italic">Preferences.</span>
                </h2>
                <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                  Customize your coffee preferences to discover beans that match
                  your taste profile.
                </p>
              </Stack>
            </div>
          </div>
        </div>

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
                      <div
                        className="flex items-center gap-2"
                        key={roast.value}
                      >
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
                    onChange={(value) =>
                      updateFormData("flavorProfiles", value)
                    }
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
                <Button
                  disabled={isSaving}
                  onClick={handleSubmit}
                  type="button"
                >
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </Stack>
          </FieldGroup>
        </Stack>
      </Stack>
    </Section>
  );
}
