import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import type { FinanceSummary, FinanceSettings, FinanceProfile, FinanceAlert } from "@/types/finance";
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
    mutationFn: async (data: Partial<FinanceSettings>) => {
      const body: Record<string, unknown> = {};
      if (data.monthlySalary !== undefined) body.monthlySalary = data.monthlySalary;
      if (data.savingsPercentage !== undefined) body.savingsPercentage = data.savingsPercentage;
      if (data.inflationRate !== undefined) body.inflationAdjustmentPercent = data.inflationRate;

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
