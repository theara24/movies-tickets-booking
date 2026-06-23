import client from "./client"
import type { User } from "@/types"
import type { ApiResponse } from "@/types"

interface RegisterData {
  email: string
  password: string
  name: string
  phone: string
}

interface AuthResponse {
  user: User
  token: string
}

function mapBackendUser(u: Record<string, unknown>): User {
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

export async function login(
  email: string,
  password: string,
): Promise<ApiResponse<AuthResponse>> {
  try {
    const { data: responseData } = await client.post("/auth/login", {
      email,
      password,
    })
    const d = responseData.data || responseData
    const user = mapBackendUser(d.user)
    const token = d.accessToken

    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
      localStorage.setItem("refresh_token", d.refreshToken)
      localStorage.setItem("user", JSON.stringify(user))
    }

    return { success: true, data: { user, token } }
  } catch (error: any) {
    const msg =
      error.response?.data?.message || error.message || "Invalid email or password"
    return { success: false, data: null as any, message: msg }
  }
}

export async function register(
  data: RegisterData,
): Promise<ApiResponse<AuthResponse>> {
  try {
    const { data: responseData } = await client.post("/auth/register", {
      email: data.email,
      password: data.password,
      fullName: data.name,
      phone: data.phone,
    })
    const d = responseData.data || responseData
    const user = mapBackendUser(d.user)
    const token = d.accessToken

    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
      localStorage.setItem("refresh_token", d.refreshToken)
      localStorage.setItem("user", JSON.stringify(user))
    }

    return { success: true, data: { user, token } }
  } catch (error: any) {
    const msg =
      error.response?.data?.message || error.message || "Registration failed"
    return { success: false, data: null as any, message: msg }
  }
}

export async function forgotPassword(
  email: string,
): Promise<ApiResponse<{ message: string }>> {
  try {
    const { data: responseData } = await client.post("/auth/forgot-password", {
      email,
    })
    return { success: true, data: responseData.data || responseData }
  } catch (error: any) {
    return {
      success: true,
      data: {
        message: "If the email exists, a reset link has been sent",
      },
    }
  }
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<ApiResponse<{ message: string }>> {
  try {
    const { data: responseData } = await client.post("/auth/reset-password", {
      token,
      password,
    })
    return { success: true, data: responseData.data || responseData }
  } catch (error: any) {
    const msg =
      error.response?.data?.message || error.message || "Reset failed"
    return { success: false, data: null as any, message: msg }
  }
}

export async function getProfile(): Promise<ApiResponse<User | null>> {
  try {
    const { data: responseData } = await client.get("/users/profile")
    const d = responseData.data || responseData
    if (d && d.id) {
      const user = mapBackendUser(d)
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user))
      }
      return { success: true, data: user }
    }
    return { success: false, data: null, message: "Not authenticated" }
  } catch {
    return { success: false, data: null, message: "Not authenticated" }
  }
}

export async function updateProfile(
  data: Partial<User>,
): Promise<ApiResponse<User>> {
  try {
    const payload: Record<string, unknown> = {}
    if (data.name) payload.fullName = data.name
    if (data.phone) payload.phone = data.phone
    if (data.avatar) payload.avatar = data.avatar

    const { data: responseData } = await client.patch(
      `/users/${data.id}`,
      payload,
    )
    const d = responseData.data || responseData
    const user = mapBackendUser(d)
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user))
    }
    return { success: true, data: user }
  } catch (error: any) {
    const msg =
      error.response?.data?.message || error.message || "Update failed"
    return { success: false, data: null as any, message: msg }
  }
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
): Promise<ApiResponse<{ message: string }>> {
  try {
    const { data: responseData } = await client.post("/auth/change-password", {
      oldPassword,
      newPassword,
    })
    return { success: true, data: responseData.data || responseData }
  } catch (error: any) {
    const msg =
      error.response?.data?.message || error.message || "Password change failed"
    return { success: false, data: null as any, message: msg }
  }
}

export async function logout(): Promise<void> {
  try {
    await client.post("/auth/logout")
  } catch {
    // ignore
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
  }
}
