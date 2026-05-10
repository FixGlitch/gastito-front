"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Menu,
  X,
  Settings,
  Wallet,
  PiggyBank,
  Repeat,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import { useUIStore } from "@/lib/store/ui";
import { useAuthStore } from "@/lib/store/auth";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const userNavItems: NavItem[] = [
  { label: "Resumen", href: "/dashboard", icon: BarChart3 },
  { label: "Gastos", href: "/dashboard/expenses", icon: Receipt },
  { label: "Presupuesto", href: "/dashboard/budget", icon: Wallet },
  { label: "Recurrentes", href: "/dashboard/recurring-expenses", icon: Repeat },
  { label: "Ahorro", href: "/dashboard/savings", icon: PiggyBank },
  { label: "Configuración", href: "/dashboard/settings", icon: Settings },
];

const adminNavItems: NavItem[] = [
  { label: "Estadísticas", href: "/admin/stats", icon: BarChart3 },
  { label: "Usuarios", href: "/admin/users", icon: Users },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { sidebarOpen, sidebarCollapsed, setSidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const currentNavItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full flex-col border-r bg-sidebar transition-all duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b px-4">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
                G
              </div>
              <span className="font-semibold text-sidebar-foreground">Gastito</span>
            </div>
          )}
        </div>

        {isAdmin && !sidebarCollapsed && (
          <div className="border-b px-4 py-3">
            <p className="text-sm font-semibold text-sidebar-foreground">Dashboard</p>
          </div>
        )}

        <nav className="flex-1 space-y-1 p-3">
          {currentNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  sidebarCollapsed && "justify-center px-2",
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <div className="border-t p-4">
            <p className="text-xs text-sidebar-foreground/50">Gastito v0.1.0</p>
          </div>
        )}
      </aside>
    </>
  );
}