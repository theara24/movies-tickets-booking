import client from "./client"
import type { ApiResponse } from "@/types"

function extractData(responseData: any) {
  return responseData?.data || responseData
}

export async function getRevenueReport(
  startDate?: string,
  endDate?: string,
): Promise<ApiResponse<any>> {
  try {
    const params: Record<string, string> = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    const { data: responseData } = await client.get("/reports/daily-sales", {
      params,
    })
    return { success: true, data: extractData(responseData) }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getTicketReport(
  startDate?: string,
  endDate?: string,
): Promise<ApiResponse<any>> {
  try {
    const params: Record<string, string> = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    const { data: responseData } = await client.get("/reports/top-movies", {
      params: { ...params, limit: "50" },
    })
    return { success: true, data: extractData(responseData) }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getOccupancyReport(
  startDate?: string,
  endDate?: string,
): Promise<ApiResponse<any>> {
  try {
    const params: Record<string, string> = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    const { data: responseData } = await client.get(
      "/reports/seat-occupancy",
      { params },
    )
    return { success: true, data: extractData(responseData) }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function exportReport(
  type: string,
  format: string,
  startDate?: string,
  endDate?: string,
): Promise<ApiResponse<{ url: string }>> {
  try {
    const params: Record<string, string> = { format }
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    const { data: responseData } = await client.get(
      `/reports/${type}/export`,
      { params, responseType: "blob" },
    )
    return { success: true, data: { url: URL.createObjectURL(responseData as any) } }
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getMonthlyRevenue(
  year?: number,
  month?: number,
): Promise<ApiResponse<any>> {
  try {
    const params: Record<string, string> = {}
    if (year) params.year = String(year)
    if (month) params.month = String(month)
    const { data: responseData } = await client.get(
      "/reports/monthly-revenue",
      { params },
    )
    return { success: true, data: extractData(responseData) }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getTopMovies(
  startDate?: string,
  endDate?: string,
  limit?: number,
): Promise<ApiResponse<any>> {
  try {
    const params: Record<string, string> = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    if (limit) params.limit = String(limit)
    const { data: responseData } = await client.get("/reports/top-movies", {
      params,
    })
    return { success: true, data: extractData(responseData) }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getSeatOccupancy(
  startDate?: string,
  endDate?: string,
): Promise<ApiResponse<any>> {
  try {
    const params: Record<string, string> = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    const { data: responseData } = await client.get(
      "/reports/seat-occupancy",
      { params },
    )
    return { success: true, data: extractData(responseData) }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message,
    }
  }
}
