"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, type ExpenseFormData as ExpenseFormSchema } from "@/lib/schemas";
import { EXPENSE_CATEGORIES } from "@/types/expense";
import { useCreateExpense } from "@/lib/api/hooks/expenses";
import type { ExpenseCategory } from "@/types/expense";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/atoms/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { getCurrentMonthISO } from "@/lib/format";
import { useState, useEffect } from "react";

interface CategoryOption {
  key: string;
  label: string;
  icon: string;
  color: string;
  isSube?: boolean;
}

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExpenseModal({ open, onOpenChange }: AddExpenseModalProps) {
  const createMutation = useCreateExpense();
  const [categories, setCategories] = useState<CategoryOption[]>(Object.values(EXPENSE_CATEGORIES));

  const {
    register,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: getCurrentMonthISO(),
    },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = (data: ExpenseFormSchema) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar nuevo gasto</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              placeholder="Ej: Almuerzo en el centro"
              {...register("description")}
              error={errors.description?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="$ 0,00"
              {...register("amount")}
              error={errors.amount?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select
              value={watch("category")}
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.key} value={cat.key}>
                    {cat.isSube ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-sube" />
                        {cat.label}
                      </span>
                    ) : (
                      cat.label
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              error={errors.date?.message}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Registrar gasto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
