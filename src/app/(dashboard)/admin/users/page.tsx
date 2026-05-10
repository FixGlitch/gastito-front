"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Badge } from "@/components/atoms/badge";
import { Progress } from "@/components/atoms/progress";
import {
  useAdminUsers,
  useAdminUser,
  useUpdateUser,
  useDeleteUser,
  useUpdateUserFinance,
  useDeleteUserExpense,
  useUpdateUserExpense,
  useUpdateUserSavingsGoal,
  useDeleteUserSavingsGoal,
  useUpdateUserRecurring,
  useDeleteUserRecurring,
  useCreateUserBudget,
  useUpdateUserBudget,
  useDeleteUserBudget,
} from "@/lib/api/hooks/admin";
import { formatARS } from "@/lib/format";
import {
  Loader2,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Receipt,
  PiggyBank,
  DollarSign,
  Calendar,
  User,
  Mail,
  Repeat,
  Wallet,
  Tag,
  Plus,
  X,
  Save,
  Eye,
  Edit3,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";

type UserData = { id: string; email: string; name: string; role: string; createdAt: string };

type FullUserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  salaryProfile?: { monthlySalary: string; savingsPercentage: string; inflationAdjustmentPercent: string; payday: number } | null;
  stats: { totalExpenses: number; totalExpensesAmount: number; monthlyExpenses: number; totalSavingsGoals: number; totalSavingsAmount: number; totalRecurring: number; activeRecurring: number; totalBudgets: number };
  expenses: any[];
  savings: any[];
  recurring: any[];
  budgets: any[];
  categories: any[];
};

type TabType = "info" | "expenses" | "savings" | "recurring" | "budgets" | "categories";

export default function AdminUsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: usersData, isLoading, refetch } = useAdminUsers(page, 10, search);
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editFinanceOpen, setEditFinanceOpen] = useState(false);

  const { data: fullUserData, isLoading: loadingUser, refetch: refetchUser } = useAdminUser(selectedUserId || "") as { data: FullUserData; isLoading: boolean; refetch: () => void };

  const updateFinanceMutation = useUpdateUserFinance();
  const deleteExpenseMutation = useDeleteUserExpense();
  const updateExpenseMutation = useUpdateUserExpense();
  const deleteSavingsMutation = useDeleteUserSavingsGoal();
  const deleteRecurringMutation = useDeleteUserRecurring();
  const createBudgetMutation = useCreateUserBudget();
  const deleteBudgetMutation = useDeleteUserBudget();
  const updateBudgetMutation = useUpdateUserBudget();

  // Edit expense state
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editExpenseDesc, setEditExpenseDesc] = useState("");
  const [editExpenseAmount, setEditExpenseAmount] = useState("");
  const [editExpenseCategory, setEditExpenseCategory] = useState("");
  const [editExpenseDate, setEditExpenseDate] = useState("");

  const handleEditExpense = (e: any) => {
    setEditingExpenseId(e.id);
    setEditExpenseDesc(e.description);
    setEditExpenseAmount(String(e.amount));
    setEditExpenseCategory(e.category);
    setEditExpenseDate(e.date);
  };

  const handleSaveExpense = () => {
    if (!selectedUserId || !editingExpenseId) return;
    updateExpenseMutation.mutate({
      userId: selectedUserId,
      expenseId: editingExpenseId,
      data: { description: editExpenseDesc, amount: parseFloat(editExpenseAmount), category: editExpenseCategory, date: editExpenseDate },
    }, { onSuccess: () => setEditingExpenseId(null) });
  };

  // Edit states
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [editSavingsPct, setEditSavingsPct] = useState("");
  const [editInflation, setEditInflation] = useState("");
  const [editPayday, setEditPayday] = useState("1");
  
  // New budget
  const [newBudgetCategory, setNewBudgetCategory] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [newBudgetPeriod, setNewBudgetPeriod] = useState("monthly");

  // Edit budget state
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editBudgetAmount, setEditBudgetAmount] = useState("");
  const [editBudgetCategory, setEditBudgetCategory] = useState("");
  const [editBudgetPeriod, setEditBudgetPeriod] = useState("");

  const handleEditBudget = (b: any) => {
    setEditingBudgetId(b.id);
    setEditBudgetAmount(String(b.amount));
    setEditBudgetCategory(b.category);
    setEditBudgetPeriod(b.period);
  };

  const handleSaveBudget = () => {
    if (!selectedUserId || !editingBudgetId) return;
    updateBudgetMutation.mutate({
      userId: selectedUserId,
      budgetId: editingBudgetId,
      data: { amount: parseFloat(editBudgetAmount), category: editBudgetCategory, period: editBudgetPeriod },
    }, { onSuccess: () => setEditingBudgetId(null) });
  };

  // Edit savings state
  const updateSavingsMutation = useUpdateUserSavingsGoal();
  const [editingSavingsId, setEditingSavingsId] = useState<string | null>(null);
  const [editSavingsName, setEditSavingsName] = useState("");
  const [editSavingsTarget, setEditSavingsTarget] = useState("");
  const [editSavingsCurrent, setEditSavingsCurrent] = useState("");
  const [editSavingsActive, setEditSavingsActive] = useState(true);

  const handleEditSavings = (s: any) => {
    setEditingSavingsId(s.id);
    setEditSavingsName(s.name);
    setEditSavingsTarget(String(s.targetAmount));
    setEditSavingsCurrent(String(s.currentAmount));
    setEditSavingsActive(s.isActive);
  };

  const handleSaveSavings = () => {
    if (!selectedUserId || !editingSavingsId) return;
    updateSavingsMutation.mutate({
      userId: selectedUserId,
      goalId: editingSavingsId,
      data: { name: editSavingsName, targetAmount: parseFloat(editSavingsTarget), currentAmount: parseFloat(editSavingsCurrent), isActive: editSavingsActive },
    }, { onSuccess: () => setEditingSavingsId(null) });
  };

  // Edit recurring state
  const updateRecurringMutation = useUpdateUserRecurring();
  const [editingRecurringId, setEditingRecurringId] = useState<string | null>(null);
  const [editRecurringDesc, setEditRecurringDesc] = useState("");
  const [editRecurringAmount, setEditRecurringAmount] = useState("");
  const [editRecurringCategory, setEditRecurringCategory] = useState("");
  const [editRecurringPeriod, setEditRecurringPeriod] = useState("");
  const [editRecurringActive, setEditRecurringActive] = useState(true);

  const handleEditRecurring = (r: any) => {
    setEditingRecurringId(r.id);
    setEditRecurringDesc(r.description);
    setEditRecurringAmount(String(r.amount));
    setEditRecurringCategory(r.category);
    setEditRecurringPeriod(r.period);
    setEditRecurringActive(r.isActive);
  };

  const handleSaveRecurring = () => {
    if (!selectedUserId || !editingRecurringId) return;
    updateRecurringMutation.mutate({
      userId: selectedUserId,
      recurringId: editingRecurringId,
      data: { description: editRecurringDesc, amount: parseFloat(editRecurringAmount), category: editRecurringCategory, period: editRecurringPeriod, isActive: editRecurringActive },
    }, { onSuccess: () => setEditingRecurringId(null) });
  };

  const handleViewDetails = (u: UserData) => {
    setSelectedUserId(u.id);
    setActiveTab("info");
    setDetailsModalOpen(true);
  };

const handleEditUser = (u: UserData) => {
    router.push(`/admin/users/${u.id}/edit`);
  };

  const handleEditFinance = () => {
    if (!fullUserData) return;
    setEditSalary(fullUserData.salaryProfile?.monthlySalary || "0");
    setEditSavingsPct(fullUserData.salaryProfile?.savingsPercentage || "20");
    setEditInflation(fullUserData.salaryProfile?.inflationAdjustmentPercent || "0");
    setEditPayday(String(fullUserData.salaryProfile?.payday ?? 1));
    setEditFinanceOpen(true);
  };

  const handleSaveUser = () => {
    if (!selectedUserId) return;
    updateUserMutation.mutate(
      { userId: selectedUserId, data: { name: editName, email: editEmail } },
      { onSuccess: () => { setEditUserOpen(false); refetch(); } }
    );
  };

  const handleSaveFinance = () => {
    if (!selectedUserId) return;
    updateFinanceMutation.mutate({
      userId: selectedUserId,
      data: { 
        monthlySalary: parseFloat(editSalary) || 0,
        savingsPercentage: parseFloat(editSavingsPct) || 0,
        inflationAdjustmentPercent: parseFloat(editInflation) || 0,
        payday: parseInt(editPayday) || 1,
      },
    }, { onSuccess: () => { setEditFinanceOpen(false); } });
  };

  const handleDelete = (userId: string) => {
    if (confirm("¿Eliminar usuario y todos sus datos?")) {
      deleteUserMutation.mutate(userId, { onSuccess: () => refetch() });
    }
  };

  const handleCreateBudget = () => {
    if (!selectedUserId || !newBudgetCategory || !newBudgetAmount) return;
    createBudgetMutation.mutate({
      userId: selectedUserId,
      data: { category: newBudgetCategory, amount: parseFloat(newBudgetAmount), period: newBudgetPeriod },
    }, { onSuccess: () => { setNewBudgetCategory(""); setNewBudgetAmount(""); } });
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });

  const tabs = [
    { id: "info", label: "Info", icon: User },
    { id: "expenses", label: "Gastos", icon: Receipt },
    { id: "savings", label: "Ahorros", icon: PiggyBank },
    { id: "recurring", label: "Recurrentes", icon: Repeat },
    { id: "budgets", label: "Presupuestos", icon: Wallet },
    { id: "categories", label: "Categorías", icon: Tag },
  ] as const;

  const disposableAmount = fullUserData?.salaryProfile 
    ? Number(fullUserData.salaryProfile.monthlySalary) * (1 - Number(fullUserData.salaryProfile.savingsPercentage) / 100)
    : 0;
  
  const savingsAmount = fullUserData?.salaryProfile 
    ? Number(fullUserData.salaryProfile.monthlySalary) * Number(fullUserData.salaryProfile.savingsPercentage) / 100
    : 0;

  return (
    <DashboardTemplate title="Usuarios" description="Gestión completa de usuarios">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>{usersData?.total || 0} usuarios</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 w-80" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Creado</th>
                    <th className="text-right py-3 px-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData?.data?.map((u: UserData) => (
                    <tr key={u.id} className="border-b hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"><User className="h-4 w-4 text-primary" /></div>
                          <span className="font-medium">{u.name || "Sin nombre"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">{formatDate(u.createdAt)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetails(u)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditUser(u)}><Edit3 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(u.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {usersData?.totalPages && usersData.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Página {usersData.page} de {usersData.totalPages}</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" disabled={page >= usersData.totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

{/* Details Modal - Improved */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          {loadingUser ? (
            <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : fullUserData && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{fullUserData.name || "Sin nombre"}</h2>
                    <p className="text-sm text-muted-foreground">{fullUserData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={fullUserData.role === "admin" ? "default" : "secondary"} className="text-sm">
                    {fullUserData.role}
                  </Badge>
                  <Button onClick={() => router.push(`/admin/users/${fullUserData.id}/edit`)}>
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 py-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-xl text-center">
                  <p className="text-2xl font-bold">{fullUserData.stats.totalExpenses}</p>
                  <p className="text-xs text-muted-foreground">Gastos</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-xl text-center">
                  <p className="text-2xl font-bold">{formatARS(fullUserData.stats.monthlyExpenses)}</p>
                  <p className="text-xs text-muted-foreground">Este mes</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-xl text-center">
                  <p className="text-2xl font-bold">{fullUserData.stats.totalSavingsGoals}</p>
                  <p className="text-xs text-muted-foreground">Metas</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-xl text-center">
                  <p className="text-2xl font-bold">{fullUserData.stats.activeRecurring}/{fullUserData.stats.totalRecurring}</p>
                  <p className="text-xs text-muted-foreground">Recurrentes</p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-xl text-center">
                  <p className="text-2xl font-bold">{fullUserData.stats.totalBudgets}</p>
                  <p className="text-xs text-muted-foreground">Presupuestos</p>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950 rounded-xl text-center">
                  <p className="text-2xl font-bold">{formatARS(fullUserData.stats.totalExpensesAmount)}</p>
                  <p className="text-xs text-muted-foreground">Total gastado</p>
                </div>
              </div>

{/* Tabs */}
              <div className="flex gap-1 border-b py-2 overflow-x-auto">
                {tabs.map((tab) => (
                  <Button key={tab.id} variant={activeTab === tab.id ? "default" : "ghost"} size="sm" onClick={() => setActiveTab(tab.id as TabType)} className="whitespace-nowrap">
                    <tab.icon className="h-4 w-4 mr-1" /> {tab.label}
                  </Button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === "info" && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="p-4 bg-muted/30 rounded-xl"><Label className="text-xs text-muted-foreground">Nombre</Label><p className="text-lg font-medium">{fullUserData.name || "Sin nombre"}</p></div>
                      <div className="p-4 bg-muted/30 rounded-xl"><Label className="text-xs text-muted-foreground">Email</Label><p className="text-lg">{fullUserData.email}</p></div>
                      <div className="p-4 bg-muted/30 rounded-xl"><Label className="text-xs text-muted-foreground">Creado</Label><p className="text-lg">{formatDate(fullUserData.createdAt)}</p></div>
                      <div className="p-4 bg-muted/30 rounded-xl"><Label className="text-xs text-muted-foreground">Rol</Label><Badge variant={fullUserData.role === "admin" ? "default" : "secondary"}>{fullUserData.role}</Badge></div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-xl text-center">
                        <p className="text-3xl font-bold text-emerald-600">{fullUserData.salaryProfile ? formatARS(Number(fullUserData.salaryProfile.monthlySalary)) : "—"}</p>
                        <p className="text-sm text-muted-foreground">Sueldo mensual</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-xl text-center">
                          <p className="text-2xl font-bold">{fullUserData.salaryProfile?.savingsPercentage || 0}%</p>
                          <p className="text-xs text-muted-foreground">Ahorro</p>
                        </div>
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-xl text-center">
                          <p className="text-2xl font-bold">{fullUserData.salaryProfile?.inflationAdjustmentPercent || 0}%</p>
                          <p className="text-xs text-muted-foreground">Inflación</p>
                        </div>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-xl flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Disponible:</span>
                        <span className="text-2xl font-bold text-emerald-600">{formatARS(disposableAmount)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "expenses" && (
                  <div className="space-y-2">
                    {(!fullUserData.expenses || fullUserData.expenses.length === 0) ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Sin gastos registrados</p>
                      </div>
                    ) : fullUserData.expenses.map((e: any) => (
                      <div key={e.id} className="border rounded-xl p-3">
                        {editingExpenseId === e.id ? (
                          <div className="flex gap-2 w-full items-center flex-wrap">
                            <Input value={editExpenseDesc} onChange={(ev) => setEditExpenseDesc(ev.target.value)} placeholder="Descripción" className="flex-1" />
                            <Input type="number" value={editExpenseAmount} onChange={(ev) => setEditExpenseAmount(ev.target.value)} placeholder="Monto" className="w-24" />
                            <Input value={editExpenseCategory} onChange={(ev) => setEditExpenseCategory(ev.target.value)} placeholder="Categoría" className="w-24" />
                            <Input type="date" value={editExpenseDate} onChange={(ev) => setEditExpenseDate(ev.target.value)} className="w-32" />
                            <Button size="sm" onClick={handleSaveExpense}><Save className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingExpenseId(null)}><X className="h-3 w-3" /></Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
                                <Receipt className="h-5 w-5 text-red-500" />
                              </div>
                              <div>
                                <p className="font-medium text-lg">{e.description}</p>
                                <p className="text-sm text-muted-foreground">{formatDate(e.date)} • {e.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold">{formatARS(e.amount)}</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditExpense(e)}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => deleteExpenseMutation.mutate({ userId: selectedUserId!, expenseId: e.id })}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "savings" && (
                  <div className="space-y-3">
                    {(!fullUserData.savings || fullUserData.savings.length === 0) ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <PiggyBank className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Sin metas de ahorro</p>
                      </div>
                    ) : fullUserData.savings.map((s: any) => {
                      const progress = Math.min((s.currentAmount / s.targetAmount) * 100, 100);
                      return (
                        <div key={s.id} className="p-5 border rounded-xl">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{s.name}</h3>
                              <Badge variant={s.isActive ? "success" : "secondary"} className="mt-1">{s.isActive ? "Activa" : "Inactiva"}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold">{formatARS(s.currentAmount)}<span className="text-muted-foreground">/{formatARS(s.targetAmount)}</span></span>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditSavings(s)}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => deleteSavingsMutation.mutate({ userId: selectedUserId!, goalId: s.id })}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </div>
                          <Progress value={progress} className="h-3" />
                          <p className="text-sm text-muted-foreground text-right mt-1">{Math.round(progress)}% completado</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === "recurring" && (
                  <div className="space-y-2">
                    {(!fullUserData.recurring || fullUserData.recurring.length === 0) ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Repeat className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Sin gastos recurrentes</p>
                      </div>
                    ) : fullUserData.recurring.map((r: any) => (
                      <div key={r.id} className="flex items-center justify-between p-4 border rounded-xl">
                        <div>
                          <h3 className="font-medium text-lg">{r.description}</h3>
                          <p className="text-sm text-muted-foreground">{r.category} • {r.period}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={r.isActive ? "success" : "secondary"}>{r.isActive ? "Activo" : "Pausado"}</Badge>
                          <span className="text-xl font-bold">{formatARS(r.amount)}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditRecurring(r)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => deleteRecurringMutation.mutate({ userId: selectedUserId!, recurringId: r.id })}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "budgets" && (
                  <div className="space-y-2">
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
                    {(!fullUserData.budgets || fullUserData.budgets.length === 0) ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Wallet className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Sin presupuestos</p>
                      </div>
                    ) : fullUserData.budgets.map((b: any) => (
                      <div key={b.id} className="border rounded-xl p-3">
                        {editingBudgetId === b.id ? (
                          <div className="flex gap-2 w-full items-center flex-wrap">
                            <Input value={editBudgetCategory} onChange={(ev) => setEditBudgetCategory(ev.target.value)} placeholder="Categoría" className="flex-1" />
                            <Input type="number" value={editBudgetAmount} onChange={(ev) => setEditBudgetAmount(ev.target.value)} placeholder="Monto" className="w-24" />
                            <select value={editBudgetPeriod} onChange={(ev) => setEditBudgetPeriod(ev.target.value)} className="p-2 border rounded">
                              <option value="daily">Diario</option>
                              <option value="weekly">Semanal</option>
                              <option value="monthly">Mensual</option>
                            </select>
                            <Button size="sm" onClick={handleSaveBudget}><Save className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingBudgetId(null)}><X className="h-3 w-3" /></Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-lg">{b.category}</h3>
                              <p className="text-sm text-muted-foreground capitalize">{b.period}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold">{formatARS(b.amount)}</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditBudget(b)}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => deleteBudgetMutation.mutate({ userId: selectedUserId!, budgetId: b.id })}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "categories" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {(!fullUserData.categories || fullUserData.categories.length === 0) ? (
                      <div className="col-span-full text-center py-12 text-muted-foreground">
                        <Tag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Sin categorías</p>
                      </div>
                    ) : fullUserData.categories.map((c: any) => (
                      <div key={c.id} className="flex items-center gap-3 p-4 border rounded-xl">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
                        <div className="flex-1">
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.isDefault ? "Sistema" : "Usuario"}</p>
                        </div>
                        <Badge variant={c.isActive ? "success" : "secondary"}>{c.isActive ? "✓" : "✗"}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Modal - Simple */}
      <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Editar Usuario</DialogTitle></DialogHeader>
          {loadingUser && selectedUserId ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input 
                  value={fullUserData?.name || editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email" 
                  value={fullUserData?.email || editEmail} 
                  onChange={(e) => setEditEmail(e.target.value)} 
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditUserOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveUser} disabled={updateUserMutation.isPending || (loadingUser && selectedUserId !== null)}>
              {updateUserMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Finance Modal - Simple */}
      <Dialog open={editFinanceOpen} onOpenChange={setEditFinanceOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Editar Finanzas</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Sueldo Mensual</Label><Input type="number" value={editSalary} onChange={(e) => setEditSalary(e.target.value)} /></div>
            <div><Label>Ahorro %</Label><Input type="number" value={editSavingsPct} onChange={(e) => setEditSavingsPct(e.target.value)} /></div>
            <div><Label>Inflación %</Label><Input type="number" value={editInflation} onChange={(e) => setEditInflation(e.target.value)} /></div>
            <div><Label>Día de cobro</Label><Input type="number" min={1} max={31} value={editPayday} onChange={(e) => setEditPayday(e.target.value)} /></div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditFinanceOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveFinance} disabled={updateFinanceMutation.isPending}>
              {updateFinanceMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardTemplate>
  );
}