import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import type { FinanceSummary, FinanceSettings, FinanceProfile, FinanceAlert, Budget, BudgetComparison, BudgetCategorySetting, InflationAdjustment } from "@/types/finance";
import { useAuthStore } from "@/lib/store/auth";
import { toast } from "@/lib/utils/toast";

export function useFinanceSummary() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.finance.summary,
    queryFn: async () => {
      const res = await api.get<ApiResponse<FinanceSummary>>(
        "/finance/summary",
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFinanceProfile() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.finance.profile,
    queryFn: async () => {
      const res = await api.get<ApiResponse<FinanceProfile>>(
        "/finance/profile",
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
  });
}

export function useUpdateFinanceSettings() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { monthlySalary?: number; savingsPercentage?: number; inflationRate?: number; payday?: number }) => {
      const body: Record<string, unknown> = {};
      if (data.monthlySalary !== undefined) body.monthlySalary = data.monthlySalary;
      if (data.savingsPercentage !== undefined) body.savingsPercentage = data.savingsPercentage;
      if (data.inflationRate !== undefined) body.inflationAdjustmentPercent = data.inflationRate;
      if (data.payday !== undefined) body.payday = data.payday;

      const res = await api.post<ApiResponse<FinanceProfile>>(
        "/finance/configure",
        body,
        token ?? undefined,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.finance.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
      toast.success("Configuración actualizada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar la configuración");
    },
  });
}

export function useFinanceAlerts() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.finance.alerts,
    queryFn: async () => {
      const res = await api.get<ApiResponse<FinanceAlert[]>>(
        "/finance/alerts",
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 2,
  });
}

export function useBudgets() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.finance.budgets,
    queryFn: async () => {
      const res = await api.get<ApiResponse<Budget[]>>(
        "/finance/budgets",
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
  });
}

export function useBudgetComparison() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.finance.budgetComparison,
    queryFn: async () => {
      const res = await api.get<ApiResponse<BudgetComparison[]>>(
        "/finance/budget-comparison",
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
  });
}

export function useCreateBudget() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { period: string; amount: number; category: string }) => {
      const res = await api.post<ApiResponse<Budget>>(
        "/finance/budget",
        data,
        token ?? undefined,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.finance.budgets });
      toast.success("Presupuesto creado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear presupuesto");
    },
  });
}

export function useDeleteBudget() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<ApiResponse<{ message: string }>>(
        `/finance/budget/${id}`,
        token ?? undefined,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.finance.budgets });
      toast.success("Presupuesto eliminado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar presupuesto");
    },
  });
}

export function useUpdateBudget() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { category?: string; amount?: number; period?: string } }) => {
      const res = await api.put<ApiResponse<Budget>>(
        `/finance/budget/${id}`,
        data,
        token ?? undefined,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.finance.budgets });
      toast.success("Presupuesto actualizado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar presupuesto");
    },
  });
}

export function useSendBudgetAlertsEmail() {
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post<ApiResponse<{ message: string }>>(
        "/finance/send-alerts-email",
        {},
        token ?? undefined,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Alertas enviadas por email");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al enviar alertas");
    },
  });
}
