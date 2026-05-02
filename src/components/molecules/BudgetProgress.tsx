import { formatCurrency } from '@lib/utils';

interface BudgetProgressProps {
  spent: number;
  total: number;
  showPercentage?: boolean;
}

export function BudgetProgress({ spent, total, showPercentage = false }: BudgetProgressProps) {
  const percentage = Math.min((spent / total) * 100, 100);
  const remaining = total - spent;
  const isOverBudget = spent > total;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {isOverBudget ? 'Presupuesto excedido' : 'Restante'}
        </span>
        <span className={`text-sm font-medium ${
          isOverBudget ? 'text-danger-600' : 'text-success-600'
        }`}>
          {formatCurrency(Math.abs(remaining))}
        </span>
      </div>

      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
            isOverBudget
              ? 'bg-danger-500'
              : percentage > 80
              ? 'bg-yellow-500'
              : 'bg-accent'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>{formatCurrency(spent)} gastados</span>
        {showPercentage && (
          <span className="font-medium">{percentage.toFixed(1)}%</span>
        )}
        <span>{formatCurrency(total)} total</span>
      </div>
    </div>
  );
}
