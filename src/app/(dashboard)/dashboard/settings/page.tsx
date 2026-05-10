"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { financeSettingsSchema, type FinanceSettingsFormData } from "@/lib/schemas";
import { useFinanceProfile, useUpdateFinanceSettings } from "@/lib/api/hooks/budget";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { AlertBanner } from "@/components/organisms/alert-banner";
import { formatARS } from "@/lib/format";
import { Save, Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function SettingsPage() {
  const { data: settings, isLoading: settingsLoading } = useFinanceProfile();
  const updateMutation = useUpdateFinanceSettings();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FinanceSettingsFormData>({
    resolver: zodResolver(financeSettingsSchema),
    defaultValues: {
      monthlySalary: 0,
      savingsPercentage: 20,
      inflationRate: 0,
      payday: 1,
    },
  });

  useEffect(() => {
    if (settings) {
      setValue("monthlySalary", Number(settings.monthlySalary));
      setValue("savingsPercentage", Number(settings.savingsPercentage));
      setValue("inflationRate", Number(settings.inflationAdjustmentPercent));
      setValue("payday", settings.payday || 1);
    }
  }, [settings, setValue]);

  const monthlySalary = watch("monthlySalary");
  const savingsPercentage = watch("savingsPercentage");
  const savingsAmount = monthlySalary * (savingsPercentage / 100);
  const disposableAmount = monthlySalary - savingsAmount;

  const onSubmit = (data: FinanceSettingsFormData) => {
    updateMutation.mutate({
      monthlySalary: Number(data.monthlySalary),
      savingsPercentage: Number(data.savingsPercentage),
      inflationRate: Number(data.inflationRate),
      payday: Number(data.payday),
    } as any);
  };

  if (settingsLoading) {
    return (
      <DashboardTemplate title="Configuración" description="Cargando...">
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      title="Configuración"
      description="Ajustá tu presupuesto, ahorro y categorías"
    >
      <AlertBanner
        type="info"
        title="Configuración personalizada"
        message="Los cambios se aplican al cálculo de tu presupuesto mensual y alertas."
        className="mb-6"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos y Ahorro</CardTitle>
              <CardDescription>
                Configurá tu sueldo y porcentaje de ahorro mensual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthlySalary">Sueldo mensual neto</Label>
                <Input
                  id="monthlySalary"
                  type="number"
                  placeholder="500000"
                  {...register("monthlySalary", { valueAsNumber: true })}
                  error={errors.monthlySalary?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="savingsPercentage">Porcentaje de ahorro</Label>
                <Input
                  id="savingsPercentage"
                  type="number"
                  placeholder="20"
                  min={0}
                  max={100}
                  {...register("savingsPercentage", { valueAsNumber: true })}
                  error={errors.savingsPercentage?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inflationRate">Tasa de inflación mensual (%)</Label>
                <Input
                  id="inflationRate"
                  type="number"
                  placeholder="4.2"
                  step={0.1}
                  {...register("inflationRate", { valueAsNumber: true })}
                  error={errors.inflationRate?.message}
                />
                <p className="text-xs text-muted-foreground">
                  Usado para ajustar automáticamente tu presupuesto
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payday">Día de cobro</Label>
                <Input
                  id="payday"
                  type="number"
                  min={1}
                  max={31}
                  placeholder="15"
                  {...register("payday", { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Elegí el día del mes en que cobrás tu sueldo (1-31)
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ahorro mensual:</span>
                  <span className="font-medium text-success">
                    {formatARS(savingsAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Disponible para gastos:</span>
                  <span className="font-medium">{formatARS(disposableAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorías de gastos</CardTitle>
              <CardDescription>
                Las categorías son dinámicas. Podés usar cualquier nombre al registrar un gasto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Al registrar un gasto, simplemente escribí el nombre de la categoría.
                Ejemplos: "Alimentos", "Transporte", "Servicios", "Ocio", "Varios", etc.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" size="lg" loading={updateMutation.isPending || isSubmitting}>
            <Save className="h-4 w-4" />
            Guardar configuración
          </Button>
        </div>
      </form>
    </DashboardTemplate>
  );
}
