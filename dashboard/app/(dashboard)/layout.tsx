import { redirect } from "next/navigation";

import { DashboardLayoutClient } from "@/components/dashboard/layout-client";
import { getServerSession } from "@/lib/server-auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <DashboardLayoutClient initialUser={session.user}>{children}</DashboardLayoutClient>;
}
