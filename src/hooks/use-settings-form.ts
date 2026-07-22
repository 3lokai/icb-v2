"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";

type SaveResult = { success: boolean; error?: string };

type SettingsFormMessages = {
  success: string;
  errorTitle: string;
  fallback: string;
};

/**
 * Shared state + validate/save/toast flow for dashboard settings forms.
 * Owns formData/error/fieldErrors/isSaving; the caller keeps its own
 * server-sync effect (via setFormData) and any form-specific helpers.
 */
export function useSettingsForm<S extends z.ZodType>({
  initial,
  schema,
  save,
  messages,
  onSuccess,
}: {
  initial: Partial<z.infer<S>>;
  schema: S;
  save: (data: z.infer<S>) => Promise<SaveResult>;
  messages: SettingsFormMessages;
  onSuccess?: () => void;
}) {
  type FormValues = z.infer<S>;

  const [formData, setFormData] = useState<Partial<FormValues>>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateField = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    setFieldErrors({});

    const result = schema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path.join(".")] = issue.message;
      });
      setFieldErrors(errors);
      setError("Please correct the errors below.");
      setIsSaving(false);
      return;
    }

    try {
      const saveResult = await save(result.data);
      if (saveResult.success) {
        toast.success(messages.success, {
          description: "Your changes have been saved.",
        });
        onSuccess?.();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : messages.fallback;
      setError(message);
      toast.error(messages.errorTitle, { description: message });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    setFormData,
    updateField,
    isSaving,
    error,
    setError,
    fieldErrors,
    setFieldErrors,
    handleSubmit,
  };
}
