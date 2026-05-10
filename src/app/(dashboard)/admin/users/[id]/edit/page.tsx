"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Badge } from "@/components/atoms/badge";
import { Progress } from "@/components/atoms/progress";
import { useAdminUser, useUpdateUser, useUpdateUserFinance, useUpdateUserSavingsGoal, useDeleteUserSavingsGoal, useUpdateUserRecurring, useDeleteUserRecurring, useCreateUserBudget, useUpdateUserBudget, useDeleteUserBudget, useDeleteUserExpense, useUpdateUserExpense } from "@/lib/api/hooks/admin";
import { formatARS } from "@/lib/format";
import { Loader2, ArrowLeft, Save, Pencil, Trash2, Plus, X, User, DollarSign, Receipt, PiggyBank, Repeat, Wallet } from "lucide-react";
import { toast } from "@/lib/utils/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";

type TabType = "info" | "finance" | "expenses" | "savings" | "recurring" | "budgets";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { data: userData, isLoading, refetch } = useAdminUser(userId);
  const user = userData;

  const updateUserMutation = useUpdateUser();
  const updateFinanceMutation = useUpdateUserFinance();
  const updateSavingsMutation = useUpdateUserSavingsGoal();
  const deleteSavingsMutation = useDeleteUserSavingsGoal();
  const updateRecurringMutation = useUpdateUserRecurring();
  const deleteRecurringMutation = useDeleteUserRecurring();
  const createBudgetMutation = useCreateUserBudget();
  const updateBudgetMutation = useUpdateUserBudget();
  const deleteBudgetMutation = useDeleteUserBudget();
  const deleteExpenseMutation = useDeleteUserExpense();
  const updateExpenseMutation = useUpdateUserExpense();

  const [activeTab, setActiveTab] = useState<TabType>("info");

  // Modal states
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [editExpenseDesc, setEditExpenseDesc] = useState("");
  const [editExpenseAmount, setEditExpenseAmount] = useState("");
  const [editExpenseCategory, setEditExpenseCategory] = useState("");
  const [editExpenseDate, setEditExpenseDate] = useState("");

  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [editingSavings, setEditingSavings] = useState<any>(null);
  const [editSavingsName, setEditSavingsName] = useState("");
  const [editSavingsTarget, setEditSavingsTarget] = useState("");
  const [editSavingsCurrent, setEditSavingsCurrent] = useState("");
  const [editSavingsActive, setEditSavingsActive] = useState(true);

  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<any>(null);
  const [editRecurringDesc, setEditRecurringDesc] = useState("");
  const [editRecurringAmount, setEditRecurringAmount] = useState("");
  const [editRecurringCategory, setEditRecurringCategory] = useState("");
  const [editRecurringPeriod, setEditRecurringPeriod] = useState("");
  const [editRecurringActive, setEditRecurringActive] = useState(true);

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [editBudgetAmount, setEditBudgetAmount] = useState("");
  const [editBudgetCategory, setEditBudgetCategory] = useState("");
  const [editBudgetPeriod, setEditBudgetPeriod] = useState("");

  const handleEditExpense = (e: any) => {
    setEditingExpense(e);
    setEditExpenseDesc(e.description);
    setEditExpenseAmount(String(e.amount));
    setEditExpenseCategory(e.category);
    setEditExpenseDate(e.date);
    setShowExpenseModal(true);
  };

  const handleSaveExpense = () => {
    if (!editingExpense) return;
    updateExpenseMutation.mutate({
      userId,
      expenseId: editingExpense.id,
      data: { description: editExpenseDesc, amount: parseFloat(editExpenseAmount), category: editExpenseCategory, date: editExpenseDate },
    }, { onSuccess: () => setShowExpenseModal(false) });
  };

  const handleEditSavings = (s: any) => {
    setEditingSavings(s);
    setEditSavingsName(s.name);
    setEditSavingsTarget(String(s.targetAmount));
    setEditSavingsCurrent(String(s.currentAmount));
    setEditSavingsActive(s.isActive);
    setShowSavingsModal(true);
  };

  const handleSaveSavings = () => {
    if (!editingSavings) return;
    updateSavingsMutation.mutate({
      userId,
      goalId: editingSavings.id,
      data: { name: editSavingsName, targetAmount: parseFloat(editSavingsTarget), currentAmount: parseFloat(editSavingsCurrent), isActive: editSavingsActive },
    }, { onSuccess: () => setShowSavingsModal(false) });
  };

  const handleEditRecurring = (r: any) => {
    setEditingRecurring(r);
    setEditRecurringDesc(r.description);
    setEditRecurringAmount(String(r.amount));
    setEditRecurringCategory(r.category);
    setEditRecurringPeriod(r.period);
    setEditRecurringActive(r.isActive);
    setShowRecurringModal(true);
  };

  const handleSaveRecurring = () => {
    if (!editingRecurring) return;
    updateRecurringMutation.mutate({
      userId,
      recurringId: editingRecurring.id,
      data: { description: editRecurringDesc, amount: parseFloat(editRecurringAmount), category: editRecurringCategory, period: editRecurringPeriod, isActive: editRecurringActive },
    }, { onSuccess: () => setShowRecurringModal(false) });
  };

  const handleEditBudget = (b: any) => {
    setEditingBudget(b);
    setEditBudgetAmount(String(b.amount));
    setEditBudgetCategory(b.category);
    setEditBudgetPeriod(b.period);
    setShowBudgetModal(true);
  };

  const handleSaveBudget = () => {
    if (!editingBudget) return;
    updateBudgetMutation.mutate({
      userId,
      budgetId: editingBudget.id,
      data: { amount: parseFloat(editBudgetAmount), category: editBudgetCategory, period: editBudgetPeriod },
    }, { onSuccess: () => setShowBudgetModal(false) });
  };

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [editSavingsPct, setEditSavingsPct] = useState("");
  const [editInflation, setEditInflation] = useState("");

  const [newBudgetCategory, setNewBudgetCategory] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [newBudgetPeriod, setNewBudgetPeriod] = useState("monthly");

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditEmail(user.email);
      if (user.salaryProfile) {
        setEditSalary(user.salaryProfile.monthlySalary || "0");
        setEditSavingsPct(user.salaryProfile.savingsPercentage || "20");
        setEditInflation(user.salaryProfile.inflationAdjustmentPercent || "0");
      }
    }
  }, [user]);

  const handleSaveUser = () => {
    updateUserMutation.mutate(
      { userId, data: { name: editName, email: editEmail } },
      { onSuccess: () => { toast.success("Usuario actualizado"); refetch(); } }
    );
  };

  const handleSaveFinance = () => {
    updateFinanceMutation.mutate({
      userId,
      data: { 
        monthlySalary: parseFloat(editSalary) || 0,
        savingsPercentage: parseFloat(editSavingsPct) || 0,
        inflationAdjustmentPercent: parseFloat(editInflation) || 0,
      },
    }, { onSuccess: () => { toast.success("Finanzas actualizadas"); refetch(); } });
  };

  const handleCreateBudget = () => {
    if (!newBudgetCategory || !newBudgetAmount) return;
    createBudgetMutation.mutate({
      userId,
      data: { category: newBudgetCategory, amount: parseFloat(newBudgetAmount), period: newBudgetPeriod },
    }, { onSuccess: () => { setNewBudgetCategory(""); setNewBudgetAmount(""); } });
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });

  if (isLoading) {
    return (
      <DashboardTemplate title="Cargando..." description="">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardTemplate>
    );
  }

  if (!user) {
    return (
      <DashboardTemplate title="Usuario no encontrado" description="">
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-4">Usuario no encontrado</p>
          <Button onClick={() => router.push("/admin/users")}>Volver a usuarios</Button>
        </div>
      </DashboardTemplate>
    );
  }

  const stats = user.stats;
  const tabs = [
    { id: "info", label: "Usuario", icon: User },
    { id: "finance", label: "Finanzas", icon: DollarSign },
    { id: "expenses", label: "Gastos", icon: Receipt },
    { id: "savings", label: "Ahorros", icon: PiggyBank },
    { id: "recurring", label: "Recurrentes", icon: Repeat },
    { id: "budgets", label: "Presupuestos", icon: Wallet },
  ] as const;

  return (
    <DashboardTemplate title="Editar Usuario" description="Administrar información y datos del usuario">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.name || "Sin nombre"}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-sm">
          {user.role}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold">{stats.totalExpenses}</p>
          <p className="text-xs text-muted-foreground">Gastos</p>
        </div>
        <div className="bg-green-50 dark:bg-green-950 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold">{formatARS(stats.monthlyExpenses)}</p>
          <p className="text-xs text-muted-foreground">Este mes</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold">{stats.totalSavingsGoals}</p>
          <p className="text-xs text-muted-foreground">Metas</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold">{stats.activeRecurring}/{stats.totalRecurring}</p>
          <p className="text-xs text-muted-foreground">Recurrentes</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold">{stats.totalBudgets}</p>
          <p className="text-xs text-muted-foreground">Presupuestos</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold">{formatARS(stats.totalExpensesAmount)}</p>
          <p className="text-xs text-muted-foreground">Total gastado</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id as TabType)}
            className="gap-1 whitespace-nowrap"
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "info" && (
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Datos básicos del usuario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nombre del usuario" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Fecha de creación</Label>
                <div className="p-3 bg-muted/50 rounded-lg">{new Date(user.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}</div>
              </div>
            </div>
            <Button onClick={handleSaveUser} disabled={updateUserMutation.isPending} className="w-full md:w-auto">
              {updateUserMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <Save className="h-4 w-4 mr-2" />
              Guardar cambios
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "finance" && (
        <Card>
          <CardHeader>
            <CardTitle>Configuración Financiera</CardTitle>
            <CardDescription>Gestionar salario y metas de ahorro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Sueldo Mensual</Label>
                <Input type="number" value={editSalary} onChange={(e) => setEditSalary(e.target.value)} className="text-lg font-semibold" />
              </div>
              <div className="space-y-2">
                <Label>% de Ahorro</Label>
                <Input type="number" value={editSavingsPct} onChange={(e) => setEditSavingsPct(e.target.value)} className="text-lg font-semibold" />
              </div>
              <div className="space-y-2">
                <Label>% Inflación</Label>
                <Input type="number" value={editInflation} onChange={(e) => setEditInflation(e.target.value)} className="text-lg font-semibold" />
              </div>
            </div>
            {user.salaryProfile && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                  <p className="text-sm text-muted-foreground">Monto de ahorro mensual</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatARS(Number(user.salaryProfile.monthlySalary) * Number(user.salaryProfile.savingsPercentage) / 100)}</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm text-muted-foreground">Disponible para gastar</p>
                  <p className="text-2xl font-bold text-blue-600">{formatARS(Number(user.salaryProfile.monthlySalary) * (1 - Number(user.salaryProfile.savingsPercentage) / 100))}</p>
                </div>
              </div>
            )}
            <Button onClick={handleSaveFinance} disabled={updateFinanceMutation.isPending} className="w-full md:w-auto">
              {updateFinanceMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <Save className="h-4 w-4 mr-2" />
              Guardar finanzas
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "expenses" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Historial de Gastos</CardTitle>
              <CardDescription>{user.expenses?.length || 0} transacciones registradas</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{formatARS(stats.totalExpensesAmount)}</p>
              <p className="text-sm text-muted-foreground">Total gastado</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(!user.expenses || user.expenses.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay gastos registrados</p>
                </div>
              ) : user.expenses.map((e: any) => (
                <div key={e.id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium">{e.description}</p>
                      <p className="text-xs text-muted-foreground">{e.category} • {formatDate(e.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{formatARS(e.amount)}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditExpense(e)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => deleteExpenseMutation.mutate({ userId, expenseId: e.id })}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "savings" && (
        <Card>
          <CardHeader>
            <CardTitle>Metas de Ahorro</CardTitle>
            <CardDescription>{user.savings?.length || 0} metas de ahorro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(!user.savings || user.savings.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <PiggyBank className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay metas de ahorro</p>
                </div>
              ) : user.savings.map((s: any) => {
                const progress = Math.min((s.currentAmount / s.targetAmount) * 100, 100);
                return (
                  <div key={s.id} className="p-5 border rounded-xl hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-lg">{s.name}</p>
                        <Badge variant={s.isActive ? "success" : "secondary"} className="mt-1">{s.isActive ? "Activo" : "Inactivo"}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{formatARS(s.currentAmount)}<span className="text-muted-foreground">/{formatARS(s.targetAmount)}</span></span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditSavings(s)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => deleteSavingsMutation.mutate({ userId, goalId: s.id })}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <p className="text-xs text-muted-foreground text-right mt-1">{Math.round(progress)}% completado</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "recurring" && (
        <Card>
          <CardHeader>
            <CardTitle>Gastos Recurrentes</CardTitle>
            <CardDescription>{user.recurring?.length || 0} gastos recurrentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(!user.recurring || user.recurring.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Repeat className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay gastos recurrentes</p>
                </div>
              ) : user.recurring.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition-shadow">
                  <div>
                    <p className="font-medium">{r.description}</p>
                    <p className="text-xs text-muted-foreground">{r.category} • {r.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={r.isActive ? "success" : "secondary"}>{r.isActive ? "Activo" : "Pausado"}</Badge>
                    <span className="font-bold">{formatARS(r.amount)}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditRecurring(r)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => deleteRecurringMutation.mutate({ userId, recurringId: r.id })}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "budgets" && (
        <Card>
          <CardHeader>
            <CardTitle>Presupuestos</CardTitle>
            <CardDescription>Gestionar límites de gasto por categoría</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 p-4 bg-muted/30 rounded-lg">
              <Input placeholder="Categoría" value={newBudgetCategory} onChange={(e) => setNewBudgetCategory(e.target.value)} className="flex-1" />
              <Input type="number" placeholder="Monto" value={newBudgetAmount} onChange={(e) => setNewBudgetAmount(e.target.value)} className="w-32" />
              <select value={newBudgetPeriod} onChange={(e) => setNewBudgetPeriod(e.target.value)} className="p-2 border rounded">
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </select>
              <Button onClick={handleCreateBudget}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-2">
              {(!user.budgets || user.budgets.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay presupuestos</p>
                </div>
              ) : user.budgets.map((b: any) => (
                <div key={b.id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition-shadow">
                  <div>
                    <p className="font-medium">{b.category}</p>
                    <p className="text-xs text-muted-foreground capitalize">{b.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{formatARS(b.amount)}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditBudget(b)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => deleteBudgetMutation.mutate({ userId, budgetId: b.id })}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Expense Modal */}
      <Dialog open={showExpenseModal} onOpenChange={setShowExpenseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Editar Gasto</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Descripción</Label><Input value={editExpenseDesc} onChange={(e) => setEditExpenseDesc(e.target.value)} /></div>
            <div className="space-y-2"><Label>Monto</Label><Input type="number" value={editExpenseAmount} onChange={(e) => setEditExpenseAmount(e.target.value)} /></div>
            <div className="space-y-2"><Label>Categoría</Label><Input value={editExpenseCategory} onChange={(e) => setEditExpenseCategory(e.target.value)} /></div>
            <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={editExpenseDate} onChange={(e) => setEditExpenseDate(e.target.value)} /></div>
            <Button onClick={handleSaveExpense} className="w-full">Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Savings Modal */}
      <Dialog open={showSavingsModal} onOpenChange={setShowSavingsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Editar Meta de Ahorro</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Nombre</Label><Input value={editSavingsName} onChange={(e) => setEditSavingsName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Monto Actual</Label><Input type="number" value={editSavingsCurrent} onChange={(e) => setEditSavingsCurrent(e.target.value)} /></div>
            <div className="space-y-2"><Label>Monto Objetivo</Label><Input type="number" value={editSavingsTarget} onChange={(e) => setEditSavingsTarget(e.target.value)} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={editSavingsActive} onChange={(e) => setEditSavingsActive(e.target.checked)} />
              <Label>Activo</Label>
            </div>
            <Button onClick={handleSaveSavings} className="w-full">Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Recurring Modal */}
      <Dialog open={showRecurringModal} onOpenChange={setShowRecurringModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Editar Gasto Recurrente</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Descripción</Label><Input value={editRecurringDesc} onChange={(e) => setEditRecurringDesc(e.target.value)} /></div>
            <div className="space-y-2"><Label>Monto</Label><Input type="number" value={editRecurringAmount} onChange={(e) => setEditRecurringAmount(e.target.value)} /></div>
            <div className="space-y-2"><Label>Categoría</Label><Input value={editRecurringCategory} onChange={(e) => setEditRecurringCategory(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>Período</Label>
              <select value={editRecurringPeriod} onChange={(e) => setEditRecurringPeriod(e.target.value)} className="w-full border rounded-md p-2">
                <option value="daily">Diario</option><option value="weekly">Semanal</option><option value="monthly">Mensual</option><option value="yearly">Anual</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={editRecurringActive} onChange={(e) => setEditRecurringActive(e.target.checked)} />
              <Label>Activo</Label>
            </div>
            <Button onClick={handleSaveRecurring} className="w-full">Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Budget Modal */}
      <Dialog open={showBudgetModal} onOpenChange={setShowBudgetModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Editar Presupuesto</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Categoría</Label><Input value={editBudgetCategory} onChange={(e) => setEditBudgetCategory(e.target.value)} /></div>
            <div className="space-y-2"><Label>Monto</Label><Input type="number" value={editBudgetAmount} onChange={(e) => setEditBudgetAmount(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>Período</Label>
              <select value={editBudgetPeriod} onChange={(e) => setEditBudgetPeriod(e.target.value)} className="w-full border rounded-md p-2">
                <option value="daily">Diario</option><option value="weekly">Semanal</option><option value="monthly">Mensual</option>
              </select>
            </div>
            <Button onClick={handleSaveBudget} className="w-full">Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardTemplate>
  );
}