"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Country, State, City } from "country-state-city";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { popularBrewingMethods } from "@/lib/utils/coffee-constants";
import { profileUpdateSchema } from "@/lib/validations/profile";
import type { ProfileUpdateFormData } from "@/lib/validations/profile";
import type { PrivateProfileDTO } from "@/data/user-dto";

type ProfileFormClientProps = {
  initialProfile: PrivateProfileDTO;
};

export function ProfileFormClient({ initialProfile }: ProfileFormClientProps) {
  const router = useRouter();
  const updateProfile = useUpdateProfile();

  // Use hook with server-fetched initialData
  const { data: profile } = useProfile(initialProfile);

  const [formData, setFormData] = useState<Partial<ProfileUpdateFormData>>({
    fullName: "",
    username: "",
    bio: "",
    city: "",
    state: "",
    country: "India",
    gender: undefined,
    experienceLevel: undefined,
    preferredBrewingMethods: [],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("IN");
  const [selectedStateCode, setSelectedStateCode] = useState<string>("");

  // Initialize form data from profile
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "India",
        gender:
          (profile.gender as
            | "male"
            | "female"
            | "non-binary"
            | "prefer-not-to-say") || undefined,
        experienceLevel:
          (profile.experience_level as "beginner" | "enthusiast" | "expert") ||
          undefined,
        preferredBrewingMethods: profile.preferred_brewing_methods || [],
      });

      // Set country/state codes based on profile data
      if (profile.country) {
        const country = Country.getAllCountries().find(
          (c) => c.name === profile.country
        );
        if (country) {
          setSelectedCountryCode(country.isoCode);
          if (profile.state) {
            const state = State.getStatesOfCountry(country.isoCode).find(
              (s) => s.name === profile.state
            );
            if (state) {
              setSelectedStateCode(state.isoCode);
            }
          }
        }
      }
    }
  }, [profile]);

  // Country-State-City data
  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(
    () =>
      selectedCountryCode ? State.getStatesOfCountry(selectedCountryCode) : [],
    [selectedCountryCode]
  );
  const cities = useMemo(
    () =>
      selectedCountryCode && selectedStateCode
        ? City.getCitiesOfState(selectedCountryCode, selectedStateCode)
        : [],
    [selectedCountryCode, selectedStateCode]
  );

  const updateFormData = <K extends keyof ProfileUpdateFormData>(
    key: K,
    value: ProfileUpdateFormData[K]
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

  const toggleArrayItem = (key: keyof ProfileUpdateFormData, value: string) => {
    setFormData((prev) => {
      const current = (prev[key] as string[] | undefined) ?? [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated as ProfileUpdateFormData[typeof key] };
    });
    setError(null);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    setFieldErrors({});

    // Validate with Zod
    const validationResult = profileUpdateSchema.safeParse(formData);

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
      const result = await updateProfile.mutateAsync(validationResult.data);

      if (result.success) {
        toast.success("Profile updated successfully!", {
          description: "Your changes have been saved.",
        });
        router.refresh();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update profile. Please try again.";
      setError(errorMessage);
      toast.error("Failed to update profile", {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack gap="8">
      {/* Magazine-style header */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <Stack gap="6">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  Account Settings
                </span>
              </div>
              <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                Profile
              </h2>
              <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                Manage your profile information and personal details.
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
            {/* Avatar Upload */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8 md:items-start">
              <FieldLabel>Avatar</FieldLabel>
              <div className="flex flex-col gap-2">
                <AvatarUpload
                  currentAvatarUrl={profile?.avatar_url}
                  name={formData.fullName || profile?.full_name || "User"}
                  userId={profile?.id}
                  size="md"
                />
                <FieldDescription>
                  Click or drag an image to upload. Max 2MB, JPEG, PNG, or WebP.
                </FieldDescription>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8 md:items-start">
              <FieldLabel htmlFor="fullName">
                Full Name <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="flex flex-col gap-2">
                <Input
                  data-invalid={!!fieldErrors.fullName}
                  id="fullName"
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  placeholder="John Doe"
                  required
                  type="text"
                  value={formData.fullName || ""}
                />
                {fieldErrors.fullName && (
                  <FieldError>{fieldErrors.fullName}</FieldError>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8 md:items-start">
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <div className="flex flex-col gap-2">
                <Input
                  data-invalid={!!fieldErrors.username}
                  id="username"
                  onChange={(e) => updateFormData("username", e.target.value)}
                  placeholder="johndoe"
                  type="text"
                  value={formData.username || ""}
                />
                <FieldDescription>
                  Optional. 3-50 characters, letters, numbers, and underscores
                  only.
                </FieldDescription>
                {fieldErrors.username && (
                  <FieldError>{fieldErrors.username}</FieldError>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8 md:items-start">
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <div className="flex flex-col gap-2">
                <Textarea
                  data-invalid={!!fieldErrors.bio}
                  id="bio"
                  onChange={(e) => updateFormData("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  value={formData.bio || ""}
                />
                <FieldDescription>
                  Optional. Maximum 500 characters.
                </FieldDescription>
                {fieldErrors.bio && <FieldError>{fieldErrors.bio}</FieldError>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8 md:items-start">
              <div className="flex flex-col gap-1">
                <FieldLabel>Location</FieldLabel>
                <FieldDescription>Defaults to India</FieldDescription>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Select
                    onValueChange={(value) => {
                      const country = countries.find(
                        (c) => c.isoCode === value
                      );
                      setSelectedCountryCode(value);
                      setSelectedStateCode("");
                      updateFormData("country", country?.name || "");
                      updateFormData("state", undefined);
                      updateFormData("city", undefined);
                    }}
                    value={
                      countries.find((c) => c.name === formData.country)
                        ?.isoCode || selectedCountryCode
                    }
                  >
                    <SelectTrigger
                      className="w-full"
                      data-invalid={!!fieldErrors.country}
                      id="country"
                    >
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={country.isoCode}
                          value={country.isoCode}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.country && (
                    <FieldError>{fieldErrors.country}</FieldError>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Select
                    disabled={!selectedCountryCode}
                    onValueChange={(value) => {
                      const state = states.find((s) => s.isoCode === value);
                      setSelectedStateCode(value);
                      updateFormData("state", state?.name || "");
                      updateFormData("city", undefined);
                    }}
                    value={
                      states.find((s) => s.name === formData.state)?.isoCode ||
                      ""
                    }
                  >
                    <SelectTrigger
                      className="w-full"
                      data-invalid={!!fieldErrors.state}
                      id="state"
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.state && (
                    <FieldError>{fieldErrors.state}</FieldError>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Select
                    disabled={!selectedStateCode}
                    onValueChange={(value) => {
                      const city = cities.find((c) => c.name === value);
                      updateFormData("city", city?.name || "");
                    }}
                    value={formData.city || ""}
                  >
                    <SelectTrigger
                      className="w-full"
                      data-invalid={!!fieldErrors.city}
                      id="city"
                    >
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.city && (
                    <FieldError>{fieldErrors.city}</FieldError>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8 md:items-start">
              <div className="flex flex-col gap-1">
                <FieldLabel>Gender</FieldLabel>
                <FieldDescription>
                  Skip if you prefer not sharing
                </FieldDescription>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => updateFormData("gender", "male")}
                    type="button"
                    variant={formData.gender === "male" ? "default" : "ghost"}
                  >
                    <Icon name="GenderMale" size={20} />
                    <span>Male</span>
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => updateFormData("gender", "female")}
                    type="button"
                    variant={formData.gender === "female" ? "default" : "ghost"}
                  >
                    <Icon name="GenderFemale" size={20} />
                    <span>Female</span>
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => updateFormData("gender", "non-binary")}
                    type="button"
                    variant={
                      formData.gender === "non-binary" ? "default" : "ghost"
                    }
                  >
                    <Icon name="GenderIntersex" size={20} />
                    <span>Non-binary</span>
                  </Button>
                </div>
                {fieldErrors.gender && (
                  <FieldError>{fieldErrors.gender}</FieldError>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8 md:items-start">
              <FieldLabel>
                Experience Level <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-4">
                  <Slider
                    max={2}
                    min={0}
                    onValueChange={(value) => {
                      const levels = ["beginner", "enthusiast", "expert"];
                      updateFormData(
                        "experienceLevel",
                        levels[
                          value[0] ?? 0
                        ] as ProfileUpdateFormData["experienceLevel"]
                      );
                    }}
                    step={1}
                    value={
                      formData.experienceLevel
                        ? [
                            ["beginner", "enthusiast", "expert"].indexOf(
                              formData.experienceLevel
                            ),
                          ]
                        : [0]
                    }
                  />
                  <div className="relative flex text-caption text-muted-foreground">
                    <span className="absolute left-0">Beginner</span>
                    <span className="absolute left-1/2 -translate-x-1/2">
                      Enthusiast
                    </span>
                    <span className="absolute right-0">Expert</span>
                  </div>
                </div>
                {fieldErrors.experienceLevel && (
                  <FieldError>{fieldErrors.experienceLevel}</FieldError>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-8 md:items-start mt-4">
              <div className="flex flex-col gap-1">
                <FieldLabel>Preferred Brewing Methods</FieldLabel>
                <FieldDescription>
                  Select all that apply (optional)
                </FieldDescription>
              </div>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {popularBrewingMethods.map((method) => (
                    <div className="flex items-center gap-2" key={method}>
                      <Checkbox
                        checked={
                          formData.preferredBrewingMethods?.includes(method) ??
                          false
                        }
                        id={`method-${method}`}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            toggleArrayItem("preferredBrewingMethods", method);
                          } else {
                            toggleArrayItem("preferredBrewingMethods", method);
                          }
                        }}
                      />
                      <Label
                        className="cursor-pointer font-normal"
                        htmlFor={`method-${method}`}
                      >
                        {method}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button disabled={isSaving} onClick={handleSubmit} type="button">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Stack>
        </FieldGroup>
      </Stack>
    </Stack>
  );
}
