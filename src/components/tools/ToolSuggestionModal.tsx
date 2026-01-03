"use client";

import { FormModal } from "@/components/contactus/FormModal";
import { submitForm } from "@/app/actions/forms";
import { useState } from "react";

export function ToolSuggestionTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const getButtonText = () => {
    if (formSubmitting) return "Submitting...";
    if (formSubmitted) return "Submitted!";
    return "Submit Suggestion";
  };

  const handleFormSubmit = async (e: React.FormEvent, formType: string) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const result = await submitForm(formType, formData);

      if (result.success) {
        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false);
          form.reset();
          setIsOpen(false);
        }, 3000);
      } else {
        setFormError(
          result.error || "There was a problem submitting your form"
        );
      }
    } catch (err) {
      setFormError("An unexpected error occurred");
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-accent-foreground hover:text-accent underline underline-offset-4 transition-colors"
        type="button"
      >
        Let us know →
      </button>
      {isOpen && (
        <FormModal
          activeForm="suggestion"
          onClose={() => setIsOpen(false)}
          onSubmit={handleFormSubmit}
          formSubmitting={formSubmitting}
          formSubmitted={formSubmitted}
          formError={formError}
          getButtonText={getButtonText}
        />
      )}
    </>
  );
}
