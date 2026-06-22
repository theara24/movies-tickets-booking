"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Clock, MapPin, Film, ChevronLeft, ChevronRight, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { getShowtime, getSeats } from "@/services/api/showtime.service"
import { useBookingStore } from "@/store/booking-store"
import { formatTime, formatCurrency, formatDate } from "@/lib/utils"
import type { Seat, SeatType, SeatStatus } from "@/types"

const SEAT_COLORS: Record<SeatType, string> = {
  standard: "bg-muted hover:bg-muted/80 border-border",
  vip: "bg-gold/20 hover:bg-gold/30 border-gold/40",
  couple: "bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/40",
  wheelchair: "bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/40",
}

const SEAT_STATUS_COLORS: Record<string, string> = {
  available: "",
  selected: "bg-gold text-cinema-dark border-gold shadow-glow-sm",
  reserved: "bg-muted/30 text-muted-foreground/30 cursor-not-allowed border-muted",
  booked: "bg-destructive/10 text-destructive/30 cursor-not-allowed border-destructive/20",
  locked: "bg-warning/10 text-warning/30 cursor-not-allowed border-warning/20",
}

function SeatButton({
  seat,
  isSelected,
  onToggle,
}: {
  seat: Seat
  isSelected: boolean
  onToggle: () => void
}) {
  const isDisabled = seat.status === "booked" || seat.status === "reserved" || seat.status === "locked"

  return (
    <button
      onClick={onToggle}
      disabled={isDisabled}
      title={`${seat.row}${seat.col} - ${seat.type} - ${formatCurrency(seat.price)}`}
      className={`h-7 w-7 rounded-t-md border text-[8px] font-bold transition-all ${
        isDisabled
          ? SEAT_STATUS_COLORS[seat.status]
          : isSelected
            ? SEAT_STATUS_COLORS.selected
            : SEAT_COLORS[seat.type]
      }`}
    >
      {seat.row}
      {seat.col + 1}
    </button>
  )
}

function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const showtimeId = searchParams.get("showtimeId") || ""

  const { selectedSeats, toggleSeat, seatLockTimer, tickLockTimer, startLockTimer } = useBookingStore()

  const { data: showtimeData, isLoading: loadingShowtime } = useQuery({
    queryKey: ["showtime", showtimeId],
    queryFn: () => getShowtime(showtimeId),
    enabled: !!showtimeId,
  })

  const { data: seatsData, isLoading: loadingSeats } = useQuery({
    queryKey: ["seats", showtimeId],
    queryFn: () => getSeats(showtimeId),
    enabled: !!showtimeId,
  })

  const showtime = showtimeData?.data
  const seatMap = seatsData?.data ?? []

  useEffect(() => {
    if (showtime) {
      useBookingStore.getState().setShowtime(showtime)
      startLockTimer()
    }
  }, [showtime, startLockTimer])

  useEffect(() => {
    const interval = setInterval(() => {
      tickLockTimer()
    }, 1000)
    return () => clearInterval(interval)
  }, [tickLockTimer])

  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0)

  const formatTimer = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec.toString().padStart(2, "0")}`
  }

  if (!showtimeId) {
    return (
      <div className="container flex flex-col items-center justify-center py-20 gap-4">
        <Film className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-lg font-medium">No showtime selected</p>
        <Button asChild>
          <a href="/showtimes">Browse Showtimes</a>
        </Button>
      </div>
    )
  }

  if (loadingShowtime || loadingSeats) {
    return (
      <div className="container py-8 space-y-6">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  if (!showtime) {
    return (
      <div className="container flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-lg font-medium">Showtime not found</p>
        <Button asChild>
          <a href="/showtimes">Browse Showtimes</a>
        </Button>
      </div>
    )
  }

  const rows = seatMap.length
  const cols = seatMap[0]?.length ?? 0

  return (
    <div className="container py-6 md:py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Select Seats</h1>
          <p className="text-sm text-muted-foreground">
            {showtime.movie.title}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Timer className="h-4 w-4 text-gold" />
          <span className={seatLockTimer < 60 ? "text-destructive font-medium" : "text-muted-foreground"}>
            {formatTimer(seatLockTimer)}
          </span>
        </div>
      </div>

      <Card className="bg-cinema-surface/50 border-border/40">
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              <span>{showtime.cinema.name}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatTime(showtime.startTime)}</span>
            </div>
            <Badge variant="secondary">{showtime.hall.name}</Badge>
            <span className="text-muted-foreground">{formatDate(showtime.date, "long")}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-muted border border-border" />
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gold border border-gold" />
            <span className="text-xs text-muted-foreground">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-destructive/20 border border-destructive/30" />
            <span className="text-xs text-muted-foreground">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gold/20 border border-gold/40" />
            <span className="text-xs text-muted-foreground">VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-purple-500/20 border border-purple-500/40" />
            <span className="text-xs text-muted-foreground">Couple</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-[500px] mx-auto text-center space-y-6">
            <div className="mx-auto w-3/4 h-2 rounded-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Screen</p>

            <div className="space-y-1.5 overflow-x-auto pb-2">
              <AnimatePresence>
                {seatMap.map((row, ri) => (
                  <motion.div
                    key={ri}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: ri * 0.03 }}
                    className="flex items-center justify-center gap-1"
                  >
                    {row.map((seat, ci) => (
                      <SeatButton
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeats.some((s) => s.id === seat.id)}
                        onToggle={() => toggleSeat(seat)}
                      />
                    ))}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Selected: <span className="text-foreground font-medium">{selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""}</span>
          </p>
          {selectedSeats.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedSeats.map((s) => s.number).join(", ")}
            </p>
          )}
          <p className="text-lg font-bold">
            Total: <span className="text-gold">{formatCurrency(totalAmount)}</span>
          </p>
        </div>
        <Button
          size="lg"
          disabled={selectedSeats.length === 0}
          className="bg-gold text-cinema-dark hover:bg-gold-light font-semibold"
          onClick={() => router.push("/booking/summary")}
        >
          Continue to Payment
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>}>
      <BookingContent />
    </Suspense>
  )
}
