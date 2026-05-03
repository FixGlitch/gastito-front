import { useQuery } from "@tanstack/react-query";
import { api, type ApiResponse } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuthStore } from "@/lib/store/auth";
import type { DashboardOverview, MonthlyComparison, TopCategory } from "@/types/dashboard";

export function useDashboardOverview() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.dashboard.overview,
    queryFn: async () => {
      const res = await api.get<ApiResponse<DashboardOverview>>(
        "/dashboard/overview",
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 3,
  });
}

export function useMonthlyComparison(months: number = 6) {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.dashboard.comparison(months),
    queryFn: async () => {
      const res = await api.get<ApiResponse<MonthlyComparison[]>>(
        `/dashboard/comparison?months=${months}`,
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 10,
  });
}

export function useTopCategories(limit: number = 5) {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.dashboard.topCategories(limit),
    queryFn: async () => {
      const res = await api.get<ApiResponse<TopCategory[]>>(
        `/dashboard/top-categories?limit=${limit}`,
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
}
