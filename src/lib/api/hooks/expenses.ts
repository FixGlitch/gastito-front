import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import type { Expense, ExpenseFormData, ExpenseFilters } from "@/types/expense";
import { useAuthStore } from "@/lib/store/auth";
import { toast } from "@/lib/utils/toast";

interface ExpenseSummaryResponse {
  total: number;
  byCategory: Record<string, number>;
  count: number;
  categoryDetails: Array<{
    category: string;
    label: string;
    total: number;
    count: number;
    percentage: number;
    color: string;
  }>;
}

export function useExpenses(filters?: ExpenseFilters) {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.expenses.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.category) params.set("category", filters.category);
      if (filters?.month) params.set("month", filters.month);
      if (filters?.search) params.set("search", filters.search);
      const query = params.toString();
      const res = await api.get<ApiResponse<Expense[]>>(
        `/expenses${query ? `?${query}` : ""}`,
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
  });
}

export function useExpenseSummary(month?: string) {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.expenses.summary(month),
    queryFn: async () => {
      const res = await api.get<ApiResponse<ExpenseSummaryResponse>>(
        `/expenses/summary${month ? `?month=${month}` : ""}`,
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
  });
}

export function useCreateExpense() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      const body = {
        description: data.description,
        amount: parseFloat(data.amount.replace(/\./g, "").replace(",", ".")),
        category: data.category,
        date: data.date,
      };
      const res = await api.post<ApiResponse<Expense>>("/expenses", body, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.finance.budgets });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
      toast.success("Gasto registrado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al registrar el gasto");
    },
  });
}

export function useUpdateExpense() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ExpenseFormData> }) => {
      const body: Record<string, unknown> = {};
      if (data.description) body.description = data.description;
      if (data.amount) body.amount = parseFloat(data.amount.replace(/\./g, "").replace(",", "."));
      if (data.category) body.category = data.category;
      if (data.date) body.date = data.date;
      const res = await api.put<ApiResponse<Expense>>(`/expenses/${id}`, body, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.finance.budgets });
      toast.success("Gasto actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el gasto");
    },
  });
}

export function useDeleteExpense() {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<ApiResponse<unknown>>(`/expenses/${id}`, token ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.finance.budgets });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
      toast.success("Gasto eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el gasto");
    },
  });
}
