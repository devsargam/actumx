"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest, type ApiKeyRecord } from "@/lib/api";
import { getRawKeys } from "@/lib/raw-keys";

export default function SimulatorPage() {
  const [topic, setTopic] = useState("x402");
  const [selectedApiKeyId, setSelectedApiKeyId] = useState("");
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [output, setOutput] = useState("No simulation run yet.");

  useEffect(() => {
    const run = async () => {
      const response = await apiRequest<{ keys: ApiKeyRecord[] }>("/v1/api-keys");
      if (response.status < 400) {
        setKeys(response.data.keys);
      }
    };

    void run();
  }, []);

  const activeKeys = useMemo(() => keys.filter((key) => !key.revokedAt), [keys]);

  useEffect(() => {
    if (!selectedApiKeyId && activeKeys[0]) {
      setSelectedApiKeyId(activeKeys[0].id);
    }
  }, [selectedApiKeyId, activeKeys]);

  async function runSimulation() {
    const rawKeyMap = getRawKeys();
    const rawKey = rawKeyMap[selectedApiKeyId];

    if (!rawKey) {
      setOutput("No raw key found for selected API key. Create a fresh key in API Keys page.");
      return;
    }

    const challenge = await apiRequest<{ x402?: { paymentId: string }; error?: string }>(
      `/v1/protected/quote?topic=${encodeURIComponent(topic)}`,
      {
        headers: { "x-api-key": rawKey },
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
      headers: { "x-api-key": rawKey },
    });

    if (settle.status >= 400 || !settle.data.receiptId) {
      setOutput(`Settle failed: ${settle.data.error ?? "unknown error"}`);
      return;
    }

    const paid = await apiRequest<{ data?: { insight: string }; error?: string }>(
      `/v1/protected/quote?topic=${encodeURIComponent(topic)}`,
      {
        headers: {
          "x-api-key": rawKey,
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
          <CardDescription>Run challenge, settle, and paid retry in one flow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 md:grid-cols-3">
            <Input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Topic" />
            <select
              className="bg-input/30 border-input h-9 rounded-4xl border px-3 text-sm"
              value={selectedApiKeyId}
              onChange={(event) => setSelectedApiKeyId(event.target.value)}
            >
              <option value="">Select API key</option>
              {activeKeys.map((key) => (
                <option key={key.id} value={key.id}>
                  {key.name} ({key.keyPrefix}...)
                </option>
              ))}
            </select>
            <Button onClick={() => void runSimulation()}>Run Simulation</Button>
          </div>
          <div className="rounded-xl border p-3 font-mono text-xs">{output}</div>
        </CardContent>
      </Card>
    </div>
  );
}
