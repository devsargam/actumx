"use client";

import { useEffect, useState } from "react";

import { useDashboardAuth } from "@/components/dashboard/auth-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, formatMoney, formatTimestamp, type Transaction } from "@/lib/api";

export default function TransactionsPage() {
  const { token } = useDashboardAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const run = async () => {
      const response = await apiRequest<{ transactions: Transaction[] }>("/v1/transactions", { token });
      if (response.status < 400) {
        setTransactions(response.data.transactions);
      }
    };

    void run();
  }, [token]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>x402 Transactions</CardTitle>
          <CardDescription>Challenge and settlement lifecycle events.</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-2 text-left">ID</th>
                <th className="py-2 text-left">Endpoint</th>
                <th className="py-2 text-left">Amount</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Updated</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t">
                  <td className="py-2 font-mono text-xs">{tx.id}</td>
                  <td className="py-2 text-xs">{tx.method} {tx.endpoint}</td>
                  <td className="py-2">{formatMoney(tx.amountCents)}</td>
                  <td className="py-2">
                    <Badge variant={tx.status === "completed" ? "secondary" : "outline"}>{tx.status}</Badge>
                  </td>
                  <td className="py-2 text-xs">{formatTimestamp(tx.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
