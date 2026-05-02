'use client';

import { Edit, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@lib/utils';
import type { Expense, Category } from '@types/index';

interface ExpenseTableProps {
  expenses: Expense[];
  categories: Category[];
  isLoading: boolean;
  onEdit: (expense: Expense) => void;
}

export function ExpenseTable({ expenses, categories, isLoading, onEdit }: ExpenseTableProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Cargando gastos...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No hay gastos registrados para este período</p>
      </div>
    );
  }

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#6b7280';
  };

  const isSubeCategory = (categoryName: string) => {
    return categoryName.toLowerCase().includes('sube') || 
           categoryName.toLowerCase() === 'transporte';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Categoría
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Monto
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {formatDate(new Date(expense.date))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {expense.description}
                  </span>
                  {expense.isRecurring && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full">
                      Recurrente
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: getCategoryColor(expense.category) }}
                  />
                  <span className={`text-sm ${
                    isSubeCategory(expense.category) 
                      ? 'font-semibold text-green-600 dark:text-green-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {expense.category}
                    {isSubeCategory(expense.category) && (
                      <span className="ml-1 text-xs">(SUBE)</span>
                    )}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(expense.amount)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-gray-400 hover:text-accent transition-colors"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="text-gray-400 hover:text-danger-600 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
