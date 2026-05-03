"use client";

import { useState } from "react";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { ExpenseTable } from "@/components/organisms/expense-table";
import { AddExpenseModal } from "@/components/molecules/add-expense-modal";
import { AlertBanner } from "@/components/organisms/alert-banner";
import { useExpenses, useDeleteExpense } from "@/lib/api/hooks/expenses";
import { Button } from "@/components/atoms/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Plus, Filter, Loader2 } from "lucide-react";
import type { Expense, ExpenseCategory, ExpenseFilters } from "@/types/expense";
import { EXPENSE_CATEGORIES } from "@/types/expense";
import { getCurrentMonthISO } from "@/lib/format";

const months = [
  { value: "2026-05", label: "Mayo 2026" },
  { value: "2026-04", label: "Abril 2026" },
  { value: "2026-03", label: "Marzo 2026" },
  { value: "2026-02", label: "Febrero 2026" },
  { value: "2026-01", label: "Enero 2026" },
];

export default function ExpensesPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [filters, setFilters] = useState<ExpenseFilters>({
    month: getCurrentMonthISO(),
  });

  const { data: expenses = [], isLoading } = useExpenses(filters);
  const deleteMutation = useDeleteExpense();

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que querés eliminar este gasto?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (_expense: Expense) => {
    console.log("Edit expense:", _expense);
  };

  const hasSube = expenses.some((e) => e.category === "sube");
  const subeCount = expenses.filter((e) => e.category === "sube").length;

  return (
    <DashboardTemplate
      title="Gastos"
      description="Administrá y revisá todos tus gastos"
      actions={
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo gasto
        </Button>
      }
    >
      <div className="mb-6 grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <Input
            id="search"
            placeholder="Descripción del gasto..."
            value={filters.search ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value || undefined }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="month">Mes</Label>
          <Select
            value={filters.month}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, month: value }))}
          >
            <SelectTrigger id="month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={filters.category ?? "all"}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                category: (value === "all" ? undefined : value) as ExpenseCategory | undefined,
              }))
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {Object.values(EXPENSE_CATEGORIES).map((cat) => (
                <SelectItem key={cat.key} value={cat.key}>
                  {cat.isSube ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-sube" />
                      {cat.label}
                    </span>
                  ) : (
                    cat.label
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setFilters({ month: getCurrentMonthISO() })}
          >
            <Filter className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>
      </div>

      {hasSube && subeCount > 2 && (
        <AlertBanner
          type="info"
          title="Gastos SUBE detectados"
          message={`Tenés ${subeCount} gastos de transporte este mes. Si superás el presupuesto, vas a recibir una alerta.`}
          className="mb-4"
        />
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Cargando gastos...
        </div>
      ) : (
        <ExpenseTable data={expenses} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <AddExpenseModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </DashboardTemplate>
  );
}
