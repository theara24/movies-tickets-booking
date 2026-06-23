"use client"

import type { ReactNode } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: number
  trendLabel?: string
  prefix?: string
  suffix?: string
  variant?: "default" | "compact"
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  prefix,
  suffix,
  variant = "default",
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0

  if (variant === "compact") {
    return (
      <div className="rounded-lg border border-border/60 bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gold/10 text-gold">
            {icon}
          </div>
        </div>
        <p className="text-xl font-bold text-foreground">
          {prefix}{value}{suffix}
        </p>
        {trend !== undefined && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-success" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            )}
            <span className={isPositive ? "text-success" : "text-destructive"}>
              {isPositive ? "+" : ""}{trend}%
            </span>
            {trendLabel && <span className="text-muted-foreground">{trendLabel}</span>}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      "rounded-xl border border-border/60 bg-card p-5",
      "hover:border-gold/20 transition-colors",
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-foreground">
            {prefix}{value}{suffix}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
          {icon}
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
          <span className={isPositive ? "text-success" : "text-destructive"}>
            {isPositive ? "+" : ""}{trend}%
          </span>
          {trendLabel && <span className="text-muted-foreground ml-1">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}
