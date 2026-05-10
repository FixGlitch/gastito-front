"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, type ExpenseFormData } from "@/lib/schemas";
import { DEFAULT_CATEGORIES } from "@/types/expense";
import { useCreateExpense } from "@/lib/api/hooks/expenses";
import { useCategories, useCreateCategory } from "@/lib/api/hooks/categories";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/atoms/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/atoms/select";
import { getCurrentMonthISO } from "@/lib/format";
import { useState } from "react";
import { Upload, Loader2, FileText, Plus } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { CategoryResponse } from "@/types/api";

interface CategoryOption {
  key: string;
  label: string;
  icon: string;
  color: string;
}

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExpenseModal({ open, onOpenChange }: AddExpenseModalProps) {
  const createMutation = useCreateExpense();
  const { token } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();

  const {
    register,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: getCurrentMonthISO(),
    },
  });

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const response = await createCategoryMutation.mutateAsync({
        name: newCategoryName.trim(),
        color: "#6B7280",
      });
      const categoryName = response?.data?.name || response?.name || newCategoryName.trim();
      setValue("category", categoryName, { shouldValidate: true });
      setNewCategoryName("");
      setShowNewCategoryInput(false);
    } catch (error: any) {
      console.error("Error creating category:", error);
      alert("Error al crear categoría: " + (error?.message || "Error desconocido"));
    }
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const onSubmit = async (data: ExpenseFormData) => {
    // First create the expense
    createMutation.mutate(data, {
      onSuccess: async (expense) => {
        // If there's a file, upload it
        if (selectedFile && expense?.id) {
          setUploading(true);
          try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/expenses/${expense.id}/receipt`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              }
            );
            
            if (!response.ok) {
              console.error("Failed to upload receipt");
            }
          } catch (error) {
            console.error("Upload error:", error);
          } finally {
            setUploading(false);
          }
        }
        handleClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar nuevo gasto</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              placeholder="Ej: Almuerzo en el centro"
              {...register("description")}
              error={errors.description?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="$ 0,00"
              {...register("amount")}
              error={errors.amount?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <div className="flex gap-2">
              <Select
                value={watch("category")}
                onValueChange={(value) => {
                  if (value && value !== "__create_new__") {
                    setValue("category", value, { shouldValidate: true });
                  }
                }}
              >
                <SelectTrigger id="category" className="flex-1">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DEFAULT_CATEGORIES).map((cat) => (
                    <SelectItem key={cat.key} value={cat.key}>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        {cat.label}
                      </span>
                    </SelectItem>
                  ))}
                  {categories.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        Mis categorías
                      </div>
                      {categories
                        .filter((cat: CategoryResponse) => cat.userId)
                        .map((cat: CategoryResponse) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                              {cat.name}
                            </span>
                          </SelectItem>
                        ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {showNewCategoryInput && (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Nombre de la categoría"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateCategory();
                    }
                  }}
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreateCategory}
                  disabled={createCategoryMutation.isPending || !newCategoryName.trim()}
                >
                  {createCategoryMutation.isPending ? "Creando..." : "Crear"}
                </Button>
              </div>
            )}
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              error={errors.date?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt">Comprobante (opcional)</Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="receipt"
                className="flex h-10 flex-1 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm text-muted-foreground hover:bg-accent"
              >
                {selectedFile ? (
                  <>
                    <FileText className="h-4 w-4" />
                    <span className="truncate">{selectedFile.name}</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Subir comprobante (JPG, PNG, PDF)</span>
                  </>
                )}
              </label>
              <input
                id="receipt"
                type="file"
                accept="image/jpeg,image/png,image/gif,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {(errors as any).receipt && (
              <p className="text-xs text-destructive">{(errors as any).receipt.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending || uploading}
              disabled={createMutation.isPending || uploading}
              onClick={() => onSubmit(watch() as ExpenseFormData)}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                "Registrar gasto"
              )}
            </Button>
          </DialogFooter>
        </form>
       </DialogContent>
    </Dialog>
  );
}
