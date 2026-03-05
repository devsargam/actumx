"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  ClipboardListIcon,
  OrbitIcon,
  BoxesIcon,
  PlugZapIcon,
  WalletCardsIcon,
  CommandIcon,
} from "lucide-react";
import Image from "next/image";

const NAV_ITEMS = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Agents",
    url: "/agents",
    icon: <WalletCardsIcon />,
  },
  {
    title: "Connect Agent",
    url: "/connect-agent",
    icon: <PlugZapIcon />,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: <OrbitIcon />,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: <BoxesIcon />,
  },
  {
    title: "Agent Requests",
    url: "/agent-requests",
    icon: <ClipboardListIcon />,
  },
];

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string;
    email: string;
  } | null;
  onLogout?: () => Promise<void> | void;
};

export function AppSidebar({ user, onLogout, ...props }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="text-foreground bg-sidebar dark:text-slate-100"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="items-center flex">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <Image
                  src="/logo.jpg"
                  alt="Actumx Logo"
                  className="size-5 rounded-xs"
                  width={20}
                  height={20}
                />
                <span className="text-base font-semibold">Actumx</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* <SidebarSeparator /> */}
      <SidebarContent>
        <NavMain items={NAV_ITEMS} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? "Unknown User",
            email: user?.email ?? "",
            avatar: "",
          }}
          onLogout={onLogout}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
