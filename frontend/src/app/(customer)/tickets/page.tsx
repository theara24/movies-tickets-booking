"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { motion } from "framer-motion"
import { Ticket, Calendar, MapPin, Clock, Film, ChevronRight, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/store/auth-store"
import { getBookings } from "@/services/api/booking.service"
import { formatDate, formatTime, formatCurrency, truncate } from "@/lib/utils"
import type { Booking } from "@/types"

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const },
  confirmed: { label: "Confirmed", variant: "gold" as const },
  cancelled: { label: "Cancelled", variant: "destructive" as const },
  completed: { label: "Completed", variant: "default" as const },
}

function TicketCard({ booking }: { booking: Booking }) {
  const statusInfo = statusConfig[booking.status]
  const showtime = booking.showtime

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-cinema-surface/50 border-border/40 overflow-hidden hover:border-gold/30 transition-all group">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-0">
            <div className="bg-gradient-to-br from-gold/20 to-gold/5 p-4 flex flex-col items-center justify-center gap-1 border-b md:border-b-0 md:border-r border-border/40">
              <Film className="h-8 w-8 text-gold" />
              <span className="text-[10px] text-muted-foreground text-center leading-tight">
                {truncate(showtime?.movie?.title ?? "", 20)}
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/tickets/${booking.id}`}
                    className="font-semibold text-sm hover:text-gold transition-colors line-clamp-1"
                  >
                    {showtime?.movie?.title ?? "Movie"}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Booking ID: <span className="font-mono">{booking.id}</span>
                  </p>
                </div>
                <Badge variant={statusInfo.variant} className="shrink-0 text-[10px]">
                  {statusInfo.label}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {showtime?.cinema?.name ?? "Cinema"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {showtime?.date ? formatDate(showtime.date, "short") : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {showtime?.startTime ? formatTime(showtime.startTime) : ""}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {booking.seats.length} seat{booking.seats.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {booking.seats.map((s) => s.number).join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gold">{formatCurrency(booking.totalAmount)}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function TicketCardSkeleton() {
  return (
    <Card className="bg-cinema-surface/50 border-border/40">
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
    </Card>
  )
}

export default function TicketsPage() {
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: () => getBookings(user?.id),
    enabled: !!user?.id,
  })

  const bookings = data?.data ?? []

  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending",
  )
  const history = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled",
  )

  return (
    <div className="container py-6 md:py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Tickets</h1>
        <p className="text-sm text-muted-foreground">View and manage your bookings</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="upcoming">
            Upcoming
            {upcoming.length > 0 && (
              <Badge variant="gold" className="ml-2 text-[10px]">
                {upcoming.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <TicketCardSkeleton key={i} />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Ticket className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-lg font-medium">No upcoming tickets</p>
              <p className="text-sm text-muted-foreground">Book a movie to see your tickets here</p>
              <Button asChild>
                <Link href="/movies">Browse Movies</Link>
              </Button>
            </div>
          ) : (
            upcoming.map((booking) => (
              <TicketCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-3 mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <TicketCardSkeleton key={i} />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <QrCode className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-lg font-medium">No booking history</p>
              <p className="text-sm text-muted-foreground">Your past bookings will appear here</p>
            </div>
          ) : (
            history.map((booking) => (
              <TicketCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
