import { ApiResponse, RevenueData, TicketSalesData, OccupancyData } from "@/types"
import { revenueChartData, ticketSalesData, occupancyData } from "./mock-data"

interface ReportParams {
  startDate?: string
  endDate?: string
  cinemaId?: string
  movieId?: string
}

type ExportType = "revenue" | "tickets" | "occupancy"
type ExportFormat = "csv" | "pdf" | "excel"

function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * ms) + 200))
}

export async function getRevenueReport(params?: ReportParams): Promise<ApiResponse<RevenueData[]>> {
  await delay()
  let data = [...revenueChartData]
  if (params?.startDate) {
    data = data.filter((d) => d.date >= params.startDate!)
  }
  if (params?.endDate) {
    data = data.filter((d) => d.date <= params.endDate!)
  }
  return { success: true, data }
}

export async function getTicketReport(params?: ReportParams): Promise<ApiResponse<TicketSalesData[]>> {
  await delay()
  let data = [...ticketSalesData]
  if (params?.movieId) {
    data = data.filter((t) => t.movieId === params.movieId)
  }
  return { success: true, data }
}

export async function getOccupancyReport(params?: ReportParams): Promise<ApiResponse<OccupancyData[]>> {
  await delay()
  let data = [...occupancyData]
  return { success: true, data }
}

export async function exportReport(type: ExportType, format: ExportFormat): Promise<ApiResponse<{ url: string }>> {
  await delay(500)
  return {
    success: true,
    data: {
      url: `/api/reports/export/${type}.${format}`,
    },
  }
}
