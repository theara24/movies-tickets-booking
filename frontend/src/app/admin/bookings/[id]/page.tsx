"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery, useMutation } from "@tanstack/react-query"
import { ArrowLeft, Loader2, CheckCircle, XCircle, Undo2, Clock, User, Film, CreditCard, MapPin, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { getBooking } from "@/services/api/booking.service"
import { formatDate, formatTime, formatCurrency } from "@/lib/utils"
import type { Booking } from "@/types"

const statusColors: Record<Booking["status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-success/10 text-success border-success/20",
}

const actionTimeline = [
  { action: "Booking Created", date: new Date(Date.now() - 7200000).toISOString(), icon: Ticket },
  { action: "Payment Completed", date: new Date(Date.now() - 3600000).toISOString(), icon: CreditCard },
  { action: "Booking Confirmed", date: new Date(Date.now() - 1800000).toISOString(), icon: CheckCircle },
]

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBooking(id),
    enabled: !!id,
  })

  const booking = data?.data

  const confirmMutation = useMutation({
    mutationFn: async () => { await new Promise((r) => setTimeout(r, 300)); return { success: true } },
    onSuccess: () => {
      toast({ title: "Booking confirmed", variant: "success" })
      router.refresh()
    },
  })

  const cancelMutation = useMutation({
    mutationFn: async () => { await new Promise((r) => setTimeout(r, 300)); return { success: true } },
    onSuccess: () => {
      toast({ title: "Booking cancelled", variant: "success" })
      router.refresh()
    },
  })

  const refundMutation = useMutation({
    mutationFn: async () => { await new Promise((r) => setTimeout(r, 300)); return { success: true } },
    onSuccess: () => {
      toast({ title: "Refund processed", variant: "success" })
      router.refresh()
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Booking not found</p>
        <Link href="/admin/bookings"><Button variant="outline" className="mt-4">Back to Bookings</Button></Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/bookings">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">Booking {booking.id}</h2>
              <Badge variant="outline" className={`text-[11px] ${statusColors[booking.status]}`}>
                {booking.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">Created on {formatDate(booking.createdAt, "long")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {booking.status === "pending" && (
            <>
              <Button variant="outline" className="text-success border-success/30 hover:bg-success/10" onClick={() => confirmMutation.mutate()}>
                <CheckCircle className="h-4 w-4 mr-2" /> Confirm
              </Button>
              <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => cancelMutation.mutate()}>
                <XCircle className="h-4 w-4 mr-2" /> Cancel
              </Button>
            </>
          )}
          {(booking.status === "confirmed" || booking.status === "completed") && booking.paymentStatus !== "refunded" && (
            <Button variant="outline" className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10" onClick={() => refundMutation.mutate()}>
              <Undo2 className="h-4 w-4 mr-2" /> Refund
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-cinema-card border-border/60">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Movie & Showtime</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-12 rounded bg-muted overflow-hidden flex items-center justify-center">
                  <Film className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{booking.showtime?.movie?.title ?? "Unknown Movie"}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.showtime?.cinema?.name} &middot; {booking.showtime?.hall?.name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-cinema-dark border border-border">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium text-foreground">{booking.showtime?.date ? formatDate(booking.showtime.date, "long") : "—"}</p>
                </div>
                <div className="p-3 rounded-lg bg-cinema-dark border border-border">
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-medium text-foreground">{booking.showtime?.startTime ? formatTime(`2000-01-01T${booking.showtime.startTime}`) : "—"}</p>
                </div>
                <div className="p-3 rounded-lg bg-cinema-dark border border-border">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium text-foreground">{booking.showtime?.movie?.duration ?? "—"} min</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cinema-card border-border/60">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Seats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {booking.seats.map((seat) => (
                  <div key={seat.id} className="px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20 text-sm font-medium text-gold">
                    {seat.number}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cinema-card border-border/60">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Action Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actionTimeline.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(item.date, "long")} at {formatTime(item.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-cinema-card border-border/60">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Customer #{booking.userId}</p>
                  <p className="text-xs text-muted-foreground">ID: {booking.userId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cinema-card border-border/60">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-lg font-bold text-gold">{formatCurrency(booking.totalAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Method</span>
                <span className="text-sm font-medium text-foreground capitalize">{booking.paymentMethod ?? "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className={`text-[10px] ${paymentColors[booking.paymentStatus]}`}>
                  {booking.paymentStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const paymentColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-success/10 text-success border-success/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  refunded: "bg-purple-500/10 text-purple-400 border-purple-500/20",
}
