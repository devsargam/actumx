"use client";

import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest, formatMoney, formatTimestamp, type PaymentIntent } from "@/lib/api";

export default function BillingPage() {
  const [amount, setAmount] = useState("1000");
  const [status, setStatus] = useState("Ready");
  const [intents, setIntents] = useState<PaymentIntent[]>([]);

  const loadIntents = useCallback(async () => {
    const response = await apiRequest<{ intents: PaymentIntent[] }>("/v1/billing/payment-intents");
    if (response.status < 400) {
      setIntents(response.data.intents);
    }
  }, []);

  useEffect(() => {
    void loadIntents();
  }, [loadIntents]);

  async function handleTopUp() {
    setStatus("Creating top-up...");
    const response = await apiRequest<{ error?: string }>("/v1/billing/top-up", {
      method: "POST",
      body: { amountCents: Number(amount) },
    });

    if (response.status >= 400) {
      setStatus(`Failed: ${response.data.error ?? "unknown error"}`);
      return;
    }

    setStatus("Top-up settled");
    await loadIntents();
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Top up dummy credits and review payment intents.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Up Credits</CardTitle>
          <CardDescription>Amount in cents. Example: 2500 = $25.00.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={amount} type="number" min={100} step={100} onChange={(event) => setAmount(event.target.value)} />
            <Button onClick={() => void handleTopUp()}>Top Up</Button>
          </div>
          <p className="text-muted-foreground text-xs">{status}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Top Ups</CardTitle>
          <CardDescription>Last 50 payment intents.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-2 text-left">Intent</th>
                <th className="py-2 text-left">Amount</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {intents.map((intent) => (
                <tr key={intent.id} className="border-t">
                  <td className="py-2 font-mono text-xs">{intent.id}</td>
                  <td className="py-2">{formatMoney(intent.amountCents)}</td>
                  <td className="py-2"><Badge variant="secondary">{intent.status}</Badge></td>
                  <td className="py-2 text-xs">{formatTimestamp(intent.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
