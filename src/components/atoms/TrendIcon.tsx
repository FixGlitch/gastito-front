import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@lib/utils';

export interface TrendIconProps {
  trend: number;
  className?: string;
}

export function TrendIcon({ trend, className }: TrendIconProps) {
  if (trend > 0) {
    return (
      <TrendingUp
        className={cn('h-4 w-4 text-success-600', className)}
        aria-label="Tendencia positiva"
      />
    );
  }
  if (trend < 0) {
    return (
      <TrendingDown
        className={cn('h-4 w-4 text-danger-600', className)}
        aria-label="Tendencia negativa"
      />
    );
  }
  return (
    <Minus
      className={cn('h-4 w-4 text-gray-400', className)}
      aria-label="Sin cambios"
    />
  );
}
