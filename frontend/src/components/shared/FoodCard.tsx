"use client"

import Image from "next/image"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatCurrency, truncate } from "@/lib/utils"
import { useCartStore } from "@/store/cart-store"
import type { FoodItem } from "@/types"

interface FoodCardProps {
  item: FoodItem
}

const categoryColors: Record<string, string> = {
  popcorn: "bg-yellow-500/20 text-yellow-400",
  drinks: "bg-blue-500/20 text-blue-400",
  snacks: "bg-green-500/20 text-green-400",
  combo: "bg-purple-500/20 text-purple-400",
  candy: "bg-pink-500/20 text-pink-400",
  hot_food: "bg-orange-500/20 text-orange-400",
}

export function FoodCard({ item }: FoodCardProps) {
  const { items, addItem, updateQuantity } = useCartStore()
  const cartItem = items.find((i) => i.item.id === item.id)
  const quantity = cartItem?.quantity || 0

  if (!item.isAvailable) return null

  return (
    <div className="rounded-xl border border-white/10 bg-[#16162a] overflow-hidden hover:border-white/20 transition-colors">
      <div className="relative aspect-[4/3]">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 200px"
        />
        <div className="absolute top-2 left-2">
          <Badge className={cn("text-[10px] font-medium", categoryColors[item.category])}>
            {item.category.replace("_", " ")}
          </Badge>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 min-h-[2rem]">
          {truncate(item.description, 60)}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#f5a623]">
            {formatCurrency(item.price)}
          </span>
          {quantity === 0 ? (
            <Button
              size="sm"
              onClick={() => addItem(item)}
              className="h-8 w-8 p-0 bg-[#f5a623] hover:bg-[#d4921e] text-[#0d0d1a]"
            >
              <Plus className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="h-8 w-8 p-0 border-white/10 text-white"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium text-white w-5 text-center">
                {quantity}
              </span>
              <Button
                size="sm"
                onClick={() => addItem(item)}
                className="h-8 w-8 p-0 bg-[#f5a623] hover:bg-[#d4921e] text-[#0d0d1a]"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
