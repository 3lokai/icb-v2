"use client";

import { Icon } from "@/components/common/Icon";

type FormModalProps = {
  activeForm: "roaster" | "suggestion" | "professional";
  onClose: () => void;
  onSubmit: (e: React.FormEvent, formType: string) => Promise<void>;
  formSubmitting: boolean;
  formSubmitted: boolean;
  formError: string | null;
  getButtonText: () => string;
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
  const getModalTitle = () => {
    if (activeForm === "roaster") {
      return "Submit a Roaster";
    }
    if (activeForm === "suggestion") {
      return "Suggest Changes";
    }
    if (activeForm === "professional") {
      return "Professional Inquiry";
    }
    return "";
  };

  const renderRoasterForm = () => (
    <form
      className="space-y-4"
      onSubmit={(e) => onSubmit(e, "roaster_submission")}
    >
      {/* Honeypot field - hidden from users but visible to bots */}
      <input
        aria-hidden="true"
        autoComplete="off"
        className="pointer-events-none absolute opacity-0"
        name="url"
        style={{ position: "absolute", left: "-9999px" }}
        tabIndex={-1}
        type="text"
      />
      <div>
        <label
          className="mb-1 block font-medium text-muted-foreground text-caption"
          htmlFor="roasterName"
        >
          Roaster Name*
        </label>
        <input
          className="search-input"
          id="roasterName"
          name="roasterName"
          required
          type="text"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            className="mb-1 block font-medium text-muted-foreground text-caption"
            htmlFor="website"
          >
            Website
          </label>
          <input
            className="search-input"
            id="website"
            name="website"
            type="url"
          />
        </div>

        <div>
          <label
            className="mb-1 block font-medium text-muted-foreground text-caption"
            htmlFor="location"
          >
            Location
          </label>
          <input
            className="search-input"
            id="location"
            name="location"
            type="text"
          />
        </div>
      </div>

      <div>
        <label
          className="mb-1 block font-medium text-muted-foreground text-caption"
          htmlFor="description"
        >
          What makes this roaster special?
        </label>
        <textarea
          className="search-input"
          id="description"
          name="description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            className="mb-1 block font-medium text-muted-foreground text-caption"
            htmlFor="yourName"
          >
            Your Name*
          </label>
          <input
            className="search-input"
            id="yourName"
            name="yourName"
            required
            type="text"
          />
        </div>

        <div>
          <label
            className="mb-1 block font-medium text-muted-foreground text-caption"
            htmlFor="yourEmail"
          >
            Your Email*
          </label>
          <input
            className="search-input"
            id="yourEmail"
            name="yourEmail"
            required
            type="email"
          />
        </div>
      </div>

      {formError && (
        <div className="form-message border border-destructive/30 bg-destructive/10 text-destructive">
          {formError}
        </div>
      )}

      <button
        className={`btn-primary w-full ${formSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
        disabled={formSubmitting || formSubmitted}
        type="submit"
      >
        {getButtonText()}
      </button>

      {formSubmitted && (
        <div className="form-message border border-border bg-secondary text-muted-foreground">
          Thanks for the submission! We will review the information and add it
          to our directory soon.
        </div>
      )}
    </form>
  );

  const renderSuggestionForm = () => (
    <form className="space-y-4" onSubmit={(e) => onSubmit(e, "suggestion")}>
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
      <div>
        <label
          className="mb-1 block font-medium text-muted-foreground text-caption"
          htmlFor="suggestionType"
        >
          Type of Suggestion*
        </label>
        <select
          className="search-input"
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
      </div>

      <div>
        <label
          className="mb-1 block font-medium text-muted-foreground text-caption"
          htmlFor="suggestionDetails"
        >
          Details*
        </label>
        <textarea
          className="search-input"
          id="suggestionDetails"
          name="suggestionDetails"
          placeholder="Please describe your suggestion in detail..."
          required
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            className="mb-1 block font-medium text-muted-foreground text-caption"
            htmlFor="suggesterName"
          >
            Your Name*
          </label>
          <input
            className="search-input"
            id="suggesterName"
            name="suggesterName"
            required
            type="text"
          />
        </div>

        <div>
          <label
            className="mb-1 block font-medium text-muted-foreground text-caption"
            htmlFor="suggesterEmail"
          >
            Your Email*
          </label>
          <input
            className="search-input"
            id="suggesterEmail"
            name="suggesterEmail"
            required
            type="email"
          />
        </div>
      </div>

      {formError && (
        <div className="form-message border border-destructive/30 bg-destructive/10 text-destructive">
          {formError}
        </div>
      )}

      <button
        className={`btn-primary w-full ${formSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
        disabled={formSubmitting || formSubmitted}
        type="submit"
      >
        {getButtonText()}
      </button>

      {formSubmitted && (
        <div className="form-message border border-border bg-secondary text-muted-foreground">
          Thanks for your suggestion! We appreciate your feedback and will
          review it soon.
        </div>
      )}
    </form>
  );

  const renderProfessionalForm = () => (
    <form
      className="space-y-4"
      onSubmit={(e) => onSubmit(e, "professional_inquiry")}
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            className="mb-1 block font-medium text-muted-foreground text-caption"
            htmlFor="proName"
          >
            Your Name*
          </label>
          <input
            className="search-input"
            id="proName"
            name="name"
            required
            type="text"
          />
        </div>

        <div>
          <label
            className="mb-1 block font-medium text-muted-foreground text-caption"
            htmlFor="organization"
          >
            Organization
          </label>
          <input
            className="search-input"
            id="organization"
            name="organization"
            type="text"
          />
        </div>
      </div>

      <div>
        <label
          className="mb-1 block font-medium text-muted-foreground text-caption"
          htmlFor="proEmail"
        >
          Email*
        </label>
        <input
          className="search-input"
          id="proEmail"
          name="email"
          required
          type="email"
        />
      </div>

      <div>
        <label
          className="mb-1 block font-medium text-muted-foreground text-caption"
          htmlFor="collaborationType"
        >
          Collaboration Interest*
        </label>
        <select
          className="search-input"
          id="collaborationType"
          name="collaborationType"
          required
        >
          <option value="">Select an option</option>
          <option value="content">Guest Articles/Content</option>
          <option value="research">Research Collaboration</option>
          <option value="education">Educational Content</option>
          <option value="partnership">Strategic Partnership</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label
          className="mb-1 block font-medium text-muted-foreground text-caption"
          htmlFor="proMessage"
        >
          Tell Us More*
        </label>
        <textarea
          className="search-input"
          id="proMessage"
          name="message"
          placeholder="Please describe your collaboration idea or inquiry..."
          required
          rows={4}
        />
      </div>

      {formError && (
        <div className="form-message border border-destructive/30 bg-destructive/10 text-destructive">
          {formError}
        </div>
      )}

      <button
        className={`btn-primary w-full ${formSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
        disabled={formSubmitting || formSubmitted}
        type="submit"
      >
        {getButtonText()}
      </button>

      {formSubmitted && (
        <div className="form-message border border-border bg-secondary text-muted-foreground">
          Thanks for reaching out! We will get back to you soon to discuss
          collaboration opportunities.
        </div>
      )}
    </form>
  );

  return (
    <div className="fixed inset-0 z-50 flex-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="surface-2 max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg">
        <div className="sticky top-0 rounded-t-lg bg-primary/90 p-4 text-primary-foreground backdrop-blur-sm">
          <div className="flex-between">
            <h3 className="font-bold text-heading">{getModalTitle()}</h3>
            <button
              className="rounded p-1 text-primary-foreground transition-colors duration-200 hover:text-primary-foreground/80"
              onClick={onClose}
              type="button"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
        </div>

        <div className="card-padding">
          {activeForm === "roaster" && renderRoasterForm()}
          {activeForm === "suggestion" && renderSuggestionForm()}
          {activeForm === "professional" && renderProfessionalForm()}
        </div>
      </div>
    </div>
  );
}
