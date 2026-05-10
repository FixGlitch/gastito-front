export type ExpenseCategory = string;

export interface CategoryConfig {
  key: string;
  label: string;
  icon: string;
  color: string;
}

export const DEFAULT_CATEGORIES: Record<string, CategoryConfig> = {
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
  suscripciones: {
    key: "suscripciones",
    label: "Suscripciones",
    icon: "bus",
    color: "#2563EB",
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
  ocio: {
    key: "ocio",
    label: "Ocio",
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
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}
