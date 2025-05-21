"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Wallet,
  BarChart3,
  ArrowLeftRight,
  Settings,
  LogOut,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Conti", href: "/conti", icon: Wallet },
  { name: "Transazioni", href: "/transazioni", icon: ArrowLeftRight },
  { name: "Statistiche", href: "/statistiche", icon: BarChart3 },
  { name: "Investimenti", href: "/investimenti", icon: LineChart },
  { name: "Impostazioni", href: "/impostazioni", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="relative">
      <ShadcnSidebar variant="sidebar">
        <SidebarHeader className="border-b">
          <div className="flex h-16 items-center px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Wallet className="h-6 w-6" />
              <span>Gestione Spese</span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className=" px-4 py-2">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.name}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-4 w-4" />
            <span>Esci</span>
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </ShadcnSidebar>
    </div>
  );
}
