"use client";

import { useEffect, useState } from "react";

import { useDashboardAuth } from "@/components/dashboard/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, formatMoney, type BillingSummary } from "@/lib/api";

export default function OverviewPage() {
  const { token } = useDashboardAuth();
  const [summary, setSummary] = useState<BillingSummary | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    const run = async () => {
      const response = await apiRequest<BillingSummary>("/v1/billing/summary", { token });
      if (response.status < 400) {
        setSummary(response.data);
      }
    };

    void run();
  }, [token]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Current balance and x402 activity snapshot.</CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
            <CardDescription>Available credits</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatMoney(summary?.balanceCents ?? 0)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Top Up</CardTitle>
            <CardDescription>Settled deposits</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatMoney(summary?.topUpTotalCents ?? 0)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Usage</CardTitle>
            <CardDescription>Settled API spend</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatMoney(summary?.usageTotalCents ?? 0)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Active credentials</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{summary?.activeApiKeys ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>x402 Tx</CardTitle>
            <CardDescription>Total protocol events</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{summary?.x402Transactions ?? 0}</CardContent>
        </Card>
      </div>
    </div>
  );
}
