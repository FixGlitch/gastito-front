import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface AlertBannerProps {
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  onDismiss?: () => void;
}

const alertStyles = {
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    titleColor: 'text-yellow-800 dark:text-yellow-300',
    textColor: 'text-yellow-700 dark:text-yellow-400',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: AlertCircle,
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-800 dark:text-red-300',
    textColor: 'text-red-700 dark:text-red-400',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-800 dark:text-blue-300',
    textColor: 'text-blue-700 dark:text-blue-400',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-600 dark:text-green-400',
    titleColor: 'text-green-800 dark:text-green-300',
    textColor: 'text-green-700 dark:text-green-400',
  },
};

export function AlertBanner({ type, title, message, onDismiss }: AlertBannerProps) {
  const style = alertStyles[type];
  const Icon = style.icon;

  return (
    <div className={`rounded-xl border p-4 ${style.bg} ${style.border}`}>
      <div className="flex items-start">
        <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${style.iconColor}`} />
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${style.titleColor}`}>{title}</h3>
          <p className={`mt-1 text-sm ${style.textColor}`}>{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`ml-3 inline-flex rounded-md p-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type}-500`}
          >
            <span className="sr-only">Cerrar</span>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 12 12">
              <path d="M10.293 1.707a1 1 0 00-1.414 0L6 4.586 3.121 1.707a1 1 0 00-1.414 1.414L4.586 6 1.707 8.879a1 1 0 101.414 1.414L6 7.414l2.879 2.879a1 1 0 001.414-1.414L7.414 6l2.879-2.879a1 1 0 000-1.414z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
