"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Orbit,
  Sparkles,
  WalletCards,
} from "lucide-react";

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
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agents", label: "Agents", icon: WalletCards },
  { href: "/use-sponge", label: "Use Sponge", icon: Sparkles },
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
      <Sidebar variant="inset" collapsible="icon" className="border-r border-white/10 bg-[#090f1d] text-slate-100">
        <SidebarHeader className="border-b border-white/10">
          <div className="rounded-xl border border-white/15 bg-white/[0.03] p-3 group-data-[collapsible=icon]:p-2">
            <div className="flex items-start gap-2 group-data-[collapsible=icon]:justify-center">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-cyan-300" />
              <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-semibold text-white">Actumx</p>
                <p className="text-xs text-slate-400">Agent treasury console</p>
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarSeparator className="bg-white/10" />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-400">Navigation</SidebarGroupLabel>
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
                        className="text-slate-300 hover:bg-blue-500/15 hover:text-white data-[active=true]:bg-blue-500/25 data-[active=true]:text-cyan-200"
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
          <div className="rounded-xl border border-white/15 bg-white/[0.03] p-3 text-xs group-data-[collapsible=icon]:p-2">
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <Avatar size="sm">
                <AvatarFallback>{initials || "U"}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="font-medium text-white">{user?.name ?? "Unknown User"}</p>
                <p className="truncate text-slate-400">{user?.email ?? ""}</p>
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
      <SidebarInset className="bg-[radial-gradient(circle_at_top_left,_#1f2b4a_0%,_#0a0f19_35%,_#04060d_100%)] text-slate-100">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-white/10 bg-black/40 px-4 backdrop-blur-sm">
          <SidebarTrigger />
          <p className="text-xs font-medium tracking-wide text-slate-400">
            {pathname.replace("/", "") || "dashboard"}
          </p>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
