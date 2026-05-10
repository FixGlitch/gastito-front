"use client";

import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { BudgetProgress } from "@/components/molecules/budget-progress";
import { StatCard } from "@/components/molecules/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { useFinanceSummary } from "@/lib/api/hooks/budget";
import {
  useSavingsGoals,
  useCreateSavingsGoal,
  useUpdateSavingsGoal,
  useDeleteSavingsGoal,
  useSavingsProjection,
} from "@/lib/api/hooks/savings";
import { formatARS } from "@/lib/format";
import {
  PiggyBank,
  TrendingUp,
  Calendar,
  Target,
  Plus,
  Trash2,
  Loader2,
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

export default function SavingsPage() {
  const { data: budgetSummary } = useFinanceSummary();
  const { data: goals = [], isLoading: goalsLoading } = useSavingsGoals();
  const createGoalMutation = useCreateSavingsGoal();
  const updateGoalMutation = useUpdateSavingsGoal();
  const deleteGoalMutation = useDeleteSavingsGoal();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editCurrentAmount, setEditCurrentAmount] = useState("");
  const [editTargetAmount, setEditTargetAmount] = useState("");
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalAmount, setNewGoalAmount] = useState("");

  const monthlySavings = budgetSummary?.savingsAmount ?? 0;
  const { data: projection } = useSavingsProjection(monthlySavings);

  const totalSaved = goals.reduce((sum, g) => sum + Number(g.currentAmount), 0);
  const totalTarget = goals.reduce((sum, g) => sum + Number(g.targetAmount), 0);

  const handleCreateGoal = () => {
    if (!newGoalName || !newGoalAmount) return;
    createGoalMutation.mutate(
      {
        name: newGoalName,
        targetAmount: parseFloat(newGoalAmount),
      },
      {
        onSuccess: () => {
          setNewGoalName("");
          setNewGoalAmount("");
          setAddModalOpen(false);
        },
      },
    );
  };

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal);
    setEditName(goal.name);
    setEditCurrentAmount(String(goal.currentAmount));
    setEditTargetAmount(String(goal.targetAmount));
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingGoal) return;
    updateGoalMutation.mutate({
      id: editingGoal.id,
      data: {
        name: editName,
        currentAmount: parseFloat(editCurrentAmount),
        targetAmount: parseFloat(editTargetAmount),
      },
    }, { onSuccess: () => setEditModalOpen(false) });
  };

  return (
    <DashboardTemplate
      title="Ahorro"
      description="Seguí el progreso de tus metas de ahorro"
      actions={
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nueva meta
        </Button>
      }
    >
      <div className="stats-grid mb-6">
        <StatCard
          label="Ahorro acumulado"
          value={formatARS(totalSaved)}
          icon="piggyBank"
        />
        <StatCard
          label="Meta total"
          value={formatARS(totalTarget)}
          icon="target"
        />
        <StatCard
          label="Ahorro mensual"
          value={formatARS(monthlySavings)}
          icon="calendar"
        />
        <StatCard
          label="Proyección 12 meses"
          value={projection ? formatARS(projection.twelveMonths) : "..."}
          icon="trendingUp"
        />
      </div>

      {totalTarget > 0 && (
        <BudgetProgress
          label="Progreso general de ahorro"
          current={totalSaved}
          target={totalTarget}
          className="mb-6"
        />
      )}

      {goalsLoading ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Cargando metas...
        </div>
      ) : goals.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = Number(goal.targetAmount) > 0
              ? Math.min((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100, 100)
              : 0;

            return (
              <Card key={goal.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{goal.name}</CardTitle>
                      <CardDescription>
                        {goal.targetDate
                          ? `Objetivo: ${new Date(goal.targetDate).toLocaleDateString("es-AR")}`
                          : "Sin fecha límite"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleEditGoal(goal)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => deleteGoalMutation.mutate(goal.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Actual</span>
                      <span className="font-medium">{formatARS(Number(goal.currentAmount))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Objetivo</span>
                      <span className="font-medium">{formatARS(Number(goal.targetAmount))}</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-center text-sm font-medium text-muted-foreground">
                      {progress.toFixed(0)}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="flex h-48 flex-col items-center justify-center text-center">
          <PiggyBank className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-medium">No tenés metas de ahorro</p>
          <p className="text-sm text-muted-foreground">
            Creá una para empezar a seguir tu progreso
          </p>
        </Card>
      )}

      {projection && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Proyección de ahorro</CardTitle>
            <CardDescription>
              Basado en tu ahorro mensual de {formatARS(monthlySavings)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">En 3 meses:</span>
                <span className="font-medium">{formatARS(projection.threeMonths)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">En 6 meses:</span>
                <span className="font-medium">{formatARS(projection.sixMonths)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">En 12 meses:</span>
                <span className="font-medium">{formatARS(projection.twelveMonths)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              * Proyección basada en ahorro constante sin considerar inflación
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva meta de ahorro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goalName">Nombre de la meta</Label>
              <Input
                id="goalName"
                placeholder="Ej: Fondo de emergencia"
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goalAmount">Monto objetivo</Label>
              <Input
                id="goalAmount"
                type="number"
                placeholder="500000"
                value={newGoalAmount}
                onChange={(e) => setNewGoalAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateGoal}
              loading={createGoalMutation.isPending}
              disabled={!newGoalName || !newGoalAmount}
            >
              Crear meta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Savings Goal Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Meta de Ahorro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Monto Actual</Label>
              <Input type="number" value={editCurrentAmount} onChange={(e) => setEditCurrentAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Monto Objetivo</Label>
              <Input type="number" value={editTargetAmount} onChange={(e) => setEditTargetAmount(e.target.value)} />
            </div>
            <Button onClick={handleSaveEdit} className="w-full">Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardTemplate>
  );
}
