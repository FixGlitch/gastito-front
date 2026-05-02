import { cn, formatCurrencyARS } from '@lib/utils';

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  error?: string;
  placeholder?: string;
}

export function CurrencyInput({
  value,
  onChange,
  label,
  error,
  placeholder = '$ 0,00',
  className,
  ...props
}: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9,-]/g, '').replace(',', '.');
    const parsedValue = parseFloat(rawValue);
    onChange(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const displayValue = value > 0 ? formatCurrencyARS(value).replace('$', '').trim() : '';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          $
        </span>
        <input
          type="text"
          inputMode="decimal"
          className={cn(
            'w-full pl-8 pr-4 py-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200',
            error
              ? 'border-danger-500 focus:ring-danger-500'
              : 'border-gray-300 dark:border-gray-600',
            className
          )}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{error}</p>
      )}
    </div>
  );
}
