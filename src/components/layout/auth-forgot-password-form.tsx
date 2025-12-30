"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/supabase/auth-helpers";

type AuthForgotPasswordFormProps = {
  className?: string;
} & Omit<React.ComponentProps<"form">, "onSubmit">;

export function AuthForgotPasswordForm({
  className,
  ...props
}: AuthForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: resetError } = await auth.resetPasswordForEmail(email);

      if (resetError) {
        setError(
          resetError.message || "Failed to send reset email. Please try again."
        );
        setIsLoading(false);
        return;
      }

      // Success - show success message
      setIsSuccess(true);
      setIsLoading(false);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  if (isSuccess) {
    return (
      <div className={cn(className)}>
        <Stack gap="6">
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-title font-serif tracking-tight">
                Check your email
              </h1>
              <p className="text-muted-foreground text-caption text-balance">
                We&apos;ve sent a password reset link to {email}
              </p>
            </div>

            <div className="bg-primary/10 text-primary rounded-md border border-primary/20 p-3 text-caption">
              If an account exists with this email, you&apos;ll receive a
              password reset link shortly. Please check your inbox and follow
              the instructions.
            </div>

            <Field>
              <FieldDescription className="text-center">
                <Link
                  href="/auth?mode=login"
                  className="underline underline-offset-4 hover:no-underline"
                >
                  Back to login
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </Stack>
      </div>
    );
  }

  return (
    <form className={cn(className)} onSubmit={handleSubmit} {...props}>
      <Stack gap="6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-title font-bold">Reset your password</h1>
            <p className="text-muted-foreground text-caption text-balance">
              Enter your email address and we&apos;ll send you a link to reset
              your password
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md border border-destructive/20 p-3 text-caption">
              {error}
            </div>
          )}

          <Stack gap="4">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={handleInputChange}
                required
              />
              <FieldDescription>
                We&apos;ll send a password reset link to this email address.
              </FieldDescription>
            </Field>

            <Field>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </Field>
          </Stack>

          <Field>
            <FieldDescription className="text-center">
              Remember your password?{" "}
              <Link
                href="/auth?mode=login"
                className="underline underline-offset-4 hover:no-underline"
              >
                Sign in
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </Stack>
    </form>
  );
}
