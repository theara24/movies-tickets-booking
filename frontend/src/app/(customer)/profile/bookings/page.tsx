"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/store/auth-store"
import { getBookingHistory } from "@/services/api/booking.service"
import { formatDate, formatTime, formatCurrency } from "@/lib/utils"
import type { BookingStatus } from "@/types"

const statusConfig: Record<BookingStatus, { label: string; variant: "gold" | "secondary" | "destructive" | "default" }> = {
  pending: { label: "Pending", variant: "secondary" },
  confirmed: { label: "Confirmed", variant: "gold" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  completed: { label: "Completed", variant: "default" },
}

const ITEMS_PER_PAGE = 10

export default function BookingHistoryPage() {
  const { user } = useAuthStore()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ["bookingHistory", user?.id],
    queryFn: () => getBookingHistory(user!.id),
    enabled: !!user?.id,
  })

  const bookings = data?.data ?? []

  const filtered =
    statusFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter)

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  if (!user) {
    return (
      <div className="container flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-lg font-medium">Sign in to view your booking history</p>
        <Button asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-6 md:py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Booking History</h1>
          <p className="text-sm text-muted-foreground">View all your past bookings</p>
        </div>
      </div>

      <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
        <SelectTrigger className="w-[180px] bg-cinema-dark/50">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : paged.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Calendar className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium">No bookings found</p>
          <p className="text-sm text-muted-foreground">
            {statusFilter !== "all" ? "Try a different filter" : "Book a movie to get started"}
          </p>
          {statusFilter === "all" && (
            <Button asChild>
              <Link href="/movies">Browse Movies</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {paged.map((booking) => {
            const st = booking.showtime
            const statusInfo = statusConfig[booking.status]
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link href={`/tickets/${booking.id}`}>
                  <Card className="bg-cinema-surface/50 border-border/40 hover:border-gold/30 transition-all group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="h-14 w-10 rounded-lg bg-muted shrink-0 flex items-center justify-center">
                            <Film className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-gold transition-colors">
                              {st?.movie?.title ?? "Movie"}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {st?.cinema?.name ?? "Cinema"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {st?.date ? formatDate(st.date, "short") : ""}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {st?.startTime ? formatTime(st.startTime) : ""}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {booking.seats.length} seat{booking.seats.length !== 1 ? "s" : ""} · {booking.seats.map((s) => s.number).join(", ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <Badge variant={statusInfo.variant} className="text-[10px]">
                            {statusInfo.label}
                          </Badge>
                          <span className="text-sm font-bold text-gold">
                            {formatCurrency(booking.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="sm"
              className={p === page ? "bg-gold text-cinema-dark hover:bg-gold-light" : ""}
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
