"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { formatARS } from "@/lib/format";

interface TimeSeriesPoint {
  date: string;
  amount: number;
  budget: number;
}

interface SpendingTrendChartProps {
  data: TimeSeriesPoint[];
  title?: string;
  className?: string;
}

export function SpendingTrendChart({
  data,
  title = "Tendencia de gastos",
  className,
}: SpendingTrendChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => formatARS(value)}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--card))",
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name="Gastado"
                />
                <Bar
                  dataKey="budget"
                  fill="hsl(var(--muted))"
                  radius={[4, 4, 0, 0]}
                  name="Presupuesto"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            No hay datos de tendencia disponibles
          </div>
        )}
      </CardContent>
    </Card>
  );
}
