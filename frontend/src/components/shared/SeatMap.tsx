"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn, formatCurrency } from "@/lib/utils"
import { SeatLegend } from "./SeatLegend"
import type { Seat, Showtime } from "@/types"

interface SeatMapProps {
  seats: Seat[][]
  selectedSeats: Seat[]
  onSeatClick: (seat: Seat) => void
  showtime: Showtime
}

export function SeatMap({ seats, selectedSeats, onSeatClick, showtime }: SeatMapProps) {
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const isSelected = (seat: Seat) => selectedSeats.some((s) => s.id === seat.id)
  const isDisabled = (seat: Seat) =>
    seat.status === "booked" || seat.status === "reserved" || seat.status === "locked"

  const getSeatColor = (seat: Seat) => {
    if (isSelected(seat)) return "bg-[#f5a623] border-[#f5a623]"
    if (isDisabled(seat)) return "bg-red-500/60 border-red-500/60 cursor-not-allowed"
    if (seat.type === "vip") return "bg-purple-500/40 border-purple-500/60 hover:bg-purple-500/60"
    if (seat.type === "couple") return "bg-pink-400/40 border-pink-400/60 hover:bg-pink-400/60"
    return "bg-gray-600/40 border-gray-500/60 hover:bg-gray-500/60"
  }

  const getSeatSize = (seat: Seat) => {
    if (seat.type === "couple") return "w-10 h-10"
    return "w-8 h-8"
  }

  const handleMouseEnter = (seat: Seat, e: React.MouseEvent) => {
    if (isDisabled(seat)) return
    setHoveredSeat(seat)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top })
  }

  if (!seats.length) return null

  const rows = seats.length
  const cols = seats[0]?.length || 0

  return (
    <div className="relative">
      <div className="mb-8 flex justify-center">
        <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full" />
      </div>
      <div className="text-center mb-6">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Screen</span>
      </div>
      <div className="flex justify-center mb-2">
        <div className="flex gap-1">
          {Array.from({ length: cols }, (_, i) => (
            <div key={i} className="w-8 text-center text-[10px] text-gray-500">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        {seats.map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-center justify-center gap-1">
            <span className="w-6 text-center text-[10px] text-gray-500 font-medium">
              {String.fromCharCode(65 + rowIdx)}
            </span>
            <div className="flex gap-1">
              {row.map((seat) => (
                <motion.button
                  key={seat.id}
                  whileTap={isDisabled(seat) ? undefined : { scale: 0.9 }}
                  onClick={() => !isDisabled(seat) && onSeatClick(seat)}
                  onMouseEnter={(e) => handleMouseEnter(seat, e)}
                  onMouseLeave={() => setHoveredSeat(null)}
                  disabled={isDisabled(seat)}
                  className={cn(
                    "rounded border transition-colors duration-150 text-[8px] font-medium flex items-center justify-center",
                    getSeatSize(seat),
                    getSeatColor(seat),
                  )}
                  title={`${seat.row}${seat.col}`}
                >
                  {seat.col}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <SeatLegend />
      {hoveredSeat && !isDisabled(hoveredSeat) && (
        <div
          className="fixed z-50 bg-[#0d0d1a] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none -translate-x-1/2 -translate-y-full"
          style={{ left: tooltipPos.x, top: tooltipPos.y - 8 }}
        >
          <p className="text-white font-medium">{hoveredSeat.row}{hoveredSeat.col}</p>
          <p className="text-gray-400">{formatCurrency(hoveredSeat.price)}</p>
          {hoveredSeat.type === "vip" && <p className="text-purple-400">VIP</p>}
          {hoveredSeat.type === "couple" && <p className="text-pink-400">Couple</p>}
        </div>
      )}
    </div>
  )
}
