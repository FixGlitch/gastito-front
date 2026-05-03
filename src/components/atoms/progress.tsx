import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const progressVariants = cva("relative h-2 w-full overflow-hidden rounded-full bg-muted", {
  variants: {
    variant: {
      default: "[&>div]:bg-primary",
      success: "[&>div]:bg-success",
      danger: "[&>div]:bg-destructive",
      warning: "[&>div]:bg-warning",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number;
}

export function Progress({ className, value = 0, variant, ...props }: ProgressProps) {
  return (
    <div className={cn(progressVariants({ variant, className }))} {...props}>
      <div
        className="h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </div>
  );
}
