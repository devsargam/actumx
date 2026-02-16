"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";
import { saveSessionToken } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Ready");

  async function handleAuth() {
    setStatus("Authenticating...");

    const endpoint = authMode === "register" ? "/v1/auth/register" : "/v1/auth/login";
    const body = authMode === "register" ? { email, name } : { email };

    const result = await apiRequest<{ token?: string; error?: string }>(endpoint, {
      method: "POST",
      body,
    });

    if (result.status >= 400 || !result.data.token) {
      setStatus(`Auth failed: ${result.data.error ?? "unknown error"}`);
      return;
    }

    saveSessionToken(result.data.token);
    setStatus("Authenticated");
    router.replace("/overview");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#e2e8f0_40%,_#cbd5e1_100%)] p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>x402 Control Plane</CardTitle>
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
              <Button
                variant={authMode === "login" ? "default" : "outline"}
                onClick={() => setAuthMode("login")}
              >
                Login
              </Button>
            </div>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
            {authMode === "register" ? (
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
            ) : null}
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
