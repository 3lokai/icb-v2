"use client";

import { Button } from "@/components/ui/button";
import { Stack } from "@/components/primitives/stack";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";

type PartnerFormModalProps = {
  activeForm: "free" | "verified" | "premium";
  onClose: () => void;
  onSubmit: (e: React.FormEvent, formData: FormData) => Promise<void>;
  formSubmitting: boolean;
  formSubmitted: boolean;
  formError: string | null;
};

export default function PartnerFormModal({
  activeForm,
  onClose,
  onSubmit,
  formSubmitting,
  formSubmitted,
  formError,
}: PartnerFormModalProps) {
  const getModalTitle = () => {
    if (activeForm === "free") return "Get Listed Free";
    if (activeForm === "verified") return "Claim Your Founding Spot";
    if (activeForm === "premium") return "Contact Us for Premium";
    return "Partner Inquiry";
  };

  const getButtonText = () => {
    if (formSubmitting) return "Submitting...";
    if (formSubmitted) return "Submitted!";
    if (activeForm === "free") return "Submit Request";
    if (activeForm === "verified") return "Claim Founding Spot";
    if (activeForm === "premium") return "Contact Us";
    return "Submit";
  };

  const inputClasses =
    "w-full px-5 py-3.5 rounded-xl border border-border bg-muted/5 text-body focus:bg-background focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all outline-none";
  const labelClasses =
    "text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 block";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    onSubmit(e, formData);
  };

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
              Partner with us
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
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Honeypot field */}
            <input
              aria-hidden="true"
              autoComplete="off"
              className="pointer-events-none absolute opacity-0"
              name="website"
              style={{ position: "absolute", left: "-9999px" }}
              tabIndex={-1}
              type="text"
            />

            {/* Hidden field for interestedIn */}
            <input type="hidden" name="interestedIn" value={activeForm} />

            <Stack gap="3">
              <label className={labelClasses} htmlFor="roasteryName">
                Roastery Name*
              </label>
              <input
                className={inputClasses}
                id="roasteryName"
                name="roasteryName"
                placeholder="e.g. Blue Tokai Coffee Roasters"
                required
                type="text"
              />
            </Stack>

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
                <label className={labelClasses} htmlFor="email">
                  Email*
                </label>
                <input
                  className={inputClasses}
                  id="email"
                  name="email"
                  required
                  type="email"
                />
              </Stack>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Stack gap="3">
                <label className={labelClasses} htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  className={inputClasses}
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+91 98765 43210"
                  type="tel"
                />
              </Stack>

              <Stack gap="3">
                <label className={labelClasses} htmlFor="websiteUrl">
                  Website URL
                </label>
                <input
                  className={inputClasses}
                  id="websiteUrl"
                  name="websiteUrl"
                  placeholder="https://..."
                  type="url"
                />
              </Stack>
            </div>

            <Stack gap="3">
              <label className={labelClasses} htmlFor="message">
                Message (Optional)
              </label>
              <textarea
                className={cn(inputClasses, "resize-none")}
                id="message"
                name="message"
                placeholder="Tell us about your roastery or any questions you have..."
                rows={4}
              />
            </Stack>

            <div className="pt-4 border-t border-border/40">
              <Stack gap="3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    value="true"
                    required
                    className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent/20"
                  />
                  <span className="text-caption text-foreground">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Terms of Service
                    </a>
                  </span>
                </label>
              </Stack>
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
                  Thanks! We&apos;ll reach out within 24 hours.
                </div>
              )}
            </Stack>
          </form>
        </div>
      </div>
    </div>
  );
}
