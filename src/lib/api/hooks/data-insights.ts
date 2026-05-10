"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuthStore } from "@/lib/store/auth";
import { toast } from "@/lib/utils/toast";

export function useSponsoredContent() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ["data-insights", "sponsored"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{
        id: string;
        title: string;
        category: string;
        impressions: number;
        clicks: number;
        isActive: boolean;
      }[]>>(
        "/data-insights/sponsored",
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
  });
}

export function useConsumerTrends() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ["data-insights", "trends"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{
        id: string;
        category: string;
        averageSpending: number;
        transactionCount: number;
        growthRate: number;
      }[]>>(
        "/data-insights/trends",
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
  });
}

export function useDataReports() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ["data-insights", "reports"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{
        id: string;
        period: string;
        status: string;
        soldAt: string | null;
      }[]>>(
        "/data-insights/reports",
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
  });
}
