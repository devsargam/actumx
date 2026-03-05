"use client";

import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useDashboardAuth } from "@/components/dashboard/auth-context";
import { Separator } from "../ui/separator";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useDashboardAuth();

  const title =
    pathname
      .split("/")
      .filter(Boolean)
      .slice(-1)[0]
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) ?? "Dashboard";

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} onLogout={() => logout()} />
      <SidebarInset className="md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full h-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-1 data-[orientation=vertical]:h-12"
            />
            <h1 className="text-base font-medium">{title}</h1>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <div className="dashboard-app p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
