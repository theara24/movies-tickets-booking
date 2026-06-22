export interface Movie {
  id: string
  title: string
  slug: string
  description: string
  posterUrl: string
  backdropUrl: string
  trailerUrl: string | null
  genre: string[]
  duration: number
  releaseDate: string
  endDate: string
  rating: string
  director: string
  cast: string[]
  language: string
  subtitle: string
  isFeatured: boolean
  isNowShowing: boolean
  isComingSoon: boolean
  status: "now_showing" | "coming_soon" | "ended"
}

export interface Cinema {
  id: string
  name: string
  slug: string
  address: string
  city: string
  phone: string
  imageUrl: string
  halls: Hall[]
}

export interface Hall {
  id: string
  name: string
  cinemaId: string
  type: HallType
  totalSeats: number
  rows: number
  cols: number
  seatMap: Seat[][]
}

export type HallType = "standard" | "vip" | "imax" | "4dx"

export interface Showtime {
  id: string
  movieId: string
  hallId: string
  cinemaId: string
  date: string
  startTime: string
  endTime: string
  price: number
  vipPrice: number
  couplePrice: number
  hall: Hall
  movie: Movie
  cinema: Cinema
  availableSeats: number
  totalSeats: number
}

export interface Seat {
  id: string
  row: string
  col: number
  number: string
  type: SeatType
  status: SeatStatus
  price: number
}

export type SeatType = "standard" | "vip" | "couple" | "wheelchair"

export type SeatStatus = "available" | "reserved" | "selected" | "booked" | "locked"

export interface Booking {
  id: string
  userId: string
  showtimeId: string
  seats: Seat[]
  totalAmount: number
  status: BookingStatus
  paymentStatus: PaymentStatus
  paymentMethod: string | null
  qrCode: string
  createdAt: string
  showtime: Showtime
  foodItems: FoodOrderItem[]
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed"

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded"

export interface User {
  id: string
  email: string
  name: string
  phone: string
  avatar: string | null
  role: UserRole
  loyaltyPoints: number
  loyaltyTier: LoyaltyTier
  createdAt: string
}

export type UserRole = "customer" | "staff" | "admin" | "super_admin"

export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum"

export interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: FoodCategory
  isAvailable: boolean
  isCombo: boolean
  comboItems: string[]
}

export type FoodCategory = "popcorn" | "drinks" | "snacks" | "combo" | "candy" | "hot_food"

export interface FoodOrderItem {
  item: FoodItem
  quantity: number
}

export interface Promotion {
  id: string
  code: string
  title: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minPurchase: number
  maxDiscount: number
  startDate: string
  endDate: string
  usageLimit: number
  usageCount: number
  isActive: boolean
  applicableMovies: string[]
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transactionId: string | null
  khqrImage: string | null
  createdAt: string
  updatedAt: string
}

export type PaymentMethod = "khqr" | "credit_card" | "debit_card" | "account"

export interface Review {
  id: string
  userId: string
  movieId: string
  rating: number
  comment: string
  createdAt: string
  user: Pick<User, "id" | "name" | "avatar">
}

export interface DashboardStats {
  totalRevenue: number
  totalTickets: number
  totalCustomers: number
  occupancyRate: number
  revenueGrowth: number
  ticketsGrowth: number
  customersGrowth: number
  occupancyGrowth: number
}

export interface RevenueData {
  date: string
  revenue: number
  tickets: number
}

export interface OccupancyData {
  date: string
  rate: number
  showtime: string
}

export interface TicketSalesData {
  movieId: string
  movieTitle: string
  ticketsSold: number
  revenue: number
  occupancyRate: number
}

export interface Staff {
  id: string
  userId: string
  user: User
  position: string
  department: string
  salary: number
  hireDate: string
  status: "active" | "inactive" | "suspended"
  attendance: Attendance[]
}

export interface Attendance {
  date: string
  checkIn: string
  checkOut: string
  status: "present" | "absent" | "late" | "leave"
}

export interface Payroll {
  staffId: string
  staff: Staff
  month: string
  baseSalary: number
  bonus: number
  deductions: number
  netSalary: number
  status: "pending" | "paid"
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
