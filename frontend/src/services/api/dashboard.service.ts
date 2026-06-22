import { ApiResponse, DashboardStats, RevenueData, TicketSalesData, OccupancyData } from "@/types"
import { dashboardStats, revenueChartData, ticketSalesData, occupancyData } from "./mock-data"

type Period = "7d" | "30d" | "90d" | "1y"

function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * ms) + 200))
}

export async function getStats(): Promise<ApiResponse<DashboardStats>> {
  await delay()
  return { success: true, data: dashboardStats }
}

export async function getRevenueChart(period: Period = "30d"): Promise<ApiResponse<RevenueData[]>> {
  await delay()
  const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365
  const data = revenueChartData.slice(-days)
  return { success: true, data }
}

export async function getTicketSales(): Promise<ApiResponse<TicketSalesData[]>> {
  await delay()
  return { success: true, data: ticketSalesData }
}

export async function getOccupancyData(): Promise<ApiResponse<OccupancyData[]>> {
  await delay()
  return { success: true, data: occupancyData }
}
