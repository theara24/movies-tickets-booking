import client from "./client"
import type { ApiResponse, Booking } from "@/types"

interface CreateBookingData {
  showtimeId: string
  userId: string
  seats: { id: string; row: string; col: number }[]
  totalAmount: number
  foodItems?: { itemId: string; quantity: number }[]
  promotionCode?: string
}

function mapBooking(b: Record<string, unknown>): Booking {
  return {
    id: b.id as string,
    userId: (b.userId as string) || "",
    showtimeId: (b.showtimeId as string) || "",
    seats: (b.seats as Booking["seats"]) || [],
    totalAmount: (b.totalAmount as number) || 0,
    status: (b.status as Booking["status"]) || "pending",
    paymentStatus: (b.paymentStatus as Booking["paymentStatus"]) || "pending",
    paymentMethod: (b.paymentMethod as Booking["paymentMethod"]) || null,
    qrCode: (b.qrCode as string) || "",
    createdAt: (b.createdAt as string) || new Date().toISOString(),
    showtime: b.showtime as Booking["showtime"],
    foodItems: (b.foodItems as Booking["foodItems"]) || [],
  }
}

function extractData(responseData: any) {
  return responseData?.data || responseData
}

export async function createBooking(
  data: CreateBookingData,
): Promise<ApiResponse<Booking>> {
  try {
    const payload: Record<string, unknown> = {
      showtimeId: data.showtimeId,
      seatIds: data.seats.map((s) => s.id),
    }
    if (data.promotionCode) {
      payload.promotionCode = data.promotionCode
    }
    const { data: responseData } = await client.post("/bookings", payload)
    const d = extractData(responseData)
    return { success: true, data: mapBooking(d) }
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getBookings(
  userId?: string,
): Promise<ApiResponse<Booking[]>> {
  try {
    const endpoint = userId ? "/bookings/my-bookings" : "/bookings"
    const { data: responseData } = await client.get(endpoint)
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return { success: true, data: list.map(mapBooking) }
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getBooking(
  id: string,
): Promise<ApiResponse<Booking | null>> {
  try {
    const { data: responseData } = await client.get(`/bookings/${id}`)
    const d = extractData(responseData)
    return { success: true, data: mapBooking(d) }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getBookingByReference(
  ref: string,
): Promise<ApiResponse<Booking | null>> {
  try {
    const { data: responseData } = await client.get(`/bookings/ref/${ref}`)
    const d = extractData(responseData)
    return { success: true, data: mapBooking(d) }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function cancelBooking(
  id: string,
): Promise<ApiResponse<{ message: string }>> {
  try {
    const { data: responseData } = await client.delete(`/bookings/${id}`)
    return {
      success: true,
      data: responseData?.data || responseData || { message: "Cancelled" },
    }
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getBookingHistory(
  userId: string,
): Promise<ApiResponse<Booking[]>> {
  try {
    const { data: responseData } = await client.get("/bookings/my-bookings", {
      params: { limit: "50" },
    })
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return { success: true, data: list.map(mapBooking) }
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    }
  }
}
