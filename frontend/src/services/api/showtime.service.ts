import client from "./client"
import type { ApiResponse, Showtime, Seat } from "@/types"

interface GetShowtimesParams {
  movieId?: string
  cinemaId?: string
  date?: string
}

function mapShowtime(s: Record<string, unknown>): Showtime {
  return {
    id: s.id as string,
    movieId: (s.movieId as string) || ((s.movie as Record<string, unknown>)?.id as string) || "",
    hallId: (s.hallId as string) || "",
    cinemaId: (s.cinemaId as string) || "",
    date: (s.date as string) || "",
    startTime: (s.startTime as string) || (s.start_time as string) || "",
    endTime: (s.endTime as string) || (s.end_time as string) || "",
    price: (s.price as number) || 0,
    vipPrice: (s.vipPrice as number) || (s.vip_price as number) || 0,
    couplePrice: (s.couplePrice as number) || (s.couple_price as number) || 0,
    hall: s.hall as Showtime["hall"],
    movie: s.movie as Showtime["movie"],
    cinema: s.cinema as Showtime["cinema"],
    availableSeats: (s.availableSeats as number) || (s.available_seats as number) || 0,
    totalSeats: (s.totalSeats as number) || 0,
  }
}

function mapSeat(s: Record<string, unknown>): Seat {
  return {
    id: s.id as string,
    row: (s.row as string) || "",
    col: (s.col as number) || 0,
    number: (s.number as string) || s.seatNumber as string || "",
    type: (s.type as Seat["type"]) || "standard",
    status: (s.status as Seat["status"]) || "available",
    price: (s.price as number) || 0,
  }
}

function extractData(responseData: any) {
  return responseData?.data || responseData
}

export async function getShowtimes(
  params?: GetShowtimesParams,
): Promise<ApiResponse<Showtime[]>> {
  try {
    const { data: responseData } = await client.get("/showtimes", { params })
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return { success: true, data: list.map(mapShowtime) }
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getShowtime(
  id: string,
): Promise<ApiResponse<Showtime | null>> {
  try {
    const { data: responseData } = await client.get(`/showtimes/${id}`)
    const d = extractData(responseData)
    return { success: true, data: mapShowtime(d) }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getShowtimesByMovie(
  movieId: string,
  cinemaId?: string,
  date?: string,
): Promise<ApiResponse<Showtime[]>> {
  try {
    const params: Record<string, string> = {}
    if (cinemaId) params.cinemaId = cinemaId
    if (date) params.date = date
    const { data: responseData } = await client.get(
      `/showtimes/by-movie/${movieId}`,
      { params },
    )
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return { success: true, data: list.map(mapShowtime) }
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getShowtimesByDate(
  date: string,
  cinemaId?: string,
): Promise<ApiResponse<Showtime[]>> {
  try {
    const params: Record<string, string> = {}
    if (cinemaId) params.cinemaId = cinemaId
    const { data: responseData } = await client.get(
      `/showtimes/by-date/${date}`,
      { params },
    )
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return { success: true, data: list.map(mapShowtime) }
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getSeats(
  showtimeId: string,
): Promise<ApiResponse<Seat[][] | null>> {
  try {
    const { data: responseData } = await client.get(
      `/seats/available/${showtimeId}`,
    )
    const d = extractData(responseData)
    const seats = Array.isArray(d)
      ? d.map((row: any) => (Array.isArray(row) ? row.map(mapSeat) : []))
      : []
    return { success: true, data: seats }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function lockSeats(
  showtimeId: string,
  seatIds: string[],
): Promise<ApiResponse<boolean>> {
  try {
    await client.post("/bookings/lock-seats", { showtimeId, seatIds })
    return { success: true, data: true }
  } catch (error: any) {
    return {
      success: false,
      data: false,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function unlockSeats(
  showtimeId: string,
  seatIds: string[],
): Promise<ApiResponse<boolean>> {
  try {
    await client.post("/bookings/unlock-seats", { showtimeId, seatIds })
    return { success: true, data: true }
  } catch {
    return { success: true, data: true }
  }
}
