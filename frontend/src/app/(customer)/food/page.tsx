"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  UtensilsCrossed,
  Popcorn,
  GlassWater,
  Candy,
  Pizza,
  Soup,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { getFoodItems, getCombos } from "@/services/api/food.service"
import { useCartStore } from "@/store/cart-store"
import { formatCurrency } from "@/lib/utils"
import type { FoodCategory, FoodItem } from "@/types"

const CATEGORIES: { value: FoodCategory | "all"; label: string; icon: typeof Popcorn }[] = [
  { value: "all", label: "All", icon: Sparkles },
  { value: "combo", label: "Combos", icon: Sparkles },
  { value: "popcorn", label: "Popcorn", icon: Popcorn },
  { value: "drinks", label: "Drinks", icon: GlassWater },
  { value: "snacks", label: "Snacks", icon: Pizza },
  { value: "candy", label: "Candy", icon: Candy },
  { value: "hot_food", label: "Hot Food", icon: Soup },
]

function FoodCard({ item }: { item: FoodItem }) {
  const { addItem, items, updateQuantity } = useCartStore()
  const cartItem = items.find((oi) => oi.item.id === item.id)
  const quantity = cartItem?.quantity ?? 0

  return (
    <Card className="bg-cinema-surface/50 border-border/40 overflow-hidden hover:border-gold/30 transition-all group">
      <CardContent className="p-0">
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight line-clamp-1">{item.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
              {item.isCombo && (
                <Badge variant="gold" className="mt-1 text-[9px]">
                  Combo
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-bold text-gold">{formatCurrency(item.price)}</span>
            {quantity > 0 ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-muted hover:bg-gold/20 transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-sm font-medium w-5 text-center">{quantity}</span>
                <button
                  onClick={() => addItem(item, 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-gold text-cinema-dark hover:bg-gold-light transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addItem(item, 1)}
                className="flex items-center gap-1 rounded-md bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold hover:bg-gold/20 transition-colors"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-cinema-dark border-l border-border/40 shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-gold" />
                  <h2 className="font-semibold">Your Order</h2>
                  <Badge variant="gold" className="ml-1 text-[10px]">
                    {getItemCount()}
                  </Badge>
                </div>
                <button onClick={closeCart} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                    <ShoppingCart className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm">Your cart is empty</p>
                  </div>
                ) : (
                  items.map((oi) => (
                    <div key={oi.item.id} className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{oi.item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(oi.item.price)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(oi.item.id, oi.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded bg-muted hover:bg-muted/80"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-5 text-center">{oi.quantity}</span>
                        <button
                          onClick={() => updateQuantity(oi.item.id, oi.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded bg-gold text-cinema-dark hover:bg-gold-light"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-medium w-20 text-right">
                        {formatCurrency(oi.item.price * oi.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(oi.item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-border/40 p-5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-lg font-bold text-gold">{formatCurrency(getTotal())}</span>
                  </div>
                  <Button className="w-full bg-gold text-cinema-dark hover:bg-gold-light font-semibold">
                    Proceed to Checkout
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function FoodPage() {
  const [category, setCategory] = useState<FoodCategory | "all">("all")
  const { getItemCount, openCart } = useCartStore()

  const { data: foodData, isLoading } = useQuery({
    queryKey: ["food", category],
    queryFn: () => getFoodItems(category === "all" || category === "combo" ? undefined : category),
  })

  const { data: combosData } = useQuery({
    queryKey: ["food", "combos"],
    queryFn: () => getCombos(),
  })

  const items = foodData?.data ?? []
  const combos = combosData?.data ?? []
  const isComboTab = category === "combo"
  const displayItems = isComboTab ? combos : items

  return (
    <div className="container py-6 md:py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Food & Beverage</h1>
          <p className="text-sm text-muted-foreground">Enhance your movie experience</p>
        </div>
        <button
          onClick={openCart}
          className="relative flex items-center gap-2 rounded-lg bg-gold/10 px-4 py-2 text-sm font-medium text-gold hover:bg-gold/20 transition-colors"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="hidden sm:inline">Cart</span>
          {getItemCount() > 0 && (
            <Badge variant="gold" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
              {getItemCount()}
            </Badge>
          )}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isActive = category === cat.value
          return (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-gold text-cinema-dark"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.label}
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : displayItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <UtensilsCrossed className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium">No items available</p>
          <p className="text-sm text-muted-foreground">Check back later for new additions</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!isComboTab && combos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <h2 className="text-xl font-bold tracking-tight">Combo Packages</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {combos.map((combo) => (
              <FoodCard key={combo.id} item={combo} />
            ))}
          </div>
        </section>
      )}

      <CartDrawer />
    </div>
  )
}
