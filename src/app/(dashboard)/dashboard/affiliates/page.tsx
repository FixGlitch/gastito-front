"use client";

import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/card";
import { buttonVariants } from "@/components/atoms/button";
import { cn } from "@/lib/utils";
import { useMyCashbacks, useCashbackSummary, useMerchants, useSuggestMerchants } from "@/lib/api/hooks/affiliates";
import { formatARS } from "@/lib/format";
import {
  Store,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

export default function AffiliatesPage() {
  const { data: merchants = [] } = useMerchants();
  const { data: cashbacks = [], isLoading: cashLoading } = useMyCashbacks();
  const { data: summary } = useCashbackSummary();
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: suggestions = [] } = useSuggestMerchants(selectedCategory);

  return (
    <DashboardTemplate
      title="Afiliados"
      description="Gana cashback con tus gastos en comercios asociados"
    >
      {summary && (
        <div className="stats-grid mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total ganado</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {formatARS(summary.totalEarned ?? 0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pendiente</CardDescription>
              <CardTitle className="text-2xl">
                {formatARS(summary.pending ?? 0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pagado</CardDescription>
              <CardTitle className="text-2xl">
                {formatARS(summary.paid ?? 0)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mis Cashbacks</CardTitle>
            <CardDescription>
              Historial de cashback generado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cashLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : cashbacks.length > 0 ? (
              <div className="space-y-3">
                {cashbacks.map((cb: any) => (
                  <div key={cb.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{cb.merchantName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(cb.createdAt).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        +{formatARS(cb.commissionEarned)}
                      </p>
                      <p className={`text-xs ${
                        cb.status === "paid" ? "text-green-600" : 
                        cb.status === "approved" ? "text-blue-600" : "text-muted-foreground"
                      }`}>
                        {cb.status === "pending" ? "Pendiente" : 
                         cb.status === "approved" ? "Aprobado" : "Pagado"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No tenés cashbacks ain.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comercios Sugeridos</CardTitle>
            <CardDescription>
              Basado en tus categorías de gasto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría de gasto</label>
              <input
                type="text"
                placeholder="Ej: Alimentos, Transporte"
                className="w-full rounded-md border p-2 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-3">
                {suggestions.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      {m.logoUrl && (
                        <img src={m.logoUrl} alt={m.name} className="h-8 w-8 rounded" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.category} · {m.commissionRate}% comisión
                        </p>
                      </div>
                    </div>
                    <a href={m.affiliateLink} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            {merchants.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Todos los comercios</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {merchants.filter((m: any) => m.isActive).map((m: any) => (
                    <div key={m.id} className="flex items-center gap-2 rounded border p-2">
                      {m.logoUrl && (
                        <img src={m.logoUrl} alt={m.name} className="h-6 w-6 rounded" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.commissionRate}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardTemplate>
  );
}
