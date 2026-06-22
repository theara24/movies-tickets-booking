"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ChevronLeft,
  MapPin,
  Clock,
  Calendar,
  Film,
  QrCode,
  User,
  CreditCard,
  AlertTriangle,
  Ticket,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getBooking, cancelBooking } from "@/services/api/booking.service"
import { formatDate, formatTime, formatCurrency } from "@/lib/utils"

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBooking(id),
    enabled: !!id,
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", id] })
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
  })

  const booking = data?.data

  if (isLoading) {
    return (
      <div className="container py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container flex flex-col items-center justify-center py-20 gap-4">
        <Ticket className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-lg font-medium">Ticket not found</p>
        <Button asChild>
          <Link href="/tickets">My Tickets</Link>
        </Button>
      </div>
    )
  }

  const showtime = booking.showtime
  const isCancellable = booking.status === "confirmed" || booking.status === "pending"

  return (
    <div className="container py-6 md:py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Ticket Details</h1>
          <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
        </div>
        <Badge
          variant={
            booking.status === "confirmed"
              ? "gold"
              : booking.status === "cancelled"
                ? "destructive"
                : booking.status === "completed"
                  ? "default"
                  : "secondary"
          }
          className="ml-auto"
        >
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <Card className="bg-gradient-to-br from-gold/10 via-cinema-card to-cinema-card border-gold/20 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-20 w-16 rounded-lg bg-muted shrink-0 flex items-center justify-center">
                  <Film className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold">{showtime?.movie?.title ?? "Movie"}</h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {showtime?.cinema?.name ?? "Cinema"}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {showtime?.date ? formatDate(showtime.date, "long") : ""}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {showtime?.startTime ? formatTime(showtime.startTime) : ""}
                    </span>
                  </div>
                  <Badge variant="secondary" className="mt-2 text-[10px]">
                    {showtime?.hall?.name ?? "Hall"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-gold/20 px-6 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">Seats</span>
                  <p className="font-semibold">{booking.seats.map((s) => s.number).join(", ")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Quantity</span>
                  <p className="font-semibold">{booking.seats.length} ticket{booking.seats.length !== 1 ? "s" : ""}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Payment</span>
                  <p className="font-semibold capitalize">{booking.paymentMethod ?? "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Status</span>
                  <p className="font-semibold capitalize">{booking.paymentStatus}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-gold/20 px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Paid</span>
              <span className="text-xl font-bold text-gold">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cinema-surface/50 border-border/40">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Entry QR Code</h3>
              <Button variant="ghost" size="sm" className="text-gold">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-center py-4">
              <div className="h-48 w-48 rounded-xl bg-white p-4 flex items-center justify-center">
                <QrCode className="h-full w-full text-cinema-dark" />
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Present this QR code at the cinema entrance for entry
            </p>
          </CardContent>
        </Card>

        <Card className="bg-cinema-surface/50 border-border/40">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold">Purchase Information</h3>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono text-xs">{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booked On</span>
                <span>{formatDate(booking.createdAt, "long")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span className="capitalize">{booking.paymentMethod ?? "Pending"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-gold">{formatCurrency(booking.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {isCancellable && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <AlertTriangle className="h-4 w-4" />
                Cancel Booking
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Booking</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel this booking? This action cannot be undone.
                  {booking.paymentStatus === "completed" && (
                    <span className="block mt-2 text-warning">
                      Your payment will be refunded according to our cancellation policy.
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => {}}>
                  Keep Booking
                </Button>
                <Button
                  variant="destructive"
                  disabled={cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate()}
                >
                  {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Button variant="outline" className="w-full" asChild>
          <Link href="/tickets">
            <ChevronLeft className="h-4 w-4" />
            Back to My Tickets
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}
