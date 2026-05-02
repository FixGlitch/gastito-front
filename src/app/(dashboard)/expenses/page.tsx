'use client';

import { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { Button, Text } from '@gluestack-ui/themed';
import { ExpenseTable } from '@components/organisms/ExpenseTable';
import { ExpenseForm } from '@components/organisms/ExpenseForm';
import { useExpenses, useCategories } from '@lib/hooks/useQueryHooks';
import type { Expense } from '@types/index';

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    category: '',
    search: '',
  });
  
  const { data: expenses = [], isLoading } = useExpenses(filters);
  const { data: categories = [] } = useCategories();

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis gastos</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administrá tus gastos personales
          </p>
        </div>
        
        <Button onPress={handleAddNew}>
          <Plus size={20} />
          <Text>Agregar gasto</Text>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por descripción..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          
          <select
            value={filters.month}
            onChange={(e) => setFilters(prev => ({ ...prev, month: parseInt(e.target.value) }))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>
                {new Date(0, month - 1).toLocaleString('es-AR', { month: 'long' })}
              </option>
            ))}
          </select>
          
          <select
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: parseInt(e.target.value) }))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ExpenseTable 
          expenses={expenses}
          categories={categories}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <ExpenseForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
          expense={editingExpense || undefined}
        />
      )}
    </div>
  );
}
