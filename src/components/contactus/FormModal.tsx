// src/components/contactus/FormModal.tsx
"use client";

import { Button } from "../ui/button";
import { Stack } from "../primitives/stack";
import { Icon } from "../common/Icon";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getRoastersForDropdown } from "@/app/actions/forms";

type FormModalProps = {
  activeForm: "roaster" | "suggestion" | "professional" | "claim";
  onClose: () => void;
  onSubmit: (e: React.FormEvent, formType: string) => Promise<void>;
  formSubmitting: boolean;
  formSubmitted: boolean;
  formError: string | null;
  getButtonText: () => string;
};

type RoasterOption = {
  id: string;
  name: string;
  slug: string;
};

export function FormModal({
  activeForm,
  onClose,
  onSubmit,
  formSubmitting,
  formSubmitted,
  formError,
  getButtonText,
}: FormModalProps) {
  const [roasters, setRoasters] = useState<RoasterOption[]>([]);
  const [loadingRoasters, setLoadingRoasters] = useState(false);

  useEffect(() => {
    if (activeForm === "claim") {
      // Use a function to handle async state updates
      const loadRoasters = async () => {
        setLoadingRoasters(true);
        try {
          const result = await getRoastersForDropdown();
          if (Array.isArray(result)) {
            setRoasters(result);
          }
        } catch (error) {
          console.error("Error loading roasters:", error);
        } finally {
          setLoadingRoasters(false);
        }
      };
      loadRoasters();
    }
  }, [activeForm]);

  const getModalTitle = () => {
    if (activeForm === "roaster") return "Submit a Roaster";
    if (activeForm === "suggestion") return "Suggest Changes";
    if (activeForm === "professional") return "Professional Inquiry";
    if (activeForm === "claim") return "Claim Your Listing";
    return "";
  };

  const inputClasses =
    "w-full px-5 py-3.5 rounded-xl border border-border bg-muted/5 text-body focus:bg-background focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all outline-none";
  const labelClasses =
    "text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 block";

  const renderRoasterForm = () => (
    <form
      className="space-y-8"
      onSubmit={(e) => onSubmit(e, "roaster_submission")}
    >
      <input
        aria-hidden="true"
        autoComplete="off"
        className="pointer-events-none absolute opacity-0"
        name="url"
        style={{ position: "absolute", left: "-9999px" }}
        tabIndex={-1}
        type="text"
      />

      <Stack gap="3">
        <label className={labelClasses} htmlFor="roasterName">
          Roaster Name*
        </label>
        <input
          className={inputClasses}
          id="roasterName"
          name="roasterName"
          placeholder="e.g. Blue Tokai Coffee Roasters"
          required
          type="text"
        />
      </Stack>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Stack gap="3">
          <label className={labelClasses} htmlFor="website">
            Website
          </label>
          <input
            className={inputClasses}
            id="website"
            name="website"
            placeholder="https://..."
            type="url"
          />
        </Stack>

        <Stack gap="3">
          <label className={labelClasses} htmlFor="location">
            Primary Location
          </label>
          <input
            className={inputClasses}
            id="location"
            name="location"
            placeholder="e.g. Gurgaon, Haryana"
            type="text"
          />
        </Stack>
      </div>

      <Stack gap="3">
        <label className={labelClasses} htmlFor="description">
          What makes this roaster special?
        </label>
        <textarea
          className={cn(inputClasses, "resize-none")}
          id="description"
          name="description"
          placeholder="Tell us about their roasting style, unique offerings..."
          rows={4}
        />
      </Stack>

      <div className="pt-4 border-t border-border/40">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <Stack gap="3">
            <label className={labelClasses} htmlFor="yourName">
              Your Name*
            </label>
            <input
              className={inputClasses}
              id="yourName"
              name="yourName"
              required
              type="text"
            />
          </Stack>

          <Stack gap="3">
            <label className={labelClasses} htmlFor="yourEmail">
              Your Email*
            </label>
            <input
              className={inputClasses}
              id="yourEmail"
              name="yourEmail"
              required
              type="email"
            />
          </Stack>
        </div>
      </div>

      <Stack gap="4">
        <Button
          className="w-full h-14 text-body font-bold uppercase tracking-widest hover-lift shadow-xl shadow-accent/5"
          disabled={formSubmitting || formSubmitted}
          type="submit"
        >
          {getButtonText()}
        </Button>

        {formError && (
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-caption">
            {formError}
          </div>
        )}

        {formSubmitted && (
          <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 text-accent font-medium text-caption text-center">
            Thanks! We&apos;ll review the submission soon.
          </div>
        )}
      </Stack>
    </form>
  );

  const renderSuggestionForm = () => (
    <form className="space-y-8" onSubmit={(e) => onSubmit(e, "suggestion")}>
      <input
        aria-hidden="true"
        autoComplete="off"
        className="pointer-events-none absolute opacity-0"
        name="website"
        style={{ position: "absolute", left: "-9999px" }}
        tabIndex={-1}
        type="text"
      />

      <Stack gap="3">
        <label className={labelClasses} htmlFor="suggestionType">
          Nature of Suggestion*
        </label>
        <select
          className={cn(
            inputClasses,
            "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M7%207l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-position-[right_1rem_center] bg-size-[1.25em_1.25em] bg-no-repeat"
          )}
          id="suggestionType"
          name="suggestionType"
          required
        >
          <option value="">Select an option</option>
          <option value="correction">Data Correction</option>
          <option value="feature">Feature Request</option>
          <option value="improvement">Site Improvement</option>
          <option value="content">Content Suggestion</option>
          <option value="other">Other</option>
        </select>
      </Stack>

      <Stack gap="3">
        <label className={labelClasses} htmlFor="suggestionDetails">
          Details*
        </label>
        <textarea
          className={cn(inputClasses, "resize-none")}
          id="suggestionDetails"
          name="suggestionDetails"
          placeholder="How can we make things better?"
          required
          rows={5}
        />
      </Stack>

      <div className="pt-4 border-t border-border/40">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <Stack gap="3">
            <label className={labelClasses} htmlFor="suggesterName">
              Your Name*
            </label>
            <input
              className={inputClasses}
              id="suggesterName"
              name="suggesterName"
              required
              type="text"
            />
          </Stack>

          <Stack gap="3">
            <label className={labelClasses} htmlFor="suggesterEmail">
              Your Email*
            </label>
            <input
              className={inputClasses}
              id="suggesterEmail"
              name="suggesterEmail"
              required
              type="email"
            />
          </Stack>
        </div>
      </div>

      <Stack gap="4">
        <Button
          className="w-full h-14 text-body font-bold uppercase tracking-widest hover-lift shadow-xl shadow-accent/5"
          disabled={formSubmitting || formSubmitted}
          type="submit"
        >
          {getButtonText()}
        </Button>

        {formError && (
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-caption">
            {formError}
          </div>
        )}

        {formSubmitted && (
          <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 text-accent font-medium text-caption text-center">
            Appreciate the feedback! We&apos;ll look into it.
          </div>
        )}
      </Stack>
    </form>
  );

  const renderClaimForm = () => (
    <form className="space-y-8" onSubmit={(e) => onSubmit(e, "roaster_claim")}>
      <input
        aria-hidden="true"
        autoComplete="off"
        className="pointer-events-none absolute opacity-0"
        name="website"
        style={{ position: "absolute", left: "-9999px" }}
        tabIndex={-1}
        type="text"
      />

      <Stack gap="3">
        <label className={labelClasses} htmlFor="roasterId">
          Select Your Roastery*
        </label>
        <select
          className={cn(
            inputClasses,
            "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M7%207l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-position-[right_1rem_center] bg-size-[1.25em_1.25em] bg-no-repeat"
          )}
          id="roasterId"
          name="roasterId"
          required
          disabled={loadingRoasters}
        >
          <option value="">
            {loadingRoasters ? "Loading roasters..." : "Select a roaster"}
          </option>
          {roasters.map((roaster) => (
            <option key={roaster.id} value={roaster.id}>
              {roaster.name}
            </option>
          ))}
        </select>
      </Stack>

      <Stack gap="3">
        <label className={labelClasses} htmlFor="claimEmail">
          Your Email Address*
        </label>
        <input
          className={inputClasses}
          id="claimEmail"
          name="email"
          placeholder="your@email.com"
          required
          type="email"
        />
        <p className="text-caption text-muted-foreground/70">
          We&apos;ll use this email to verify your identity and contact you
          about claiming your listing.
        </p>
      </Stack>

      <Stack gap="4">
        <Button
          className="w-full h-14 text-body font-bold uppercase tracking-widest hover-lift shadow-xl shadow-accent/5"
          disabled={formSubmitting || formSubmitted || loadingRoasters}
          type="submit"
        >
          {getButtonText()}
        </Button>

        {formError && (
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-caption">
            {formError}
          </div>
        )}

        {formSubmitted && (
          <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 text-accent font-medium text-caption text-center">
            Claim request submitted! We&apos;ll verify your identity and get
            back to you soon.
          </div>
        )}
      </Stack>
    </form>
  );

  const renderProfessionalForm = () => (
    <form
      className="space-y-8"
      onSubmit={(e) => onSubmit(e, "professional_inquiry")}
    >
      <input
        aria-hidden="true"
        autoComplete="off"
        className="pointer-events-none absolute opacity-0"
        name="website"
        style={{ position: "absolute", left: "-9999px" }}
        tabIndex={-1}
        type="text"
      />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Stack gap="3">
          <label className={labelClasses} htmlFor="proName">
            Full Name*
          </label>
          <input
            className={inputClasses}
            id="proName"
            name="name"
            required
            type="text"
          />
        </Stack>

        <Stack gap="3">
          <label className={labelClasses} htmlFor="organization">
            Organization
          </label>
          <input
            className={inputClasses}
            id="organization"
            name="organization"
            placeholder="Company or Collective"
            type="text"
          />
        </Stack>
      </div>

      <Stack gap="3">
        <label className={labelClasses} htmlFor="proEmail">
          Work Email*
        </label>
        <input
          className={inputClasses}
          id="proEmail"
          name="email"
          required
          type="email"
        />
      </Stack>

      <Stack gap="3">
        <label className={labelClasses} htmlFor="collaborationType">
          Area of Interest*
        </label>
        <select
          className={cn(
            inputClasses,
            "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M7%207l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-position-[right_1rem_center] bg-size-[1.25em_1.25em] bg-no-repeat"
          )}
          id="collaborationType"
          name="collaborationType"
          required
        >
          <option value="">Select an option</option>
          <option value="content">Guest Articles / Research</option>
          <option value="education">Educational Partnerships</option>
          <option value="business">Business Inquiries</option>
          <option value="other">Other</option>
        </select>
      </Stack>

      <Stack gap="3">
        <label className={labelClasses} htmlFor="proMessage">
          Inquiry Details*
        </label>
        <textarea
          className={cn(inputClasses, "resize-none")}
          id="proMessage"
          name="message"
          placeholder="How can we collaborate?"
          required
          rows={5}
        />
      </Stack>

      <Stack gap="4">
        <Button
          className="w-full h-14 text-body font-bold uppercase tracking-widest hover-lift shadow-xl shadow-accent/5"
          disabled={formSubmitting || formSubmitted}
          type="submit"
        >
          {getButtonText()}
        </Button>

        {formError && (
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-caption">
            {formError}
          </div>
        )}

        {formSubmitted && (
          <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 text-accent font-medium text-caption text-center">
            Message received! We will be in touch shortly.
          </div>
        )}
      </Stack>
    </form>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in sm:p-6">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[2.5rem] border border-border bg-card shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
        {/* Decorative stripe */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary/60 opacity-60" />

        <div className="sticky top-0 z-20 flex items-center justify-between p-8 md:p-10 border-b border-border/10 bg-card/95 backdrop-blur-md rounded-t-[2.5rem]">
          <Stack gap="2">
            <h3 className="font-serif italic text-title text-primary leading-none">
              {getModalTitle()}
            </h3>
            <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/40">
              {activeForm === "roaster"
                ? "Spread the word"
                : activeForm === "claim"
                  ? "Verify ownership"
                  : "Get in touch"}
            </p>
          </Stack>
          <button
            className="p-3 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="flex-1 p-8 md:p-10 overflow-y-auto">
          {activeForm === "roaster" && renderRoasterForm()}
          {activeForm === "suggestion" && renderSuggestionForm()}
          {activeForm === "professional" && renderProfessionalForm()}
          {activeForm === "claim" && renderClaimForm()}
        </div>
      </div>
    </div>
  );
}
