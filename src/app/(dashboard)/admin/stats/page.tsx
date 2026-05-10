"use client";

import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/card";
import { useAdminOverview } from "@/lib/api/hooks/admin";
import { formatARS } from "@/lib/format";
import { Loader2, Users, Receipt, PiggyBank, Repeat, Tag, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function AdminStatsPage() {
  const { data: overview, isLoading } = useAdminOverview();

  if (isLoading) {
    return (
      <DashboardTemplate title="Estadísticas" description="Estadísticas completas del sistema">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate title="Estadísticas" description="Estadísticas completas del sistema">
      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl p-6 mb-8 border">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Panel de Control</h2>
            <p className="text-muted-foreground">Resumen completo del sistema Gastito</p>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-1 bg-primary rounded-full" />
          <h2 className="text-lg font-semibold">Usuarios</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overview?.users.total || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">usuarios registrados</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overview?.users.admins || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">con rol admin</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Usuarios con Sueldo</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overview?.salary?.totalUsersWithSalary || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                de {overview?.users.total || 0} ({overview?.users.total ? Math.round(((overview?.salary?.totalUsersWithSalary || 0) / overview?.users.total) * 100) : 0}%)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-1 bg-red-500 rounded-full" />
          <h2 className="text-lg font-semibold">Gastos</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <Receipt className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overview?.expenses.total || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">transacciones registradas</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatARS(overview?.expenses.totalAmount || 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">en todos los gastos</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatARS(overview?.expenses.thisMonth || 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">gastado este mes</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Crecimiento</CardTitle>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${(overview?.expenses.growth || 0) >= 0 ? "bg-red-100 dark:bg-red-900" : "bg-green-100 dark:bg-green-900"}`}>
                {(overview?.expenses.growth || 0) >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${(overview?.expenses.growth || 0) >= 0 ? "text-red-600" : "text-green-600"}`}>
                {(overview?.expenses.growth || 0) >= 0 ? "+" : ""}{overview?.expenses.growth || 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs mes anterior</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Savings Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-1 bg-emerald-500 rounded-full" />
          <h2 className="text-lg font-semibold">Ahorros</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Metas de Ahorro</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <PiggyBank className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overview?.savings.total || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">metas creadas</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Ahorrado</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatARS(overview?.savings.totalAmount || 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">ahorrado en total</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Salaries Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-1 bg-blue-500 rounded-full" />
          <h2 className="text-lg font-semibold">Salarios</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Usuarios con Sueldo</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overview?.salary?.totalUsersWithSalary || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">usuarios configurados</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Salarios Mensuales</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatARS(overview?.salary?.totalMonthlySalary || 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">suma de todos los salarios</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Salario Promedio</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatARS(overview?.salary?.averageSalary || 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">promedio por usuario</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-1 bg-gray-500 rounded-full" />
          <h2 className="text-lg font-semibold">Sistema</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gastos Recurrentes</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <Repeat className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overview?.recurring.total || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">{overview?.recurring.active || 0} activos</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Categorías</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <Tag className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overview?.categories.total || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">categorías del sistema</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Presupuestos</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overview?.budgets.total || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">presupuestos activos</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardTemplate>
  );
}