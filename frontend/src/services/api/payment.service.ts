import { ApiResponse, Payment, PaymentMethod } from "@/types"
import { payments, bookings } from "./mock-data"

interface TransactionParams {
  page?: number
  limit?: number
  status?: string
  method?: string
}

function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * ms) + 200))
}

export async function processPayment(bookingId: string, method: PaymentMethod): Promise<ApiResponse<Payment>> {
  await delay(500)
  const booking = bookings.find((b) => b.id === bookingId)
  if (!booking) {
    return { success: false, data: null as any, message: "Booking not found" }
  }

  booking.paymentStatus = "completed"
  booking.paymentMethod = method

  const payment: Payment = {
    id: `payment-${bookingId.split("-")[1]}`,
    bookingId,
    amount: booking.totalAmount,
    method,
    status: "completed",
    transactionId: `TXN${String(Math.floor(Math.random() * 10000000)).padStart(7, "0")}`,
    khqrImage: method === "khqr" ? `/images/qr/payment-${bookingId.split("-")[1]}.png` : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return { success: true, data: payment }
}

export async function getPayment(bookingId: string): Promise<ApiResponse<Payment | null>> {
  await delay()
  const payment = payments.find((p) => p.bookingId === bookingId) || null
  return { success: !!payment, data: payment }
}

export async function generateKHQR(amount: number): Promise<ApiResponse<{ qrImageUrl: string; amount: number }>> {
  await delay(300)
  return {
    success: true,
    data: {
      qrImageUrl: `/images/qr/khqr-${Date.now()}.png`,
      amount,
    },
  }
}

export async function requestRefund(bookingId: string): Promise<ApiResponse<Payment>> {
  await delay(400)
  const booking = bookings.find((b) => b.id === bookingId)
  if (!booking) {
    return { success: false, data: null as any, message: "Booking not found" }
  }
  booking.paymentStatus = "refunded"
  booking.status = "cancelled"

  const payment = payments.find((p) => p.bookingId === bookingId)
  if (payment) {
    payment.status = "refunded"
  }

  return {
    success: true,
    data: payment || ({ id: `payment-${bookingId}`, bookingId, amount: booking.totalAmount, status: "refunded" } as Payment),
  }
}

export async function getTransactions(params?: TransactionParams): Promise<
  ApiResponse<{
    payments: Payment[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>
> {
  await delay()
  let filtered = [...payments]
  if (params?.status) {
    filtered = filtered.filter((p) => p.status === params.status)
  }
  if (params?.method) {
    filtered = filtered.filter((p) => p.method === params.method)
  }

  const page = params?.page || 1
  const limit = params?.limit || 10
  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paged = filtered.slice(start, start + limit)

  return { success: true, data: { payments: paged, total, page, limit, totalPages } }
}
