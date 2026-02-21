"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

export default function SimulatorPage() {
  const [topic, setTopic] = useState("x402");
  const [rawKey, setRawKey] = useState("");
  const [output, setOutput] = useState("No simulation run yet.");

  async function runSimulation() {
    if (!rawKey.trim()) {
      setOutput("Paste a raw API key from the API Keys page.");
      return;
    }
    const keyForRun = rawKey.trim();
    setRawKey("");

    const challenge = await apiRequest<{ x402?: { paymentId: string }; error?: string }>(
      `/v1/protected/quote?topic=${encodeURIComponent(topic)}`,
      {
        headers: { "x-api-key": keyForRun },
      }
    );

    if (challenge.status !== 402 || !challenge.data.x402?.paymentId) {
      setOutput(`Expected 402 challenge, got ${challenge.status}.`);
      return;
    }

    const paymentId = challenge.data.x402.paymentId;

    const settle = await apiRequest<{ receiptId?: string; error?: string }>("/v1/x402/settle", {
      method: "POST",
      body: { paymentId },
      headers: { "x-api-key": keyForRun },
    });

    if (settle.status >= 400 || !settle.data.receiptId) {
      setOutput(`Settle failed: ${settle.data.error ?? "unknown error"}`);
      return;
    }

    const paid = await apiRequest<{ data?: { insight: string }; error?: string }>(
      `/v1/protected/quote?topic=${encodeURIComponent(topic)}`,
      {
        headers: {
          "x-api-key": keyForRun,
          "x-payment-id": paymentId,
          "x-payment-proof": settle.data.receiptId,
        },
      }
    );

    if (paid.status >= 400 || !paid.data.data?.insight) {
      setOutput(`Paid request failed: ${paid.data.error ?? "unknown error"}`);
      return;
    }

    setOutput(
      `Challenge(${paymentId}) -> Settle(${settle.data.receiptId}) -> Success: ${paid.data.data.insight}`
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>x402 Simulator</CardTitle>
          <CardDescription>Run challenge, settle, and paid retry in one flow. Raw key is never stored.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 md:grid-cols-2">
            <Input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Topic" />
            <Input
              value={rawKey}
              onChange={(event) => setRawKey(event.target.value)}
              placeholder="Paste raw API key"
              type="password"
              autoComplete="off"
            />
          </div>
          <Button onClick={() => void runSimulation()}>Run Simulation</Button>
          <div className="rounded-xl border p-3 font-mono text-xs">{output}</div>
        </CardContent>
      </Card>
    </div>
  );
}
