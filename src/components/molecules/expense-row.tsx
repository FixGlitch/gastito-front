import { StatusBadge } from "@/components/atoms/status-badge";
import { Button } from "@/components/atoms/button";
import { EXPENSE_CATEGORIES } from "@/types/expense";
import type { Expense } from "@/types/expense";
import { formatARS, formatShortDate } from "@/lib/format";
import { Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const DEFAULT_COLOR = "#6B7280";

function getCategoryConfig(categoryName: string) {
  const key = categoryName.toLowerCase() as keyof typeof EXPENSE_CATEGORIES;
  if (EXPENSE_CATEGORIES[key]) {
    return EXPENSE_CATEGORIES[key];
  }
  return {
    key: categoryName,
    label: categoryName,
    icon: "ellipsis",
    color: DEFAULT_COLOR,
    isSube: false,
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
        {category.isSube && (
          <StatusBadge variant="sube" dot={false}>
            SUBE
          </StatusBadge>
        )}
        {!category.isSube && (
          <span className="text-xs font-bold">{category.label.charAt(0)}</span>
        )}
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

      {(onEdit || onDelete) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(expense)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(expense.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
