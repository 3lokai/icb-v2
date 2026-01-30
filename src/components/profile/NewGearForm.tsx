"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { Stack } from "@/components/primitives/stack";
import { Icon } from "@/components/common/Icon";
import type { CreateNewGearFormData } from "@/lib/validations/gear";

interface NewGearFormProps {
  initialCategory?: "grinder" | "brewer" | "accessory";
  onSubmit: (data: CreateNewGearFormData) => Promise<void>;
  onCancel: () => void;
}

export function NewGearForm({
  initialCategory,
  onSubmit,
  onCancel,
}: NewGearFormProps) {
  const [formData, setFormData] = useState<CreateNewGearFormData>({
    name: "",
    category: initialCategory || "grinder",
    brand: "",
    model: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    if (!formData.name.trim()) {
      setErrors({ name: "Name is required" });
      return;
    }

    if (!formData.category) {
      setErrors({ category: "Category is required" });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: formData.name.trim(),
        category: formData.category,
        brand: formData.brand?.trim() || undefined,
        model: formData.model?.trim() || undefined,
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({
        submit:
          error instanceof Error ? error.message : "Failed to create gear",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack
        gap="12"
        className="surface-1 rounded-lg p-4 border border-border/20"
      >
        <Stack gap="1">
          <h3 className="text-label font-medium">Create New Gear Item</h3>
          <p className="text-caption text-muted-foreground">
            Add a new item to the gear catalog
          </p>
        </Stack>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[120px_1fr] md:gap-4 md:items-center">
          <FieldLabel htmlFor="gear-name">
            Name <span className="text-destructive">*</span>
          </FieldLabel>
          <div className="flex flex-col gap-1">
            <Input
              id="gear-name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., C40 MK4"
              aria-invalid={!!errors.name}
            />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[120px_1fr] md:gap-4 md:items-center">
          <FieldLabel htmlFor="gear-category">
            Category <span className="text-destructive">*</span>
          </FieldLabel>
          <div className="flex flex-col gap-1">
            <Select
              value={formData.category}
              onValueChange={(value: "grinder" | "brewer" | "accessory") =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger
                id="gear-category"
                aria-invalid={!!errors.category}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grinder">Grinder</SelectItem>
                <SelectItem value="brewer">Brewer</SelectItem>
                <SelectItem value="accessory">Accessory</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <FieldError>{errors.category}</FieldError>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[120px_1fr] md:gap-4 md:items-center">
          <FieldLabel htmlFor="gear-brand">
            Brand{" "}
            <span className="text-muted-foreground text-caption font-normal">
              (Optional)
            </span>
          </FieldLabel>
          <Input
            id="gear-brand"
            value={formData.brand || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, brand: e.target.value }))
            }
            placeholder="e.g., Comandante"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[120px_1fr] md:gap-4 md:items-center">
          <FieldLabel htmlFor="gear-model">
            Model{" "}
            <span className="text-muted-foreground text-caption font-normal">
              (Optional)
            </span>
          </FieldLabel>
          <Input
            id="gear-model"
            value={formData.model || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, model: e.target.value }))
            }
            placeholder="e.g., MK4"
          />
        </div>

        {errors.submit && (
          <div className="text-caption text-destructive">{errors.submit}</div>
        )}

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <Icon name="Plus" size={14} className="mr-2" />
                Create & Add
              </>
            )}
          </Button>
        </div>
      </Stack>
    </form>
  );
}
