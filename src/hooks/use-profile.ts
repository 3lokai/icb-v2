"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyProfileDTO } from "@/data/user-dto";
import { queryKeys } from "@/lib/query-keys";
import { createClient } from "@/lib/supabase/client";
import type { PrivateProfileDTO } from "@/data/user-dto";
import {
  updateProfile,
  updateCoffeePreferences,
  updateNotificationPreferences,
  updatePrivacySettings,
} from "@/app/actions/profile";
import type {
  ProfileUpdateFormData,
  CoffeePreferencesUpdateFormData,
  NotificationPreferencesUpdateFormData,
  PrivacySettingsFormData,
} from "@/lib/validations/profile";

// Fetch current user's profile
export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.current,
    queryFn: async () => {
      // We need to call a server action or API route since getMyProfileDTO is server-only
      // For now, we'll fetch directly from Supabase client
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        return null;
      }

      // Transform to match PrivateProfileDTO
      return {
        id: profile.id,
        username: profile.username,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        experience_level: profile.experience_level,
        email: user.email,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        gender: profile.gender,
        preferred_brewing_methods: profile.preferred_brewing_methods,
        is_public_profile: profile.is_public_profile,
        show_location: profile.show_location,
        email_verified: profile.email_verified,
        onboarding_completed: profile.onboarding_completed,
        newsletter_subscribed: profile.newsletter_subscribed,
      } as PrivateProfileDTO;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

// Update profile mutation with optimistic updates
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileUpdateFormData) => {
      const result = await updateProfile(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to update profile");
      }
      return result;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.profile.current });

      const previous = queryClient.getQueryData<PrivateProfileDTO | null>(
        queryKeys.profile.current
      );

      // Optimistically update the cache
      if (previous) {
        queryClient.setQueryData<PrivateProfileDTO | null>(
          queryKeys.profile.current,
          {
            ...previous,
            full_name: newData.fullName,
            username: newData.username || previous.username,
            bio: newData.bio || previous.bio,
            city: newData.city || previous.city,
            state: newData.state || previous.state,
            country: newData.country || previous.country,
            gender: newData.gender || previous.gender,
            experience_level:
              newData.experienceLevel || previous.experience_level,
            preferred_brewing_methods:
              newData.preferredBrewingMethods ||
              previous.preferred_brewing_methods,
          }
        );
      }

      return { previous };
    },
    onError: (_err, _newData, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.profile.current, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.current });
    },
  });
}

// Fetch coffee preferences
export function useCoffeePreferences() {
  return useQuery({
    queryKey: queryKeys.profile.coffeePreferences,
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from("user_coffee_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        return null;
      }

      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

// Update coffee preferences mutation with optimistic updates
export function useUpdateCoffeePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CoffeePreferencesUpdateFormData) => {
      const result = await updateCoffeePreferences(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to update coffee preferences");
      }
      return result;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.profile.coffeePreferences,
      });

      const previous = queryClient.getQueryData(
        queryKeys.profile.coffeePreferences
      );

      // Optimistically update
      queryClient.setQueryData(queryKeys.profile.coffeePreferences, {
        ...previous,
        roast_levels: newData.roastLevels || null,
        flavor_profiles: newData.flavorProfiles || null,
        processing_methods: newData.processingMethods || null,
        regions: newData.regions || null,
        with_milk_preference: newData.withMilkPreference ?? undefined,
        decaf_only: newData.decafOnly ?? false,
        organic_only: newData.organicOnly ?? false,
      });

      return { previous };
    },
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.profile.coffeePreferences,
          context.previous
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.coffeePreferences,
      });
    },
  });
}

// Fetch notification preferences
export function useNotificationPreferences() {
  return useQuery({
    queryKey: queryKeys.profile.notifications,
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from("user_notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        return null;
      }

      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

// Update notification preferences mutation with optimistic updates
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NotificationPreferencesUpdateFormData) => {
      const result = await updateNotificationPreferences(data);
      if (!result.success) {
        throw new Error(
          result.error || "Failed to update notification preferences"
        );
      }
      return result;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.profile.notifications,
      });

      const previous = queryClient.getQueryData(
        queryKeys.profile.notifications
      );

      // Optimistically update
      queryClient.setQueryData(queryKeys.profile.notifications, {
        ...previous,
        new_roasters: newData.newRoasters ?? true,
        coffee_updates: newData.coffeeUpdates ?? true,
        newsletter: newData.newsletter ?? true,
        platform_updates: newData.platformUpdates ?? true,
        email_frequency: newData.emailFrequency ?? "weekly",
      });

      return { previous };
    },
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.profile.notifications,
          context.previous
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.notifications,
      });
    },
  });
}

// Update privacy settings mutation with optimistic updates
export function useUpdatePrivacySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PrivacySettingsFormData) => {
      const result = await updatePrivacySettings(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to update privacy settings");
      }
      return result;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.profile.current });

      const previous = queryClient.getQueryData<PrivateProfileDTO | null>(
        queryKeys.profile.current
      );

      // Optimistically update
      if (previous) {
        queryClient.setQueryData<PrivateProfileDTO | null>(
          queryKeys.profile.current,
          {
            ...previous,
            is_public_profile:
              newData.isPublicProfile ?? previous.is_public_profile,
            show_location: newData.showLocation ?? previous.show_location,
          }
        );
      }

      return { previous };
    },
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.profile.current, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.current });
    },
  });
}
