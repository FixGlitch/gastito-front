export type TrendDirection = "up" | "down" | "stable";

export interface StatData {
  label: string;
  value: string;
  trend: TrendDirection;
  trendValue?: string;
  icon: string;
}

export interface AlertItem {
  id: string;
  type: "warning" | "danger" | "info" | "success";
  title: string;
  message: string;
  date: string;
}

export type ChartDataPoint = {
  name: string;
  value: number;
  fill: string;
};

export type TimeSeriesPoint = {
  date: string;
  amount: number;
  budget: number;
};

export type DistributionSlice = {
  category: string;
  value: number;
  color: string;
};

export interface DashboardOverview {
  summary: {
    monthlySalary: number;
    savingsPercentage: number;
    savingsAmount: number;
    disposableAmount: number;
    spentThisMonth: number;
    remainingReal: number;
  };
  recentExpenses: Array<{
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    createdAt: string;
  }>;
  alerts: Array<{
    type: "warning" | "danger" | "info" | "success";
    title: string;
    message: string;
  }>;
  timeSeries: Array<{
    date: string;
    amount: number;
    budget: number;
  }>;
}

export interface MonthlyComparison {
  month: string;
  totalSpent: number;
  budget: number;
  savings: number;
}

export interface TopCategory {
  category: string;
  label: string;
  total: number;
  percentage: number;
  color: string;
}
