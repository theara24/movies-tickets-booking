import { create } from "zustand"
import type { User } from "@/types"

interface RegisterData {
  email: string
  password: string
  name: string
  phone: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  loadProfile: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  clearError: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const { login: loginApi } = await import("@/services/api/auth.service")
      const res = await loginApi(email, password)
      if (res.success) {
        set({ user: res.data.user, isAuthenticated: true, isLoading: false })
      } else {
        set({ error: res.message ?? "Login failed", isLoading: false })
      }
    } catch {
      set({ error: "Login failed", isLoading: false })
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null })
    try {
      const { register: registerApi } = await import("@/services/api/auth.service")
      const res = await registerApi(data)
      if (res.success) {
        set({ user: res.data.user, isAuthenticated: true, isLoading: false })
      } else {
        set({ error: res.message ?? "Registration failed", isLoading: false })
      }
    } catch {
      set({ error: "Registration failed", isLoading: false })
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
    }
    set({ user: null, isAuthenticated: false, error: null })
  },

  loadProfile: async () => {
    set({ isLoading: true })
    try {
      const { getProfile } = await import("@/services/api/auth.service")
      const res = await getProfile()
      if (res.success && res.data) {
        set({ user: res.data, isAuthenticated: true, isLoading: false })
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false })
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  updateProfile: async (data: Partial<User>) => {
    set({ isLoading: true })
    try {
      const { updateProfile: updateApi } = await import("@/services/api/auth.service")
      const res = await updateApi(data)
      if (res.success) {
        set({ user: res.data, isLoading: false })
      } else {
        set({ error: res.message ?? "Update failed", isLoading: false })
      }
    } catch {
      set({ error: "Update failed", isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))
