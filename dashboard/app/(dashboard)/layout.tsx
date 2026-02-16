"use client";

import { DashboardAuthProvider, useDashboardAuth } from "@/components/dashboard/auth-context";
import { DashboardShell } from "@/components/dashboard/shell";

function ProtectedShell({ children }: { children: React.ReactNode }) {
  const { loading, token } = useDashboardAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading dashboard...</p>
      </main>
    );
  }

  if (!token) {
    return null;
  }

  return <DashboardShell>{children}</DashboardShell>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardAuthProvider>
      <ProtectedShell>{children}</ProtectedShell>
    </DashboardAuthProvider>
  );
}
