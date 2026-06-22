import { ApiResponse, FoodItem, FoodCategory, FoodOrderItem } from "@/types"
import { foodItems } from "./mock-data"

interface CreateOrderItem {
  itemId: string
  quantity: number
}

function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * ms) + 200))
}

export async function getFoodItems(category?: FoodCategory): Promise<ApiResponse<FoodItem[]>> {
  await delay()
  const items = category ? foodItems.filter((f) => f.category === category && !f.isCombo) : foodItems.filter((f) => !f.isCombo)
  return { success: true, data: items }
}

export async function getCombos(): Promise<ApiResponse<FoodItem[]>> {
  await delay()
  const combos = foodItems.filter((f) => f.isCombo && f.isAvailable)
  return { success: true, data: combos }
}

export async function createOrder(
  items: CreateOrderItem[]
): Promise<ApiResponse<{ items: FoodOrderItem[]; totalAmount: number }>> {
  await delay(400)
  const orderItems: FoodOrderItem[] = items.map((i) => {
    const item = foodItems.find((f) => f.id === i.itemId)!
    return { item, quantity: i.quantity }
  })
  const totalAmount = orderItems.reduce((sum, oi) => sum + oi.item.price * oi.quantity, 0)
  return { success: true, data: { items: orderItems, totalAmount } }
}
