import { cn } from "@/lib/utils"

type StatusVariant =
  | "active"
  | "inactive"
  | "pending"
  | "cancelled"
  | "completed"
  | "paid"
  | "refunded"
  | "expired"
  | "scheduled"
  | "draft"

interface StatusBadgeProps {
  status: StatusVariant | string
  className?: string
}

const variantStyles: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-border/40",
  pending: "bg-warning/10 text-warning border-warning/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-success/10 text-success border-success/20",
  paid: "bg-success/10 text-success border-success/20",
  refunded: "bg-warning/10 text-warning border-warning/20",
  expired: "bg-muted text-muted-foreground border-border/40",
  scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  draft: "bg-muted text-muted-foreground border-border/40",
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase()
  const styles = variantStyles[normalized] || variantStyles.inactive

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        styles,
        className,
      )}
    >
      {status}
    </span>
  )
}
