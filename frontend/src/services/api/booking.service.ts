import { ApiResponse, Booking } from "@/types"
import { bookings, users } from "./mock-data"

interface CreateBookingData {
  showtimeId: string
  userId: string
  seats: { id: string; row: string; col: number }[]
  totalAmount: number
  foodItems?: { itemId: string; quantity: number }[]
}

function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * ms) + 200))
}

export async function createBooking(data: CreateBookingData): Promise<ApiResponse<Booking>> {
  await delay(400)
  const id = `booking-${String(bookings.length + 1).padStart(3, "0")}`
  const booking: Booking = {
    id,
    userId: data.userId,
    showtimeId: data.showtimeId,
    seats: data.seats.map((s) => ({
      id: s.id,
      row: s.row,
      col: s.col,
      number: `${s.row}${s.col}`,
      type: "standard" as const,
      status: "booked" as const,
      price: 0,
    })),
    totalAmount: data.totalAmount,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: null,
    qrCode: `/images/qr/${id}.png`,
    createdAt: new Date().toISOString(),
    showtime: undefined as any,
    foodItems: [],
  }
  bookings.push(booking)
  return { success: true, data: booking }
}

export async function getBookings(userId?: string): Promise<ApiResponse<Booking[]>> {
  await delay()
  const result = userId ? bookings.filter((b) => b.userId === userId) : bookings
  return { success: true, data: result }
}

export async function getBooking(id: string): Promise<ApiResponse<Booking | null>> {
  await delay()
  const booking = bookings.find((b) => b.id === id) || null
  return { success: !!booking, data: booking }
}

export async function cancelBooking(id: string): Promise<ApiResponse<Booking>> {
  await delay(300)
  const booking = bookings.find((b) => b.id === id)
  if (!booking) {
    return { success: false, data: null as any, message: "Booking not found" }
  }
  booking.status = "cancelled"
  booking.paymentStatus = "refunded"
  return { success: true, data: booking }
}

export async function getBookingHistory(userId: string): Promise<ApiResponse<Booking[]>> {
  await delay()
  const result = bookings
    .filter((b) => b.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return { success: true, data: result }
}
