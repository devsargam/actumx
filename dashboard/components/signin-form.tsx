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

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
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
    setStatus("Signing in...");

    const result = await authClient.signIn.email({
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

  async function handleGithubSignIn() {
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
          <h1 className="text-2xl font-bold">Sign in to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>
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
        </Field>
        <Field>
          <Button type="submit" disabled={submitting}>
            Sign In
          </Button>
        </Field>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-muted dark:*:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>
        <Field>
          <GithubAuthButton
            actionLabel="Sign in with GitHub"
            disabled={submitting}
            onClick={() => void handleGithubSignIn()}
          />
          <FieldDescription className="px-6 text-center">
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
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
