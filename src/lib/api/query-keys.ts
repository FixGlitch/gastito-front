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
    budgets: ["finance", "budgets"] as const,
    budgetComparison: ["finance", "budget-comparison"] as const,
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
  admin: {
    overview: ["admin", "overview"] as const,
    stats: ["admin", "stats"] as const,
    users: ["admin", "users"] as const,
    usersList: (page?: number, limit?: number, search?: string) =>
      ["admin", "users", "list", page, limit, search] as const,
    userDetail: (userId: string) => ["admin", "user", userId] as const,
    userStats: (userId: string) => ["admin", "user-stats", userId] as const,
    all: ["admin", "all"] as const,
    userExpenses: (userId: string, page?: number, limit?: number, month?: string) =>
      ["admin", "user-expenses", userId, page, limit, month] as const,
    userCategories: (userId: string) => ["admin", "user-categories", userId] as const,
    userSavings: (userId: string) => ["admin", "user-savings", userId] as const,
    userFinance: (userId: string) => ["admin", "user-finance", userId] as const,
    userBudgets: (userId: string) => ["admin", "user-budgets", userId] as const,
    userRecurring: (userId: string) => ["admin", "user-recurring", userId] as const,
  },
};
