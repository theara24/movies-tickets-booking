import { ApiResponse, Showtime, Seat } from "@/types"
import { showtimes, getShowtimeById } from "./mock-data"

interface GetShowtimesParams {
  movieId?: string
  cinemaId?: string
  date?: string
}

function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * ms) + 200))
}

export async function getShowtimes(params?: GetShowtimesParams): Promise<ApiResponse<Showtime[]>> {
  await delay()
  let filtered = [...showtimes]

  if (params?.movieId) {
    filtered = filtered.filter((s) => s.movieId === params.movieId)
  }
  if (params?.cinemaId) {
    filtered = filtered.filter((s) => s.cinemaId === params.cinemaId)
  }
  if (params?.date) {
    filtered = filtered.filter((s) => s.date === params.date)
  }

  return { success: true, data: filtered }
}

export async function getShowtime(id: string): Promise<ApiResponse<Showtime | null>> {
  await delay()
  const showtime = getShowtimeById(id) || null
  return { success: !!showtime, data: showtime }
}

export async function getSeats(showtimeId: string): Promise<ApiResponse<Seat[][] | null>> {
  await delay()
  const showtime = getShowtimeById(showtimeId)
  if (!showtime) return { success: false, data: null, message: "Showtime not found" }
  return { success: true, data: showtime.hall.seatMap }
}

const lockedSeats = new Map<string, string[]>()

export async function lockSeats(showtimeId: string, seatIds: string[]): Promise<ApiResponse<boolean>> {
  await delay(200)
  const existing = lockedSeats.get(showtimeId) || []
  lockedSeats.set(showtimeId, [...existing, ...seatIds])

  const showtime = getShowtimeById(showtimeId)
  if (showtime) {
    for (const row of showtime.hall.seatMap) {
      for (const seat of row) {
        if (seatIds.includes(seat.id) && seat.status === "available") {
          seat.status = "locked"
        }
      }
    }
  }

  return { success: true, data: true }
}

export async function unlockSeats(showtimeId: string, seatIds: string[]): Promise<ApiResponse<boolean>> {
  await delay(200)
  const existing = lockedSeats.get(showtimeId) || []
  lockedSeats.set(showtimeId, existing.filter((id) => !seatIds.includes(id)))

  const showtime = getShowtimeById(showtimeId)
  if (showtime) {
    for (const row of showtime.hall.seatMap) {
      for (const seat of row) {
        if (seatIds.includes(seat.id) && seat.status === "locked") {
          seat.status = "available"
        }
      }
    }
  }

  return { success: true, data: true }
}
