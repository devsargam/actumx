"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Ready");

  async function handleAuth() {
    setStatus("Authenticating...");

    const endpoint = authMode === "register" ? "/auth/api/sign-up/email" : "/auth/api/sign-in/email";
    const body =
      authMode === "register"
        ? {
            email,
            name,
            password,
          }
        : {
            email,
            password,
          };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({ message: "Authentication failed" }))) as {
        message?: string;
      };
      setStatus(`Auth failed: ${data.message ?? "unknown error"}`);
      return;
    }

    setStatus("Authenticated");
    router.replace("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#e2e8f0_40%,_#cbd5e1_100%)] p-6 md:p-10 dark:bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#111827_45%,_#020617_100%)]">
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Actumx Control Plane</CardTitle>
            <CardDescription>Register or login to manage credits and API keys.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={authMode === "register" ? "default" : "outline"}
                onClick={() => setAuthMode("register")}
              >
                Register
              </Button>
              <Button variant={authMode === "login" ? "default" : "outline"} onClick={() => setAuthMode("login")}>
                Login
              </Button>
            </div>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
            {authMode === "register" ? (
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
            ) : null}
            <Input
              value={password}
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
            />
            <Button className="w-full" onClick={() => void handleAuth()}>
              Continue
            </Button>
            <p className="text-muted-foreground text-xs">{status}</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
