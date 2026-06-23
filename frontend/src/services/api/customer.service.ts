import client from "./client"
import type { ApiResponse, User, Booking } from "@/types"

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

function mapUser(u: Record<string, unknown>): User {
  return {
    id: u.id as string,
    email: u.email as string,
    name: (u.fullName as string) || (u.name as string) || "",
    phone: (u.phone as string) || "",
    avatar: (u.avatar as string) || null,
    role: ((u.role as string)?.toLowerCase() as User["role"]) || "customer",
    loyaltyPoints: (u.loyaltyPoints as number) || 0,
    loyaltyTier: (u.loyaltyTier as User["loyaltyTier"]) || "bronze",
    createdAt: (u.createdAt as string) || new Date().toISOString(),
  }
}

function extractData(responseData: any) {
  return responseData?.data || responseData
}

export async function getCustomers(params?: Record<string, unknown>): Promise<ApiResponse<User[]>> {
  try {
    const { data: responseData } = await client.get("/users", {
      params: { ...params, limit: params?.limit ?? 100 },
    })
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return { success: true, data: list.map(mapUser) }
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getCustomer(
  id: string,
): Promise<ApiResponse<User | null>> {
  try {
    const { data: responseData } = await client.get(`/users/${id}`)
    const d = extractData(responseData)
    return { success: true, data: mapUser(d) }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getCustomerBookings(
  id: string,
): Promise<ApiResponse<Booking[]>> {
  try {
    const { data: responseData } = await client.get("/bookings", {
      params: { userId: id, limit: "50" },
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

export async function getCustomerLoyalty(
  id: string,
): Promise<
  ApiResponse<{
    points: number
    tier: string
    pointsToNextTier: number
    totalSpent: number
  }>
> {
  try {
    const { data: responseData } = await client.get(`/users/${id}`)
    const d = extractData(responseData)
    return {
      success: true,
      data: {
        points: (d.loyaltyPoints as number) || 0,
        tier: (d.loyaltyTier as string) || "bronze",
        pointsToNextTier: (d.pointsToNextTier as number) || 0,
        totalSpent: (d.totalSpent as number) || 0,
      },
    }
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      message: error.response?.data?.message || error.message,
    }
  }
}
