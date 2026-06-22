"use client"

import { Tag, Clock, Percent, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate, formatCurrency } from "@/lib/utils"
import type { Promotion } from "@/types"

interface PromotionCardProps {
  promotion: Promotion
  onApply?: () => void
  applied?: boolean
}

export function PromotionCard({ promotion, onApply, applied }: PromotionCardProps) {
  const isExpired = new Date(promotion.endDate) < new Date()

  return (
    <div className={cn(
      "relative rounded-xl border p-4 transition-all",
      applied
        ? "border-[#f5a623] bg-[#f5a623]/5"
        : "border-white/10 bg-[#16162a] hover:border-white/20",
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          applied ? "bg-[#f5a623] text-[#0d0d1a]" : "bg-white/5 text-gray-400",
        )}>
          <Tag className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white text-sm truncate">
              {promotion.title}
            </h3>
            <Badge variant={promotion.discountType === "percentage" ? "gold" : "secondary"} className="text-[10px]">
              {promotion.discountType === "percentage" ? (
                <><Percent className="h-3 w-3 mr-0.5" />{promotion.discountValue}%</>
              ) : (
                <><DollarSign className="h-3 w-3 mr-0.5" />{formatCurrency(promotion.discountValue)}</>
              )}
            </Badge>
          </div>
          <p className="text-xs text-gray-400 line-clamp-2 mb-2">
            {promotion.description}
          </p>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-white/5 text-[#f5a623] px-2 py-0.5 rounded font-mono">
              {promotion.code}
            </code>
            {!isExpired && (
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <Clock className="h-3 w-3" />
                Expires {formatDate(promotion.endDate)}
              </div>
            )}
          </div>
          {promotion.minPurchase > 0 && (
            <p className="text-[10px] text-gray-500 mt-1">
              Min. purchase: {formatCurrency(promotion.minPurchase)}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          {isExpired ? (
            <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-400">
              Expired
            </Badge>
          ) : applied ? (
            <Badge variant="gold" className="text-[10px]">
              Applied
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={onApply}
              className="bg-[#f5a623] hover:bg-[#d4921e] text-[#0d0d1a] text-xs h-7"
            >
              Apply
            </Button>
          )}
        </div>
      </div>
      {promotion.usageLimit > 0 && (
        <p className="text-[10px] text-gray-600 mt-2 pl-[52px]">
          *Terms & conditions apply
        </p>
      )}
    </div>
  )
}
