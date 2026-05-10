"use client";

import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { StatCard } from "@/components/molecules/stat-card";
import { AlertBanner } from "@/components/organisms/alert-banner";
import { SpendingTrendChart } from "@/components/organisms/spending-trend-chart";
import { useDashboardOverview } from "@/lib/api/hooks/dashboard";
import { formatARS } from "@/lib/format";
import { Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { useState } from "react";
import { AddExpenseModal } from "@/components/molecules/add-expense-modal";
import { ExpenseRow } from "@/components/molecules/expense-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import type { Expense as ExpenseType } from "@/types/expense";
import { useWebSocket } from "@/hooks/use-websocket";
import { toast } from "@/lib/utils/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { useUpdateExpense, useDeleteExpense } from "@/lib/api/hooks/expenses";

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardOverview();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseType | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");

  const updateExpenseMutation = useUpdateExpense();
  const deleteExpenseMutation = useDeleteExpense();

  const handleEditExpense = (expense: ExpenseType) => {
    setEditingExpense(expense);
    setEditDescription(expense.description);
    setEditAmount(String(expense.amount));
    setEditCategory(expense.category);
    setEditDate(expense.date);
    setEditModalOpen(true);
  };

  const handleSaveExpense = () => {
    if (!editingExpense) return;
    updateExpenseMutation.mutate({
      id: editingExpense.id,
      data: {
        description: editDescription,
        amount: editAmount,
        category: editCategory,
        date: editDate,
      },
    }, { onSuccess: () => setEditModalOpen(false) });
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm("¿Eliminar este gasto?")) {
      deleteExpenseMutation.mutate(id);
    }
  };

  useWebSocket({
    onBudgetAlert: (alerts) => {
      alerts.forEach((alert) => {
        if (alert.type === "danger") {
          toast.error(alert.message);
        } else if (alert.type === "warning") {
          toast.warning(alert.message);
        } else {
          toast.info(alert.message);
        }
      });
    },
  });

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
                onEdit={() => handleEditExpense(expense as ExpenseType)}
                onDelete={() => handleDeleteExpense(expense.id)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      <AddExpenseModal open={addModalOpen} onOpenChange={setAddModalOpen} />

      {/* Edit Expense Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Gasto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Monto</Label>
              <Input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
            </div>
            <Button onClick={handleSaveExpense} className="w-full">Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardTemplate>
  );
}
