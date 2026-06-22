import { ApiResponse, Promotion, PaginatedResponse } from "@/types"
import { promotions } from "./mock-data"

interface GetPromotionsParams {
  page?: number
  limit?: number
  isActive?: boolean
}

function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * ms) + 200))
}

export async function getPromotions(params?: GetPromotionsParams): Promise<ApiResponse<PaginatedResponse<Promotion>>> {
  await delay()
  let filtered = [...promotions]
  if (params?.isActive !== undefined) {
    filtered = filtered.filter((p) => p.isActive === params.isActive)
  }
  const page = params?.page || 1
  const limit = params?.limit || 10
  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paged = filtered.slice(start, start + limit)
  return {
    success: true,
    data: { data: paged, total, page, limit, totalPages },
  }
}

export async function getPromotion(id: string): Promise<ApiResponse<Promotion | null>> {
  await delay()
  const promo = promotions.find((p) => p.id === id) || null
  return { success: !!promo, data: promo }
}

export async function createPromotion(data: Omit<Promotion, "id" | "usageCount">): Promise<ApiResponse<Promotion>> {
  await delay(400)
  const id = `promo-${String(promotions.length + 1).padStart(3, "0")}`
  const promo: Promotion = { ...data, id, usageCount: 0 }
  promotions.push(promo)
  return { success: true, data: promo }
}

export async function updatePromotion(id: string, data: Partial<Promotion>): Promise<ApiResponse<Promotion>> {
  await delay(300)
  const index = promotions.findIndex((p) => p.id === id)
  if (index === -1) {
    return { success: false, data: null as any, message: "Promotion not found" }
  }
  promotions[index] = { ...promotions[index], ...data }
  return { success: true, data: promotions[index] }
}

export async function deletePromotion(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
  await delay(300)
  const index = promotions.findIndex((p) => p.id === id)
  if (index === -1) {
    return { success: false, data: null as any, message: "Promotion not found" }
  }
  promotions.splice(index, 1)
  return { success: true, data: { deleted: true } }
}

export async function validatePromotion(
  code: string,
  amount: number
): Promise<ApiResponse<{ valid: boolean; discount?: number; promotion?: Promotion }>> {
  await delay()
  const promo = promotions.find((p) => p.code === code && p.isActive)
  if (!promo) {
    return { success: true, data: { valid: false, discount: 0 } }
  }

  const now = new Date()
  const start = new Date(promo.startDate)
  const end = new Date(promo.endDate)
  if (now < start || now > end) {
    return { success: true, data: { valid: false, discount: 0 } }
  }

  if (amount < promo.minPurchase) {
    return { success: true, data: { valid: false, discount: 0 } }
  }

  if (promo.usageLimit > 0 && promo.usageCount >= promo.usageLimit) {
    return { success: true, data: { valid: false, discount: 0 } }
  }

  let discount = promo.discountType === "percentage" ? (amount * promo.discountValue) / 100 : promo.discountValue
  if (promo.maxDiscount > 0) {
    discount = Math.min(discount, promo.maxDiscount)
  }

  return { success: true, data: { valid: true, discount, promotion: promo } }
}
