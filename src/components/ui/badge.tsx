import * as React from "react";
import { cn } from "@/lib/utils";

const base = "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors";
const variantMap = {
  default: "border-transparent bg-secondary text-secondary-foreground",
  outline: "border-border text-muted-foreground",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
} as const;

type Variant = keyof typeof variantMap;

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return <div className={cn(base, variantMap[variant], className)} {...props} />;
}
