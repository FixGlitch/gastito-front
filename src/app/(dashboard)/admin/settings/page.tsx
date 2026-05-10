"use client";

import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/card";
import { useAuthStore } from "@/lib/store/auth";

export default function AdminSettingsPage() {
  const { user } = useAuthStore();

  return (
    <DashboardTemplate title="Configuración" description="Configuración del panel de administración">
      <div className="grid gap-6 md:max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Cuenta</CardTitle>
            <CardDescription>Tus datos de administrador</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="text-lg font-medium">{user?.name}</p>
                <p className="text-muted-foreground">{user?.email}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                  Administrador
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sobre Gastito</CardTitle>
            <CardDescription>Información del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Versión</span>
              <span className="font-medium">0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entorno</span>
              <span className="font-medium">Desarrollo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rol</span>
              <span className="font-medium">Admin</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardTemplate>
  );
}