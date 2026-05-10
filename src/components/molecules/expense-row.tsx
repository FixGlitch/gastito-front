import { Button } from "@/components/atoms/button";
import { DEFAULT_CATEGORIES } from "@/types/expense";
import type { Expense } from "@/types/expense";
import { formatARS, formatShortDate } from "@/lib/format";
import { Pencil, Trash2 } from "lucide-react";

const DEFAULT_COLOR = "#6B7280";

function getCategoryConfig(categoryName: string) {
  const key = categoryName.toLowerCase();
  if (DEFAULT_CATEGORIES[key]) {
    return DEFAULT_CATEGORIES[key];
  }
  return {
    key: categoryName,
    label: categoryName,
    icon: "ellipsis",
    color: DEFAULT_COLOR,
  };
}

interface ExpenseRowProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

export function ExpenseRow({ expense, onEdit, onDelete }: ExpenseRowProps) {
  const category = getCategoryConfig(expense.category);

  return (
    <div className="group flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/40">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
        style={{ backgroundColor: category.color }}
      >
        <span className="text-xs font-bold">{category.label.charAt(0).toUpperCase()}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{expense.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{category.label}</span>
          <span>·</span>
          <span>{formatShortDate(expense.date)}</span>
        </div>
      </div>

      <p className="shrink-0 font-semibold tabular-nums">{formatARS(expense.amount)}</p>

      <div className="flex items-center gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(expense)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600"
              onClick={() => onDelete(expense.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
    </div>
  );
}
