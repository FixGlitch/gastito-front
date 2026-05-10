"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import type { Expense } from "@/types/expense";
import { DEFAULT_CATEGORIES } from "@/types/expense";
import { formatARS, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ChevronsUpDown, Pencil, Trash2 } from "lucide-react";

const DEFAULT_COLOR = "#6B7280";

function getCategoryConfig(categoryName: string) {
  const key = categoryName.toLowerCase();
  if (DEFAULT_CATEGORIES[key]) {
    return DEFAULT_CATEGORIES[key];
  }
  return {
    label: categoryName,
    color: DEFAULT_COLOR,
  };
}

interface ExpenseTableProps {
  data: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

export function ExpenseTable({ data, onEdit, onDelete }: ExpenseTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "description",
      header: "Descripción",
      cell: ({ row }) => {
        const expense = row.original;
        const category = getCategoryConfig(expense.category);
        return (
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white text-xs font-bold"
              style={{ backgroundColor: category.color }}
            >
              {category.label.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium">{expense.description}</p>
              <p className="text-xs text-muted-foreground">
                {category.label}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Monto
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          )}
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-semibold tabular-nums">
          {formatARS(row.getValue("amount"))}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatShortDate(row.getValue("date"))}
        </span>
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(expense)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => onDelete(expense.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b bg-muted/40"
              >
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="h-11 px-4 text-left font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const category = getCategoryConfig(row.original.category);
                return (
                  <tr
                    key={row.id}
                    className="border-b transition-colors hover:bg-muted/40"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="h-14 px-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No hay gastos registrados en este período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
