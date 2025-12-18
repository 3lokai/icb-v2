"use client";

import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

type NewsletterFormProps = {
  className?: string;
  buttonText?: string;
  placeholderText?: string;
};

export function NewsletterForm({
  className = "",
  buttonText = "Subscribe",
  placeholderText = "Your email address",
}: NewsletterFormProps) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append("consent", "true");

    try {
      const result = await subscribeToNewsletter(formData);
      if (result.success) {
        toast.success("Subscribed!", {
          description: "🎉 You've been added to our newsletter.",
        });
        formRef.current?.reset();
      } else {
        toast.error("Subscription Failed", {
          description: result.error || "Something went wrong.",
        });
      }
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className={`space-y-2 ${className}`}
      onSubmit={handleSubmit}
      ref={formRef}
    >
      {/* Honeypot field - hidden from users but visible to bots */}
      <input
        aria-hidden="true"
        autoComplete="off"
        className="pointer-events-none absolute opacity-0"
        name="website"
        style={{ position: "absolute", left: "-9999px" }}
        tabIndex={-1}
        type="text"
      />
      <input
        className="w-full rounded-md border border-border bg-muted p-2 text-foreground font-sans"
        name="email"
        placeholder={placeholderText}
        required
        type="email"
      />

      <button
        className={`btn-primary w-full ${loading ? "opacity-70" : ""}`}
        disabled={loading}
        type="submit"
      >
        {loading ? "Subscribing..." : buttonText}
      </button>
    </form>
  );
}
