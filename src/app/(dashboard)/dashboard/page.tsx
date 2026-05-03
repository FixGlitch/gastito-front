"use client";

import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { StatCard } from "@/components/molecules/stat-card";
import { AlertBanner } from "@/components/organisms/alert-banner";
import { SpendingTrendChart } from "@/components/organisms/spending-trend-chart";
import { useDashboardOverview } from "@/lib/api/hooks/dashboard";
import { formatARS } from "@/lib/format";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { useState } from "react";
import { AddExpenseModal } from "@/components/molecules/add-expense-modal";
import { ExpenseRow } from "@/components/molecules/expense-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import type { Expense as ExpenseType } from "@/types/expense";

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardOverview();
  const [addModalOpen, setAddModalOpen] = useState(false);

  if (isLoading) {
    return (
      <DashboardTemplate title="Resumen" description="Tu situación financiera este mes">
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Cargando tu resumen...</p>
          </div>
        </div>
      </DashboardTemplate>
    );
  }

  if (isError || !data) {
    return (
      <DashboardTemplate title="Resumen" description="Tu situación financiera este mes">
        <AlertBanner
          type="danger"
          title="Error al cargar"
          message="No se pudo obtener la información. Intentá nuevamente."
        />
      </DashboardTemplate>
    );
  }

  const { summary, recentExpenses, alerts, timeSeries } = data;

  return (
    <DashboardTemplate
      title="Resumen"
      description="Tu situación financiera este mes"
      actions={
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo gasto
        </Button>
      }
    >
      {alerts?.map((alert) => (
        <AlertBanner
          key={alert.title}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          className="mb-3"
          dismissible
        />
      ))}

      <div className="stats-grid mb-6">
        <StatCard
          label="Sueldo mensual"
          value={formatARS(summary.monthlySalary)}
          icon="wallet"
        />
        <StatCard
          label="Ahorro protegido"
          value={formatARS(summary.savingsAmount)}
          icon="piggyBank"
          trend="up"
          trendValue={`${summary.savingsPercentage}% del sueldo`}
        />
        <StatCard
          label="Disponible para gastar"
          value={formatARS(summary.disposableAmount)}
          icon="trendingUp"
        />
        <StatCard
          label="Gastado este mes"
          value={formatARS(summary.spentThisMonth)}
          icon="trendingDown"
          trend={summary.spentThisMonth > summary.disposableAmount ? "up" : "down"}
          trendValue={
            summary.spentThisMonth > summary.disposableAmount
              ? "Excedido"
              : `${formatARS(summary.remainingReal)} restante`
          }
        />
      </div>

      <div className="dashboard-grid lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SpendingTrendChart
            data={timeSeries.map((p) => ({
              date: p.date.slice(5),
              amount: p.amount,
              budget: p.budget,
            }))}
          />
        </div>

        <div className="rounded-xl border bg-card p-5 lg:col-span-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">Presupuesto restante</p>
          <p className="text-2xl font-bold mb-1">
            {formatARS(summary.remainingReal)}
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            de {formatARS(summary.disposableAmount)} disponible
          </p>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full w-full flex-1 bg-success transition-all"
              style={{
                transform: `translateX(-${100 - Math.min((summary.remainingReal / summary.disposableAmount) * 100, 100)}%)`,
              }}
            />
          </div>
        </div>
      </div>

      {recentExpenses?.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Últimos gastos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentExpenses.map((expense) => (
              <ExpenseRow
                key={expense.id}
                expense={{
                  ...expense,
                  updatedAt: expense.createdAt,
                } as ExpenseType}
              />
            ))}
          </CardContent>
        </Card>
      )}

      <AddExpenseModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </DashboardTemplate>
  );
}
