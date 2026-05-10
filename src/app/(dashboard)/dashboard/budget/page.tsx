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
import { useBudgets, useCreateBudget, useDeleteBudget, useBudgetComparison, useUpdateBudget } from "@/lib/api/hooks/budget";
import { useFinanceProfile } from "@/lib/api/hooks/budget";
import { formatARS } from "@/lib/format";
import {
  Wallet,
  Plus,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle,
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
import { Progress } from "@/components/atoms/progress";

export default function BudgetPage() {
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();
  const { data: profile } = useFinanceProfile();
  const { data: comparison = [] } = useBudgetComparison();
  const createBudgetMutation = useCreateBudget();
  const deleteBudgetMutation = useDeleteBudget();
  const updateBudgetMutation = useUpdateBudget();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editPeriod, setEditPeriod] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newPeriod, setNewPeriod] = useState("monthly");

  const monthlySalary = profile?.monthlySalary ?? 0;
  const savingsPercentage = profile?.savingsPercentage ?? 20;
  const disposableAmount = monthlySalary * (1 - savingsPercentage / 100);

  const handleCreateBudget = () => {
    if (!newCategory || !newAmount) return;
    createBudgetMutation.mutate(
      {
        category: newCategory,
        amount: parseFloat(newAmount),
        period: newPeriod,
      },
      {
        onSuccess: () => {
          setNewCategory("");
          setNewAmount("");
          setAddModalOpen(false);
        },
      },
    );
  };

  const handleEditBudget = (budget: any) => {
    setEditingBudget(budget);
    setEditCategory(budget.category);
    setEditAmount(String(budget.amount));
    setEditPeriod(budget.period);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingBudget) return;
    updateBudgetMutation.mutate({
      id: editingBudget.id,
      data: {
        category: editCategory,
        amount: parseFloat(editAmount),
        period: editPeriod,
      },
    }, { onSuccess: () => setEditModalOpen(false) });
  };

  return (
    <DashboardTemplate
      title="Presupuesto"
      description="Gestioná tus presupuestos por categoría"
      actions={
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo presupuesto
        </Button>
      }
    >
      <div className="stats-grid mb-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <CardDescription>Sueldo mensual</CardDescription>
            </div>
            <CardTitle className="text-2xl">{formatARS(monthlySalary)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <CardDescription>Disponible para gastar</CardDescription>
            </div>
            <CardTitle className="text-2xl">{formatARS(disposableAmount)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <CardDescription>Presupuestos activos</CardDescription>
            </div>
            <CardTitle className="text-2xl">{budgets.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {comparison.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Comparación: Presupuestado vs Gastado</CardTitle>
            <CardDescription>
              Segimiento de tus presupuestos en tiempo real
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {comparison.map((item) => {
              const isOverBudget = item.spent > item.budgeted;
              return (
                <div key={item.budgetId} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.category}</span>
                    <span className={isOverBudget ? "text-red-500 font-medium" : ""}>
                      {formatARS(item.spent)} / {formatARS(item.budgeted)}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(item.percentage, 100)}
                    className={isOverBudget ? "bg-red-100" : ""}
                  />
                  {isOverBudget && (
                    <p className="text-xs text-red-500">
                      Te pasaste por {formatARS(item.spent - item.budgeted)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {item.percentage.toFixed(1)}% utilizdo · Restante: {formatARS(item.remaining)}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {budgetsLoading ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Cargando presupuestos...
        </div>
      ) : budgets.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const comparisonItem = comparison.find(c => c.budgetId === budget.id);
            const percentage = comparisonItem?.percentage ?? 0;
            const isOverBudget = percentage > 100;

            return (
              <Card key={budget.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{budget.category}</CardTitle>
                      <CardDescription>
                        {budget.period === "monthly" ? "Mensual" : 
                         budget.period === "weekly" ? "Semanal" : "Diario"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleEditBudget(budget)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => deleteBudgetMutation.mutate(budget.id)}
                        disabled={deleteBudgetMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Presupuestado</span>
                      <span className="font-medium">{formatARS(budget.amount)}</span>
                    </div>
                    {comparisonItem && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Gastado</span>
                          <span className={isOverBudget ? "text-red-500" : ""}>
                            {formatARS(comparisonItem.spent)}
                          </span>
                        </div>
                        <Progress
                          value={Math.min(percentage, 100)}
                          className={isOverBudget ? "bg-red-100" : ""}
                        />
                        <p className="text-xs text-muted-foreground">
                          {percentage.toFixed(1)}% · Restante: {formatARS(comparisonItem.remaining)}
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="flex h-48 flex-col items-center justify-center text-center">
          <Wallet className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-medium">No tenés presupuestos</p>
          <p className="text-sm text-muted-foreground">
            Creá uno para controlar tus gastos por categoría
          </p>
        </Card>
      )}

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo presupuesto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                placeholder="Ej: Alimentos, Transporte"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                type="number"
                placeholder="50000"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
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
              onClick={handleCreateBudget}
              loading={createBudgetMutation.isPending}
              disabled={!newCategory || !newAmount}
            >
              Crear presupuesto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Budget Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Presupuesto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Monto</Label>
              <Input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
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
            <Button onClick={handleSaveEdit} className="w-full">Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardTemplate>
  );
}
