export type ExpenseCategory =
  | "alimentos"
  | "transporte"
  | "sube"
  | "servicios"
  | "entretenimiento"
  | "salud"
  | "educacion"
  | "hogar"
  | "ropa"
  | "otros";

export interface CategoryConfig {
  key: string;
  label: string;
  icon: string;
  color: string;
  isSube?: boolean;
}

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, CategoryConfig> = {
  alimentos: {
    key: "alimentos",
    label: "Alimentos",
    icon: "utensils",
    color: "#F59E0B",
  },
  transporte: {
    key: "transporte",
    label: "Transporte",
    icon: "car",
    color: "#8B5CF6",
  },
  sube: {
    key: "sube",
    label: "SUBE",
    icon: "bus",
    color: "#2563EB",
    isSube: true,
  },
  servicios: {
    key: "servicios",
    label: "Servicios",
    icon: "zap",
    color: "#EF4444",
  },
  entretenimiento: {
    key: "entretenimiento",
    label: "Entretenimiento",
    icon: "gamepad-2",
    color: "#EC4899",
  },
  salud: {
    key: "salud",
    label: "Salud",
    icon: "heart-pulse",
    color: "#16A34A",
  },
  educacion: {
    key: "educacion",
    label: "Educación",
    icon: "graduation-cap",
    color: "#0EA5E9",
  },
  hogar: {
    key: "hogar",
    label: "Hogar",
    icon: "home",
    color: "#78716C",
  },
  ropa: {
    key: "ropa",
    label: "Ropa",
    icon: "shirt",
    color: "#A855F7",
  },
  otros: {
    key: "otros",
    label: "Otros",
    icon: "ellipsis",
    color: "#6B7280",
  },
};

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  description: string;
  amount: string;
  category: string;
  date: string;
}

export interface ExpenseFilters {
  category?: string;
  month?: string;
  search?: string;
}
