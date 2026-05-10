export interface RecurringExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  period: "daily" | "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  lastGeneratedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
