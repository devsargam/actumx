"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, formatMoney, formatTimestamp, type UsageEvent } from "@/lib/api";

export default function UsagePage() {
  const [events, setEvents] = useState<UsageEvent[]>([]);

  useEffect(() => {
    const run = async () => {
      const response = await apiRequest<{ events: UsageEvent[] }>("/v1/usage");
      if (response.status < 400) {
        setEvents(response.data.events);
      }
    };

    void run();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Usage Events</CardTitle>
          <CardDescription>Settled paid API requests charged through x402 flow.</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-2 text-left">Event</th>
                <th className="py-2 text-left">Endpoint</th>
                <th className="py-2 text-left">Cost</th>
                <th className="py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t">
                  <td className="py-2 font-mono text-xs">{event.id}</td>
                  <td className="py-2 text-xs">{event.method} {event.endpoint}</td>
                  <td className="py-2">{formatMoney(event.costCents)}</td>
                  <td className="py-2 text-xs">{formatTimestamp(event.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
