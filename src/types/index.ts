export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory = 
  | 'comida'
  | 'transporte'
  | 'servicios'
  | 'entretenimiento'
  | 'salud'
  | 'educacion'
  | 'compras'
  | 'sube'
  | 'otros';

export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  budgetLimit?: number;
}

export interface Budget {
  id: string;
  category: ExpenseCategory;
  limit: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
}

export interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  dailyBudget: number;
  weeklyBudget: number;
  savingsGoal: number;
  savingsProgress: number;
  topCategories: { category: ExpenseCategory; amount: number; percentage: number }[];
  recentExpenses: Expense[];
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Settings {
  id: string;
  monthlySalary: number;
  savingsPercentage: number;
  inflationRate: number;
  currency: 'ARS';
  categories: CategoryConfig[];
  budgetLimits: Record<ExpenseCategory, number>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
