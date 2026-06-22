import { ApiResponse, User, Booking, PaginatedResponse } from "@/types"
import { users, bookings } from "./mock-data"

interface GetCustomersParams {
  page?: number
  limit?: number
  search?: string
  tier?: string
}

function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * ms) + 200))
}

export async function getCustomers(
  params?: GetCustomersParams
): Promise<ApiResponse<PaginatedResponse<User>>> {
  await delay()
  let filtered = users.filter((u) => u.role === "customer")
  if (params?.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }
  if (params?.tier) {
    filtered = filtered.filter((u) => u.loyaltyTier === params.tier)
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

export async function getCustomer(id: string): Promise<ApiResponse<User | null>> {
  await delay()
  const user = users.find((u) => u.id === id && u.role === "customer") || null
  return { success: !!user, data: user }
}

export async function getCustomerBookings(id: string): Promise<ApiResponse<Booking[]>> {
  await delay()
  const result = bookings.filter((b) => b.userId === id)
  return { success: true, data: result }
}

export async function getCustomerLoyalty(
  id: string
): Promise<
  ApiResponse<{
    points: number
    tier: string
    pointsToNextTier: number
    totalSpent: number
  } | null>
> {
  await delay()
  const user = users.find((u) => u.id === id && u.role === "customer")
  if (!user) return { success: false, data: null, message: "Customer not found" }

  const thresholds: Record<string, number> = { bronze: 1000, silver: 5000, gold: 15000, platinum: 0 }
  const nextTier = user.loyaltyTier === "bronze" ? "silver" : user.loyaltyTier === "silver" ? "gold" : user.loyaltyTier === "gold" ? "platinum" : null
  const nextThreshold = nextTier ? thresholds[user.loyaltyTier] || 0 : 0
  const pointsToNextTier = nextTier ? Math.max(0, nextThreshold - user.loyaltyPoints) : 0

  const userBookings = bookings.filter((b) => b.userId === id && b.status !== "cancelled")
  const totalSpent = userBookings.reduce((sum, b) => sum + b.totalAmount, 0)

  return {
    success: true,
    data: {
      points: user.loyaltyPoints,
      tier: user.loyaltyTier,
      pointsToNextTier,
      totalSpent,
    },
  }
}
