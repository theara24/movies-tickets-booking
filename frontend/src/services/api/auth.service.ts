import { ApiResponse, User } from "@/types"
import { users } from "./mock-data"

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

function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * ms) + 200))
}

export async function login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
  await delay(400)
  const user = users.find((u) => u.email === email)
  if (!user || !(password.length >= 6)) {
    return { success: false, data: null as any, message: "Invalid email or password" }
  }
  const token = `mock-jwt-${user.id}-${Date.now()}`
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("user", JSON.stringify(user))
  }
  return { success: true, data: { user, token } }
}

export async function register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
  await delay(400)
  const exists = users.find((u) => u.email === data.email)
  if (exists) {
    return { success: false, data: null as any, message: "Email already registered" }
  }
  const newUser: User = {
    id: `user-${String(users.length + 1).padStart(3, "0")}`,
    email: data.email,
    name: data.name,
    phone: data.phone,
    avatar: null,
    role: "customer",
    loyaltyPoints: 0,
    loyaltyTier: "bronze",
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  const token = `mock-jwt-${newUser.id}-${Date.now()}`
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("user", JSON.stringify(newUser))
  }
  return { success: true, data: { user: newUser, token } }
}

export async function forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
  await delay(300)
  const user = users.find((u) => u.email === email)
  return {
    success: true,
    data: { message: user ? "Password reset link sent to your email" : "If the email exists, a reset link has been sent" },
  }
}

export async function resetPassword(token: string, password: string): Promise<ApiResponse<{ message: string }>> {
  await delay(300)
  return {
    success: true,
    data: { message: "Password has been reset successfully" },
  }
}

export async function getProfile(): Promise<ApiResponse<User | null>> {
  await delay(200)
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("user")
    if (stored) {
      return { success: true, data: JSON.parse(stored) }
    }
  }
  return { success: false, data: null, message: "Not authenticated" }
}

export async function updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
  await delay(300)
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("user")
    if (stored) {
      const user: User = { ...JSON.parse(stored), ...data }
      localStorage.setItem("user", JSON.stringify(user))
      return { success: true, data: user }
    }
  }
  return { success: false, data: null as any, message: "Not authenticated" }
}
