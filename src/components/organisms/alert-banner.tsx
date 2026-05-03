import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { useState } from "react";

interface AlertBannerProps {
  type: "warning" | "danger" | "info" | "success";
  title: string;
  message: string;
  dismissible?: boolean;
  className?: string;
}

export function AlertBanner({
  type,
  title,
  message,
  dismissible = true,
  className,
}: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const variants = {
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
      border: "border-yellow-200 dark:border-yellow-800",
      icon: AlertTriangle,
      iconColor: "text-yellow-600 dark:text-yellow-400",
      titleColor: "text-yellow-800 dark:text-yellow-300",
      messageColor: "text-yellow-700 dark:text-yellow-400",
    },
    danger: {
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800",
      icon: AlertCircle,
      iconColor: "text-red-600 dark:text-red-400",
      titleColor: "text-red-800 dark:text-red-300",
      messageColor: "text-red-700 dark:text-red-400",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      icon: Info,
      iconColor: "text-blue-600 dark:text-blue-400",
      titleColor: "text-blue-800 dark:text-blue-300",
      messageColor: "text-blue-700 dark:text-blue-400",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
      icon: CheckCircle,
      iconColor: "text-green-600 dark:text-green-400",
      titleColor: "text-green-800 dark:text-green-300",
      messageColor: "text-green-700 dark:text-green-400",
    },
  };

  const variant = variants[type];
  const Icon = variant.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        variant.bg,
        variant.border,
        className,
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", variant.iconColor)} />
      <div className="flex-1 space-y-1">
        <p className={cn("text-sm font-medium", variant.titleColor)}>{title}</p>
        <p className={cn("text-sm", variant.messageColor)}>{message}</p>
      </div>
      {dismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
