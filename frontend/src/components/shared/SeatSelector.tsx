"use client"

import { useEffect, useCallback } from "react"
import { Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate, formatTime } from "@/lib/utils"
import { useBookingStore } from "@/store/booking-store"
import { SeatMap } from "./SeatMap"
import type { Showtime } from "@/types"

interface SeatSelectorProps {
  showtime: Showtime
  onProceed?: () => void
}

export function SeatSelector({ showtime, onProceed }: SeatSelectorProps) {
  const {
    selectedSeats,
    seatLockTimer,
    toggleSeat,
    tickLockTimer,
    startLockTimer,
    setShowtime,
  } = useBookingStore()

  useEffect(() => {
    setShowtime(showtime)
    startLockTimer()
  }, [showtime, setShowtime, startLockTimer])

  useEffect(() => {
    const interval = setInterval(() => {
      tickLockTimer()
    }, 1000)
    return () => clearInterval(interval)
  }, [tickLockTimer])

  const formatTimer = useCallback((seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec.toString().padStart(2, "0")}`
  }, [])

  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0)

  const seatMap = showtime.hall?.seatMap || []

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {showtime.hall?.name || "Select Seats"}
            </h2>
            <p className="text-sm text-gray-400">
              {formatDate(showtime.date, "long")} at {formatTime(showtime.startTime)}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-[#f5a623]" />
            <span className={seatLockTimer < 60 ? "text-red-400" : "text-gray-300"}>
              {formatTimer(seatLockTimer)}
            </span>
          </div>
        </div>
        <Card className="bg-[#16162a] border-white/5">
          <CardContent className="p-4 md:p-6 overflow-x-auto">
            <SeatMap
              seats={seatMap}
              selectedSeats={selectedSeats}
              onSeatClick={toggleSeat}
              showtime={showtime}
            />
          </CardContent>
        </Card>
      </div>
      <div className="lg:sticky lg:top-24 self-start">
        <Card className="bg-[#16162a] border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-base">Selected Seats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedSeats.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Select seats from the map
              </p>
            ) : (
              <div className="space-y-2">
                {selectedSeats.map((seat) => (
                  <div
                    key={seat.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-300">
                      Seat {seat.row}{seat.col}
                      {seat.type !== "standard" && (
                        <span className="ml-1 text-[10px] uppercase text-gray-500">
                          ({seat.type})
                        </span>
                      )}
                    </span>
                    <span className="text-white">{formatCurrency(seat.price)}</span>
                  </div>
                ))}
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-[#f5a623]">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            )}
            <Button
              onClick={onProceed}
              disabled={selectedSeats.length === 0}
              className="w-full bg-[#f5a623] hover:bg-[#d4921e] text-[#0d0d1a] font-semibold"
            >
              Proceed to Booking
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
