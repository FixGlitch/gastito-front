import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrendDirection } from "@/types/dashboard";

interface TrendIconProps {
  direction: TrendDirection;
  className?: string;
  size?: number;
}

export function TrendIcon({ direction, className, size = 16 }: TrendIconProps) {
  const icons = {
    up: ArrowUpRight,
    down: ArrowDownRight,
    stable: Minus,
  };

  const colors = {
    up: "text-success",
    down: "text-destructive",
    stable: "text-muted-foreground",
  };

  const Icon = icons[direction];

  return <Icon className={cn(colors[direction], className)} size={size} />;
}
