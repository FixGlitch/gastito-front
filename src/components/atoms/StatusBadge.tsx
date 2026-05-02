import { cn } from '@lib/utils';

export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger' | 'info' | 'sube';
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
    sube: 'badge-sube',
  };

  return (
    <span className={cn('badge', variants[status], className)}>{children}</span>
  );
}
