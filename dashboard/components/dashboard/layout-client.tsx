"use client";

import { DashboardAuthProvider } from "@/components/dashboard/auth-context";
import { DashboardShell } from "@/components/dashboard/shell";

export function DashboardLayoutClient({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: {
    id: string;
    name: string;
    email: string;
  };
}) {
  return (
    <DashboardAuthProvider initialUser={initialUser}>
      <DashboardShell>{children}</DashboardShell>
    </DashboardAuthProvider>
  );
}
