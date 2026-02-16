import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#e2e8f0_45%,_#cbd5e1_100%)] p-6 md:p-10 dark:bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#111827_45%,_#020617_100%)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-end">
          <ThemeToggle />
        </div>

        <Card>
          <CardHeader className="space-y-3">
            <Badge variant="secondary" className="w-fit">x402 Ready</Badge>
            <CardTitle className="text-3xl leading-tight md:text-4xl">
              Monetize APIs with x402-style payment flow
            </CardTitle>
            <CardDescription className="max-w-3xl text-sm md:text-base">
              Issue API keys, accept dummy credit top-ups, run payment-required challenges, settle requests on behalf
              of your users, and monitor all activity in one dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/overview">Open Dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">1. Fund Credits</CardTitle>
              <CardDescription>Top up dummy balance with payment intents in cents.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">2. Issue Keys</CardTitle>
              <CardDescription>Create and revoke API keys for each integration.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">3. Track x402</CardTitle>
              <CardDescription>See challenge, settlement, and usage events in real time.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
