import client from "./client"
import type { ApiResponse, Payment } from "@/types"

interface ProcessPaymentData {
  bookingId: string
  method: string
  phone?: string
}

function mapPayment(p: Record<string, unknown>): Payment {
  return {
    id: p.id as string,
    bookingId: (p.bookingId as string) || "",
    amount: (p.amount as number) || 0,
    method: (p.method as Payment["method"]) || "khqr",
    status: (p.status as Payment["status"]) || "pending",
    transactionId: (p.transactionId as string) || null,
    khqrImage: (p.khqrImage as string) || null,
    createdAt: (p.createdAt as string) || new Date().toISOString(),
    updatedAt: (p.updatedAt as string) || new Date().toISOString(),
  }
}

function extractData(responseData: any) {
  return responseData?.data || responseData
}

export async function processPayment(
  data: ProcessPaymentData,
): Promise<ApiResponse<Payment>> {
  try {
    const { data: responseData } = await client.post("/payments/process", {
      bookingId: data.bookingId,
      method: data.method,
      phone: data.phone,
    })
    const d = extractData(responseData)
    return { success: true, data: mapPayment(d) }
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getPayment(
  id: string,
): Promise<ApiResponse<Payment | null>> {
  try {
    const { data: responseData } = await client.get(`/payments/${id}`)
    const d = extractData(responseData)
    return { success: true, data: mapPayment(d) }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getPaymentByBooking(
  bookingId: string,
): Promise<ApiResponse<Payment | null>> {
  try {
    const { data: responseData } = await client.get(
      `/payments/booking/${bookingId}`,
    )
    const d = extractData(responseData)
    return { success: true, data: mapPayment(d) }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function generateKHQR(
  paymentId: string,
): Promise<ApiResponse<{ qrImage: string }>> {
  try {
    const { data: responseData } = await client.get(
      `/payments/${paymentId}`,
    )
    const d = extractData(responseData)
    return {
      success: true,
      data: { qrImage: (d.khqrImage as string) || "" },
    }
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function requestRefund(
  paymentId: string,
): Promise<ApiResponse<{ message: string }>> {
  try {
    const { data: responseData } = await client.post(
      `/payments/${paymentId}/refund`,
    )
    return {
      success: true,
      data: responseData?.data || responseData || { message: "Refund initiated" },
    }
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      message: error.response?.data?.message || error.message,
    }
  }
}

export async function getTransactions(params?: Record<string, unknown>): Promise<ApiResponse<Payment[]>> {
  try {
    const { data: responseData } = await client.get("/payments/my-payments", { params })
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return { success: true, data: list.map(mapPayment) }
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    }
  }
}
