import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import type { SavingsGoal, SavingsProjection, CreateSavingsGoalDto, UpdateSavingsGoalDto } from "@/types/savings";
import { useAuthStore } from "@/lib/store/auth";
import { toast } from "@/lib/utils/toast";

export function useSavingsGoals() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.savings.all,
    queryFn: async () => {
      const res = await api.get<ApiResponse<SavingsGoal[]>>(
        "/savings",
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
  });
}

export function useSavingsProjection(monthlySavings: number) {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.savings.projection(monthlySavings),
    queryFn: async () => {
      const res = await api.get<ApiResponse<SavingsProjection>>(
        `/savings/projection?monthly=${monthlySavings}`,
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token && monthlySavings > 0,
  });
}

export function useCreateSavingsGoal() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSavingsGoalDto) => {
      const res = await api.post<ApiResponse<SavingsGoal>>(
        "/savings",
        data,
        token ?? undefined,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savings.all });
      toast.success("Meta de ahorro creada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear la meta de ahorro");
    },
  });
}

export function useUpdateSavingsGoal() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSavingsGoalDto }) => {
      const res = await api.put<ApiResponse<SavingsGoal>>(
        `/savings/${id}`,
        data,
        token ?? undefined,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savings.all });
      toast.success("Meta de ahorro actualizada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar la meta");
    },
  });
}

export function useDeleteSavingsGoal() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<ApiResponse<unknown>>(
        `/savings/${id}`,
        token ?? undefined,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savings.all });
      toast.success("Meta de ahorro eliminada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar la meta");
    },
  });
}
