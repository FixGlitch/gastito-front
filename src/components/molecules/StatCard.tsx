import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  description?: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  variant = 'primary'
}: StatCardProps) {
  const variantClasses = {
    primary: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    secondary: 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600',
    accent: 'bg-accent/10 border-accent/20',
  };

  return (
    <div className={`rounded-xl border p-5 ${variantClasses[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(value)}
          </p>
          {description && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          variant === 'accent' 
            ? 'bg-accent text-white' 
            : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
        }`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-success-600" />
          ) : trend < 0 ? (
            <TrendingDown className="h-4 w-4 text-danger-600" />
          ) : (
            <Minus className="h-4 w-4 text-gray-400" />
          )}
          <span className={`ml-1 text-sm ${
            trend > 0 ? 'text-success-600' : trend < 0 ? 'text-danger-600' : 'text-gray-500'
          }`}>
            {Math.abs(trend)}%
          </span>
        </div>
      )}
    </div>
  );
}
