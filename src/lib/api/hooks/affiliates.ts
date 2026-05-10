"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuthStore } from "@/lib/store/auth";
import { toast } from "@/lib/utils/toast";

export function useMerchants() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ["affiliates", "merchants"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{
        id: string;
        name: string;
        category: string;
        commissionRate: number;
        logoUrl: string;
        isActive: boolean;
      }[]>>(
        "/affiliates/merchants",
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
  });
}

export function useMyCashbacks() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ["affiliates", "my-cashback"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{
        id: string;
        merchantName: string;
        amount: number;
        commissionEarned: number;
        status: string;
        createdAt: string;
      }[]>>(
        "/affiliates/cashback/my",
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
  });
}

export function useCashbackSummary() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ["affiliates", "cashback-summary"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{
        totalEarned: number;
        pending: number;
        paid: number;
      }>>(
        "/affiliates/cashback/summary",
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token,
  });
}

export function useSuggestMerchants(expenseCategory: string) {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ["affiliates", "suggest", expenseCategory],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{
        id: string;
        name: string;
        commissionRate: number;
      }[]>>(
        `/affiliates/merchants/suggest/${expenseCategory}`,
        token ?? undefined,
      );
      return res.data;
    },
    enabled: !!token && !!expenseCategory,
  });
}
