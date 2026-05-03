import type { ExpenseFilters } from "@/types/expense";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
    updateProfile: ["auth", "updateProfile"] as const,
    changePassword: ["auth", "changePassword"] as const,
  },
  expenses: {
    all: ["expenses"] as const,
    list: (filters?: ExpenseFilters) =>
      ["expenses", "list", filters] as const,
    detail: (id: string) => ["expenses", "detail", id] as const,
    summary: (month?: string) => ["expenses", "summary", month] as const,
  },
  finance: {
    all: ["finance"] as const,
    profile: ["finance", "profile"] as const,
    configure: ["finance", "configure"] as const,
    summary: ["finance", "summary"] as const,
    alerts: ["finance", "alerts"] as const,
  },
  dashboard: {
    overview: ["dashboard", "overview"] as const,
    comparison: (months: number) => ["dashboard", "comparison", months] as const,
    topCategories: (limit: number) => ["dashboard", "top-categories", limit] as const,
  },
  savings: {
    all: ["savings"] as const,
    detail: (id: string) => ["savings", "detail", id] as const,
    projection: (monthly: number) => ["savings", "projection", monthly] as const,
  },
};
