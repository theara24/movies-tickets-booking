import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import { API_BASE_URL } from "@/lib/constants"

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("refresh_token")

      if (!refreshToken) {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
        window.location.href = "/auth/login"
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return client(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } },
        )

        const newAccessToken = data.data?.accessToken || data.accessToken
        const newRefreshToken = data.data?.refreshToken || data.refreshToken

        localStorage.setItem("auth_token", newAccessToken)
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken)
        }

        processQueue(null, newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return client(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
        window.location.href = "/auth/login"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default client
