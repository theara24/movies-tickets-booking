"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, QrCode } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn, formatCurrency, formatDate, formatTime } from "@/lib/utils"
import type { Booking } from "@/types"

interface TicketCardProps {
  booking: Booking
  variant?: "list" | "detail"
}

const statusColors: Record<string, string> = {
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
}

export function TicketCard({ booking, variant = "list" }: TicketCardProps) {
  const isDetail = variant === "detail"
  const showtime = booking.showtime

  return (
    <Card className={cn(
      "bg-[#16162a] border-white/5 overflow-hidden",
      isDetail && "max-w-2xl mx-auto",
    )}>
      <CardContent className="p-0">
        <div className={cn(
          "flex",
          isDetail ? "flex-col" : "flex-col sm:flex-row",
        )}>
          {showtime?.movie && (
            <div className={cn(
              "relative flex-shrink-0",
              isDetail ? "h-48 w-full" : "h-32 w-full sm:h-auto sm:w-28",
            )}>
              <Image
                src={showtime.movie.posterUrl}
                alt={showtime.movie.title}
                fill
                className="object-cover"
                sizes={isDetail ? "100vw" : "112px"}
              />
            </div>
          )}
          <div className="flex-1 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className={cn(
                  "font-semibold text-white truncate",
                  isDetail && "text-lg",
                )}>
                  {showtime?.movie?.title || "Movie"}
                </h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "mt-1 text-[10px] border",
                    statusColors[booking.status],
                  )}
                >
                  {booking.status}
                </Badge>
              </div>
              {!isDetail && (
                <span className="text-sm font-semibold text-[#f5a623] whitespace-nowrap">
                  {formatCurrency(booking.totalAmount)}
                </span>
              )}
            </div>
            <div className={cn(
              "grid gap-1.5 text-xs text-gray-400",
              isDetail ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2",
            )}>
              {showtime?.cinema && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{showtime.cinema.name}</span>
                </div>
              )}
              {showtime?.hall && (
                <span className="text-gray-500">{showtime.hall.name}</span>
              )}
              {showtime?.date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span>{formatDate(showtime.date, "long")}</span>
                </div>
              )}
              {showtime?.startTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span>{formatTime(showtime.startTime)}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {booking.seats.map((seat) => (
                <Badge key={seat.id} variant="outline" className="text-[10px] border-white/10 text-gray-300">
                  {seat.row}{seat.col}
                </Badge>
              ))}
            </div>
            {isDetail && (
              <div className="pt-2">
                <div className="flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-6">
                  <div className="text-center">
                    {booking.qrCode ? (
                      <Image
                        src={booking.qrCode}
                        alt="QR Code"
                        width={120}
                        height={120}
                        className="mx-auto"
                      />
                    ) : (
                      <QrCode className="h-16 w-16 text-gray-600 mx-auto" />
                    )}
                    <p className="text-xs text-gray-500 mt-2">Booking ID: {booking.id}</p>
                  </div>
                </div>
              </div>
            )}
            <div className={cn(
              "flex items-center justify-between pt-1",
              isDetail && "border-t border-white/10 pt-3",
            )}>
              {isDetail && (
                <span className="text-lg font-bold text-[#f5a623]">
                  {formatCurrency(booking.totalAmount)}
                </span>
              )}
              <Link href={`/bookings/${booking.id}`}>
                <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5 text-xs">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
