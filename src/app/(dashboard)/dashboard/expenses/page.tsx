"use client";

import { useState } from "react";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { ExpenseTable } from "@/components/organisms/expense-table";
import { AddExpenseModal } from "@/components/molecules/add-expense-modal";
import { AlertBanner } from "@/components/organisms/alert-banner";
import { useExpenses, useDeleteExpense, useUpdateExpense } from "@/lib/api/hooks/expenses";
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
import { Plus, Filter, Loader2, Pencil, Trash2 } from "lucide-react";
import type { Expense, ExpenseFilters } from "@/types/expense";
import { DEFAULT_CATEGORIES } from "@/types/expense";
import { getCurrentMonthISO } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";

const months = [
  { value: "2026-05", label: "Mayo 2026" },
  { value: "2026-04", label: "Abril 2026" },
  { value: "2026-03", label: "Marzo 2026" },
  { value: "2026-02", label: "Febrero 2026" },
  { value: "2026-01", label: "Enero 2026" },
];

export default function ExpensesPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");
  const [filters, setFilters] = useState<ExpenseFilters>({
    month: getCurrentMonthISO(),
  });

  const { data: expenses = [], isLoading } = useExpenses(filters);
  const deleteMutation = useDeleteExpense();
  const updateMutation = useUpdateExpense();

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que querés eliminar este gasto?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setEditDescription(expense.description);
    setEditAmount(String(expense.amount));
    setEditCategory(expense.category);
    setEditDate(expense.date);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingExpense) return;
    updateMutation.mutate({
      id: editingExpense.id,
      data: {
        description: editDescription,
        amount: editAmount,
        category: editCategory,
        date: editDate,
      },
    }, { onSuccess: () => setEditModalOpen(false) });
  };

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
      <div className="mb-6 grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-6">
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
          <Label htmlFor="startDate">Desde</Label>
          <Input
            id="startDate"
            type="date"
            value={filters.startDate ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, startDate: e.target.value || undefined }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Hasta</Label>
          <Input
            id="endDate"
            type="date"
            value={filters.endDate ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, endDate: e.target.value || undefined }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minAmount">Monto mínimo</Label>
          <Input
            id="minAmount"
            type="number"
            placeholder="0"
            value={filters.minAmount ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minAmount: e.target.value ? Number(e.target.value) : undefined }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxAmount">Monto máximo</Label>
          <Input
            id="maxAmount"
            type="number"
            placeholder="999999"
            value={filters.maxAmount ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxAmount: e.target.value ? Number(e.target.value) : undefined }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={filters.category ?? "all"}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                category: value === "all" ? undefined : value,
              }))
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {Object.values(DEFAULT_CATEGORIES).map((cat) => (
                  <SelectItem key={cat.key} value={cat.key}>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.label}
                    </span>
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

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Cargando gastos...
        </div>
      ) : (
        <ExpenseTable data={expenses} onEdit={handleEdit} onDelete={handleDelete} />
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
            <Button onClick={handleSaveEdit} className="w-full">Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardTemplate>
  );
}
