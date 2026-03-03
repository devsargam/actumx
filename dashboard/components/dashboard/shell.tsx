"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Orbit,
  PlugZap,
  Sparkles,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
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
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agents", label: "Agents", icon: WalletCards },
  { href: "/connect-agent", label: "Connect Agent", icon: PlugZap },
  { href: "/transactions", label: "Transactions", icon: Orbit },
  { href: "/orders", label: "Orders", icon: Boxes },
  { href: "/agent-requests", label: "Agent Requests", icon: ClipboardList },
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
      <Sidebar
        variant="inset"
        collapsible="icon"
        className="border-r border-border bg-background text-foreground dark:border-white/10 dark:bg-[#090f1d] dark:text-slate-100"
      >
        <SidebarHeader className="border-b border-border dark:border-white/10">
          <div className="rounded-xl border border-border bg-card p-3 group-data-[collapsible=icon]:p-2 dark:border-white/15 dark:bg-white/[0.03]">
            <div className="flex items-start gap-2 group-data-[collapsible=icon]:justify-center">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
              <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-semibold text-foreground dark:text-white">Actumx</p>
                <p className="text-xs text-muted-foreground dark:text-slate-400">Agent treasury console</p>
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarSeparator className="bg-border dark:bg-white/10" />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground dark:text-slate-400">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        className="text-foreground hover:bg-accent/50 hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground dark:text-slate-300 dark:hover:bg-[#4e6fff]/18 dark:hover:text-white dark:data-[active=true]:bg-[#4e6fff]/26 dark:data-[active=true]:text-[#dbe3ff]"
                      >
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
          <div className="rounded-xl border border-border bg-card p-3 text-xs group-data-[collapsible=icon]:p-2 dark:border-white/15 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <Avatar size="sm">
                <AvatarFallback>{initials || "U"}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="font-medium text-foreground">
                  {user?.name ?? "Unknown User"}
                </p>
                <p className="truncate text-muted-foreground">{user?.email ?? ""}</p>
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
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
      <SidebarInset className="bg-background text-foreground dark:bg-[#070b14] dark:text-slate-100">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-sm dark:border-white/10 dark:bg-black/40">
          <SidebarTrigger />
          <p className="text-xs font-medium tracking-wide text-muted-foreground dark:text-slate-400">
            {pathname.replace("/", "") || "dashboard"}
          </p>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="dashboard-app p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
