import { z } from "zod";
import { DEFAULT_CATEGORIES } from "@/types/expense";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Ingresá un correo electrónico válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Ingresá un correo electrónico válido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede superar los 100 caracteres"),
});

export const expenseSchema = z.object({
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(100, "La descripción no puede superar los 100 caracteres"),
  amount: z
    .string()
    .min(1, "El monto es obligatorio")
    .refine((val) => {
      const num = parseFloat(val.replace(/\./g, "").replace(",", "."));
      return !isNaN(num) && num > 0;
    }, "Ingresá un monto válido mayor a 0"),
  category: z
    .string()
    .min(1, "Seleccioná una categoría"),
  date: z
    .string()
    .min(1, "La fecha es obligatoria")
    .refine((val) => !isNaN(new Date(val).getTime()), "Ingresá una fecha válida"),
});

export const financeSettingsSchema = z.object({
  monthlySalary: z
    .number()
    .min(0, "El sueldo no puede ser negativo")
    .max(1000000000, "Monto inválido"),
  savingsPercentage: z
    .number()
    .min(0, "El porcentaje no puede ser negativo")
    .max(100, "El porcentaje no puede superar el 100%"),
  inflationRate: z
    .number()
    .min(0, "La tasa no puede ser negativa")
    .max(100, "La tasa no puede superar el 100%"),
  payday: z
    .number()
    .int("Debe ser un día válido")
    .min(1, "El día debe ser entre 1 y 31")
    .max(31, "El día debe ser entre 1 y 31")
    .default(1),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type FinanceSettingsFormData = z.infer<typeof financeSettingsSchema>;

export const forgotPasswordSchema = z.object({
  email: z.
    string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Ingresá un correo electrónico válido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "El token es obligatorio"),
  newPassword: z.
    string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede superar los 100 caracteres"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
