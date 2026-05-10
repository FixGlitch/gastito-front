export interface CategoryResponse {
  id: string;
  name: string;
  color: string;
  icon: string | null;
  isActive: boolean;
  affiliateLink: string | null;
  userId: string | null;
  createdAt: string;
}

export interface ExpenseResponse {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsGoalResponse {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetResponse {
  id: string;
  category: string;
  amount: number;
  period: "monthly" | "weekly" | "yearly";
  createdAt: string;
  updatedAt: string;
}

export interface RecurringExpenseResponse {
  id: string;
  description: string;
  amount: number;
  category: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  nextDueDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
