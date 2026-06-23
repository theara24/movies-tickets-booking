export const APP_NAME = "CinePremium"
export const APP_DESCRIPTION = "Premium movie ticket booking platform"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"

export const SEAT_TYPES = {
  STANDARD: "standard",
  VIP: "vip",
  COUPLE: "couple",
  WHEELCHAIR: "wheelchair",
} as const

export const SEAT_STATUS = {
  AVAILABLE: "available",
  RESERVED: "reserved",
  SELECTED: "selected",
  BOOKED: "booked",
  LOCKED: "locked",
} as const

export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
} as const

export const PAYMENT_METHODS = {
  KHQR: "khqr",
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "debit_card",
  ACCOUNT: "account",
} as const

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const

export const USER_ROLES = {
  CUSTOMER: "customer",
  STAFF: "staff",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const

export const MOVIE_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
] as const

export const CINEMA_BRANCHES = [
  "CinePremium Phnom Penh",
  "CinePremium Siem Reap",
  "CinePremium Sihanoukville",
  "CinePremium Battambang",
] as const

export const SEAT_LOCK_DURATION = 300

export const ROWS = "ABCDEFGHIJ"
export const COLS_PER_ROW = 12

export const LOYALTY_TIERS = {
  BRONZE: "bronze",
  SILVER: "silver",
  GOLD: "gold",
  PLATINUM: "platinum",
} as const

export const LOYALTY_POINTS_PER_KHR = 0.01
export const LOYALTY_THRESHOLDS = {
  SILVER: 1000,
  GOLD: 5000,
  PLATINUM: 15000,
} as const
