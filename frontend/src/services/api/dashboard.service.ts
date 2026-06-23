import client from "./client"
import type { ApiResponse, DashboardStats, RevenueData, TicketSalesData, OccupancyData } from "@/types"

function extractData(responseData: any) {
  return responseData?.data || responseData
}

type Period = "7d" | "30d" | "90d" | "1y"

export async function getStats(): Promise<ApiResponse<DashboardStats>> {
  try {
    const { data: responseData } = await client.get("/reports/dashboard")
    const d = extractData(responseData)
    return {
      success: true,
      data: {
        totalRevenue: (d.totalRevenue as number) || 0,
        totalTickets: (d.totalTickets as number) || 0,
        totalCustomers: (d.totalCustomers as number) || 0,
        occupancyRate: (d.occupancyRate as number) || 0,
        revenueGrowth: (d.revenueGrowth as number) || 0,
        ticketsGrowth: (d.ticketsGrowth as number) || 0,
        customersGrowth: (d.customersGrowth as number) || 0,
        occupancyGrowth: (d.occupancyGrowth as number) || 0,
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

export async function getRevenueChart(
  period: Period = "30d",
): Promise<ApiResponse<RevenueData[]>> {
  try {
    const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365
    const { data: responseData } = await client.get("/reports/daily-sales", {
      params: { limit: String(days) },
    })
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return {
      success: true,
      data: list.map((item: any) => ({
        date: (item.date as string) || "",
        revenue: (item.revenue as number) || 0,
        tickets: (item.tickets as number) || 0,
      })),
    }
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getTicketSales(): Promise<ApiResponse<TicketSalesData[]>> {
  try {
    const { data: responseData } = await client.get("/reports/top-movies", {
      params: { limit: "10" },
    })
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return {
      success: true,
      data: list.map((item: any) => ({
        movieId: (item.movieId as string) || (item.id as string) || "",
        movieTitle: (item.movieTitle as string) || (item.title as string) || "",
        ticketsSold: (item.ticketsSold as number) || 0,
        revenue: (item.revenue as number) || 0,
        occupancyRate: (item.occupancyRate as number) || 0,
      })),
    }
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getOccupancyData(): Promise<ApiResponse<OccupancyData[]>> {
  try {
    const { data: responseData } = await client.get("/reports/seat-occupancy")
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return {
      success: true,
      data: list.map((item: any) => ({
        date: (item.date as string) || "",
        rate: (item.rate as number) || 0,
        showtime: (item.showtime as string) || "",
      })),
    }
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    }
  }
}
