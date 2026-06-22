"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, ShoppingBag, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency } from "@/lib/utils"
import { useCartStore } from "@/store/cart-store"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, addItem, updateQuantity, getTotal, getItemCount } = useCartStore()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  const total = getTotal()
  const count = getItemCount()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#0d0d1a] border-l border-white/10 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#f5a623]" />
                <h2 className="text-lg font-semibold text-white">
                  Cart{count > 0 && ` (${count})`}
                </h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ScrollArea className="flex-1 p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-600 mb-3" />
                  <p className="text-gray-400 text-sm">Your cart is empty</p>
                  <p className="text-gray-600 text-xs mt-1">Add some snacks and drinks</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((orderItem) => (
                    <div
                      key={orderItem.item.id}
                      className="flex items-center gap-3 bg-[#16162a] rounded-xl p-3"
                    >
                      <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={orderItem.item.imageUrl}
                          alt={orderItem.item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {orderItem.item.name}
                        </p>
                        <p className="text-xs text-[#f5a623] mt-0.5">
                          {formatCurrency(orderItem.item.price * orderItem.quantity)}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(orderItem.item.id, orderItem.quantity - 1)}
                            className="h-6 w-6 p-0 border-white/10 text-white"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm text-white w-4 text-center">
                            {orderItem.quantity}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => addItem(orderItem.item)}
                            className="h-6 w-6 p-0 bg-[#f5a623] hover:bg-[#d4921e] text-[#0d0d1a]"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            {items.length > 0 && (
              <div className="border-t border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-semibold">{formatCurrency(total)}</span>
                </div>
                <Button
                  onClick={onClose}
                  className="w-full bg-[#f5a623] hover:bg-[#d4921e] text-[#0d0d1a] font-semibold"
                >
                  Proceed to Checkout
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
