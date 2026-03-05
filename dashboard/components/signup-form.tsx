"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GithubAuthButton } from "@/components/github-auth-button";
import { authClient } from "@/lib/auth-client";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setStatus("Creating account...");

    const result = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (result.error) {
      setStatus(`Auth failed: ${result.error.message ?? "unknown error"}`);
      setSubmitting(false);
      return;
    }

    setStatus("Authenticated");
    router.replace("/dashboard");
  }

  async function handleGithubSignUp() {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setStatus("Redirecting to GitHub...");
    const callbackURL = `${window.location.origin}/dashboard`;
    const result = await authClient.signIn.social({
      provider: "github",
      callbackURL,
    });

    if (result.error) {
      setStatus(`Auth failed: ${result.error.message ?? "unknown error"}`);
      setSubmitting(false);
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={(event) => void handleSubmit(event)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            className="bg-background"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-background"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            className="bg-background"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <Button type="submit" disabled={submitting}>
            Create Account
          </Button>
        </Field>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-muted dark:*:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>
        <Field>
          <GithubAuthButton
            actionLabel="Sign up with GitHub"
            disabled={submitting}
            onClick={() => void handleGithubSignUp()}
          />
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link href="/login">Sign in</Link>
          </FieldDescription>
          {status ? (
            <FieldDescription className="px-2 text-center">
              {status}
            </FieldDescription>
          ) : null}
        </Field>
      </FieldGroup>
    </form>
  );
}
