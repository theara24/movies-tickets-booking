import client from "./client"
import type { ApiResponse, Promotion } from "@/types"

function mapPromotion(p: Record<string, unknown>): Promotion {
  return {
    id: p.id as string,
    code: (p.code as string) || "",
    title: (p.title as string) || (p.name as string) || "",
    description: (p.description as string) || "",
    discountType: (p.discountType as Promotion["discountType"]) || "percentage",
    discountValue: (p.discountValue as number) || 0,
    minPurchase: (p.minPurchase as number) || 0,
    maxDiscount: (p.maxDiscount as number) || 0,
    startDate: (p.startDate as string) || "",
    endDate: (p.endDate as string) || "",
    usageLimit: (p.usageLimit as number) || 0,
    usageCount: (p.usageCount as number) || 0,
    isActive: (p.isActive as boolean) ?? true,
    applicableMovies: (p.applicableMovies as string[]) || [],
  }
}

function extractData(responseData: any) {
  return responseData?.data || responseData
}

export async function getPromotions(params?: Record<string, unknown>): Promise<ApiResponse<Promotion[]>> {
  try {
    const { data: responseData } = await client.get("/promotions", { params })
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return { success: true, data: list.map(mapPromotion) }
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getPromotion(
  id: string,
): Promise<ApiResponse<Promotion | null>> {
  try {
    const { data: responseData } = await client.get(`/promotions/${id}`)
    const d = extractData(responseData)
    return { success: true, data: mapPromotion(d) }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function createPromotion(
  data: Partial<Promotion>,
): Promise<ApiResponse<Promotion>> {
  try {
    const { data: responseData } = await client.post("/promotions", data)
    const d = extractData(responseData)
    return { success: true, data: mapPromotion(d) }
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function updatePromotion(
  id: string,
  data: Partial<Promotion>,
): Promise<ApiResponse<Promotion>> {
  try {
    const { data: responseData } = await client.patch(
      `/promotions/${id}`,
      data,
    )
    const d = extractData(responseData)
    return { success: true, data: mapPromotion(d) }
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function deletePromotion(
  id: string,
): Promise<ApiResponse<{ message: string }>> {
  try {
    const { data: responseData } = await client.delete(`/promotions/${id}`)
    return {
      success: true,
      data: responseData?.data || responseData || { message: "Deleted" },
    }
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function validatePromotion(
  code: string,
  amount: number,
): Promise<ApiResponse<Promotion & { discountAmount: number; finalAmount: number }>> {
  try {
    const { data: responseData } = await client.get(
      `/promotions/validate/${code}`,
      { params: { amount: String(amount) } },
    )
    const d = extractData(responseData)
    return {
      success: true,
      data: d as any,
    }
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      message: error.response?.data?.message || error.message,
    }
  }
}
