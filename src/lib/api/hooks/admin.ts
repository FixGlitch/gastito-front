import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuthToken } from "./auth";
import { toast } from "@/lib/utils/toast";
import type { Expense } from "@/types/expense";
import type { SavingsGoal } from "@/types/savings";

// ========== OVERVIEW ==========
export function useAdminOverview() {
  const token = useAuthToken();
  return useQuery({
    queryKey: queryKeys.admin.overview,
    queryFn: async () => {
      const res = await api.get<ApiResponse<any>>("/admin/overview", token ?? undefined);
      return res.data;
    },
    enabled: !!token,
  });
}

// ========== USERS ==========
export function useAdminUsers(page?: number, limit?: number, search?: string) {
  const token = useAuthToken();
  return useQuery({
    queryKey: queryKeys.admin.usersList(page, limit, search),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (page) params.set("page", String(page));
      if (limit) params.set("limit", String(limit));
      if (search) params.set("search", search);
      const res = await api.get<ApiResponse<any>>(`/admin/users${params.toString() ? `?${params}` : ""}`, token ?? undefined);
      return res.data;
    },
    enabled: !!token,
  });
}

export function useAdminUser(userId: string) {
  const token = useAuthToken();
  return useQuery({
    queryKey: queryKeys.admin.userDetail(userId),
    queryFn: async () => {
      const res = await api.get<ApiResponse<any>>(`/admin/users/${userId}`, token ?? undefined);
      return res.data;
    },
    enabled: !!token && !!userId,
  });
}

export function useAdminUserStats(userId: string) {
  const token = useAuthToken();
  return useQuery({
    queryKey: queryKeys.admin.userStats(userId),
    queryFn: async () => {
      const res = await api.get<ApiResponse<any>>(`/admin/users/${userId}/stats`, token ?? undefined);
      return res.data;
    },
    enabled: !!token && !!userId,
  });
}

export function useUpdateUser() {
  const token = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: { name?: string; email?: string; avatarUrl?: string } }) => {
      const res = await api.patch<ApiResponse<any>>(`/admin/users/${userId}`, data, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      toast.success("Usuario actualizado");
    },
    onError: (error: Error) => toast.error(error.message || "Error al actualizar"),
  });
}

export function useDeleteUser() {
  const token = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await api.delete<ApiResponse<any>>(`/admin/users/${userId}`, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      toast.success("Usuario eliminado");
    },
    onError: (error: Error) => toast.error(error.message || "Error al eliminar"),
  });
}

// ========== USER EXPENSES ==========
export function useUserExpenses(userId: string, page?: number, limit?: number, month?: string) {
  const token = useAuthToken();
  return useQuery({
    queryKey: queryKeys.admin.userExpenses(userId, page, limit, month),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (page) params.set("page", String(page));
      if (limit) params.set("limit", String(limit));
      if (month) params.set("month", month);
      const res = await api.get<ApiResponse<any>>(`/admin/users/${userId}/expenses${params.toString() ? `?${params}` : ""}`, token ?? undefined);
      return res.data;
    },
    enabled: !!token && !!userId,
  });
}

export function useDeleteUserExpense() {
  const token = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, expenseId }: { userId: string; expenseId: string }) => {
      const res = await api.delete<ApiResponse<any>>(`/admin/users/${userId}/expenses/${expenseId}`, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user-expenses"] });
      toast.success("Gasto eliminado");
    },
    onError: (error: Error) => toast.error(error.message || "Error al eliminar"),
  });
}

export function useUpdateUserExpense() {
  const token = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, expenseId, data }: { userId: string; expenseId: string; data: { description?: string; amount?: number; category?: string; date?: string } }) => {
      const res = await api.patch<ApiResponse<any>>(`/admin/users/${userId}/expenses/${expenseId}`, data, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user-expenses"] });
      toast.success("Gasto actualizado");
    },
    onError: (error: Error) => toast.error(error.message || "Error al actualizar"),
  });
}

// ========== USER SAVINGS ==========
export function useUserSavings(userId: string) {
  const token = useAuthToken();
  return useQuery({
    queryKey: queryKeys.admin.userSavings(userId),
    queryFn: async () => {
      const res = await api.get<ApiResponse<SavingsGoal[]>>(`/admin/users/${userId}/savings`, token ?? undefined);
      return res.data;
    },
    enabled: !!token && !!userId,
  });
}

export function useUpdateUserSavingsGoal() {
  const token = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, goalId, data }: { userId: string; goalId: string; data: any }) => {
      const res = await api.patch<ApiResponse<any>>(`/admin/users/${userId}/savings/${goalId}`, data, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user-savings"] });
      toast.success("Meta de ahorro actualizada");
    },
    onError: (error: Error) => toast.error(error.message || "Error al actualizar"),
  });
}

export function useDeleteUserSavingsGoal() {
  const token = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, goalId }: { userId: string; goalId: string }) => {
      const res = await api.delete<ApiResponse<any>>(`/admin/users/${userId}/savings/${goalId}`, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user-savings"] });
      toast.success("Meta de ahorro eliminada");
    },
    onError: (error: Error) => toast.error(error.message || "Error al eliminar"),
  });
}

// ========== USER RECURRING ==========
export function useUserRecurring(userId: string) {
  const token = useAuthToken();
  return useQuery({
    queryKey: ["admin", "user-recurring", userId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<any>>(`/admin/users/${userId}/recurring`, token ?? undefined);
      return res.data;
    },
    enabled: !!token && !!userId,
  });
}

export function useUpdateUserRecurring() {
  const token = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, recurringId, data }: { userId: string; recurringId: string; data: any }) => {
      const res = await api.patch<ApiResponse<any>>(`/admin/users/${userId}/recurring/${recurringId}`, data, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user-recurring"] });
      toast.success("Gasto recurrente actualizado");
    },
    onError: (error: Error) => toast.error(error.message || "Error al actualizar"),
  });
}

export function useDeleteUserRecurring() {
  const token = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, recurringId }: { userId: string; recurringId: string }) => {
      const res = await api.delete<ApiResponse<any>>(`/admin/users/${userId}/recurring/${recurringId}`, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user-recurring"] });
      toast.success("Gasto recurrente eliminado");
    },
    onError: (error: Error) => toast.error(error.message || "Error al eliminar"),
  });
}

// ========== USER FINANCE ==========
export function useUserFinance(userId: string) {
  const token = useAuthToken();
  return useQuery({
    queryKey: queryKeys.admin.userFinance(userId),
    queryFn: async () => {
      const res = await api.get<ApiResponse<any>>(`/admin/users/${userId}/finance`, token ?? undefined);
      return res.data;
    },
    enabled: !!token && !!userId,
  });
}

export function useUpdateUserFinance() {
  const token = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: { monthlySalary?: number; savingsPercentage?: number; inflationAdjustmentPercent?: number; payday?: number } }) => {
      const res = await api.patch<ApiResponse<any>>(`/admin/users/${userId}/finance`, data, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user-finance"] });
      toast.success("Perfil financiero actualizado");
    },
    onError: (error: Error) => toast.error(error.message || "Error al actualizar"),
  });
}

// ========== USER BUDGETS ==========
export function useUserBudgets(userId: string) {
  const token = useAuthToken();
  return useQuery({
    queryKey: ["admin", "user-budgets", userId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<any>>(`/admin/users/${userId}/budgets`, token ?? undefined);
      return res.data;
    },
    enabled: !!token && !!userId,
  });
}

export function useCreateUserBudget() {
  const token = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: { category: string; amount: number; period: string } }) => {
      const res = await api.post<ApiResponse<any>>(`/admin/users/${userId}/budgets`, data, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user-budgets"] });
      toast.success("Presupuesto creado");
    },
    onError: (error: Error) => toast.error(error.message || "Error al crear"),
  });
}

export function useUpdateUserBudget() {
  const token = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, budgetId, data }: { userId: string; budgetId: string; data: any }) => {
      const res = await api.patch<ApiResponse<any>>(`/admin/users/${userId}/budgets/${budgetId}`, data, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user-budgets"] });
      toast.success("Presupuesto actualizado");
    },
    onError: (error: Error) => toast.error(error.message || "Error al actualizar"),
  });
}

export function useDeleteUserBudget() {
  const token = useAuthToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, budgetId }: { userId: string; budgetId: string }) => {
      const res = await api.delete<ApiResponse<any>>(`/admin/users/${userId}/budgets/${budgetId}`, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user-budgets"] });
      toast.success("Presupuesto eliminado");
    },
    onError: (error: Error) => toast.error(error.message || "Error al eliminar"),
  });
}