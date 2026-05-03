export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface SavingsProjection {
  threeMonths: number;
  sixMonths: number;
  twelveMonths: number;
}

export interface CreateSavingsGoalDto {
  name: string;
  targetAmount: number;
  targetDate?: string;
}

export interface UpdateSavingsGoalDto {
  name?: string;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: string;
  isActive?: boolean;
}
