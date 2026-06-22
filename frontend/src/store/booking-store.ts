import { create } from "zustand"
import type { Showtime, Seat, Booking } from "@/types"

export type BookingStep = "select-seats" | "food" | "payment" | "confirmation"

interface BookingState {
  selectedShowtime: Showtime | null
  selectedSeats: Seat[]
  seatLockTimer: number
  bookingStep: BookingStep
  currentBooking: Booking | null
}

interface BookingActions {
  setShowtime: (showtime: Showtime) => void
  toggleSeat: (seat: Seat) => void
  selectSeats: (seats: Seat[]) => void
  clearSeats: () => void
  startLockTimer: () => void
  stopLockTimer: () => void
  tickLockTimer: () => void
  setBookingStep: (step: BookingStep) => void
  setCurrentBooking: (booking: Booking) => void
  resetBooking: () => void
}

type BookingStore = BookingState & BookingActions

const initialState: BookingState = {
  selectedShowtime: null,
  selectedSeats: [],
  seatLockTimer: 300,
  bookingStep: "select-seats",
  currentBooking: null,
}

export const useBookingStore = create<BookingStore>()((set, get) => ({
  ...initialState,

  setShowtime: (showtime) =>
    set({ selectedShowtime: showtime, selectedSeats: [], bookingStep: "select-seats" }),

  toggleSeat: (seat) => {
    const { selectedSeats } = get()
    const exists = selectedSeats.some((s) => s.id === seat.id)
    if (exists) {
      set({ selectedSeats: selectedSeats.filter((s) => s.id !== seat.id) })
    } else {
      set({ selectedSeats: [...selectedSeats, seat] })
    }
  },

  selectSeats: (seats) => set({ selectedSeats: seats }),

  clearSeats: () => set({ selectedSeats: [] }),

  startLockTimer: () => set({ seatLockTimer: 300 }),

  stopLockTimer: () => set({ seatLockTimer: 0 }),

  tickLockTimer: () => {
    const { seatLockTimer } = get()
    if (seatLockTimer > 0) {
      set({ seatLockTimer: seatLockTimer - 1 })
    }
  },

  setBookingStep: (step) => set({ bookingStep: step }),

  setCurrentBooking: (booking) => set({ currentBooking: booking }),

  resetBooking: () => set({ ...initialState }),
}))
