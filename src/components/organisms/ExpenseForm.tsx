'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button, Text } from '@gluestack-ui/themed';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateExpense, useUpdateExpense } from '@lib/hooks/useQueryHooks';
import { CurrencyInput } from '@components/atoms/CurrencyInput';
import type { Expense } from '@types/index';

const expenseSchema = z.object({
  description: z.string().min(1, 'La descripción es requerida'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  category: z.string().min(1, 'La categoría es requerida'),
  date: z.string(),
  isRecurring: z.boolean().default(false),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense;
}

const categories = [
  { name: 'Comida', color: '#4F46E5' },
  { name: 'Transporte (SUBE)', color: '#22c55e', isSube: true },
  { name: 'Servicios', color: '#f59e0b' },
  { name: 'Entretenimiento', color: '#ec4899' },
  { name: 'Salud', color: '#ef4444' },
  { name: 'Educación', color: '#3b82f6' },
  { name: 'Compras', color: '#8b5cf6' },
  { name: 'Otros', color: '#6b7280' },
];

export function ExpenseForm({ isOpen, onClose, expense }: ExpenseFormProps) {
  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense ? {
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.split('T')[0],
      isRecurring: expense.isRecurring || false,
    } : {
      description: '',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    if (expense) {
      updateMutation.mutate(
        { id: expense.id, data },
        { onSuccess: onClose }
      );
    } else {
      createMutation.mutate(data, { onSuccess: onClose });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {expense ? 'Editar gasto' : 'Nuevo gasto'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <input
                type="text"
                {...register('description')}
                className={`w-full px-3 py-2 border ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent`}
                placeholder="Ej: Supermercado, Nafta, etc."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Monto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monto
              </label>
              <CurrencyInput
                value={watch('amount')}
                onValueChange={(value) => setValue('amount', value)}
                locale="es-AR"
                currency="ARS"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoría
              </label>
              <select
                {...register('category')}
                className={`w-full px-3 py-2 border ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent`}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha
              </label>
              <input
                type="date"
                {...register('date')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Recurrente */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRecurring"
                {...register('isRecurring')}
                className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
              />
              <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Es un gasto recurrente (mensual)
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onPress={onClose}
                className="flex-1"
              >
                <Text>Cancelar</Text>
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-accent hover:bg-indigo-700"
                isLoading={createMutation.isPending || updateMutation.isPending}
              >
                <Text>{expense ? 'Actualizar' : 'Guardar'}</Text>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
