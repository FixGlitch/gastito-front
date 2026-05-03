import { Progress } from "@/components/atoms/progress";
import { Card, CardContent } from "@/components/atoms/card";
import { formatARS } from "@/lib/format";
import { cn } from "@/lib/utils";

interface BudgetProgressProps {
  label: string;
  current: number;
  target: number;
  className?: string;
  showAmounts?: boolean;
}

export function BudgetProgress({
  label,
  current,
  target,
  className,
  showAmounts = true,
}: BudgetProgressProps) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const isOverBudget = current > target;

  return (
    <Card className={cn("transition-shadow", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">{label}</p>
          {showAmounts && (
            <p className={cn("text-xs", isOverBudget && "text-destructive")}>
              {formatARS(current)} / {formatARS(target)}
            </p>
          )}
        </div>
        <Progress value={percentage} variant={isOverBudget ? "danger" : "default"} />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {isOverBudget
            ? `Excedido por ${formatABS(current - target)}`
            : `Disponible: ${formatARS(target - current)}`}
        </p>
      </CardContent>
    </Card>
  );
}

function formatABS(value: number): string {
  return formatARS(Math.abs(value));
}
