"use client";

import { Card, CardContent } from "@/components/atoms/card";
import { TrendIcon } from "@/components/atoms/trend-icon";
import { cn } from "@/lib/utils";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Bus,
  ShoppingCart,
  Zap,
  HeartPulse,
  GraduationCap,
  Home,
  Shirt,
  Gamepad2,
  Ellipsis,
  Car,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  wallet: Wallet,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  piggyBank: PiggyBank,
  bus: Bus,
  shoppingCart: ShoppingCart,
  zap: Zap,
  heartPulse: HeartPulse,
  graduationCap: GraduationCap,
  home: Home,
  shirt: Shirt,
  gamepad2: Gamepad2,
  ellipsis: Ellipsis,
  car: Car,
  utensils: ShoppingCart,
};

interface StatCardProps {
  label: string;
  value: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  icon: string;
  className?: string;
}

export function StatCard({ label, value, trend, trendValue, icon, className }: StatCardProps) {
  const IconComponent = iconMap[icon] ?? Wallet;

  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <IconComponent className="h-5 w-5" />
          </div>
        </div>
        {trend && trendValue && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <TrendIcon direction={trend} size={14} />
            <span
              className={cn(
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                trend === "stable" && "text-muted-foreground",
              )}
            >
              {trendValue}
            </span>
            <span className="text-muted-foreground">vs. período anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
