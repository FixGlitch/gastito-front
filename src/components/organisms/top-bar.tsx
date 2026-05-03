"use client";

import { Button } from "@/components/atoms/button";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { useUIStore } from "@/lib/store/ui";
import { useAuthStore } from "@/lib/store/auth";
import { useLogout } from "@/lib/api/hooks/auth";
import { Menu, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";

export function TopBar() {
  const { setSidebarOpen, sidebarCollapsed } = useUIStore();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {sidebarCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={() => setSidebarOpen(false)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div className="flex-1" />

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user?.name ?? "Usuario"}</p>
            <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
          </div>
          <DropdownMenuItem
            onClick={() => logoutMutation.mutate()}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
