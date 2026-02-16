"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, CreditCard, KeyRound, LayoutDashboard, LogOut, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useDashboardAuth } from "@/components/dashboard/auth-context";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/api-keys", label: "API Keys", icon: KeyRound },
  { href: "/transactions", label: "Transactions", icon: BarChart3 },
  { href: "/usage", label: "Usage", icon: Activity },
  { href: "/simulator", label: "Simulator", icon: Sparkles },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useDashboardAuth();
  const initials = (user?.name ?? "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <div className="rounded-xl border bg-background/50 p-3 group-data-[collapsible=icon]:p-2">
            <div className="flex items-start gap-2 group-data-[collapsible=icon]:justify-center">
              <Sparkles className="mt-0.5 size-4 shrink-0" />
              <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-semibold">x402 Control Plane</p>
                <p className="text-muted-foreground text-xs">Pay, issue keys, and monitor spend</p>
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link href={item.href}>
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="rounded-xl border bg-background/50 p-3 text-xs group-data-[collapsible=icon]:p-2">
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <Avatar size="sm">
                <AvatarFallback>{initials || "U"}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="font-medium">{user?.name ?? "Unknown User"}</p>
                <p className="text-muted-foreground truncate">{user?.email ?? ""}</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => void logout()}
            className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0"
          >
            <LogOut className="size-4" />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            <span className="sr-only">Logout</span>
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-[radial-gradient(circle_at_top,_#ecfeff_0%,_#f1f5f9_45%,_#e2e8f0_100%)]">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm">
          <SidebarTrigger />
          <Badge variant="secondary">{pathname.replace("/", "") || "overview"}</Badge>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
