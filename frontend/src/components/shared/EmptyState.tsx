import type { ReactNode } from "react"
import { Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: ReactNode
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title = "No data found",
  description = "There is nothing to display here yet.",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-4 text-center",
      className,
    )}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
        {icon || <Inbox className="h-8 w-8 text-muted-foreground/50" />}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action}
    </div>
  )
}
