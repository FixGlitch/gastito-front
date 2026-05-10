"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuthStore } from "@/lib/store/auth";
import { toast } from "@/lib/utils/toast";
import type { RecurringExpense } from "@/types/recurring-expense";

export function useRecurringExpenses(isAdmin: boolean = false) {
  const { token } = useAuthStore();
  
  return useQuery({
    queryKey: ["recurring-expenses", "list", isAdmin],
    queryFn: async () => {
      const res = await api.get<ApiResponse<RecurringExpense[]>>(
        `/recurring-expenses${isAdmin ? "?admin=true" : ""}`,
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
  });
}

export function useCreateRecurringExpense() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      description: string;
      amount: number;
      category: string;
      period: string;
      startDate: string;
    }) => {
      const res = await api.post<ApiResponse<RecurringExpense>>(
        "/recurring-expenses",
        data,
        token ?? undefined,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses", "list"] });
      toast.success("Gasto recurrente creado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear");
    },
  });
}

export function useUpdateRecurringExpense() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  
  return useMutation({
    mutationFn: async ({ id, ...data }: {
      id: string;
      description?: string;
      amount?: number;
      category?: string;
      isActive?: boolean;
    }) => {
      const res = await api.patch<ApiResponse<RecurringExpense>>(
        `/recurring-expenses/${id}${isAdmin ? "?isAdmin=true" : ""}`,
        data,
        token ?? undefined,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses", "list"] });
      toast.success("Gasto actualizado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar");
    },
  });
}

export function useDeleteRecurringExpense() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<ApiResponse<{ message: string }>>(
        `/recurring-expenses/${id}${isAdmin ? "?isAdmin=true" : ""}`,
        token ?? undefined,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses", "list"] });
      toast.success("Gasto eliminado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar");
    },
  });
}

export function useRecurringStats() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ["recurring-expenses", "stats"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{
        total: number;
        active: number;
        monthlyAmount: number;
      }>>(
        "/recurring-expenses/stats",
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
  });
}
