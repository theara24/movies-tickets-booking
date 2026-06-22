import { create } from "zustand"
import type { FoodItem, FoodOrderItem } from "@/types"

interface CartState {
  items: FoodOrderItem[]
  isOpen: boolean
}

interface CartActions {
  addItem: (item: FoodItem, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

type CartStore = CartState & CartActions

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item, quantity = 1) => {
    const { items } = get()
    const existingIdx = items.findIndex((oi) => oi.item.id === item.id)
    if (existingIdx > -1) {
      const updated = [...items]
      updated[existingIdx] = {
        ...updated[existingIdx],
        quantity: updated[existingIdx].quantity + quantity,
      }
      set({ items: updated })
    } else {
      set({ items: [...items, { item, quantity }] })
    }
  },

  removeItem: (itemId) => {
    const { items } = get()
    set({ items: items.filter((oi) => oi.item.id !== itemId) })
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId)
      return
    }
    const { items } = get()
    set({
      items: items.map((oi) =>
        oi.item.id === itemId ? { ...oi, quantity } : oi,
      ),
    })
  },

  clearCart: () => set({ items: [], isOpen: false }),

  openCart: () => set({ isOpen: true }),

  closeCart: () => set({ isOpen: false }),

  getTotal: () => {
    return get().items.reduce((sum, oi) => sum + oi.item.price * oi.quantity, 0)
  },

  getItemCount: () => {
    return get().items.reduce((sum, oi) => sum + oi.quantity, 0)
  },
}))
