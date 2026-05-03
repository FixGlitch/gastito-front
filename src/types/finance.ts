export interface FinanceProfile {
  id: string;
  monthlySalary: number;
  savingsPercentage: number;
  inflationAdjustmentPercent: number;
  quincenaDay: 1 | 15;
  lastInflationApplied: number | null;
  lastInflationAppliedDate: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface FinanceAlert {
  type: "warning" | "danger" | "info" | "success";
  title: string;
  message: string;
}

export interface FinanceSummary {
  monthlySalary: number;
  savingsPercentage: number;
  savingsAmount: number;
  disposableAmount: number;
  spentThisMonth: number;
  remainingReal: number;
}

export interface FinanceSettings {
  monthlySalary: number;
  savingsPercentage: number;
  inflationRate: number;
  quincenaDay: 1 | 15;
}

export interface BudgetCategorySetting {
  category: string;
  percentage: number;
  enabled: boolean;
}

export interface InflationAdjustment {
  month: string;
  rate: number;
  adjustedBudget: number;
}
