"use client";

import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  useRecurringExpenses,
  useCreateRecurringExpense,
  useUpdateRecurringExpense,
  useDeleteRecurringExpense,
  useRecurringStats,
} from "@/lib/api/hooks/recurring-expense";
import { useAuthStore } from "@/lib/store/auth";
import { formatARS } from "@/lib/format";
import {
  Repeat,
  Plus,
  Trash2,
  Loader2,
  Pause,
  Play,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/atoms/dialog";

export default function RecurringExpensesPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const { data: expenses = [], isLoading } = useRecurringExpenses(isAdmin);
  const { data: stats } = useRecurringStats();
  
  // Format category name to capitalize first letter
  const formatCategory = (cat: string) => {
    if (!cat) return cat;
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };
  const createMutation = useCreateRecurringExpense();
  const updateMutation = useUpdateRecurringExpense();
  const deleteMutation = useDeleteRecurringExpense();

  const handleEdit = (exp: any) => {
    setEditingExpense(exp);
    setEditDesc(exp.description);
    setEditAmount(String(exp.amount));
    setEditCategory(exp.category);
    setEditPeriod(exp.period);
    setEditActive(exp.isActive);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingExpense) return;
    updateMutation.mutate({
      id: editingExpense.id,
      description: editDesc,
      amount: parseFloat(editAmount),
      category: editCategory,
      isActive: editActive,
    }, { onSuccess: () => setEditModalOpen(false) });
  };

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPeriod, setEditPeriod] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPeriod, setNewPeriod] = useState("monthly");

  const handleCreate = () => {
    if (!newDesc || !newAmount) return;
    createMutation.mutate({
      description: newDesc,
      amount: parseFloat(newAmount),
      category: newCategory,
      period: newPeriod,
      startDate: new Date().toISOString().split("T")[0],
    }, {
      onSuccess: () => {
        setNewDesc("");
        setNewAmount("");
        setNewCategory("");
        setAddModalOpen(false);
      },
    });
  };

  const toggleActive = (id: string, current: boolean) => {
    updateMutation.mutate({ id, isActive: !current });
  };

  return (
    <DashboardTemplate
      title="Gastos Recurrentes"
      description="Gestioná tus gastos automáticos periódicos"
      actions={
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo recurrente
        </Button>
      }
    >
      {stats && (
        <div className="stats-grid mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total recorrentes</CardDescription>
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Activos</CardDescription>
              <CardTitle className="text-2xl text-green-600">{stats.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Monto mensual estimado</CardDescription>
              <CardTitle className="text-2xl">{formatARS(stats.monthlyAmount)}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Cargando gastos recurrentes...
        </div>
      ) : expenses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expenses.map((exp) => (
            <Card key={exp.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{exp.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCategory(exp.category)} · {exp.period === "monthly" ? "Mensual" : 
                      exp.period === "weekly" ? "Semanal" : 
                      exp.period === "daily" ? "Diario" : "Anual"} · 
                      {formatARS(exp.amount)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEdit(exp)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toggleActive(exp.id, exp.isActive)}
                    >
                      {exp.isActive ? 
                        <Pause className="h-4 w-4 text-muted-foreground" /> : 
                        <Play className="h-4 w-4 text-green-600" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => deleteMutation.mutate(exp.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monto</span>
                    <span className="font-medium">{formatARS(exp.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estado</span>
                    <span className={exp.isActive ? "text-green-600" : "text-muted-foreground"}>
                      {exp.isActive ? "Activo" : "Pausado"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex h-48 flex-col items-center justify-center text-center">
          <Repeat className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-medium">No tenés gastos recurrentes</p>
          <p className="text-sm text-muted-foreground">
            Creá uno para automatizar tus gastos fijos
          </p>
        </Card>
      )}

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo gasto recurrente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="desc">Descripción</Label>
              <Input
                id="desc"
                placeholder="Ej: Netflix, Spotify"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                type="number"
                placeholder="5000"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                placeholder="Ej: Ocio, Servicios"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Periodo</Label>
              <Select value={newPeriod} onValueChange={setNewPeriod}>
                <SelectTrigger id="period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diario</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              loading={createMutation.isPending}
              disabled={!newDesc || !newAmount}
            >
              Crear gasto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Recurring Expense Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Gasto Recurrente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
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
              <Label>Período</Label>
              <select value={editPeriod} onChange={(e) => setEditPeriod(e.target.value)} className="w-full border rounded-md p-2">
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="yearly">Anual</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} />
              <Label>Activo</Label>
            </div>
            <Button onClick={handleSaveEdit} className="w-full">Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardTemplate>
  );
}
