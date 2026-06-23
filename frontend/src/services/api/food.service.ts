import client from "./client"
import type { ApiResponse, FoodItem } from "@/types"

interface FoodOrderData {
  bookingId: string
  items: { itemId: string; quantity: number }[]
}

function mapFoodItem(f: Record<string, unknown>): FoodItem {
  return {
    id: f.id as string,
    name: (f.name as string) || "",
    description: (f.description as string) || "",
    price: (f.price as number) || 0,
    imageUrl: (f.image as string) || (f.imageUrl as string) || "",
    category: (f.category as FoodItem["category"]) || "snacks",
    isAvailable: (f.isAvailable as boolean) ?? true,
    isCombo: (f.isCombo as boolean) || false,
    comboItems: (f.comboItems as string[]) || [],
  }
}

function extractData(responseData: any) {
  return responseData?.data || responseData
}

export async function getFoodItems(
  category?: string,
): Promise<ApiResponse<FoodItem[]>> {
  try {
    const params = category ? { category } : {}
    const { data: responseData } = await client.get("/food/items", { params })
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return { success: true, data: list.map(mapFoodItem) }
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getCombos(): Promise<ApiResponse<FoodItem[]>> {
  try {
    const { data: responseData } = await client.get("/food/items", {
      params: { category: "combo" },
    })
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return { success: true, data: list.map(mapFoodItem) }
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function createOrder(
  data: FoodOrderData,
): Promise<ApiResponse<{ id: string }>> {
  try {
    const { data: responseData } = await client.post("/food/orders", {
      bookingId: data.bookingId,
      items: data.items,
    })
    const d = extractData(responseData)
    return { success: true, data: { id: (d.id as string) || "" } }
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      message: error.response?.data?.message || error.message,
    }
  }
}
